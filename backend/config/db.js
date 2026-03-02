const mongoose = require('mongoose')

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    })
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`❌ MongoDB failed: ${err.message}`)
    process.exit(1)
  }
}

module.exports = connectDB