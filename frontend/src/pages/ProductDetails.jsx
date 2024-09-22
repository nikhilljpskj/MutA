import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductDetails.scss';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleAddToCart = async () => {
        const userId = JSON.parse(localStorage.getItem('user')).id;
        const cartData = {
            user_id: userId,
            product_id: product.id,
            quantity: 1
        };

        try {
            await axios.post('http://localhost:5000/api/cart', cartData);
            setIsPopupOpen(true);
        } catch (error) {
            console.error('Error adding to cart:', error.response ? error.response.data : error);
        }
    };

    const handleOrderSummary = () => {
        navigate(`/order-summary/${product.id}`);
    };
    
    if (!product) return <p>Loading...</p>;

    const imageUrl = product.image_urls && product.image_urls.length > 0
        ? `http://localhost:5000${product.image_urls[0]}`
        : null;

    return (
        <div className="product-details">
            <div className="details-container">
                <div className="image-section">
                    {imageUrl ? (
                        <img src={imageUrl} alt={product.name} className="product-image" />
                    ) : (
                        <div className="no-image">No Image Available</div>
                    )}
                </div>
                <div className="info-section">
                    <h2 className="product-name">{product.name}</h2>
                    <p className="product-price">Price: <span>${product.price_per_day}</span></p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-category">Category: {product.category_name}</p>
                    <p className="product-stock">Stock: {product.stock}</p>
                    <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
                </div>
            </div>

            {isPopupOpen && (
                <div className="popup">
                    <h3>Item Added to Cart</h3>
                    <img src={imageUrl} alt={product.name} />
                    <p>Name: {product.name}</p>
                    <p>Price: ${product.price_per_day}</p>
                    <button onClick={handleOrderSummary}>Order Summary</button>
                    <button onClick={() => setIsPopupOpen(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
