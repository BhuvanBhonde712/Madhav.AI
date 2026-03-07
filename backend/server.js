const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes  = require('./routes/auth');
const chatRoutes  = require('./routes/chat');
const verseRoutes = require('./routes/verse');
const karmaRoutes = require('./routes/karma');
const storyRoutes = require('./routes/story');

const app = express();

// Connect DB
connectDB();

// CORS — allow main domain, all Vercel preview URLs, and localhost
app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      origin === 'https://madhav-ai.vercel.app' ||
      origin.endsWith('.vercel.app') ||
      origin.startsWith('http://localhost')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ status: 'Madhav AI is running' }));

// Routes
app.use('/api/auth',  authRoutes);
app.use('/api/chat',  chatRoutes);
app.use('/api/verse', verseRoutes);
app.use('/api/karma', karmaRoutes);
app.use('/api/story', storyRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
