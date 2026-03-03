const express = require('express')
const router = express.Router()
const Chat = require('../models/chat')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

router.post('/', async (req, res) => {
  try {
    const { message, sessionId, history = [] } = req.body

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Build context from history
    const context = history.map(m => `${m.role === 'user' ? 'User' : 'Madhav'}: ${m.content}`).join('\n')
    const prompt = `You are Madhav, a wise spiritual guide inspired by the Bhagavad Gita. Speak with wisdom, compassion and clarity.
${context ? `\nConversation so far:\n${context}` : ''}
User: ${message}
Madhav:`

    const result = await model.generateContent(prompt)
    const reply = result.response.text()

    // Save to MongoDB
    let chat = await Chat.findOne({ sessionId: String(sessionId) })
    if (!chat) {
      chat = new Chat({ sessionId: String(sessionId), messages: [] })
    }
    chat.messages.push({ role: 'user', content: message })
    chat.messages.push({ role: 'assistant', content: reply })
    await chat.save()

    res.json({ reply })
  } catch (err) {
    console.error('Chat error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const chat = await Chat.findOne({ sessionId: String(req.query.sessionId) })
    res.json(chat ? chat.messages : [])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
