const jwt = require('jsonwebtoken')
const User = require('../models/user')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  })

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'सभी फ़ील्ड आवश्यक हैं' })
    const existing = await User.findOne({ email })
    if (existing)
      return res.status(409).json({ message: 'यह ईमेल पहले से पंजीकृत है' })
    const user = await User.create({ name, email, password })
    const token = signToken(user._id)
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'ईमेल और पासवर्ड आवश्यक हैं' })
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'ईमेल या पासवर्ड गलत है' })
    const token = signToken(user._id)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.profile = async (req, res) => {
  res.json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  })
}