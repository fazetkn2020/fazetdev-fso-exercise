const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('when list has only one blog, equals that author', () => {
    const listWithOne = [
      { title: 'A', author: 'Alice', likes: 5 }
    ]
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOne), { author: 'Alice', blogs: 1 })
  })

  test('of a bigger list is calculated right', () => {
    const list = [
      { title: 'A', author: 'Alice', likes: 5 },
      { title: 'B', author: 'Bob', likes: 10 },
      { title: 'C', author: 'Alice', likes: 3 },
      { title: 'D', author: 'Bob', likes: 7 },
      { title: 'E', author: 'Alice', likes: 2 }
    ]
    assert.deepStrictEqual(listHelper.mostBlogs(list), { author: 'Alice', blogs: 3 })
  })
})
