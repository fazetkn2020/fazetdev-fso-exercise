const { describe, test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
  const listWithOneBlog = [
    {
      _id: '1',
      title: 'Single Blog',
      author: 'Alice',
      url: 'http://example.com',
      likes: 5,
      __v: 0
    }
  ]

  const listWithMultipleBlogs = [
    { _id: '1', title: 'Blog A', author: 'Alice', likes: 5 },
    { _id: '2', title: 'Blog B', author: 'Bob', likes: 13 },
    { _id: '3', title: 'Blog C', author: 'Alice', likes: 7 },
  ]

  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals that author and likes', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Alice', likes: 5 })
  })

  test('of a bigger list returns the author with most likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    assert.deepStrictEqual(result, { author: 'Bob', likes: 13 })
  })
})
