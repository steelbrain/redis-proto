

// @Compiler-Transpile "true"
// @Compiler-Output "../Dist/Main.js"
"use strict";
class Proto{
  static Encode(Request){
    if(!(Request instanceof Array)){
      Request = Request.toString();
      return ['$' + Request.length, Request].join("\r\n");
    }
    let ToReturn = ['*' + Request.length];
    Request.forEach(function(SubEntry){
      ToReturn.push(Proto.Encode(SubEntry));
    });
    return ToReturn.join("\r\n");
  }
  static Decode(){

  }
}
module.exports = Proto;