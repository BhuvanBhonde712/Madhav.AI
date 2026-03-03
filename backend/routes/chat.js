const express = require('express')
const router = express.Router()
const Chat = require('../models/Chat')

// GET all chats for a user
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.query.userId })
    res.json(chats)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST create new chat / add message
router.post('/', async (req, res) => {
  try {
    const { userId, sessionId, messages } = req.body
    const chat = new Chat({ userId, sessionId, messages })
    await chat.save()
    res.status(201).json(chat)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
