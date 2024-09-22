const db = require('../config/db');


// Fetch all products with image and name from product_image and products tables
// Fetch all products with image and name from product_image and products tables
exports.getProducts = (req, res) => {
    const query = `
        SELECT 
            p.id AS product_id, 
            p.name AS product_name, 
            p.price_per_day,
            pi.image_url
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        
        // Group products and their images (similar to how categories are handled)
        const products = results.map(product => ({
            id: product.product_id,
            name: product.product_name,
            price_per_day: product.price_per_day,
            image: product.image_url
        }));

        res.json({ products });
    });
};


exports.getCategories = (req, res) => {
    const query = `
        SELECT 
            sc.id AS sub_category_id,
            sc.name AS sub_category_name,
            p.id AS product_id,
            p.name AS product_name,
            p.price_per_day,
            pi.image_url
        FROM subcategories sc
        INNER JOIN products p ON sc.id = p.sub_category_id
        INNER JOIN product_images pi ON p.id = pi.product_id
        WHERE pi.image_url IS NOT NULL  -- Ensure only products with images are fetched
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        const categories = results.reduce((acc, curr) => {
            const categoryIndex = acc.findIndex(c => c.sub_category_id === curr.sub_category_id);
            if (categoryIndex === -1) {
                acc.push({ 
                    id: curr.sub_category_id, 
                    name: curr.sub_category_name, 
                    products: [{ 
                        id: curr.product_id, 
                        name: curr.product_name, 
                        price_per_day: curr.price_per_day, 
                        image: curr.image_url 
                    }] 
                });
            } else {
                acc[categoryIndex].products.push({ 
                    id: curr.product_id, 
                    name: curr.product_name, 
                    price_per_day: curr.price_per_day, 
                    image: curr.image_url 
                });
            }
            return acc;
        }, []);
        
        res.json({ categories });
    });
};
