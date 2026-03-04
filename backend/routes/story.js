const express = require('express');
const router = express.Router();
const { getStoryChapter } = require('../controllers/storycontroller');
const { protect } = require('../middleware/auth');

router.post('/chapter', protect, getStoryChapter);

module.exports = router;
