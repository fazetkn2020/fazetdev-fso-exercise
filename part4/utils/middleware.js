// trying to make middleware for tokens
// not really sure if this is right

const jwt = require('jsonwebtoken')

// this was supposed to be middleware but i made it a regular function first
function getToken(req) {
  const auth = req.headers['authorization']
  if (auth && typeof auth === 'string') {
    if (auth.startsWith('Bearer ') || auth.startsWith('bearer ')) {
      return auth.split(' ')[1] // get part after space
    }
  }
  return null
}

// first attempt at middleware - might not work right
const tokenStuff = (req, res, next) => {
  const token = getToken(req)
  req.token = token // just attach token
  
  // i think we're supposed to check it here but not sure
  if (!token) {
    // should we return error here or let route handle it?
    // for now just attach null and let route decide
  }
  
  next()
}

// another try - this one gets user from token
const getUserFromToken = async (req, res, next) => {
  const token = getToken(req)
  
  if (!token) {
    return res.status(401).send({ error: 'need token' })
  }
  
  let decoded
  try {
    decoded = jwt.verify(token, process.env.SECRET)
  } catch (err) {
    console.log('jwt error:', err.message)
    return res.status(401).send({ error: 'token bad' })
  }
  
  if (!decoded.id) {
    return res.status(401).send({ error: 'no user id in token' })
  }
  
  req.userId = decoded.id
  req.username = decoded.username // might need this later
  
  next()
}

// export whatever works
module.exports = {
  getToken,  // not really middleware but might be useful
  tokenStuff, // middleware that just attaches token
  getUserFromToken // middleware that checks token and gets user
}
