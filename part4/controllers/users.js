const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  // check username
  if (!body.username || body.username.length < 3) {
    return response.status(400).send({ error: 'username too short, need 3 chars' })
  }

  // check password
  if (!body.password || body.password.length < 3) {
    return response.status(400).send({ error: 'password too short, need 3 chars' })
  }

  const salt = 10
  const hash = await bcrypt.hash(body.password, salt)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: hash
  })

  try {
    const saved = await user.save()
    response.status(201).json(saved)
  } catch (exception) {
    // duplicate username error
    if (exception.name === 'MongoServerError' && exception.code === 11000) {
      return response.status(400).json({ error: 'username already taken' })
    }
    // other errors
    console.log('error saving user:', exception.message)
    response.status(400).json({ error: 'something wrong' })
  }
})

module.exports = usersRouter
