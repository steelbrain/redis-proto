Redis-Proto
==========

A super-lightweight Redis Protocol Encoder and Decoder in Javascript.

#### Installation

```
npm install --save redis-proto
```

#### Usage

```js
import { encode, decode } from 'redis-proto'

const encoded = encode(['SET', 'KEY', 'VALUE'])
const decoded = decode(encoded)

console.log(decoded[0]) // ['SET', 'KEY', 'VALUE']
```


#### API

```js
// TODO: Update these
export function encode(request): String
export function decode(content): Array
export function *decodeGen(content)

```

#### License
This project is licensed under the terms of MIT License. See the LICENSE file for more info.
