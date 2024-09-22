const express = require('express');
const router = express.Router();
const { getProducts, getCategories } = require('../controllers/homeController');

// Route for getting products
router.get('/products', getProducts);

// Route for getting categories
router.get('/categories', getCategories);

module.exports = router;
