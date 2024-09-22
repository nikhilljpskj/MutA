const db = require('../config/db');

exports.getProducts = (req, res) => {
    const productSql = `
        SELECT p.id, p.name, p.description, p.price_per_day, p.availability, p.stock,
               c.name AS category_name,
               GROUP_CONCAT(pi.image_url SEPARATOR ',') AS image_urls
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        LEFT JOIN categories c ON p.category_id = c.id  -- Join with categories table
        GROUP BY p.id
        LIMIT 0, 25;
    `;

    db.query(productSql, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ message: 'Error fetching products', error: err.message });
        }

        // Convert image_urls to an array and ensure only one instance of '/uploads/products/' is prepended
        results = results.map(product => {
            if (product.image_urls) {
                product.image_urls = product.image_urls.split(',').map(imageUrl => {
                    // Check if the path already contains '/uploads/products/'
                    if (!imageUrl.startsWith('/uploads/products/')) {
                        return `/uploads/products/${imageUrl}`;
                    }
                    return imageUrl; // If it already contains the prefix, return as is
                });
            } else {
                product.image_urls = [];
            }
            return product;
        });

        res.status(200).json(results);
    });
};


// productController.js

exports.getProductDetails = (req, res) => {
    const productId = req.params.id; // Get the product ID from the request parameters

    const productSql = `
        SELECT p.id, p.name, p.description, p.price_per_day, p.availability, p.stock, p.category_id,
               GROUP_CONCAT(pi.image_url SEPARATOR ',') AS image_urls,
               c.name AS category_name
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
        GROUP BY p.id;
    `;

    db.query(productSql, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product details:', err);
            return res.status(500).json({ message: 'Error fetching product details', error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Convert image_urls to an array and ensure only one instance of '/uploads/products/' is prepended
        const product = results[0];
        if (product.image_urls) {
            product.image_urls = product.image_urls.split(',').map(imageUrl => {
                if (!imageUrl.startsWith('/uploads/products/')) {
                    return `/uploads/products/${imageUrl}`;
                }
                return imageUrl;
            });
        } else {
            product.image_urls = [];
        }

        res.status(200).json(product);
    });
};
