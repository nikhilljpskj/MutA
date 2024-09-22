const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController.js');

// Add item to cart
router.post('/', cartController.addToCart);

module.exports = router;
