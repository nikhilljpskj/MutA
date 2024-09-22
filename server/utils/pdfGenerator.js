const jsPDF = require('jspdf');
require('jspdf-autotable');

const generatePDF = (rental) => {
    return new Promise((resolve, reject) => {
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
        doc.text(`Phone: ${rental.contact}`, 14, 114);

        doc.autoTable({
            startY: 130,
            head: [['Product', 'Qty', 'Amount', 'GST ', 'Taxable Value', 'Days', 'Total']],
            body: [
                [
                    rental.product_name,
                    rental.quantity,
                    rental.total_price.toFixed(2),
                    '18%',
                    rental.total_price_gst.toFixed(2),
                    rental.no_of_days,
                    (parseFloat(rental.total_price) + parseFloat(rental.total_price_gst)).toFixed(2)
                ]
            ],
            theme: 'grid'
        });

        const finalY = doc.lastAutoTable.finalY;
        doc.text('Grand Total : ' + (parseFloat(rental.total_price) + parseFloat(rental.total_price_gst)).toFixed(2), 14, finalY + 10);
        doc.text('Authorized Signatory', 14, finalY + 30);
        doc.text('MutaEngine Rental', 14, finalY + 40);

        const pdfOutput = doc.output('arraybuffer'); // Get PDF as ArrayBuffer
        resolve(pdfOutput); // Resolve the promise with the PDF data
    });
};

module.exports = { generatePDF };
