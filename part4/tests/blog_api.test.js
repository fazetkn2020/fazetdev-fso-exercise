const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

// test blogs
const initialBlogs = [
  {
    "title": "my first blog",
    author: "john doe",
    "url": "https://myblog.com/1",
    likes: 3,
  },
  {
    title: "another blog post",
    "author": "jane smith",
    url: "http://blog.example.com/post2",
    "likes": 8
  }
]

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI)
  // console.log('connected to test db')
})

beforeEach(async () => {
  await Blog.deleteMany({})
  
  // add the blogs
  for (let i = 0; i < initialBlogs.length; i++) {
    const blog = new Blog(initialBlogs[i])
    await blog.save()
  }
})

describe('getting blogs', () => {
  test('blogs come back as json', async () => {
    await api
      .get('/api/blogs')
      .expect('Content-Type', /json/)
  })

  test('right number of blogs', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body.length).toBe(initialBlogs.length)
  })

  test('id field exists not _id', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body[0].id).toBeDefined()
    // should not have _id
    expect(res.body[0]._id).toBe(undefined)
  })
})

// tests for posting new blogs
describe('POST to /api/blogs', () => {
  test('can add new blog', async () => {
    const blogToAdd = {
      title: "testing post",
      author: "tester",
      url: "http://test.test",
      likes: 99
    }

    await api.post('/api/blogs').send(blogToAdd).expect(201)

    const allBlogs = await api.get('/api/blogs')
    expect(allBlogs.body).toHaveLength(initialBlogs.length + 1)
  })

  // ex 4.11 test - likes missing should be 0
  test('missing likes becomes 0', async () => {
    const noLikesBlog = {
      title: "no likes blog",
      author: "anon",
      url: "http://nolikes.com"
      // no likes here
    }

    const result = await api
      .post('/api/blogs')
      .send(noLikesBlog)
      .expect(201)

    // check likes is 0
    expect(result.body.likes).toEqual(0)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
