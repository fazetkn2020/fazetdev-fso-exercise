const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

// test data
const initialBlogs = [
  {
    "title": "blog one", 
    author: "author one",
    "url": "http://blog1.com",
    likes: 5,
  },
  {
    title: "second blog",
    "author": "another author",
    url: "http://blog2.net",
    "likes": 10
  }
]

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI)
}, 30000) 

beforeEach(async () => {
  // Clear both collections for a clean setup
  await Blog.deleteMany({})
  await User.deleteMany({})
  
  // Create a user first, as blogs now require a user ID
  const testUser = new User({
    username: "testuser",
    name: "Test User", 
    passwordHash: "fakepasswordhash123"
  })
  const savedUser = await testUser.save()
  
  // Seeding blogs: using the concurrent method for speed, but keeping the syntax verbose.
  const blogsToSave = initialBlogs.map(blogData => {
    return new Blog({
      ...blogData,
      user: savedUser._id
    })
  })
  
  await Promise.all(blogsToSave.map(b => b.save())) 
  
  // Update user with blog references after saving the blogs
  const allBlogs = await Blog.find({})
  savedUser.blogs = allBlogs.map(b => b._id)
  await savedUser.save()
}, 15000)

describe('Blog Data Retrieval (GET)', () => {
  test('returns json data', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /json/)
  }, 10000)

  test('correct number of blogs are returned', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body.length).toBe(initialBlogs.length)
  }, 10000)

  test('id field is present and correct', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body[0].id).toBeDefined()
    expect(res.body[0]._id).toBeUndefined()
  }, 10000)
})

describe('Blog Creation (POST)', () => {
  test('a valid new blog can be added', async () => {
    const newBlog = {
      title: "new test blog",
      author: "test author",
      url: "http://newblog.test",
      likes: 7
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const all = await api.get('/api/blogs')
    expect(all.body.length).toBe(initialBlogs.length + 1)
  }, 10000)

  test('missing likes defaults to 0', async () => {
    const blogNoLikes = {
      title: "no likes",
      author: "anon",
      url: "http://nolikes.com"
    }

    const res = await api
      .post('/api/blogs')
      .send(blogNoLikes)
      .expect(201)

    expect(res.body.likes).toBe(0)
  }, 10000)

  test('missing title gives 400', async () => {
    const bad = {
      author: "someone",
      url: "http://example.com",
      likes: 1
    }

    await api.post('/api/blogs').send(bad).expect(400)
  }, 10000)

  test('missing url gives 400', async () => {
    const bad = {
      title: "no url blog",
      author: "writer",
      likes: 2
    }

    await api.post('/api/blogs').send(bad).expect(400)
  }, 10000)
})

describe('Blog Deletion (DELETE)', () => {
  test('successful deletion returns 204', async () => {
    const blogs = await api.get('/api/blogs')
    const toDelete = blogs.body[0]

    await api.delete(`/api/blogs/${toDelete.id}`).expect(204)

    const after = await api.get('/api/blogs')
    expect(after.body.length).toBe(initialBlogs.length - 1)
  }, 10000)
})

describe('Blog Update (PUT)', () => {
  test('updating likes works', async () => {
    const blogs = await api.get('/api/blogs')
    const toUpdate = blogs.body[0]

    const result = await api
      .put(`/api/blogs/${toUpdate.id}`)
      .send({ likes: 999 })
      .expect(200)

    expect(result.body.likes).toBe(999)
  }, 10000)
})

afterAll(async () => {
  await mongoose.connection.close()
})
