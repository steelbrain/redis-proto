// @Compiler-Transpile "true"
// @Compiler-Output "../dist/main.js"
'use strict'
class Proto {
  static Encode(Request) {
    if (Request === null || typeof Request === 'undefined') {
      return "$0\r\n\r\n"
    } else if (typeof Request === 'object' || (typeof Request !== 'string' && typeof Request.length === 'number')) {
      const toReturn = ['*' + Request.length]
      const length = Request.length
      for (let i = 0 ; i < length; ++i ) {
        toReturn[i + 1] = Proto.Encode(Request[i])
      }
      return toReturn.join("\r\n")
    } else if (typeof Request === 'number') {
      return `:${Request}`
    } else {
      if (typeof Request !== 'string') {
        Request = Request.toString('utf8')
      }
      return "$" + Request.length + "\r\n" + Request
    }
  }
  static Decode(Content) {
    let ToReturn = []
    while(true){
      let Entry = Proto.DecodeEntry(Content)
      if(!Entry) break
      ToReturn.push(Entry.value)
      Content = Content.slice(Entry.offset)
      if(!Content.length) break
    }
    return ToReturn
  }
  static *DecodeGen(Content) {
    while(true){
      let Entry = Proto.DecodeEntry(Content)
      if(!Entry) break
      yield Entry.value
      Content = Content.slice(Entry.offset)
      if(!Content.length) break
    }
  }
  static DecodeEntry(Content){
    const Type = Content.readInt8(0)
    const Index = Content.indexOf("\r\n")
    const Count = parseInt(Content.slice(1, Index).toString())

    if(Type === 42){ // *
      let ToReturn = []
      let Offset = Index + 2
      for(var i = 1; i <= Count; ++i){
        let Entry = Proto.DecodeEntry(Content.slice(Offset))
        ToReturn.push(Entry.value)
        Offset += Entry.offset
      }
      return {value: ToReturn, offset: Offset}
    } else if(Type === 36){ // 36 : $
      return (Count === -1) ? {value: null, offset: Index + 2} : {value: Content.slice(Index + 2, Count), offset: Index + Count + 4}
    } else if(Type === 45){ // 45 : -
      throw new Error(Content.slice(1, Index - 1))
    } else if(Type === 43){ // 43 : +
      return {value: Content.slice(1, Index - 1), offset: Index + 2}
    } else if(Type === 58){ // 58 : :
      return {value: parseInt(Content.slice(1, Index - 1)), offset: Index + 2}
    } else throw new Error("Error Decoding Redis Response")
  }
}
module.exports = Proto
