const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const subcategoriesController = require('../controllers/subcategoriesController');

// Categories routes
router.post('/categories/add', categoriesController.addCategory);
router.get('/categories', categoriesController.getCategories);
router.get('/categories/:id', categoriesController.getCategoryById);
router.put('/categories/update/:id', categoriesController.updateCategory);

// Subcategories routes
router.post('/subcategories/add', subcategoriesController.addSubCategory);
router.get('/subcategories', subcategoriesController.getSubCategories);
router.get('/subcategories/:id', subcategoriesController.getSubCategoryById);
router.put('/subcategories/update/:id', subcategoriesController.updateSubCategory);
router.get('/subcategories/category/:categoryId', subcategoriesController.getSubcategoriesByCategoryId);

module.exports = router;
