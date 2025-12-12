const { test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('favorite blog of empty list is null', () => {
  const blogs = []

  const result = listHelper.favoriteBlog(blogs)
  assert.strictEqual(result, null)
})

