const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuth.controller');

// register a new user
router.post('/register', userAuthController.register);

// login a user
router.post('/login', userAuthController.login);

// logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

module.exports = router;