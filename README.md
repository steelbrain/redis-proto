Redis-Proto
==========
A super-lightweight Redis Protocol Encoder and Decoder in NodeJS. You can even use it in browsers with [browserify][browserify].

#### Installation

```js
npm install redis-proto
```

#### Usage

```js
var
  RedisProto = require('redis-proto'),
  Encoded = RedisProto.Encode(['SET', 'KEY', 'VALUE']),
  Decoded = RedisProto.Decode(Encoded);
console.log(Decoded[0]); // ['SET', 'KEY', 'VALUE']
```

#### License
This project is licensed under the terms of MIT License.

[browserify]:https://github.com/substack/node-browserify