const express = require('express');
const { register, login, logout, googleOAuth } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', googleOAuth); 

module.exports = router;  // This should be exporting the router
