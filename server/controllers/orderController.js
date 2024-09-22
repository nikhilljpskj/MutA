const db = require('../config/db'); // Adjust the path as needed

exports.getOrderSummary = (req, res) => {
    const { productId } = req.params;

    const productSql = `
        SELECT p.id, p.name, p.description, p.price_per_day, p.availability, p.stock,
               cart.quantity,
               GROUP_CONCAT(pi.image_url SEPARATOR ',') AS image_urls
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        LEFT JOIN cart ON cart.product_id = p.id
        WHERE p.id = ?
        GROUP BY p.id
    `;

    db.query(productSql, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching order summary:', err);
            return res.status(500).json({ message: 'Error fetching order summary', error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Convert image_urls to an array and ensure only one instance of '/uploads/products/' is prepended
        const product = results[0];
        if (product.image_urls) {
            product.image_urls = product.image_urls.split(',').map(imageUrl => {
                if (!imageUrl.startsWith('/uploads/products/')) {
                    return `/uploads/products/${imageUrl}`;
                }
                return imageUrl; // Return as is if it already contains the prefix
            });
        } else {
            product.image_urls = [];
        }

        res.status(200).json(product); // Send back the product details
    });
};


exports.createRental = (req, res) => {
    const {
        product_id,
        user_id,
        quantity,
        start_date,
        end_date,
        no_of_days,
        total_price,
        total_price_gst,
        delivery_address,
        contact,
        email,
        status = 0,
    } = req.body;

    const insertSql = `
        INSERT INTO rentals (product_id, user_id, quantity, start_date, end_date, no_of_days,
                             total_price, total_price_gst, delivery_address, contact, email, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
        product_id,
        user_id,
        quantity,
        start_date,
        end_date,
        no_of_days,
        total_price,
        total_price_gst,
        delivery_address,
        contact,
        email,
        status,
    ];

    db.query(insertSql, values, (err, result) => {
        if (err) {
            console.error('Error saving rental details:', err);
            return res.status(500).json({ message: 'Error saving rental details', error: err.message });
        }

        res.status(201).json({ message: 'Rental details saved successfully', rentalId: result.insertId });
    });
};

exports.getRentalById = (req, res) => {
    const rentalId = req.params.id;

    const query = 'SELECT * FROM rentals WHERE id = ?';
    db.query(query, [rentalId], (err, result) => {
        if (err) {
            console.error('Error fetching rental details:', err);
            return res.status(500).json({ message: 'Error fetching rental details' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Rental not found' });
        }

        res.status(200).json(result[0]);
    });
};


exports.getOrdersByUserId = (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT rentals.*, products.name AS product_name, users.email, users.address, users.name AS user_name, users.phone
        FROM rentals
        JOIN products ON rentals.product_id = products.id
        JOIN users ON rentals.user_id = users.id
        WHERE rentals.status = 1 AND rentals.user_id = ?;
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching orders' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.status(200).json(results);
    });
};
