'use babel'

import {Buffer} from 'buffer'

export function encode(request, direct = true) {
  if (request === null) {
    return '$-1\r\n'
  } else if (Array.isArray(request) && direct) {
    const toReturn = [`*${request.length}\r\n`]
    const length = request.length
    for (let i = 0 ; i < length; ++i ) {
      toReturn[i + 1] = encode(request[i], false)
    }
    return toReturn.join('')
  } else {
    const type = typeof request
    const stringish = type === 'object' || type === 'function' ? Object.prototype.toString.call(request) : type === 'string' ? request : String(request)
    return `$${stringish.length}\r\n${stringish}\r\n`
  }
}

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
