const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    {
      _id: '1',
      title: 'Blog One',
      author: 'Author A',
      url: 'http://example.com/1',
      likes: 3,
      __v: 0
    },
    {
      _id: '2',
      title: 'Blog Two',
      author: 'Author B',
      url: 'http://example.com/2',
      likes: 7,
      __v: 0
    },
    {
      _id: '3',
      title: 'Blog Three',
      author: 'Author C',
      url: 'http://example.com/3',
      likes: 10,
      __v: 0
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 20)
  })
})
