const express = require('express');
const router = express.Router();
const { getPortfolio, updatePortfolio } = require('../controllers/portfolio.controller');
const { protect } = require('../middleware/auth');

// Public route
router.get('/', getPortfolio);

// Protected route
router.put('/', protect, updatePortfolio);

module.exports = router;
