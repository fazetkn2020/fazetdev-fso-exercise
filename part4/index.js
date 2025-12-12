require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()
const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl, { family: 4 })
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.error('error connection to MongoDB:', err.message))

app.use(express.json())
app.use('/api/blogs', blogsRouter) // attach router

const PORT = process.env.PORT || 3003
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
