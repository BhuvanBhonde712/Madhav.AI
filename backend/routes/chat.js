const express = require('express')
const router = express.Router()
const Chat = require('../models/chat')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// POST - send message and get Gemini response
router.post('/', async (req, res) => {
  try {
    const { userId, sessionId, message } = req.body

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(message)
    const reply = result.response.text()

    // Save to MongoDB
    let chat = await Chat.findOne({ sessionId })
    if (!chat) {
      chat = new Chat({ userId, sessionId, messages: [] })
    }
    chat.messages.push({ role: 'user', content: message })
    chat.messages.push({ role: 'assistant', content: reply })
    await chat.save()

    res.json({ reply })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET - fetch chat history
router.get('/', async (req, res) => {
  try {
    const chat = await Chat.findOne({ sessionId: req.query.sessionId })
    res.json(chat ? chat.messages : [])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
