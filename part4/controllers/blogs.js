const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', 'username name')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  
  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'need title and url' })
  }
  
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }
  
  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: 'token invalid' })
  }
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }
  
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(401).json({ error: 'user not found' })
  }
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })
  
  try {
    const savedBlog = await blog.save()
    
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    const blogWithUser = await Blog.findById(savedBlog._id).populate('user', 'username name')
    response.status(201).json(blogWithUser)
  } catch (error) {
    response.status(500).json({ error: 'save failed' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token
  
  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }
  
  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: 'token invalid' })
  }
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }
  
  // get blog to check owner
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  
  // check if user is creator
  // blog.user is ObjectId, need to convert to string
  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(403).json({ error: 'not authorized' })
  }
  
  // delete blog
  await Blog.findByIdAndDelete(request.params.id)
  
  // also remove from user's blogs array (optional but good)
  const user = await User.findById(decodedToken.id)
  if (user) {
    user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
    await user.save()
  }
  
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: body.likes },
    { new: true }
  )

  response.json(updatedBlog)
})

module.exports = blogsRouter
