const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user','assistant'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, sparse: true },
  sessionId: { type: String, index: true, sparse: true },
  messages: [messageSchema],
}, { timestamps: true })

module.exports = mongoose.model('Chat', chatSchema)