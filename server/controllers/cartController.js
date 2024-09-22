const db = require('../config/db');

exports.addToCart = (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    const query = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
    db.query(query, [user_id, product_id, quantity], (err, results) => {
        if (err) {
            console.error('Error adding to cart:', err);
            return res.status(500).json({ message: 'Error adding to cart', error: err.message });
        }
        res.status(201).json({ message: 'Item added to cart', id: results.insertId });
    });
};
