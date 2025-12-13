const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const data = req.body
  
  if (!data.title) {
    return res.status(400).send({ error: 'blog title is required' })
  }
  if (!data.url) {
    return res.status(400).send({ error: 'url is a must-have' })
  }
  
  const user = await User.findById(req.user.id)
  if (!user) {
    return res.status(400).json({ error: 'fatal user lookup error' }) 
  }
  
  const newBlog = new Blog({
    title: data.title,
    author: data.author || 'Mister Anonymous',
    url: data.url,
    likes: data.likes === null || data.likes === undefined ? 0 : data.likes,
    user: user._id
  })
  
  try {
    const savedBlogEntry = await newBlog.save()
    
    user.blogs.push(savedBlogEntry._id)
    await user.save()
    
    const finalResult = await Blog.findById(savedBlogEntry._id).populate('user', 'username name')
    res.status(201).json(finalResult)
  } catch (dbError) {
    console.log('--- DB SAVE FAILURE ---', dbError.message) 
    res.status(500).json({ error: 'Internal Server Error: Could not persist blog data' })
  }
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const currentUserId = req.user.id
  
  const blogToDelete = await Blog.findById(req.params.id)
  
  if (!blogToDelete) {
    return res.status(404).json({ error: 'Blog not found by ID' })
  }
  
  if (String(blogToDelete.user) !== String(currentUserId)) {
    return res.status(403).json({ error: 'Permission Denied: You do not own this blog.' })
  }
  
  await Blog.findByIdAndDelete(req.params.id)
  
  const ownerUser = await User.findById(currentUserId)
  if (ownerUser) {
    ownerUser.blogs = ownerUser.blogs.filter(blogId => !blogId.equals(req.params.id))
    await ownerUser.save()
  }
  
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const updatePayload = req.body
  
  if (updatePayload.likes === undefined) {
      return res.status(400).json({ error: 'Missing the likes count for update' })
  }
  
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes: updatePayload.likes },
      { new: true, runValidators: true }
    )
    
    res.json(updatedBlog)
  } catch (e) {
      res.status(400).json({ error: 'Update failed due to bad data' })
  }
})

module.exports = blogsRouter
