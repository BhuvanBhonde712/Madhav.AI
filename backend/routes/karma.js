const express = require('express');
const router = express.Router();
const { analyzeKarma } = require('../controllers/karmacontroller');
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, analyzeKarma);

module.exports = router;