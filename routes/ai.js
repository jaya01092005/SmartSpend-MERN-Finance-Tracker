const express = require('express');
const router = express.Router();
const { getInsights } = require('../controllers/ai');
const { protect } = require('../middleware/auth');

router.get('/insights', protect, getInsights);

module.exports = router;
