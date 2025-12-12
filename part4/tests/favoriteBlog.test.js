const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '1',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com/dijkstra',
      likes: 5,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    ...listWithOneBlog,
    {
      _id: '2',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com/canonical',
      likes: 12,
      __v: 0
    },
    {
      _id: '3',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'https://example.com/tests',
      likes: 10,
      __v: 0
    }
  ]

  test('of empty list is null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has only one blog, equals that blog', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), listWithOneBlog[0])
  })

  test('of a bigger list is calculated right', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithManyBlogs), listWithManyBlogs[1])
  })
})
