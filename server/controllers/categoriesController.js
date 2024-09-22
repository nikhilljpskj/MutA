const db = require('../config/db');
const moment = require('moment');

// Add a new category
exports.addCategory = (req, res) => {
  const { name } = req.body;
  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

  if (!name) {
    return res.status(400).send({ success: false, message: 'Category name is required' });
  }

  const sql = 'INSERT INTO categories (name, created_at) VALUES (?, ?)';
  db.query(sql, [name, createdAt], (err, result) => {
    if (err) {
      console.error('Error adding category:', err);
      return res.status(500).send({ success: false, message: 'Error adding category' });
    }
    res.status(200).send({ success: true, message: 'Category added successfully' });
  });
};

exports.getCategories = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const sqlCount = 'SELECT COUNT(*) AS total FROM categories';
  const sql = 'SELECT * FROM categories LIMIT ?, ?';

  db.query(sqlCount, (err, countResult) => {
    if (err) return res.status(500).send(err);

    const totalCategories = countResult[0].total;
    const totalPages = Math.ceil(totalCategories / limit);

    db.query(sql, [offset, limit], (err, categories) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ categories, totalPages });
    });
  });
};




// Get category by ID
exports.getCategoryById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM categories WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching category:', err);
      return res.status(500).send({ success: false, message: 'Failed to fetch category' });
    }
    res.status(200).send(result[0]);
  });
};

// Update category by ID
exports.updateCategory = (req, res) => {
  const { id } = req.params; // Get category ID from URL
  const { name } = req.body; // Get category name from request body

  if (!name) {
    return res.status(400).send({ success: false, message: 'Category name is required' });
  }

  const sql = 'UPDATE categories SET name = ? WHERE id = ?';
  db.query(sql, [name, id], (err, result) => {
    if (err) {
      console.error('Error updating category:', err);
      return res.status(500).send({ success: false, message: 'Failed to update category' });
    }
    res.status(200).send({ success: true, message: 'Category updated successfully' });
  });
};
