const jwt = require('jsonwebtoken')

// ex4.20 tokenExtractor middleware
const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization')
  
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    request.token = auth.substring(7)
  } else {
    request.token = null
  }
  
  next()
}

// ex4.21 user check middleware (optional)
const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }
  
  try {
    const decoded = jwt.verify(req.token, process.env.SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'token invalid' })
  }
}

module.exports = {
  tokenExtractor,
  userExtractor
}
