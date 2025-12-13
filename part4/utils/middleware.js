const jwt = require('jsonwebtoken')

function tokenExtractor(req, res, next) {
  const auth = req.get('authorization')
  
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.split(' ')[1]
  } else {
    req.token = null
  }
  
  next()
}

async function userExtractor(req, res, next) {
  const token = req.token
  
  if (!token) {
    return res.status(401).send({ error: 'need token' })
  }
  
  let decoded
  try {
    decoded = jwt.verify(token, process.env.SECRET)
  } catch (err) {
    return res.status(401).send({ error: 'bad token' })
  }
  
  if (!decoded.id) {
    return res.status(401).send({ error: 'token weird' })
  }
  
  req.user = {
    id: decoded.id,
    username: decoded.username
  }
  
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}
