import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductScroll.scss'; // Include this for styling

const ProductScroll = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/home/products');
                setProducts(response.data.products || []);  // Handle if products are undefined
            } catch (error) {
                console.error('Error fetching products:', error.response?.data || error.message);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="product-scroll-container">
            <h2 className="product-title">Products</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className="product-card">
                                {product.image ? (
                                    <img
                                        src={`http://localhost:5000${product.image}`}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                ) : (
                                    <p>No Image Available</p>
                                )}
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">Price per day: ${product.price_per_day}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No Products Available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductScroll;