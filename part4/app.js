const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { tokenExtractor } = require('./utils/middleware')
require('dotenv').config()

const app = express()

if (process.env.NODE_ENV !== 'test') {
  let mongoUrl = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI
  
  mongoose.connect(mongoUrl)
    .then(() => {
      console.log('connected to db')
    })
    .catch(err => {
      console.log('db error:', err.message)
    })
}

app.use(express.json())
app.use(tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app
