import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryScroll.scss'; // Include this for styling

const CategoryScroll = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/home/categories');
        const combinedCategories = groupCategories(response.data.categories || []);
        setCategories(combinedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error.response?.data || error.message);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Function to group categories by name
  const groupCategories = (categories) => {
    const grouped = {};
    
    categories.forEach(category => {
      if (!grouped[category.name]) {
        grouped[category.name] = {
          id: category.id,
          name: category.name,
          products: []
        };
      }
      grouped[category.name].products = [...grouped[category.name].products, ...category.products];
    });

    return Object.values(grouped); // Convert grouped object back to an array
  };

  return (
    <div className="category-scroll-container">
      <h2>Categories</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="categories">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="category-item">
                <h3>{category.name}</h3>
                <div className="products-horizontal-list">
                  {category.products && category.products.length > 0 ? (
                    <div className="products-row">
                      {category.products.map((product) => (
                        <div key={product.id} className="product-item">
                          {product.image ? (
                            <img
                              src={`http://localhost:5000${product.image}`}
                              alt={product.name}
                              className="product-image"
                            />
                          ) : (
                            <p>No Image Available</p>
                          )}
                          <p>{product.name}</p>
                          <p className="product-price">Price per day: ${product.price_per_day}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No Products Available</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No Categories Available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryScroll;