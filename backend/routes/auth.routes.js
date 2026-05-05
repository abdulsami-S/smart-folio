const express = require('express');
const router = express.Router();
const { login, refresh, logout, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const { loginRules } = require('../middleware/validate');

router.post('/login', loginLimiter, loginRules, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
