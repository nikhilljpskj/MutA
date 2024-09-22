import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Product.scss';

const Product = () => {
    const [sort, setSort] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleSort = (e) => {
        const value = e.target.value;
        setSort(value);
        let sortedProducts = [...products];
        if (value === 'price-low-high') {
            sortedProducts.sort((a, b) => a.price_per_day - b.price_per_day);
        } else if (value === 'price-high-low') {
            sortedProducts.sort((a, b) => b.price_per_day - a.price_per_day);
        }
        setFilteredProducts(sortedProducts);
    };

    return (
        <div className="product-page">
            <h1 className="page-title">Products</h1>
            <div className="filter-sort">
                <select onChange={handleSort} value={sort}>
                    <option value="">Sort By</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                </select>
                <button className="filter-button">Filter</button>
            </div>
            <div className="product-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="product-item" onClick={() => navigate(`/product/${product.id}`)}>
                            <div className="image-container">
                                {product.image_urls && product.image_urls.length > 0 ? (
                                    <img
                                        src={`http://localhost:5000${product.image_urls[0]}`}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                ) : (
                                    <div className="no-image">No Image Available</div>
                                )}
                            </div>
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">Price: ${product.price_per_day}</p>
                            <p className="product-category">Category: {product.category_name}</p>
                        </div>
                    ))
                ) : (
                    <p>No Products Available</p>
                )}
            </div>
        </div>
    );
};

export default Product;
