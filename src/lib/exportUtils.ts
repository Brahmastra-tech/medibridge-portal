import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data: any[], fileName: string) => {
  if (data.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportToPDF = (title: string, headers: string[], rows: any[][], fileName: string) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 30);
  
  (doc as any).autoTable({
    startY: 35,
    head: [headers],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [6, 18, 36] }, // Deep blue
  });
  doc.save(`${fileName}_${new Date().toISOString().slice(0, 10)}.pdf`);
};
