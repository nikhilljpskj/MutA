const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const upload = require('../middlewares/uploadMiddleware');  // Import the upload middleware

// Route to handle product creation with file upload (up to 10 images)
router.post('/products/add', upload.array('images', 10), productController.addProduct);
router.get('/products', productController.getAllProducts);
router.put('/products/:id', productController.updateProduct);

// Delete a product
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
