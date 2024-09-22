const db = require('../config/db');

// Add a new subcategory
exports.addSubCategory = (req, res) => {
  const { categoryId, name } = req.body;

  console.log('Received data:', { categoryId, name });

  if (!categoryId || !name) {
    console.error('Category ID or Subcategory name missing');
    return res.status(400).send({ success: false, message: 'Category ID and Subcategory name are required' });
  }

  const sql = 'INSERT INTO subcategories (category_id, name) VALUES (?, ?)';
  db.query(sql, [categoryId, name], (err, result) => {
    if (err) {
      console.error('Error adding subcategory:', err);
      return res.status(500).send({ success: false, message: 'Error adding subcategory' });
    }
    res.status(200).send({ success: true, message: 'Subcategory added successfully' });
  });
};




// Get all subcategories with pagination
exports.getSubCategories = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // Number of items per page
  const offset = (page - 1) * limit;

  const countSql = 'SELECT COUNT(*) as total FROM subcategories';
  const fetchSql = `
    SELECT subcategories.id, subcategories.name, categories.name AS category_name 
    FROM subcategories 
    JOIN categories ON subcategories.category_id = categories.id 
    LIMIT ? OFFSET ?;
  `;

  // Get total count of subcategories for pagination
  db.query(countSql, (err, countResult) => {
    if (err) {
      console.error('Error counting subcategories:', err);
      return res.status(500).send({ success: false, message: 'Failed to fetch subcategories' });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Fetch paginated subcategories
    db.query(fetchSql, [limit, offset], (err, result) => {
      if (err) {
        console.error('Error fetching subcategories:', err);
        return res.status(500).send({ success: false, message: 'Failed to fetch subcategories' });
      }

      res.status(200).send({
        success: true,
        subCategories: result,
        totalPages: totalPages,
      });
    });
  });
};



// Get a subcategory by ID
exports.getSubCategoryById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM subcategories WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching subcategory:', err);
      return res.status(500).send({ success: false, message: 'Failed to fetch subcategory' });
    }
    res.status(200).send(result[0]);
  });
};

// Update a subcategory by ID
exports.updateSubCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const sql = 'UPDATE subcategories SET name = ? WHERE id = ?';
  db.query(sql, [name, id], (err, result) => {
    if (err) {
      console.error('Error updating subcategory:', err);
      return res.status(500).send({ success: false, message: 'Failed to update subcategory' });
    }
    res.status(200).send({ success: true, message: 'Subcategory updated successfully' });
  });
};


// Get subcategories by category ID
exports.getSubcategoriesByCategoryId = (req, res) => {
  const { categoryId } = req.params;
  console.log('Received data:', { categoryId });

  const sql = 'SELECT * FROM subcategories WHERE category_id = ?';
  db.query(sql, [categoryId], (err, results) => {
    if (err) {
      console.error('Error fetching subcategories:', err);
      return res.status(500).send({ success: false, message: 'Failed to fetch subcategories' });
    }
    res.status(200).json(results);
  });
};
