const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals that blog', () => {
    const blog = { title: 'Test Blog', author: 'Alice', likes: 5 }
    const result = listHelper.favoriteBlog([blog])
    assert.deepStrictEqual(result, blog)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Alice', likes: 5 },
      { title: 'Blog 2', author: 'Bob', likes: 12 },
      { title: 'Blog 3', author: 'Alice', likes: 7 }
    ]
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, { title: 'Blog 2', author: 'Bob', likes: 12 })
  })
})
