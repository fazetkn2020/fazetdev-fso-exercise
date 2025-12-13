const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
// trying to use the middleware i made
const { getUserFromToken, getToken } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', 'username name')
  response.json(blogs)
})

// using middleware for token check
// not sure if this is how you chain middleware
blogsRouter.post('/', getUserFromToken, async (request, response, next) => {
  const body = request.body
  
  // forgot to check title/url at first, had to add later
  if (!body.title) {
    return response.status(400).json({ error: 'title missing' })
  }
  if (!body.url) {
    return response.status(400).json({ error: 'url missing' })
  }
  
  // user id should be from middleware
  // but what if middleware failed? it should have returned already
  const userId = request.userId
  
  // find user - maybe should have done this in middleware?
  const user = await User.findById(userId)
  if (!user) {
    return response.status(400).json({ error: 'user not found' })
    // is 400 right? or 401? not sure
  }
  
  // create blog
  const blog = new Blog({
    title: body.title,
    author: body.author || 'unknown', // default value just in case
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes, // different way to default
    user: user._id
  })
  
  try {
    const savedBlog = await blog.save()
    
    // update user's blogs
    // sometimes i forget this part
    user.blogs = user.blogs || [] // in case blogs array doesnt exist
    user.blogs.push(savedBlog._id)
    await user.save()
    
    // get with user info
    const finalBlog = await Blog.findById(savedBlog._id).populate('user', 'username name')
    response.status(201).json(finalBlog)
  } catch (error) {
    console.log('save error', error.message)
    response.status(500).json({ error: 'failed to save' })
  }
})

// delete doesnt use token yet (maybe should?)
blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    response.status(400).json({ error: 'delete failed' })
  }
})

// update also no token check
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  
  // only updating likes for now
  const updateData = {}
  if (body.likes !== undefined) {
    updateData.likes = body.likes
  }
  // could add other fields later
  
  try {
    const updated = await Blog.findByIdAndUpdate(
      request.params.id,
      updateData,
      { new: true }
    )
    response.json(updated)
  } catch (error) {
    response.status(400).json({ error: 'update failed' })
  }
})

module.exports = blogsRouter
