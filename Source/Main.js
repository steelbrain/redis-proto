

// @Compiler-Transpile "true"
// @Compiler-Output "../Dist/Main.js"
"use strict";
class Proto{
  static Encode(ToEncode){
    let ToReturn = [];
    ToReturn.push('*' + ToEncode.length);
    ToEncode.forEach(function(Entry){
      Entry = Entry.toString();
      ToReturn.push('$' + Entry.length);
      ToReturn.push(Entry);
    });
    return ToReturn.join("\\r\\n");
  }
  static Decode(){

  }
}
module.exports = Proto;