import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
    const { rentalId } = useParams();
    const [rentalDetails, setRentalDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRentalDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/rentals/${rentalId}`);
                setRentalDetails(response.data);
            } catch (error) {
                console.error('Error fetching rental details:', error);
            }
        };

        fetchRentalDetails();
    }, [rentalId]);

    const handlePayment = async () => {
        if (!rentalDetails) return;

        const totalAmount = parseFloat(rentalDetails.total_price) + parseFloat(rentalDetails.total_price_gst);

        try {
            const response = await axios.post('http://localhost:5000/api/payment/create-order', {
                total_amount: totalAmount,
                rentalId: rentalId,
                userId: rentalDetails.user_id,
            });

            const { orderId } = response.data;

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: totalAmount * 100,
                currency: 'INR',
                name: 'Rental Payment',
                description: 'Payment for rental',
                order_id: orderId,
                handler: async (response) => {
                    console.log('Razorpay response:', response);
                    alert('Payment successful!');

                    // Send email with PDF after successful payment
                    await axios.post(`http://localhost:5000/api/payment/send-invoice`, {
                        rentalId: rentalId,
                        userId: rentalDetails.user_id,
                    });

                    navigate('/orderdetails');
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                },
                theme: {
                    color: '#F37254',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    if (!rentalDetails) return <p>Loading...</p>;

    const totalAmount = parseFloat(rentalDetails.total_price) + parseFloat(rentalDetails.total_price_gst);

    return (
        <div>
            <h2>Payment for Rental</h2>
            <p>Product ID: {rentalDetails.product_id}</p>
            <p>Quantity: {rentalDetails.quantity}</p>
            <p>Start Date: {rentalDetails.start_date}</p>
            <p>End Date: {rentalDetails.end_date}</p>
            <p>Total Amount: {rentalDetails.total_price}</p>
            <p>GST Total Amount: {rentalDetails.total_price_gst}</p>
            <button onClick={handlePayment}>Pay {totalAmount}</button>
        </div>
    );
};

export default PaymentPage;
