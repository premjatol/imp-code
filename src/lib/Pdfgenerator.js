import jsPDF from 'jspdf';
import moment from 'moment';

export const generatePDF = (events, currentDate, view) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  
  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Calendar View', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const dateRange = view === 'month' 
    ? moment(currentDate).format('MMMM YYYY')
    : view === 'week'
    ? `Week of ${moment(currentDate).startOf('week').format('MMM DD, YYYY')}`
    : moment(currentDate).format('MMMM DD, YYYY');
  
  pdf.text(dateRange, pageWidth / 2, 30, { align: 'center' });
  
  // Add view type
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`View: ${view.charAt(0).toUpperCase() + view.slice(1)}`, pageWidth / 2, 38, { align: 'center' });
  
  // Events list
  pdf.setTextColor(0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Events:', 20, 55);
  
  let yPosition = 65;
  const lineHeight = 8;
  const maxWidth = pageWidth - 40;
  
  if (events.length === 0) {
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(10);
    pdf.setTextColor(150);
    pdf.text('No events scheduled', 20, yPosition);
  } else {
    events.forEach((event, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Event number
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(0);
      pdf.text(`${index + 1}.`, 20, yPosition);
      
      // Event title
      pdf.setFont('helvetica', 'bold');
      const title = pdf.splitTextToSize(event.title, maxWidth - 15);
      pdf.text(title, 30, yPosition);
      yPosition += lineHeight;
      
      // Event date/time
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(80);
      const startDate = moment(event.start).format('MMM DD, YYYY HH:mm');
      const endDate = moment(event.end).format('MMM DD, YYYY HH:mm');
      pdf.text(`From: ${startDate}`, 30, yPosition);
      yPosition += 6;
      pdf.text(`To: ${endDate}`, 30, yPosition);
      yPosition += lineHeight + 4;
      
      // Add a subtle line separator
      pdf.setDrawColor(200);
      pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
      yPosition += 4;
    });
  }
  
  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150);
  pdf.text(
    `Generated on ${moment().format('MMM DD, YYYY HH:mm')}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
  
  // Save the PDF
  const filename = `calendar-${view}-${moment(currentDate).format('YYYY-MM-DD')}.pdf`;
  pdf.save(filename);
};