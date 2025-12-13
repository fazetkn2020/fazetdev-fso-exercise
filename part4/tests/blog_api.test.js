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

  // ex 4.12 tests
  test('missing title returns 400', async () => {
    const noTitleBlog = {
      author: "someone",
      url: "http://example.com",
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(noTitleBlog)
      .expect(400)
  })

  test('missing url returns 400', async () => {
    const noUrlBlog = {
      title: "blog with no url",
      author: "writer",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(noUrlBlog)
      .expect(400)
  })
})

// tests for deleting blogs - ex4.13
describe('DELETE /api/blogs/:id', () => {
  test('can delete a blog', async () => {
    // first get all blogs to get an id
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    // delete the blog
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    // check it was deleted
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length - 1)

    // check the deleted blog is not in the list
    const titles = blogsAtEnd.body.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
