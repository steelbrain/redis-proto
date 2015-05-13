

// @Compiler-Transpile "true"
// @Compiler-Output "../Dist/Main.js"
"use strict";
class Proto{
  static Encode(Request){
    if(typeof Request !== 'object' || !Request.length){
      Request = Request.toString();
      return ['$' + Request.length, Request].join("\r\n");
    }
    let ToReturn = ['*' + Request.length];
    Array.prototype.forEach.call(Request, function(SubEntry){
      ToReturn.push(Proto.Encode(SubEntry));
    });
    return ToReturn.join("\r\n");
  }
  static Decode(Content, ReturnOffset){
    let Type = Content.substr(0, 1);
    let Offset = Content.indexOf("\r\n");
    let Count = parseInt(Content.substr(1, Offset));
    let ToReturn = null;
    let Temp = null;

    if(Type === '*'){
      ToReturn = [];
      Temp = {Offset: Offset};
      for(let i = 0; i < Count; ++i){
        let RemovedLength = Offset + 2;
        Temp = Proto.Decode(Content.substr(Offset + 2), true);
        Offset = Temp.Offset + RemovedLength;
        ToReturn.push(Temp.Content);
      }
    } else if(Type === '$') {
      ToReturn = Content.substr(Offset + 2, Count);
      Offset += 2 + Count;
    } else if(Type === ':'){
      Offset += 2 + Count.length;
      ToReturn = parseInt(Count);
    } else if(Type === '-'){
      throw new Error(Content.substr(Offset + 2, Count));
    }
    if(ReturnOffset){
      return {Offset: Offset, Content: ToReturn};
    }
    return ToReturn;
  }
}
module.exports = Proto;