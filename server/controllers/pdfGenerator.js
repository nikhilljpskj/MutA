const { jsPDF } = require('jspdf');
require('jspdf-autotable');

const generatePDF = (rental) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text('Tax Invoice', 105, 20, null, null, 'center');

            doc.setFontSize(12);
            doc.text('Rent By: MutaEngine Rental', 14, 30);
            doc.text('Ship-from Address: ABC Buildings, ', 14, 36);
            doc.text('Pathanamthitta, Kerala, 691555, IN-KL', 14, 42);
            doc.text('GSTIN - 9876543210', 14, 48);

            doc.setFontSize(12);
            doc.text(`Invoice Number: #INV-${rental.id}`, 140, 30);
            doc.text(`Order ID: ${rental.id}`, 14, 60);
            doc.text(`Order Date: ${new Date(rental.created_at).toLocaleDateString()}`, 14, 66);
            doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 72);
            doc.text(`PAN: CYIIH5678P`, 14, 78);

            doc.text('Bill To:', 14, 90);
            doc.text(`${rental.user_name}`, 14, 96);
            doc.text(`${rental.address}`, 14, 102);
            doc.text('Kerala', 14, 108);
            doc.text(`Phone: ${rental.phone}`, 14, 114);

            const totalPrice = parseFloat(rental.total_price || 0); 
            const totalPriceGST = parseFloat(rental.total_price_gst || 0);

            doc.autoTable({
                startY: 130,
                head: [['Product', 'Qty', 'Amount', 'GST ', 'Taxable Value', 'Days', 'Total']],
                body: [
                    [
                        rental.product_name,
                        rental.quantity,
                        totalPrice.toFixed(2),
                        '18%',
                        totalPriceGST.toFixed(2),
                        rental.no_of_days,
                        (totalPrice + totalPriceGST).toFixed(2)
                    ]
                ],
                theme: 'grid'
            });

            const finalY = doc.lastAutoTable.finalY;
            doc.text('Grand Total : ' + (totalPrice + totalPriceGST).toFixed(2), 14, finalY + 10);
            doc.text('Authorized Signatory', 14, finalY + 30);
            doc.text('MutaEngine Rental', 14, finalY + 40);

            const pdfBuffer = doc.output('arraybuffer');
            resolve(pdfBuffer);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generatePDF };
