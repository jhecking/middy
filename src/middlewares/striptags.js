const striptags = require('striptags')

const unsafeEventProperties = [
  'body',
  'queryStringParameters',
  'multiValueQueryStringParameters',
  'pathParameters',
  'headers',
  'multiValueHeaders'
]

module.exports = () => {
  return {
    before: (handler, next) => {
      const { event } = handler

      for (const prop of unsafeEventProperties) {
        const input = event[prop]
        const filtered = filter(input)
        event[prop] = filtered
        event[`unsafe_${prop}`] = input
      }
      next()
    }
  }
}

function filter (input) {
  let filtered
  if (typeof input === 'string') {
    filtered = filterString(input)
  } else if (Array.isArray(input)) {
    filtered = filterArray(input)
  } else if (typeof input === 'object') {
    filtered = filterObject(input)
  } else {
    filtered = input
  }
  return filtered
}

function filterString (input) {
  return striptags(input)
}

function filterArray (input) {
  return input.map(filter)
}

function filterObject (input) {
  const output = {}
  for (const prop in input) {
    const value = input[prop]
    output[prop] = filter(value)
  }
  return output
}
