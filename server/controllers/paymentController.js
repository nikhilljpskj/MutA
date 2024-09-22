const Razorpay = require('razorpay');
const db = require('../config/db');
const { generatePDF } = require('../utils/pdfGenerator');
const nodemailer = require('nodemailer');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    const { total_amount, rentalId, userId } = req.body;

    // Validate inputs
    if (!total_amount || !rentalId || !userId) {
        return res.status(400).json({ message: 'Total amount, rental ID, and user ID are required' });
    }

    const totalAmount = Math.round(parseFloat(total_amount) * 100); // Convert to paise

    const options = {
        amount: totalAmount,
        currency: 'INR',
        receipt: `receipt_${rentalId}`,
    };

    try {
        // Create order in Razorpay
        const order = await razorpay.orders.create(options);
        console.log('Razorpay order created:', order);

        // Insert payment details into DB
        await db.query(
            'INSERT INTO payments (rental_id, user_id, payment_status, amount, razorpay_order_id) VALUES (?, ?, ?, ?, ?)',
            [rentalId, userId, 1, totalAmount, order.id]
        );
        console.log('Payment details inserted into DB.');

        // Update rental status
        await db.query('UPDATE rentals SET status = 1 WHERE id = ?', [rentalId]);
        console.log('Rental status updated.');

        // Fetch rental details
        const rentalDetails = await getRentalDetails(rentalId);

        if (!rentalDetails) {
            console.error('Rental details not found for rentalId:', rentalId);
            return res.status(404).json({ message: 'Rental details not found' });
        }

        console.log('Rental details:', rentalDetails);
        
        // Send invoice
        await sendInvoice(rentalDetails);

        res.json({ orderId: order.id, rentalId });
    } catch (error) {
        console.error('Error creating Razorpay order:', error.message);
        res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
    }
};

const getRentalDetails = async (rentalId) => {
    const sql = `
        SELECT rentals.*, products.name AS product_name, users.email, users.address, users.name AS user_name, users.phone
        FROM rentals
        JOIN products ON rentals.product_id = products.id
        JOIN users ON rentals.user_id = users.id
        WHERE rentals.id = ?;
    `;

    const [rows] = await db.query(sql, [rentalId]);
    return rows.length > 0 ? rows[0] : null; // Return first result or null
};

const sendInvoice = async (rentalDetails) => {
    try {
        const pdfBuffer = await generatePDF(rentalDetails);

        // Setup email transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: rentalDetails.email,
            subject: 'Your Rental Invoice',
            text: 'Attached is your rental invoice.',
            attachments: [{
                filename: `Invoice_${rentalDetails.id}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf'
            }],
        };

        await transporter.sendMail(mailOptions);
        console.log('Invoice sent successfully!');
    } catch (error) {
        console.error('Error sending invoice:', error);
        throw error; // Re-throw for further handling
    }
};
