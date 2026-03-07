const express = require('express');
const router = express.Router();
const { speakText } = require('../controllers/voiceController');
router.post('/speak', speakText);
module.exports = router;
