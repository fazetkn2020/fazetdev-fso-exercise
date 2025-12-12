const { test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

test('total likes of empty list is zero', () => {
  const blogs = []
  const result = listHelper.totalLikes(blogs)
  assert.strictEqual(result, 0)
})

test('total likes of a list with one blog equals that blog\'s likes', () => {
  const blogs = [{ title: 'Test Blog', likes: 5 }]
  const result = listHelper.totalLikes(blogs)
  assert.strictEqual(result, 5)
})

test('total likes of a bigger list is calculated right', () => {
  const blogs = [
    { title: 'Blog1', likes: 1 },
    { title: 'Blog2', likes: 2 },
    { title: 'Blog3', likes: 3 }
  ]
  const result = listHelper.totalLikes(blogs)
  assert.strictEqual(result, 6)
})
