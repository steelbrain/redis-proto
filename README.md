Redis-Proto
==========
A super-lightweight Redis Protocol Encoder and Decoder in NodeJS. You can even use it in browsers with [browserify][browserify].

#### Installation

```js
npm install --save redis-proto
```

#### Usage

```js
'use babel'

import {encode, decode} from 'redis-proto'

const encoded = encode(['SET', 'KEY', 'VALUE'])
const decoded = decode(encoded)

console.log(decoded[0]) // ['SET', 'KEY', 'VALUE']
```


#### API

```js
export function encode(request): String
export function decode(content): Array
export function *decodeGen(content)

```

#### License
This project is licensed under the terms of MIT License.

[browserify]:https://github.com/substack/node-browserify
