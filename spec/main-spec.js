/* @flow */

const proto = require('../')

describe('Redis-Proto', function() {
  it('works good on strings', function() {
    const payload = ['SET', 'KEY', 'VALUE']
    const encoded = proto.encode(payload)
    const decoded = proto.decode(encoded)
    expect(decoded[0]).toEqual(payload)
  })
  it('converts numbers to string', function() {
    const payload = ['SET', 1, 2]
    const encoded = proto.encode(payload)
    const decoded = proto.decode(encoded)
    expect(decoded[0][0]).toEqual('SET')
    expect(decoded[0][1]).toEqual('1')
    expect(decoded[0][2]).toEqual('2')
  })
  it('converts undefined to string', function() {
    const payload = ['SET', undefined]
    const encoded = proto.encode(payload)
    const decoded = proto.decode(encoded)
    expect(decoded[0][0]).toEqual('SET')
    expect(decoded[0][1]).toEqual('undefined')
  })
  it('keeps null as is', function() {
    const payload = ['SET', null]
    const encoded = proto.encode(payload)
    const decoded = proto.decode(encoded)
    expect(decoded[0][0]).toEqual('SET')
    expect(decoded[0][1]).toEqual(null)
  })
  it('converts bool to string', function() {
    const payload = ['SET', true]
    const encoded = proto.encode(payload)
    const decoded = proto.decode(encoded)
    expect(decoded[0][0]).toEqual('SET')
    expect(decoded[0][1]).toEqual('true')
  })
  it('converts function to string', function() {
    const payload = ['SET', function() {}]
    const encoded = proto.encode(payload)
    const decoded = proto.decode(encoded)
    expect(decoded[0][0]).toEqual('SET')
    expect(decoded[0][1]).toEqual('[object Function]')
  })
  it('converts array to string', function() {
    const payload = ['SET', []]
    const encoded = proto.encode(payload)
    const decoded = proto.decode(encoded)
    expect(decoded[0][0]).toEqual('SET')
    expect(decoded[0][1]).toEqual('[object Array]')
  })
  it('converts symbol to string', function() {
    const payload = ['SET', Symbol(null)]
    const encoded = proto.encode(payload)
    const decoded = proto.decode(encoded)
    expect(decoded[0][0]).toEqual('SET')
    expect(decoded[0][1]).toEqual('Symbol(null)')
  })
  it('converts object to string', function() {
    const payload = ['SET', {}]
    const encoded = proto.encode(payload)
    const decoded = proto.decode(encoded)
    expect(decoded[0][0]).toEqual('SET')
    expect(decoded[0][1]).toEqual('[object Object]')
  })
})
