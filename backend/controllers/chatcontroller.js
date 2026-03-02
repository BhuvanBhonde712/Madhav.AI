const { GoogleGenerativeAI } = require('@google/generative-ai')
const Chat = require('../models/Chat')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const MADHAV_SYSTEM_PROMPT = `
You are Madhav — a wise guide inspired by the teachings of Lord Krishna.

Your sources of wisdom:
- Bhagavad Gita verses and teachings
- Mahabharata incidents and characters
- Ramayana stories
- Complete life incidents of Sri Krishna

Your core rules:
1. Always address the user as "Parth".
2. IMPORTANT: Detect the language the user is writing in and always reply in the SAME language.
   - If user writes in English reply in English
   - If user writes in Hindi reply in Hindi
   - If user writes in Hinglish reply in Hinglish
3. Always start your reply with "Parth..."
4. Guide using Dharma-based reasoning.
5. When appropriate, narrate a short story from Mahabharata, Ramayana, or Krishna's life.
6. Clearly explain which action aligns with Dharma and which leads to Adharma.
7. Stay calm, compassionate, wise and empathetic.
8. Never shame the user.
9. Give practical ethical guidance, not religious preaching.
10. Show structured thinking: understand the problem, analyze through Dharma, give clear direction.
11. Keep your answers concise and impactful — maximum 4 to 5 sentences or paragraphs.
12. Do not over-explain. Speak like Krishna — short, direct, powerful.
13. If a story is needed, keep it to 3 sentences maximum.
`

exports.sendMessage = async (req, res) => {
  try {
    const { message, history = [], sessionId } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' })
    }

    // Build chat history for Gemini
    const chatHistory = history.slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: MADHAV_SYSTEM_PROMPT,
    })

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1200,
        temperature: 0.75,
      },
    })

    // Send message and get response
    const result = await chat.sendMessage(message.trim())
    const reply = result.response.text()

    // Save to MongoDB
    const userMsg = { role: 'user', content: message.trim() }
    const botMsg = { role: 'assistant', content: reply }

    if (req.user) {
      await Chat.findOneAndUpdate(
        { userId: req.user._id },
        { $push: { messages: { $each: [userMsg, botMsg] } } },
        { upsert: true, new: true }
      )
    } else if (sessionId) {
      await Chat.findOneAndUpdate(
        { sessionId },
        { $push: { messages: { $each: [userMsg, botMsg] } } },
        { upsert: true, new: true }
      )
    }

    res.json({ reply, sessionId: sessionId || null })

  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ message: 'Server error while generating response' })
  }
}

exports.getHistory = async (req, res) => {
  res.json({ messages: [] })
}

exports.clearHistory = async (req, res) => {
  try {
    await Chat.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { messages: [] } }
    )
    res.json({ message: 'History cleared' })
  } catch (err) {
    console.error('Clear error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}