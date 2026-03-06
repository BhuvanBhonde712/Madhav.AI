const express = require('express');
const router = express.Router();
const { sendMessage, getHistory, clearHistory, getChatHistory } = require('../controllers/chatcontroller');
const { protect, optionalAuth } = require('../middleware/auth');

// optionalAuth — allows both logged in and guest users to chat
router.post('/send', optionalAuth, sendMessage);

// These require login — guests have no history
router.get('/history', protect, getHistory);
router.delete('/clear', protect, clearHistory);
router.get('/recent', protect, getChatHistory);

module.exports = router;
