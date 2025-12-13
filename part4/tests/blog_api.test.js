const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: "blog one",
    author: "author one",
    url: "http://blog1.com",
    likes: 5,
  },
  {
    title: "second blog",
    author: "another author",
    url: "http://blog2.net",
    likes: 10
  }
]

let authToken

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI)
}, 30000)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  
  // create test user
  const userData = {
    username: "testuser",
    name: "Test User",
    password: "testpass"
  }
  
  await api.post('/api/users').send(userData)
  
  // login to get token
  const loginRes = await api.post('/api/login').send({
    username: "testuser",
    password: "testpass"
  })
  
  authToken = `Bearer ${loginRes.body.token}`
  
  // create blogs one by one (slower but more reliable)
  for (let blog of initialBlogs) {
    await api.post('/api/blogs')
      .set('Authorization', authToken)
      .send(blog)
  }
}, 30000) // increased timeout

describe('GET /api/blogs', () => {
  test('returns json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /json/)
  }, 15000)

  test('returns correct number', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(initialBlogs.length)
  }, 15000)

  test('has id field', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body[0].id).toBeDefined()
    expect(res.body[0]._id).toBeUndefined()
  }, 15000)
})

describe('POST /api/blogs', () => {
  test('can add blog with token', async () => {
    const newBlog = {
      title: "new test blog",
      author: "test author",
      url: "http://newblog.test",
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(newBlog)
      .expect(201)

    const all = await api.get('/api/blogs')
    expect(all.body.length).toBe(initialBlogs.length + 1)
  }, 15000)

  test('missing likes defaults to 0', async () => {
    const blogNoLikes = {
      title: "no likes",
      author: "anon",
      url: "http://nolikes.com"
    }

    const res = await api
      .post('/api/blogs')
      .set('Authorization', authToken)
      .send(blogNoLikes)
      .expect(201)

    expect(res.body.likes).toBe(0)
  }, 15000)

  test('no title gives 400', async () => {
    const bad = {
      author: "someone",
      url: "http://example.com",
      likes: 1
    }

    await api.post('/api/blogs')
      .set('Authorization', authToken)
      .send(bad)
      .expect(400)
  }, 15000)

  test('no url gives 400', async () => {
    const bad = {
      title: "no url blog",
      author: "writer",
      likes: 2
    }

    await api.post('/api/blogs')
      .set('Authorization', authToken)
      .send(bad)
      .expect(400)
  }, 15000)

  // ex4.23 test
  test('fails with 401 if no token', async () => {
    const newBlog = {
      title: "should fail",
      author: "anon",
      url: "http://fail.com",
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  }, 15000)
})

describe('DELETE /api/blogs/:id', () => {
  test('delete works with token', async () => {
    const blogs = await api.get('/api/blogs')
    const toDelete = blogs.body[0]

    await api.delete(`/api/blogs/${toDelete.id}`)
      .set('Authorization', authToken)
      .expect(204)

    const after = await api.get('/api/blogs')
    expect(after.body.length).toBe(initialBlogs.length - 1)
  }, 15000)
})

describe('PUT /api/blogs/:id', () => {
  test('update likes works', async () => {
    const blogs = await api.get('/api/blogs')
    const toUpdate = blogs.body[0]

    const result = await api
      .put(`/api/blogs/${toUpdate.id}`)
      .send({ likes: 999 })
      .expect(200)

    expect(result.body.likes).toBe(999)
  }, 15000)
})

afterAll(async () => {
  await mongoose.connection.close()
})
