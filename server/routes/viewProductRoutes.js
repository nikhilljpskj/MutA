const express = require('express');
const { getProducts, getProductDetails } = require('../controllers/viewProductController');
const router = express.Router();

// Route for fetching all products
router.get('/', getProducts);

// Route for fetching a single product by ID
router.get('/:id', getProductDetails);

module.exports = router;
