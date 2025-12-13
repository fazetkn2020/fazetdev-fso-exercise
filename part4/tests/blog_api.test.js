const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.TEST_MONGODB_URI)
}, 30000) // 30 second timeout

beforeEach(async () => {
  // Clear the database completely
  await Blog.deleteMany({})

  // Save blogs one by one to ensure order
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  }, 10000)

  test('unique identifier property of blog posts is named id, not _id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    
    // Check all blogs have id field
    blogs.forEach(blog => {
      expect(blog.id).toBeDefined()
      expect(typeof blog.id).toBe('string')
    })
    
    // Check no blog has _id field
    blogs.forEach(blog => {
      expect(blog._id).toBeUndefined()
    })
  }, 10000)
})

afterAll(async () => {
  await mongoose.connection.close()
})
