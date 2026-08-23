const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided.' })
    }
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me')
    const user = await User.findById(decoded.id).select('-passwordHash')
    if (!user) return res.status(401).json({ message: 'User no longer exists.' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid or expired token.' })
  }
}

module.exports = { protect }
