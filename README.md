Redis-Proto
==========

A super-lightweight Redis Protocol Encoder and Decoder in Javascript.

## Installation

```
npm install --save redis-proto
```

## Usage

```js
import { encode, decode, decodeGen } from 'redis-proto'

const encoded = encode(['SET', 'KEY', 'VALUE'])
const decoded = decode(encoded)

console.log(decoded[0]) // ['SET', 'KEY', 'VALUE']

for (const entry of decodeGen(encoded)) {
  console.log('entry', entry) // ['SET', 'KEY', 'VALUE']
}
```


## API

```js
export function encode(request: any): string
export function decode(content: Buffer | string): Array<any>
export function *decodeGen(content: Buffer | string): Generator<any, void, void>

```

## License
This project is licensed under the terms of MIT License. See the LICENSE file for more info.
