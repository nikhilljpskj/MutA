const express = require('express');
const orderController = require('../controllers/orderController'); // Adjust the path as needed
const router = express.Router();

router.get('/cart/:productId', orderController.getOrderSummary);
router.post('/rentals', orderController.createRental); // New route to save rental details
router.get('/rentals/:id', orderController.getRentalById);
router.get('/orders/:userId', orderController.getOrdersByUserId);

module.exports = router;
