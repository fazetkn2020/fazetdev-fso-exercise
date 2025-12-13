const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
require('dotenv').config()

const app = express()

// Only connect to MongoDB if not in test environment
// In test environment, the tests will handle the connection
if (process.env.NODE_ENV !== 'test') {
  // Database connection - use test DB when NODE_ENV is 'test'
  const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

  // Connect to MongoDB
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log(`Connected to MongoDB (${process.env.NODE_ENV || 'development'} mode)`)
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error.message)
    })
}

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app
