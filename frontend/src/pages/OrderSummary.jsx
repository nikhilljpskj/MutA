import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderSummary.scss';

const OrderSummary = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/cart/${productId}`);
                setOrderDetails(response.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('Failed to load order details.');
            }
        };

        fetchOrderDetails();
    }, [productId]);

    useEffect(() => {
        calculateTotalPrice();
    }, [startDate, endDate, quantity, orderDetails]);

    const calculateTotalPrice = () => {
        const gst = 0.18; // 18%
        let total = 0;

        if (orderDetails) {
            const days = calculateDaysBetween(startDate, endDate);
            if (days > 0) {
                total = orderDetails.price_per_day * quantity * days;
            }
        }

        setTotalPrice(total);
    };

    const calculateDaysBetween = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.ceil((endDate - startDate) / (1000 * 3600 * 24));
    };

    const handleProceedToPayment = async () => {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        const userId = userDetails ? userDetails.id : null;

        if (!userId) {
            console.error('User is not logged in');
            return;
        }

        const rentalDetails = {
            product_id: orderDetails.id,
            user_id: userId,
            quantity,
            start_date: startDate,
            end_date: endDate,
            no_of_days: calculateDaysBetween(startDate, endDate),
            total_price: totalPrice,
            total_price_gst: totalPrice * 0.18,
            delivery_address: deliveryAddress,
            contact: mobile,
            email,
            status: 0,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/rentals', rentalDetails);
            const rentalId = response.data.rentalId;
            navigate(`/payment/${rentalId}`);
        } catch (error) {
            console.error('Error proceeding to payment:', error);
            setError('Failed to proceed to payment.');
        }
    };

    if (!orderDetails) return <p>Loading...</p>;

    const imageUrl = orderDetails.image_urls && orderDetails.image_urls.length > 0
        ? `http://localhost:5000${orderDetails.image_urls[0]}`
        : null;

    return (
        <div className="order-summary">
            <h2>Rental Summary</h2>
            {error && <p className="error">{error}</p>}
            <div className="order-item">
                {imageUrl ? (
                    <img src={imageUrl} alt={orderDetails.name} className="product-image" />
                ) : (
                    <p>No Image Available</p>
                )}
                <div className="order-details">
                    <h3>{orderDetails.name}</h3>
                    <p>Price per Day: ${orderDetails.price_per_day}</p>
                    <input
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                        min="1"
                    />
                </div>
            </div>
            <div className="date-picker">
                <label htmlFor="start-date">
                    Start Date:
                    <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </label>
                <label htmlFor="end-date">
                    End Date:
                    <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
                </label>
            </div>
            <div className="contact-info">
                <label htmlFor="delivery-address">
                    Delivery Address:
                    <input
                        id="delivery-address"
                        type="text"
                        value={deliveryAddress}
                        onChange={e => setDeliveryAddress(e.target.value)}
                        required
                    />
                </label>
                <label htmlFor="email">
                    Email:
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label htmlFor="mobile">
                    Mobile:
                    <input
                        id="mobile"
                        type="tel"
                        value={mobile}
                        onChange={e => setMobile(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div className="totals">
                <p>Total: ${totalPrice.toFixed(2)}</p>
                <p>GST (18%): ${(totalPrice * 0.18).toFixed(2)}</p>
                <p>Grand Total: ${(totalPrice * 1.18).toFixed(2)}</p>
            </div>
            <button onClick={handleProceedToPayment}>Proceed to Payment</button>
        </div>
    );
};

export default OrderSummary;
