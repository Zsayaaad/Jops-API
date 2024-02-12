const express = require('express');

const { register, login } = require('../controller/auth');
const authMiddleware = require('../middleware/authentication');

const router = express.Router();

router.post('/register', register);
router.post('/login', authMiddleware, login);

module.exports = router;
