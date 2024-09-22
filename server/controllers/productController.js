const db = require('../config/db');
const path = require('path');
const fs = require('fs');
// Add a new product with images
exports.addProduct = (req, res) => {
  const { name, description, category_id, sub_category_id, price_per_day, availability, stock } = req.body;

  // Insert product details into 'products' table
  const productSql = 'INSERT INTO products (name, description, category_id, sub_category_id, price_per_day, availability, stock) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(productSql, [name, description, category_id, sub_category_id, price_per_day, availability, stock], (err, result) => {
    if (err) {
      console.error('Error inserting product:', err);
      return res.status(500).json({ message: 'Failed to add product' });
    }

    const productId = result.insertId; // Get the product ID of the newly inserted product

    // Handle multiple file uploads
    const images = req.files.map(file => {
      return {
        product_id: productId,
        image_url: `/uploads/products/${file.filename}`
      };
    });

    // Insert image URLs into 'product_images' table
    const imageSql = 'INSERT INTO product_images (product_id, image_url) VALUES ?';
    const imageValues = images.map(img => [img.product_id, img.image_url]);

    db.query(imageSql, [imageValues], (err) => {
      if (err) {
        console.error('Error inserting product images:', err);
        return res.status(500).json({ message: 'Failed to upload product images' });
      }

      res.status(200).json({ message: 'Product added successfully' });
    });
  });
};


// Controller for fetching products
// Controller for fetching products
exports.getAllProducts = (req, res) => {
    const productSql = `
      SELECT p.id, p.name, p.description, p.price_per_day, p.availability, p.stock,
             GROUP_CONCAT(pi.image_url SEPARATOR ',') AS image_urls
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
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



exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, price_per_day, availability, stock, image_urls } = req.body;
  
    // Update product details
    const updateSql = `
      UPDATE products
      SET name = ?, description = ?, price_per_day = ?, availability = ?, stock = ?
      WHERE id = ?
    `;
  
    db.query(updateSql, [name, description, price_per_day, availability, stock, id], (err, result) => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ message: 'Error updating product', error: err.message });
      }
  
      if (image_urls && image_urls.length > 0) {
        // Fetch existing images
        const fetchImagesSql = 'SELECT image_url FROM product_images WHERE product_id = ?';
        db.query(fetchImagesSql, [id], (err, existingImages) => {
          if (err) {
            console.error('Error fetching existing images:', err);
            return res.status(500).json({ message: 'Error fetching existing images', error: err.message });
          }
  
          // Extract existing image URLs
          const existingImageUrls = existingImages.map(img => img.image_url);
  
          // Determine which images to delete
          const imagesToDelete = existingImageUrls.filter(img => !image_urls.includes(img));
  
          // Determine which images to insert
          const imagesToInsert = image_urls.filter(url => !existingImageUrls.includes(url));
  
          // Delete images from file system and database
          if (imagesToDelete.length > 0) {
            // Delete from file system
            imagesToDelete.forEach(img => {
              const imagePath = path.join(__dirname, '../uploads/products', path.basename(img));
              fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting image file:', err);
              });
            });
  
            // Delete from database
            const deleteImagesSql = 'DELETE FROM product_images WHERE product_id = ? AND image_url IN (?)';
            db.query(deleteImagesSql, [id, imagesToDelete], (err) => {
              if (err) {
                console.error('Error deleting old images from database:', err);
                return res.status(500).json({ message: 'Error deleting old images from database', error: err.message });
              }
  
              // Insert new images
              if (imagesToInsert.length > 0) {
                const insertImages = imagesToInsert.map(url => [id, url]);
                const insertImagesSql = 'INSERT INTO product_images (product_id, image_url) VALUES ?';
                db.query(insertImagesSql, [insertImages], (err) => {
                  if (err) {
                    console.error('Error inserting new images:', err);
                    return res.status(500).json({ message: 'Error inserting new images', error: err.message });
                  }
  
                  res.status(200).json({ message: 'Product updated successfully' });
                });
              } else {
                res.status(200).json({ message: 'Product updated successfully' });
              }
            });
          } else {
            // Insert new images if no images to delete
            if (imagesToInsert.length > 0) {
              const insertImages = imagesToInsert.map(url => [id, url]);
              const insertImagesSql = 'INSERT INTO product_images (product_id, image_url) VALUES ?';
              db.query(insertImagesSql, [insertImages], (err) => {
                if (err) {
                  console.error('Error inserting new images:', err);
                  return res.status(500).json({ message: 'Error inserting new images', error: err.message });
                }
  
                res.status(200).json({ message: 'Product updated successfully' });
              });
            } else {
              res.status(200).json({ message: 'Product updated successfully' });
            }
          }
        });
      } else {
        // No image updates, just return success
        res.status(200).json({ message: 'Product updated successfully' });
      }
    });
  };

  exports.deleteProduct = (req, res) => {
    const { id } = req.params;
  
    // Fetch image URLs for the product
    const fetchImagesSql = 'SELECT image_url FROM product_images WHERE product_id = ?';
    db.query(fetchImagesSql, [id], (err, images) => {
      if (err) {
        console.error('Error fetching images for deletion:', err);
        return res.status(500).json({ message: 'Error fetching images for deletion', error: err.message });
      }
  
      // Delete image files
      images.forEach(img => {
        const imagePath = path.join(__dirname, '../uploads/products', img.image_url);
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting image file:', err);
        });
      });
  
      // Delete images from the database
      const deleteImagesSql = 'DELETE FROM product_images WHERE product_id = ?';
      db.query(deleteImagesSql, [id], (err) => {
        if (err) {
          console.error('Error deleting images from database:', err);
          return res.status(500).json({ message: 'Error deleting images from database', error: err.message });
        }
  
        // Delete product
        const deleteProductSql = 'DELETE FROM products WHERE id = ?';
        db.query(deleteProductSql, [id], (err) => {
          if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ message: 'Error deleting product', error: err.message });
          }
  
          res.status(200).json({ message: 'Product deleted successfully' });
        });
      });
    });
  };
  