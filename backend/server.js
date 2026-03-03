require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')

const app = express()

// Connect Database
connectDB()

// Security Middlewares
app.use(helmet())

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json({ limit: '10kb' }))

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests. Please try again later.' },
})

app.use('/api', limiter)

// ✅ Use Routes (NOT middleware or models)
app.use('/api/auth', require('./routes/auth'))
app.use('/api/chat', require('./routes/chat'))

// Health Check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', app: 'Madhav.ai' })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  })
})

// Start Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🕉️ Madhav.ai server running on port ${PORT}`)
})
