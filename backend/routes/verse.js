const express = require('express');
const router = express.Router();
const { explainVerse } = require('../controllers/versecontroller');
const { protect } = require('../middleware/auth');

router.post('/explain', protect, explainVerse);


module.exports = router;
