const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
  const blogs = [
    { title: 'Blog1', author: 'Alice', likes: 5 },
    { title: 'Blog2', author: 'Bob', likes: 10 },
    { title: 'Blog3', author: 'Alice', likes: 7 },
    { title: 'Blog4', author: 'Bob', likes: 3 }
  ]

  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('when list has only one blog, equals that author and likes', () => {
    const single = [{ title: 'Only', author: 'Carol', likes: 8 }]
    assert.deepStrictEqual(listHelper.mostLikes(single), { author: 'Carol', likes: 8 })
  })

  test('of a bigger list returns the author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Bob', likes: 13 }) // fixed
  })
})
