const middy = require('../../middy')
const striptags = require('../striptags')

/* eslint-env jest */
/* global expect jest */

function process (event, cb) {
  const handler = middy((event, context, cb) => {
    cb(null, {})
  })
  handler.use(striptags())

  handler(event, {}, (_, response) => {
    cb(response)
  })
}

describe('🛡 Strip HTML Tags', () => {
  test('It should strip tags from the query string parameters', (endTest) => {
    const event = {
      queryStringParameters: { foo: 'bar', unsafe: '<a onmouseover=alert("woof!")>click me</a>' }
    }

    process(event, (_) => {
      expect(event.queryStringParameters.unsafe).toEqual('click me')
      endTest()
    })
  })

  test('It should keep a copy of the unfiltered data', (endTest) => {
    const event = {
      queryStringParameters: { foo: 'bar', unsafe: '<a onmouseover=alert("woof!")>click me</a>' }
    }

    process(event, (_) => {
      expect(event.unsafe_queryStringParameters.unsafe).toEqual('<a onmouseover=alert("woof!")>click me</a>')
      endTest()
    })
  })
})
