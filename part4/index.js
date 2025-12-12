require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

// Use Atlas connection string from .env
const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl, { family: 4 })
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => console.error('error connection to MongoDB:', err.message))

app.use(express.json())

// GET all blogs
app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

// POST a new blog
app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

// Listen on all interfaces for Termux
const PORT = process.env.PORT || 3003
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
