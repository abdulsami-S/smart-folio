const express = require('express');
const router = express.Router();
const { getPortfolio, updatePortfolio } = require('../controllers/portfolio.controller');
const { protect } = require('../middleware/auth');
const { updatePortfolioRules } = require('../middleware/validate');

// Public route
router.get('/', getPortfolio);

// Protected route
router.put('/', protect, updatePortfolioRules, updatePortfolio);

module.exports = router;
