const express = require('express');
const router = express.Router();
const { sendMessage, getHistory, clearHistory, getChatHistory } = require('../controllers/chatcontroller');
const { protect } = require('../middleware/auth');

router.post('/send', protect, sendMessage);
router.get('/history', protect, getHistory);
router.delete('/clear', protect, clearHistory);
router.get('/recent', protect, getChatHistory);

module.exports = router;
