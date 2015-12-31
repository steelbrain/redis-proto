'use strict'

const proto = require('../')

const encoded = proto.encode(['SET', 'KEY', 'VALUE'])
const decoded = proto.decode(encoded)

console.log(decoded[0]) // ['SET', 'KEY', 'VALUE']
