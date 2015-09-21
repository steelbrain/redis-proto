// @Compiler-Transpile "true"
// @Compiler-Output "../dist/main.js"
'use strict'

const Buffer = require('buffer').Buffer

class Proto {
  static Encode(Request) {
    if (Request === null || typeof Request === 'undefined') {
      return "$0\r\n\r\n"
    } else if (typeof Request === 'object' || (typeof Request !== 'string' && typeof Request.length === 'number')) {
      const toReturn = ['*' + Request.length + "\r\n"]
      const length = Request.length
      for (let i = 0 ; i < length; ++i ) {
        toReturn[i + 1] = Proto.Encode(Request[i])
      }
      return toReturn.join('')
    } else if (typeof Request === 'number') {
      return ":" + Request + "\r\n"
    } else {
      if (typeof Request !== 'string') {
        Request = Request.toString('utf8')
      }
      return "$" + Request.length + "\r\n" + Request + "\r\n"
    }
  }
  static Decode(Content) {
    if (!Buffer.isBuffer(Content)) {
      Content = new Buffer(Content)
    }
    const Buffers = []
    let offset = 0
    while(true){
      let Entry = Proto.DecodeEntry(Content, offset)
      if(!Entry) break
      Buffers.push(Entry.value)
      offset = Entry.offset
      if(Content.length === offset) break
    }
    return Buffers
  }
  static *DecodeGen(Content) {
    if (!Buffer.isBuffer(Content)) {
      Content = new Buffer(Content)
    }
    while(true){
      let Entry = Proto.DecodeEntry(Content)
      if(!Entry) break
      yield Entry.value
      Content = Content.slice(Entry.offset)
      if(!Content.length) break
    }
  }
  static DecodeEntry(Content, startIndex){
    const Type = Content.readInt8(startIndex)
    const Index = Content.indexOf("\r\n", startIndex)
    const Count = parseInt(Content.toString('utf8', startIndex + 1, Index))

    if(Type === 42){ // *
      const ToReturn = []
      let Offset = Index + 2
      for(var i = 1; i <= Count; ++i){
        let Entry = Proto.DecodeEntry(Content, Offset)
        console.log(Entry.value)
        ToReturn.push(Entry.value)
        Offset = Entry.offset
      }
      return {value: ToReturn, offset: Offset}
    } else if(Type === 36){ // 36 : $
      return (Count === -1) ? {value: null, offset: Index + 2} : {value: Content.toString('utf8', Index + 2, Index + 2 + Count), offset: Index + Count + 4}
    } else if(Type === 45){ // 45 : -
      throw new Error(Content.slice(1, Index))
    } else if(Type === 43){ // 43 : +
      return {value: Content.slice(1, Index), offset: Index + 2}
    } else if(Type === 58){ // 58 : :
      return {value: Content.slice(1, Index), offset: Index + 2}
    } else throw new Error('Error Decoding Redis Response')
  }
}
module.exports = Proto
