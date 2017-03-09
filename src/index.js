/* @flow */

// TODO: Uncomment this
// import { Buffer } from 'buffer'

// NOTE: The reason we have encodeArray option is because redis protocol
// does not support nested arrays
export function encode(request: any, encodeArray: boolean = true) {
  if (request === null) {
    return '$-1\r\n'
  }
  if (Array.isArray(request) && encodeArray) {
    const content = [`*${request.length}\r\n`]
    for (let i = 0, length = request.length; i < length; i++) {
      content.push(encode(request[i], false))
    }
    return content.join('')
  }
  let value
  if (typeof request === 'object' || typeof request === 'function') {
    value = {}.toString.call(request)
  } else {
    value = String(value)
  }
  return `$${value.length}\r\n${value}\r\n`
}

export function decodeProgressive(content: Buffer, startIndex: number): { index: number, value: any } {
  let currentIndex = startIndex
  const type = content.toString('utf8', currentIndex, currentIndex + 1)
  // +1 because type takes 1 character
  currentIndex++

  if (type === '*') {
    // Array
    const lengthEnd = content.indexOf('\r\n', currentIndex)
    const length = parseInt(content.toString('utf8', currentIndex, lengthEnd), 10)
    // +2 because of \r\n after length ends
    currentIndex = lengthEnd + 2

    const value = []
    for (let i = 0; i < length; i++) {
      const entry = decodeProgressive(content, currentIndex)
      currentIndex = entry.index
      value.push(entry.value)
    }
    return { index: currentIndex, value }
  }

  if (type === '$') {
    // String or Null
    const lengthEnd = content.indexOf('\r\n', currentIndex)
    const length = parseInt(content.toString('utf8', currentIndex, lengthEnd), 10)
    // +2 because of \r\n after length ends
    currentIndex = lengthEnd + 2

    let value
    if (length === -1) {
      // Null
      value = null
    } else {
      // String
      value = content.toString('utf8', currentIndex, currentIndex + length)
      // +2 because of \r\n at the end of string
      currentIndex += length + 2
    }

    return { index: currentIndex, value }
  }

  if (type === '+') {
    // Simple string
    const valueEnd = content.indexOf('\r\n', currentIndex)
    const value = content.toString('utf8', currentIndex, valueEnd)
    // +2 because of \r\n at the end of simple string
    currentIndex = valueEnd + 2

    return { index: currentIndex, value }
  }

  if (type === ':') {
    // Integer
    const valueEnd = content.indexOf('\r\n', currentIndex)
    const value = parseInt(content.toString('utf8', currentIndex, valueEnd), 10)
    // +2 because of \r\n at the end of simple string
    currentIndex = valueEnd + 2

    return { index: currentIndex, value }
  }

  if (type === '-') {
    // Error
    const valueEnd = content.indexOf('\r\n', currentIndex)
    const value = content.toString('utf8', currentIndex, valueEnd)
    throw new Error(value)
  }

  throw new Error('Malformed Input')
}
console.log(decodeProgressive(Buffer.from('*5\r\n$3\r\nfoo\r\n$3\r\nbar\r\n$-1\r\n+OK\r\n:9999\r\n'), 0))

export function decode(content) {
  const bufferContent = Buffer.isBuffer(content) ? content : new Buffer(content)
  const Buffers = []
  let offset = 0
  while(true){
    let Entry = decodeEntry(bufferContent, offset)
    Buffers.push(Entry.value)
    offset = Entry.offset
    if(bufferContent.length === offset) break
  }
  return Buffers
}

export function *decodeGen(content) {
  const bufferContent = Buffer.isBuffer(content) ? content : new Buffer(content)
  let offset = 0
  while(true){
    let Entry = decodeEntry(bufferContent, offset)
    yield Entry.value
    offset = Entry.offset
    if(bufferContent.length === offset) break
  }
}

export function decodeEntry(content, startIndex) {
  const type = content.readInt8(startIndex)
  const index = content.indexOf('\r\n', startIndex)
  const count = parseInt(content.toString('utf8', startIndex + 1, index))

  if(type === 42){ // 42 : *
    const ToReturn = []
    let Offset = index + 2
    for(var i = 1; i <= count; ++i){
      let Entry = decodeEntry(content, Offset)
      ToReturn.push(Entry.value)
      Offset = Entry.offset
    }
    return {value: ToReturn, offset: Offset}
  } else if(type === 36){ // 36 : $
    return (count === -1) ? {value: null, offset: index + 2} : {value: content.toString('utf8', index + 2, index + 2 + count), offset: index + count + 4}
  } else if(type === 45){ // 45 : -
    throw new Error(content.toString('utf8', startIndex + 1, index))
  } else if(type === 43){ // 43 : +
    return {value: content.toString('utf8', startIndex + 1, index), offset: index + 2}
  } else if(type === 58){ // 58 : :
    return {value: parseInt(content.toString('utf8', startIndex + 1, index)), offset: index + 2}
  } else throw new Error('Error Decoding Redis Response')
}
