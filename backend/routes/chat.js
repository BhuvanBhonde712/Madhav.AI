const express = require('express')
const router = express.Router()
const Chat = require('../models/Chat')

// GET chats
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.query.userId })
    res.json(chats)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST new chat
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

module.exports = router   // ✅ Must export router, NOT a mongoose model
