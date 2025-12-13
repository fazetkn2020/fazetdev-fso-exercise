const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body
  
  // look for user
  const user = await User.findOne({ username: body.username })
  
  // check if password is right
  let passwordOk = false
  if (user) {
    passwordOk = await bcrypt.compare(body.password, user.passwordHash)
  }
  
  if (!user || !passwordOk) {
    return response.status(401).json({
      error: 'wrong username or password'
    })
  }
  
  // make token thingy
  const tokenData = {
    username: user.username,
    id: user._id
  }
  
  // token stuff from part4 examples
  const token = jwt.sign(tokenData, process.env.SECRET)
  
  response.status(200).send({
    token: token,
    username: user.username,
    name: user.name
  })
})

module.exports = loginRouter
