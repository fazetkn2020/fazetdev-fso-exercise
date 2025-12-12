const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
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
      title: 'First',
      author: 'Alice',
      url: 'url1',
      likes: 2,
      __v: 0
    },
    {
      _id: '2',
      title: 'Second',
      author: 'Bob',
      url: 'url2',
      likes: 3,
      __v: 0
    },
    {
      _id: '3',
      title: 'Third',
      author: 'Alice',
      url: 'url3',
      likes: 1,
      __v: 0
    }
  ]

  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('when list has only one blog, equals that author', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)
    assert.deepStrictEqual(result, { author: 'Alice', blogs: 2 })
  })
})
