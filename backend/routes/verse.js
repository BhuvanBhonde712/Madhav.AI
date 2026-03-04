const express = require('express');
const router = express.Router();
const { explainVerse } = require('../controllers/verseController');
const { protect } = require('../middleware/auth');

router.post('/explain', protect, explainVerse);

module.exports = router;