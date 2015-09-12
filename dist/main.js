

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Proto = (function () {
  function Proto() {
    _classCallCheck(this, Proto);
  }

  _createClass(Proto, null, {
    Encode: {
      value: function Encode(Request) {
        if (typeof Request !== "object" || typeof Request.length !== "number") {
          Request = Request.toString();
          return ["$" + Request.length, Request].join("\r\n");
        }
        var ToReturn = ["*" + Request.length];
        Array.prototype.forEach.call(Request, function (SubEntry) {
          ToReturn.push(Proto.Encode(SubEntry));
        });
        return ToReturn.join("\r\n") + "\r\n";
      }
    },
    Decode: {
      value: function Decode(Content) {
        var ToReturn = [];
        while (true) {
          var Entry = Proto.DecodeEntry(Content);
          if (!Entry) break;
          ToReturn.push(Entry.value);
          Content = Content.substr(Entry.offset);
          if (!Content.length) break;
        }
        return ToReturn;
      }
    },
    DecodeGen: {
      value: regeneratorRuntime.mark(function DecodeGen(Content) {
        var Entry;
        return regeneratorRuntime.wrap(function DecodeGen$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              if (!true) {
                context$2$0.next = 11;
                break;
              }

              Entry = Proto.DecodeEntry(Content);

              if (Entry) {
                context$2$0.next = 4;
                break;
              }

              return context$2$0.abrupt("break", 11);

            case 4:
              context$2$0.next = 6;
              return Entry.value;

            case 6:
              Content = Content.substr(Entry.offset);

              if (Content.length) {
                context$2$0.next = 9;
                break;
              }

              return context$2$0.abrupt("break", 11);

            case 9:
              context$2$0.next = 0;
              break;

            case 11:
            case "end":
              return context$2$0.stop();
          }
        }, DecodeGen, this);
      })
    },
    DecodeEntry: {
      value: function DecodeEntry(Content) {
        var Type = Content.substr(0, 1);
        var Index = Content.indexOf("\r\n");
        var Count = parseInt(Content.substr(1, Index - 1));

        if (Type === "*") {
          var ToReturn = [];
          var Offset = Index + 2;
          for (var i = 1; i <= Count; ++i) {
            var Entry = Proto.DecodeEntry(Content.substr(Offset));
            ToReturn.push(Entry.value);
            Offset += Entry.offset;
          }
          return { value: ToReturn, offset: Offset };
        } else if (Type === "$") {
          return Count === -1 ? { value: null, offset: Index + 2 } : { value: Content.substr(Index + 2, Count), offset: Index + Count + 4 };
        } else if (Type === "-") {
          throw new Error(Content.substr(1, Index - 1));
        } else if (Type === "+") {
          return { value: Content.substr(1, Index - 1), offset: Index + 2 };
        } else if (Type === ":") {
          return { value: parseInt(Content.substr(1, Index - 1)), offset: Index + 2 };
        } else throw new Error("Error Decoding Redis Response");
      }
    }
  });

  return Proto;
})();

module.exports = Proto;