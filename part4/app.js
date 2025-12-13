const express = require('express')
const mongoose = require('mongoose')
// had to add login router later, forgot at first
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
require('dotenv').config() // need this for SECRET

const app = express()

// only connect to db if not testing (tests handle their own connection)
// this part always confuses me a bit
if (process.env.NODE_ENV !== 'test') {
  let mongoUrl
  if (process.env.NODE_ENV === 'test') {
    mongoUrl = process.env.TEST_MONGODB_URI
  } else {
    mongoUrl = process.env.MONGODB_URI
  }
  
  mongoose.connect(mongoUrl)
    .then(result => {
      console.log('connected to mongodb')
    })
    .catch((error) => {
      console.log('error connecting to mongodb:', error.message)
    })
}

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter) // new route for ex4.18

// forgot to export app at first lol
module.exports = app
