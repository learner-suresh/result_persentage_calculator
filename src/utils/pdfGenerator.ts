import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationResult, StudentInfo, SubjectItem } from '../types';
import { getGradeDetails } from './calculator';

export function generatePerformanceReportPDF(
  studentInfo: StudentInfo,
  subjects: SubjectItem[],
  result: CalculationResult
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const hasLogo = Boolean(studentInfo.institutionLogo);
  const headerHeight = hasLogo ? 32 : 28;

  // Header Background bar
  doc.setFillColor(15, 23, 42); // Deep slate #0f172a
  doc.rect(0, 0, pageWidth, headerHeight, 'F');

  // If Institution Logo is provided, embed it into the header
  if (hasLogo && studentInfo.institutionLogo) {
    try {
      // Rounded white backing container for maximum logo contrast
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(12, 4, 24, 24, 2, 2, 'F');

      const logoFormat = studentInfo.institutionLogo.includes('image/png')
        ? 'PNG'
        : studentInfo.institutionLogo.includes('image/webp')
        ? 'WEBP'
        : 'JPEG';
      doc.addImage(studentInfo.institutionLogo, logoFormat, 13, 5, 22, 22, undefined, 'FAST');
    } catch (e) {
      try {
        doc.addImage(studentInfo.institutionLogo, 13, 5, 22, 22);
      } catch (fallbackErr) {
        console.warn('Optional logo could not be embedded into PDF:', fallbackErr);
      }
    }
  }

  // Institution & Document Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(hasLogo ? 13 : 14);
  const instName = (studentInfo.institutionName || 'STUDENT ACADEMIC PERFORMANCE REPORT').toUpperCase();

  if (hasLogo) {
    doc.text(instName, 42, 13, { align: 'left' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225); // Slate 300
    const subTitle = `${studentInfo.examTitle || 'ACADEMIC TRANSCRIPT & PERFORMANCE RECORD'} • ${studentInfo.academicYear || 'SESSION 2025-26'}`;
    doc.text(subTitle, 42, 20, { align: 'left' });
  } else {
    doc.text(instName, pageWidth / 2, 12, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225); // Slate 300
    const subTitle = `${studentInfo.examTitle || 'ACADEMIC TRANSCRIPT & PERFORMANCE RECORD'} • ${studentInfo.academicYear || 'SESSION 2025-26'}`;
    doc.text(subTitle, pageWidth / 2, 19, { align: 'center' });
  }

  // Verification Badge / Report ID
  const reportId = `REP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`;
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Doc Ref: ${reportId}`, pageWidth - 14, hasLogo ? 27 : 25, { align: 'right' });

  // Student Details Box
  let startY = headerHeight + 7;
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(14, startY, pageWidth - 28, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85); // Slate 700

  // Column 1
  doc.text('Student Name:', 18, startY + 8);
  doc.text('Roll / Reg No:', 18, startY + 16);
  doc.text('Class / Standard:', 18, startY + 24);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(studentInfo.studentName || 'Not Specified', 45, startY + 8);
  doc.text(studentInfo.rollNumber || 'Not Specified', 45, startY + 16);
  doc.text(studentInfo.standard || 'General Curriculum', 45, startY + 24);

  // Column 2
  const col2X = pageWidth / 2 + 10;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Stream / Major:', col2X, startY + 8);
  doc.text('Academic Session:', col2X, startY + 16);
  doc.text('Report Issue Date:', col2X, startY + 24);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(studentInfo.streamOrMajor || 'General', col2X + 32, startY + 8);
  doc.text(studentInfo.academicYear || 'Current Year', col2X + 32, startY + 16);
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), col2X + 32, startY + 24);

  // Performance KPI Cards (Percentage, GPA, Total Marks, Result Status)
  const cardY = startY + 33;
  const cardWidth = (pageWidth - 28 - 9) / 4; // 4 cards with 3mm gap
  const cardHeight = 18;

  const kpis = [
    { label: 'OVERALL PERCENTAGE', value: `${result.percentage}%`, bg: [238, 242, 255], border: [199, 210, 254], text: [67, 56, 202] },
    { label: `GPA / CGPA (${result.gpaScale}.0)`, value: `${result.gpa}`, bg: [240, 253, 244], border: [187, 247, 208], text: [22, 101, 52] },
    { label: 'TOTAL MARKS', value: `${result.totalObtained} / ${result.totalMax}`, bg: [240, 249, 255], border: [186, 230, 253], text: [3, 105, 161] },
    { label: 'DIVISION / AWARD', value: result.division.split(' ')[0] || 'Pass', bg: [254, 243, 199], border: [253, 230, 138], text: [146, 64, 14] },
  ];

  kpis.forEach((kpi, idx) => {
    const x = 14 + idx * (cardWidth + 3);
    doc.setFillColor(kpi.bg[0], kpi.bg[1], kpi.bg[2]);
    doc.setDrawColor(kpi.border[0], kpi.border[1], kpi.border[2]);
    doc.roundedRect(x, cardY, cardWidth, cardHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + cardWidth / 2, cardY + 6, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(kpi.text[0], kpi.text[1], kpi.text[2]);
    doc.text(kpi.value, x + cardWidth / 2, cardY + 14, { align: 'center' });
  });

  // Table Data Preparation
  const activeSubs = subjects.filter((s) => s.included !== false);
  const tableRows = activeSubs.map((sub, i) => {
    const obtained = Math.max(0, Number(sub.obtainedMarks) || 0);
    const max = Math.max(1, Number(sub.maxMarks) || 100);
    const pct = (obtained / max) * 100;
    const grade = getGradeDetails(pct);
    const status = pct >= 33 ? 'PASSED' : 'FAIL';
    const credits = sub.credits ? `${sub.credits}` : '-';

    return [
      (i + 1).toString(),
      sub.name,
      max.toString(),
      obtained.toString(),
      `${Math.round(pct * 10) / 10}%`,
      credits,
      result.gpaScale === 4 ? grade.gradePoint4.toFixed(1) : grade.gradePoint10.toString(),
      grade.letterGrade.split(' ')[0],
      status,
    ];
  });

  // Add summary row
  tableRows.push([
    '',
    'GRAND TOTAL / AGGREGATE',
    result.totalMax.toString(),
    result.totalObtained.toString(),
    `${result.percentage}%`,
    '-',
    `${result.gpa}`,
    result.letterGrade.split(' ')[0],
    result.resultStatus.toUpperCase(),
  ]);

  autoTable(doc, {
    startY: cardY + cardHeight + 6,
    head: [['#', 'Subject Name', 'Max', 'Obt.', '%', 'Credits', 'GP', 'Grade', 'Status']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // Slate 800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'left' },
      2: { halign: 'center', cellWidth: 15 },
      3: { halign: 'center', cellWidth: 15, fontStyle: 'bold' },
      4: { halign: 'center', cellWidth: 16 },
      5: { halign: 'center', cellWidth: 14 },
      6: { halign: 'center', cellWidth: 12 },
      7: { halign: 'center', cellWidth: 15, fontStyle: 'bold' },
      8: { halign: 'center', cellWidth: 20 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
    },
    didParseCell: (data) => {
      // Highlight the grand total row
      if (data.row.index === tableRows.length - 1) {
        data.cell.styles.fillColor = [241, 245, 249];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [15, 23, 42];
      }
      // Highlight fail status
      if (data.column.index === 8 && data.cell.raw === 'FAIL') {
        data.cell.styles.textColor = [225, 29, 72];
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  // Position after table
  // @ts-expect-error lastAutoTable is added by jspdf-autotable plugin
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 190;

  // Remarks and Performance Insight Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, finalY, pageWidth - 28, 20, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Academic Remarks & Assessment Summary:', 18, finalY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(result.feedbackRemarks, 18, finalY + 12);

  const subInsight = result.highestSubject
    ? `Highest scoring subject: ${result.highestSubject.name} (${result.highestSubject.marks}/${result.highestSubject.maxMarks} - ${Math.round(result.highestSubject.percentage)}%).`
    : '';
  doc.text(`${subInsight} Standing Division: ${result.division}.`, 18, finalY + 17);

  // Signatures section at bottom
  const sigY = pageHeight - 32;

  doc.setDrawColor(203, 213, 225);
  doc.line(20, sigY, 65, sigY);
  doc.line(pageWidth - 65, sigY, pageWidth - 20, sigY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Candidate Signature', 42.5, sigY + 5, { align: 'center' });
  doc.text('Principal / Controller of Examinations', pageWidth - 42.5, sigY + 5, { align: 'center' });

  // Official Seal Placeholder Stamp
  doc.setDrawColor(186, 230, 253);
  doc.setFillColor(240, 249, 255);
  doc.circle(pageWidth / 2, sigY + 2, 9, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(3, 105, 161);
  doc.text('VERIFIED', pageWidth / 2, sigY + 1, { align: 'center' });
  doc.setFontSize(5);
  doc.text('OFFICIAL RECORD', pageWidth / 2, sigY + 4, { align: 'center' });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Generated via SmartMarks Calculator • 100% Privacy Preserved (Zero API Storage) • For Academic Reference',
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  const cleanName = (studentInfo.studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${cleanName}_Performance_Report_${studentInfo.standard.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}
