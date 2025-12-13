const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// forgot to import User at first, had to add it later
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  // show user info with each blog
  const blogs = await Blog.find({}).populate('user', 'username name')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'need title and url'
    })
  }

  // need a user for the blog, just take first one for now
  const user = await User.findOne({})
  if (!user) {
    return response.status(400).json({ error: 'no users found' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id  // using id instead of _id
  })

  const savedBlog = await blog.save()
  
  // add blog to user's list
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  // populate user info in response
  const populatedBlog = await Blog.findById(savedBlog.id).populate('user', 'username name')
  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: body.likes }, // only updating likes for now
    { new: true }
  )

  response.json(updatedBlog)
})

module.exports = blogsRouter
