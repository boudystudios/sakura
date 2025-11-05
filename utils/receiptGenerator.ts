import jsPDF from 'jspdf';
import { Order } from '../types';

export const generateReceiptPdf = (order: Order, tableName: string) => {
    const doc = new jsPDF();
    const logoUrl = 'https://i.imgur.com/ZeEnUVN.png'; 
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add Logo
    // Note: Due to CORS, this might not work in all browser environments with all image hosts.
    // A better approach in a real app would be to host the logo on the same domain or use a Base64 string.
    try {
      // We will skip adding the image in this environment to avoid potential CORS issues with imgur.
      // In a real project, ensure the image is hosted correctly.
      // doc.addImage(logoUrl, 'PNG', pageWidth / 2 - 25, 10, 50, 20);
    } catch (e) {
      console.error("Could not add logo to PDF:", e);
    }

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Sakura Restaurant', pageWidth / 2, 40, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Via Roma, 123 - 00100 Roma, Italia', pageWidth / 2, 48, { align: 'center' });
    doc.text(`Ricevuta per: ${tableName}`, 20, 60);
    doc.text(`Data: ${new Date(order.createdAt).toLocaleString('it-IT')}`, pageWidth - 20, 60, { align: 'right' });

    // Table Header
    doc.setLineWidth(0.5);
    doc.line(20, 65, pageWidth - 20, 65);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Q.tà', 22, 72);
    doc.text('Piatto', 40, 72);
    doc.text('Prezzo Unit.', pageWidth - 60, 72, { align: 'right' });
    doc.text('Subtotale', pageWidth - 20, 72, { align: 'right' });
    doc.line(20, 75, pageWidth - 20, 75);
    
    // Table Body
    let yPos = 82;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    order.items.forEach(item => {
        doc.text(String(item.quantity), 22, yPos);
        doc.text(item.dish.name, 40, yPos);
        doc.text(`€${item.dish.price.toFixed(2)}`, pageWidth - 60, yPos, { align: 'right' });
        doc.text(`€${(item.dish.price * item.quantity).toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
        yPos += 7;
    });

    // Total
    yPos += 5;
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2, yPos, pageWidth - 20, yPos);
    yPos += 7;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTALE:', pageWidth - 60, yPos, { align: 'right' });
    doc.text(`€${order.total.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
    
    // Footer
    yPos += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Grazie per aver scelto Sakura!', pageWidth / 2, yPos, { align: 'center' });

    doc.save(`ricevuta_sakura_${tableName.replace(' ', '_')}_${order._id}.pdf`);
};