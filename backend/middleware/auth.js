const jwt = require('jsonwebtoken')
const User = require('../models/user')

const protect = async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) return res.status(401).json({ message: 'Authentication required' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    if (!req.user) return res.status(401).json({ message: 'User not found' })
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

const optionalAuth = async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id)
    } catch {}
  }
  next()
}

module.exports = { protect, optionalAuth }