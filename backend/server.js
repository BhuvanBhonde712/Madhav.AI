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

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ status: 'Madhav AI is running 🕉️' }));

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
