// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { toast } from 'react-toastify';

// /**
//  * Generates and downloads the dermatological analysis report as a PDF.
//  * @param {Object} prediction - The analysis result object.
//  * @param {string} prediction.predicted_label
//  * @param {number} prediction.confidence_score
//  * @param {string} prediction.timestamp
//  * @param {string} prediction.reportId
//  * @param {Object} treatmentSuggestions - Map of predicted labels to treatment arrays.
//  * @param {Object} userData - Current user's profile data (optional, defaults to placeholder).
//  * @param {string} dermComment - Dermatologist's review comment (optional).
//  */
// export const generatePdfReport = (prediction, treatmentSuggestions, userData = null, dermComment = null) => {
//     if (!prediction) {
//         console.error("Prediction data is missing.");
//         toast.error("Cannot generate report: analysis data is missing.");
//         return;
//     }

//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     let yPosition = 20;


//     const patientData = {
//         name: userData?.name || 'N/A',
//         age: userData?.age || 'N/A',
//         gender: userData?.gender || 'N/A',
//         contact: userData?.phone || 'N/A',
//         bloodGroup: userData?.bloodGroup || 'N/A',
//         dermatologist: userData?.dermatologist || 'Not Assigned'
//     };


//     const marginX = 15;
//     const col1X = marginX;
//     const col2X = pageWidth / 2 + 5;
//     const boxWidth = pageWidth / 2 - marginX - 5;
//     const innerPadding = 2;
//     const lineSpacing = 4.5;
//     const keyWidth = 25;

//     const textStartCol1 = col1X + innerPadding;
//     const textStartCol2 = col2X + innerPadding;


//     const valueMaxWidth = boxWidth - keyWidth - (2 * innerPadding);


//     const drawDetailRow = (doc, key, value, x, y, keyW, maxW) => {
//         doc.setFont('helvetica', 'bold');
//         doc.text(`${key}:`, x, y);
//         doc.setFont('helvetica', 'normal');

//         const valueX = x + keyW;


//         const safeValue = (value === null || value === undefined) ? 'N/A' : String(value);

//         const wrappedText = doc.splitTextToSize(safeValue, maxW);
//         doc.text(wrappedText, valueX, y);
//         return wrappedText.length;
//     };



//     const headerColor = [30, 41, 59];
//     doc.setFillColor(...headerColor);
//     doc.rect(0, 0, pageWidth, 30, 'F');

//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(22);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Facial-Derma AI Report', pageWidth / 2, 12, { align: 'center' });

//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
//     doc.text('AI-Assisted Facial Skin Analysis', pageWidth / 2, 22, { align: 'center' });

//     yPosition = 40;


//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'bold');



//     doc.setFillColor(30, 41, 59);
//     doc.rect(col1X, yPosition, boxWidth, 7, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.text('REPORT DETAILS', textStartCol1, yPosition + 5);


//     doc.setFillColor(30, 41, 59);
//     doc.rect(col2X, yPosition, boxWidth, 7, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.text('PATIENT DEMOGRAPHICS', textStartCol2, yPosition + 5);

//     yPosition += 7;
//     doc.setLineWidth(0.1);
//     doc.setDrawColor(200, 200, 200);


//     doc.setTextColor(51, 51, 51);


//     doc.setFontSize(9);
//     let currentY = yPosition + 4;
//     let lines = 0;




//     lines = drawDetailRow(doc, 'Name', patientData.name, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;


//     lines = drawDetailRow(doc, 'Age/Gender', `${patientData.age} / ${patientData.gender}`, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;


//     lines = drawDetailRow(doc, 'Contact', patientData.contact, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;


//     lines = drawDetailRow(doc, 'Blood', `${patientData.bloodGroup}`, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;


//     lines = drawDetailRow(doc, 'Derm.', patientData.dermatologist, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;


//     const dynamicPatientBoxHeight = (currentY - (yPosition + 4)) + 4;


//     doc.rect(col2X, yPosition, boxWidth, dynamicPatientBoxHeight);
//     doc.rect(col1X, yPosition, boxWidth, dynamicPatientBoxHeight);


//     let reportY = yPosition + 4;


//     drawDetailRow(doc, 'Report ID', prediction.reportId || 'N/A', textStartCol1, reportY, keyWidth, valueMaxWidth);


//     reportY += lineSpacing;
//     drawDetailRow(doc, 'Date', prediction.timestamp || 'N/A', textStartCol1, reportY, keyWidth, valueMaxWidth);


//     reportY += lineSpacing;
//     drawDetailRow(doc, 'Method', 'AI Deep Learning Model', textStartCol1, reportY, keyWidth, valueMaxWidth);


//     reportY += lineSpacing;
//     doc.setFont('helvetica', 'bold');
//     doc.text('Status:', textStartCol1, reportY);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(20, 160, 20);
//     doc.text('COMPLETED', textStartCol1 + keyWidth, reportY);
//     doc.setTextColor(51, 51, 51);

//     yPosition = yPosition + dynamicPatientBoxHeight + 10;



//     const sectionTitleColor = [82, 82, 82];
//     doc.setFillColor(230, 230, 230);
//     doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');

//     yPosition += 5;
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...sectionTitleColor);
//     doc.text('ANALYSIS & DIAGNOSIS RESULTS', marginX + 2, yPosition);
//     doc.setTextColor(0, 0, 0);

//     yPosition += 5;


//     doc.setDrawColor(headerColor[0], headerColor[1], headerColor[2]);
//     doc.setLineWidth(0.5);
//     doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 25);

//     yPosition += 8;
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
//     doc.text('Primary AI-Detected Condition:', marginX + 5, yPosition);

//     yPosition += 10;
//     doc.setFontSize(16);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(30, 41, 59);

//     const diagnosisText = prediction.predicted_label.toUpperCase();
//     const wrappedDiagnosis = doc.splitTextToSize(diagnosisText, pageWidth - (2 * marginX) - 10);
//     doc.text(wrappedDiagnosis, marginX + 5, yPosition);
//     doc.setTextColor(0, 0, 0);

//     yPosition += 20;


//     doc.setFillColor(230, 230, 230);
//     doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');

//     yPosition += 5;
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...sectionTitleColor);
//     doc.text('CONFIDENCE SCORE', marginX + 2, yPosition);
//     doc.setTextColor(0, 0, 0);

//     yPosition += 5;

//     const confidencePercent = (prediction.confidence_score * 100).toFixed(2);
//     const meterWidth = pageWidth - (2 * marginX) - 20;


//     doc.setFillColor(200, 200, 200);
//     doc.rect(marginX + 5, yPosition, meterWidth, 6, 'F');


//     const confidenceFillWidth = (prediction.confidence_score) * meterWidth;
//     let confidenceColor = [239, 68, 68];
//     let confidenceInterpretation = 'Low Confidence: Professional consultation strongly advised.';

//     if (prediction.confidence_score >= 0.85) {
//         confidenceColor = [20, 160, 20];
//         confidenceInterpretation = 'High Confidence: Model prediction is highly reliable.';
//     } else if (prediction.confidence_score >= 0.6) {
//         confidenceColor = [251, 191, 36];
//         confidenceInterpretation = 'Moderate Confidence: Additional clinical review recommended.';
//     }

//     doc.setFillColor(...confidenceColor);
//     doc.rect(marginX + 5, yPosition, confidenceFillWidth, 6, 'F');


//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...confidenceColor);
//     doc.text(`${confidencePercent}%`, marginX + 5 + meterWidth + 5, yPosition + 4);
//     doc.setTextColor(0, 0, 0);

//     yPosition += 10;


//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'italic');
//     const wrappedInterpretation = doc.splitTextToSize(`* ${confidenceInterpretation}`, pageWidth - (2 * marginX) - 10);
//     doc.text(wrappedInterpretation, marginX + 5, yPosition);
//     doc.setFont('helvetica', 'normal');

//     yPosition += (wrappedInterpretation.length * 4) + 5;


//     doc.setFillColor(230, 230, 230);
//     doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');

//     yPosition += 5;
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...sectionTitleColor);
//     doc.text('TREATMENT RECOMMENDATIONS', marginX + 2, yPosition);
//     doc.setTextColor(0, 0, 0);

//     yPosition += 5;


//     const treatments = treatmentSuggestions[prediction.predicted_label] || [];
//     const treatmentTableData = treatments.map((treatment, index) => [
//         `${index + 1}`,
//         treatment
//     ]);

//     autoTable(doc, {
//         startY: yPosition,
//         head: [['#', 'Recommendation Detail']],
//         body: treatmentTableData,
//         theme: 'grid',
//         headStyles: {
//             fillColor: headerColor,
//             textColor: [255, 255, 255],
//             fontStyle: 'bold',
//             fontSize: 10
//         },
//         bodyStyles: {
//             fontSize: 9,
//             textColor: [50, 50, 50],
//             minCellHeight: 8
//         },
//         columnStyles: {
//             0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
//             1: { cellWidth: 'auto' }
//         },
//         margin: { left: marginX, right: marginX },
//         alternateRowStyles: {
//             fillColor: [249, 249, 249]
//         }
//     });

//     yPosition = doc.lastAutoTable.finalY + 15;


//     if (dermComment && dermComment.trim() !== '') {

//         if (yPosition > doc.internal.pageSize.getHeight() - 60) {
//             doc.addPage();
//             yPosition = 20;
//         }

//         doc.setFillColor(230, 240, 255);
//         doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');

//         yPosition += 5;
//         doc.setFontSize(12);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(...sectionTitleColor);
//         doc.text('DERMATOLOGIST REVIEW', marginX + 2, yPosition);
//         doc.setTextColor(0, 0, 0);

//         yPosition += 8;


//         const commentBoxColor = [245, 250, 255];
//         const commentBorderColor = [59, 130, 246];
//         const commentInnerPadding = 3;
//         const commentTextX = marginX + commentInnerPadding;
//         const commentMaxWidth = pageWidth - (2 * marginX) - (2 * commentInnerPadding);


//         doc.setFontSize(9);
//         doc.setFont('helvetica', 'normal');
//         const wrappedComment = doc.splitTextToSize(dermComment, commentMaxWidth);
//         const commentBoxHeight = (wrappedComment.length * 4) + 8;


//         doc.setFillColor(...commentBoxColor);
//         doc.rect(marginX, yPosition, pageWidth - (2 * marginX), commentBoxHeight, 'F');
//         doc.setDrawColor(...commentBorderColor);
//         doc.setLineWidth(0.3);
//         doc.rect(marginX, yPosition, pageWidth - (2 * marginX), commentBoxHeight);


//         doc.setTextColor(30, 41, 59);
//         doc.text(wrappedComment, commentTextX, yPosition + 5);
//         doc.setTextColor(0, 0, 0);

//         yPosition += commentBoxHeight + 15;
//     }


//     if (yPosition > doc.internal.pageSize.getHeight() - 50) {
//         doc.addPage();
//         yPosition = 20;
//     }


//     const disclaimerBoxColor = [255, 245, 230];
//     const disclaimerBorderColor = [251, 191, 36];

//     const disclaimerInnerMargin = 3;
//     const disclaimerTextX = marginX + disclaimerInnerMargin;
//     const disclaimerMaxWidth = pageWidth - (2 * marginX) - (2 * disclaimerInnerMargin);
//     let disclaimerCurrentY = yPosition + 5;


//     doc.setFillColor(...disclaimerBoxColor);
//     doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 30, 'F');
//     doc.setDrawColor(...disclaimerBorderColor);
//     doc.setLineWidth(0.4);
//     doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 30);

//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(180, 83, 9);
//     doc.text('CONFIDENTIAL - MEDICAL DISCLAIMER', disclaimerTextX, disclaimerCurrentY);

//     disclaimerCurrentY += 5;
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(120, 53, 15);

//     const disclaimerText = [
//         'This AI report is for informational and preliminary screening only. It is NOT a substitute for professional medical diagnosis or treatment.',
//         'Always consult a certified dermatologist or healthcare provider for personalized advice. AI predictions may not account for all clinical factors.'
//     ];


//     disclaimerText.forEach((line) => {
//         const wrappedLine = doc.splitTextToSize(line, disclaimerMaxWidth);
//         doc.text(wrappedLine, disclaimerTextX, disclaimerCurrentY);
//         disclaimerCurrentY += wrappedLine.length * 3.5;
//     });

//     doc.setTextColor(0, 0, 0);


//     const footerY = doc.internal.pageSize.getHeight() - 15;
//     doc.setDrawColor(200, 200, 200);
//     doc.setLineWidth(0.3);
//     doc.line(0, footerY - 5, pageWidth, footerY - 5);

//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'italic');
//     doc.setTextColor(100, 100, 100);
//     doc.text('Document Generated by FacialDerma AI | Page 1 of 1', pageWidth / 2, footerY, { align: 'center' });
//     doc.text(`Generated On: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 4, { align: 'center' });


//     doc.save(`Dermatology_Report_${prediction.reportId}_${patientData.name.replace(/\s/g, '')}.pdf`);
//     toast.success('PDF report downloaded successfully!');
// };

// /**
//  * Generates the dermatological analysis report as a PDF Blob for sharing.
//  * Same parameters as generatePdfReport.
//  */
// export const generatePdfReportBlob = (prediction, treatmentSuggestions, userData = null, dermComment = null) => {
//     if (!prediction) {
//         console.error("Prediction data is missing.");
//         toast.error("Cannot generate report: analysis data is missing.");
//         return null;
//     }
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     let yPosition = 20;


//     const patientData = {
//         name: userData?.name || 'N/A',
//         age: userData?.age || 'N/A',
//         gender: userData?.gender || 'N/A',
//         contact: userData?.phone || 'N/A',
//         bloodGroup: userData?.bloodGroup || 'N/A',
//         dermatologist: userData?.dermatologist || 'Not Assigned'
//     };


//     const marginX = 15;
//     const col1X = marginX;
//     const col2X = pageWidth / 2 + 5;
//     const boxWidth = pageWidth / 2 - marginX - 5;
//     const innerPadding = 2;
//     const lineSpacing = 4.5;
//     const keyWidth = 25;

//     const textStartCol1 = col1X + innerPadding;
//     const textStartCol2 = col2X + innerPadding;


//     const valueMaxWidth = boxWidth - keyWidth - (2 * innerPadding);


//     const drawDetailRow = (doc, key, value, x, y, keyW, maxW) => {
//         doc.setFont('helvetica', 'bold');
//         doc.text(`${key}:`, x, y);
//         doc.setFont('helvetica', 'normal');

//         const valueX = x + keyW;


//         const safeValue = (value === null || value === undefined) ? 'N/A' : String(value);

//         const wrappedText = doc.splitTextToSize(safeValue, maxW);
//         doc.text(wrappedText, valueX, y);
//         return wrappedText.length;
//     };



//     const headerColor = [30, 41, 59];
//     doc.setFillColor(...headerColor);
//     doc.rect(0, 0, pageWidth, 30, 'F');

//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(22);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Facial-Derma AI Report', pageWidth / 2, 12, { align: 'center' });

//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
//     doc.text('AI-Assisted Facial Skin Analysis', pageWidth / 2, 22, { align: 'center' });

//     yPosition = 40;


//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'bold');



//     doc.setFillColor(30, 41, 59);
//     doc.rect(col1X, yPosition, boxWidth, 7, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.text('REPORT DETAILS', textStartCol1, yPosition + 5);


//     doc.setFillColor(30, 41, 59);
//     doc.rect(col2X, yPosition, boxWidth, 7, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.text('PATIENT DEMOGRAPHICS', textStartCol2, yPosition + 5);

//     yPosition += 7;
//     doc.setLineWidth(0.1);
//     doc.setDrawColor(200, 200, 200);


//     doc.setTextColor(51, 51, 51);


//     doc.setFontSize(9);
//     let currentY = yPosition + 4;
//     let lines = 0;




//     lines = drawDetailRow(doc, 'Name', patientData.name, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;


//     lines = drawDetailRow(doc, 'Age/Gender', `${patientData.age} / ${patientData.gender}`, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;


//     lines = drawDetailRow(doc, 'Contact', patientData.contact, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;


//     lines = drawDetailRow(doc, 'Blood', `${patientData.bloodGroup}`, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;


//     lines = drawDetailRow(doc, 'Derm.', patientData.dermatologist, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;


//     const dynamicPatientBoxHeight = (currentY - (yPosition + 4)) + 4;


//     doc.rect(col2X, yPosition, boxWidth, dynamicPatientBoxHeight);
//     doc.rect(col1X, yPosition, boxWidth, dynamicPatientBoxHeight);


//     let reportY = yPosition + 4;


//     drawDetailRow(doc, 'Report ID', prediction.reportId || 'N/A', textStartCol1, reportY, keyWidth, valueMaxWidth);


//     reportY += lineSpacing;
//     drawDetailRow(doc, 'Date', prediction.timestamp || 'N/A', textStartCol1, reportY, keyWidth, valueMaxWidth);


//     reportY += lineSpacing;
//     drawDetailRow(doc, 'Method', 'AI Deep Learning Model', textStartCol1, reportY, keyWidth, valueMaxWidth);


//     reportY += lineSpacing;
//     doc.setFont('helvetica', 'bold');
//     doc.text('Status:', textStartCol1, reportY);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(20, 160, 20);
//     doc.text('COMPLETED', textStartCol1 + keyWidth, reportY);
//     doc.setTextColor(51, 51, 51);

//     yPosition = yPosition + dynamicPatientBoxHeight + 10;



//     const sectionTitleColor = [82, 82, 82];
//     doc.setFillColor(230, 230, 230);
//     doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');

//     yPosition += 5;
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...sectionTitleColor);
//     doc.text('ANALYSIS & DIAGNOSIS RESULTS', marginX + 2, yPosition);
//     doc.setTextColor(0, 0, 0);

//     yPosition += 5;


//     doc.setDrawColor(headerColor[0], headerColor[1], headerColor[2]);
//     doc.setLineWidth(0.5);
//     doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 25);

//     yPosition += 8;
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
//     doc.text('Primary AI-Detected Condition:', marginX + 5, yPosition);

//     yPosition += 10;
//     doc.setFontSize(16);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(30, 41, 59);

//     const diagnosisText = prediction.predicted_label.toUpperCase();
//     const wrappedDiagnosis = doc.splitTextToSize(diagnosisText, pageWidth - (2 * marginX) - 10);
//     doc.text(wrappedDiagnosis, marginX + 5, yPosition);
//     doc.setTextColor(0, 0, 0);

//     yPosition += 20;


//     doc.setFillColor(230, 230, 230);
//     doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');

//     yPosition += 5;
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...sectionTitleColor);
//     doc.text('CONFIDENCE SCORE', marginX + 2, yPosition);
//     doc.setTextColor(0, 0, 0);

//     yPosition += 5;

//     const confidencePercent = (prediction.confidence_score * 100).toFixed(2);
//     const meterWidth = pageWidth - (2 * marginX) - 20;


//     doc.setFillColor(200, 200, 200);
//     doc.rect(marginX + 5, yPosition, meterWidth, 6, 'F');


//     const confidenceFillWidth = (prediction.confidence_score) * meterWidth;
//     let confidenceColor = [239, 68, 68];
//     let confidenceInterpretation = 'Low Confidence: Professional consultation strongly advised.';

//     if (prediction.confidence_score >= 0.85) {
//         confidenceColor = [20, 160, 20];
//         confidenceInterpretation = 'High Confidence: Model prediction is highly reliable.';
//     } else if (prediction.confidence_score >= 0.6) {
//         confidenceColor = [251, 191, 36];
//         confidenceInterpretation = 'Moderate Confidence: Additional clinical review recommended.';
//     }

//     doc.setFillColor(...confidenceColor);
//     doc.rect(marginX + 5, yPosition, confidenceFillWidth, 6, 'F');


//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...confidenceColor);
//     doc.text(`${confidencePercent}%`, marginX + 5 + meterWidth + 5, yPosition + 4);
//     doc.setTextColor(0, 0, 0);

//     yPosition += 10;


//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'italic');
//     const wrappedInterpretation = doc.splitTextToSize(`* ${confidenceInterpretation}`, pageWidth - (2 * marginX) - 10);
//     doc.text(wrappedInterpretation, marginX + 5, yPosition);
//     doc.setFont('helvetica', 'normal');

//     yPosition += (wrappedInterpretation.length * 4) + 5;


//     doc.setFillColor(230, 230, 230);
//     doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');

//     yPosition += 5;
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(...sectionTitleColor);
//     doc.text('TREATMENT RECOMMENDATIONS', marginX + 2, yPosition);
//     doc.setTextColor(0, 0, 0);

//     yPosition += 5;


//     const treatments = treatmentSuggestions[prediction.predicted_label] || [];
//     const treatmentTableData = treatments.map((treatment, index) => [
//         `${index + 1}`,
//         treatment
//     ]);

//     autoTable(doc, {
//         startY: yPosition,
//         head: [['#', 'Recommendation Detail']],
//         body: treatmentTableData,
//         theme: 'grid',
//         headStyles: {
//             fillColor: headerColor,
//             textColor: [255, 255, 255],
//             fontStyle: 'bold',
//             fontSize: 10
//         },
//         bodyStyles: {
//             fontSize: 9,
//             textColor: [50, 50, 50],
//             minCellHeight: 8
//         },
//         columnStyles: {
//             0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
//             1: { cellWidth: 'auto' }
//         },
//         margin: { left: marginX, right: marginX },
//         alternateRowStyles: {
//             fillColor: [249, 249, 249]
//         }
//     });

//     yPosition = doc.lastAutoTable.finalY + 15;


//     if (dermComment && dermComment.trim() !== '') {

//         if (yPosition > doc.internal.pageSize.getHeight() - 60) {
//             doc.addPage();
//             yPosition = 20;
//         }

//         doc.setFillColor(230, 240, 255);
//         doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');

//         yPosition += 5;
//         doc.setFontSize(12);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(...sectionTitleColor);
//         doc.text('DERMATOLOGIST REVIEW', marginX + 2, yPosition);
//         doc.setTextColor(0, 0, 0);

//         yPosition += 8;


//         const commentBoxColor = [245, 250, 255];
//         const commentBorderColor = [59, 130, 246];
//         const commentInnerPadding = 3;
//         const commentTextX = marginX + commentInnerPadding;
//         const commentMaxWidth = pageWidth - (2 * marginX) - (2 * commentInnerPadding);


//         doc.setFontSize(9);
//         doc.setFont('helvetica', 'normal');
//         const wrappedComment = doc.splitTextToSize(dermComment, commentMaxWidth);
//         const commentBoxHeight = (wrappedComment.length * 4) + 8;


//         doc.setFillColor(...commentBoxColor);
//         doc.rect(marginX, yPosition, pageWidth - (2 * marginX), commentBoxHeight, 'F');
//         doc.setDrawColor(...commentBorderColor);
//         doc.setLineWidth(0.3);
//         doc.rect(marginX, yPosition, pageWidth - (2 * marginX), commentBoxHeight);


//         doc.setTextColor(30, 41, 59);
//         doc.text(wrappedComment, commentTextX, yPosition + 5);
//         doc.setTextColor(0, 0, 0);

//         yPosition += commentBoxHeight + 15;
//     }


//     if (yPosition > doc.internal.pageSize.getHeight() - 50) {
//         doc.addPage();
//         yPosition = 20;
//     }


//     const disclaimerBoxColor = [255, 245, 230];
//     const disclaimerBorderColor = [251, 191, 36];

//     const disclaimerInnerMargin = 3;
//     const disclaimerTextX = marginX + disclaimerInnerMargin;
//     const disclaimerMaxWidth = pageWidth - (2 * marginX) - (2 * disclaimerInnerMargin);
//     let disclaimerCurrentY = yPosition + 5;


//     doc.setFillColor(...disclaimerBoxColor);
//     doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 30, 'F');
//     doc.setDrawColor(...disclaimerBorderColor);
//     doc.setLineWidth(0.4);
//     doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 30);

//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(180, 83, 9);
//     doc.text('CONFIDENTIAL - MEDICAL DISCLAIMER', disclaimerTextX, disclaimerCurrentY);

//     disclaimerCurrentY += 5;
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(120, 53, 15);

//     const disclaimerText = [
//         'This AI report is for informational and preliminary screening only. It is NOT a substitute for professional medical diagnosis or treatment.',
//         'Always consult a certified dermatologist or healthcare provider for personalized advice. AI predictions may not account for all clinical factors.'
//     ];


//     disclaimerText.forEach((line) => {
//         const wrappedLine = doc.splitTextToSize(line, disclaimerMaxWidth);
//         doc.text(wrappedLine, disclaimerTextX, disclaimerCurrentY);
//         disclaimerCurrentY += wrappedLine.length * 3.5;
//     });

//     doc.setTextColor(0, 0, 0);


//     const footerY = doc.internal.pageSize.getHeight() - 15;
//     doc.setDrawColor(200, 200, 200);
//     doc.setLineWidth(0.3);
//     doc.line(0, footerY - 5, pageWidth, footerY - 5);

//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'italic');
//     doc.setTextColor(100, 100, 100);
//     doc.text('Document Generated by FacialDerma AI | Page 1 of 1', pageWidth / 2, footerY, { align: 'center' });
//     doc.text(`Generated On: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 4, { align: 'center' });


//     return doc.output('blob');
// };

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';

/**
 * Core function to generate the PDF, optionally returning as Blob instead of downloading.
 * @param {Object} prediction
 * @param {Object} treatmentSuggestions
 * @param {Object|null} userData
 * @param {string|null} dermComment
 * @param {boolean} download - whether to download the PDF (true) or return blob (false)
 */
const createPdf = (prediction, treatmentSuggestions, userData = null, dermComment = null, download = true) => {
    if (!prediction) {
        console.error("Prediction data is missing.");
        toast.error("Cannot generate report: analysis data is missing.");
        return null;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    const patientData = {
        name: userData?.name || 'N/A',
        age: userData?.age || 'N/A',
        gender: userData?.gender || 'N/A',
        contact: userData?.phone || 'N/A',
        bloodGroup: userData?.bloodGroup || 'N/A',
        dermatologist: userData?.dermatologist || 'Not Assigned'
    };

    const marginX = 15;
    const col1X = marginX;
    const col2X = pageWidth / 2 + 5;
    const boxWidth = pageWidth / 2 - marginX - 5;
    const innerPadding = 2;
    const lineSpacing = 4.5;
    const keyWidth = 25;

    const textStartCol1 = col1X + innerPadding;
    const textStartCol2 = col2X + innerPadding;
    const valueMaxWidth = boxWidth - keyWidth - (2 * innerPadding);

    const drawDetailRow = (doc, key, value, x, y, keyW, maxW) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${key}:`, x, y);
        doc.setFont('helvetica', 'normal');

        const valueX = x + keyW;
        const safeValue = (value === null || value === undefined) ? 'N/A' : String(value);
        const wrappedText = doc.splitTextToSize(safeValue, maxW);
        doc.text(wrappedText, valueX, y);
        return wrappedText.length;
    };

    const headerColor = [30, 41, 59];
    doc.setFillColor(...headerColor);
    doc.rect(0, 0, pageWidth, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Facial-Derma AI Report', pageWidth / 2, 12, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('AI-Assisted Facial Skin Analysis', pageWidth / 2, 22, { align: 'center' });

    yPosition = 40;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');

    // Header boxes
    doc.setFillColor(30, 41, 59);
    doc.rect(col1X, yPosition, boxWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('REPORT DETAILS', textStartCol1, yPosition + 5);

    doc.setFillColor(30, 41, 59);
    doc.rect(col2X, yPosition, boxWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('PATIENT DEMOGRAPHICS', textStartCol2, yPosition + 5);

    yPosition += 7;
    doc.setLineWidth(0.1);
    doc.setDrawColor(200, 200, 200);
    doc.setTextColor(51, 51, 51);

    doc.setFontSize(9);
    let currentY = yPosition + 4;
    let lines = 0;

    // Patient details
    lines = drawDetailRow(doc, 'Name', patientData.name, textStartCol2, currentY, keyWidth, valueMaxWidth);
    currentY += lineSpacing * lines;
    lines = drawDetailRow(doc, 'Age/Gender', `${patientData.age} / ${patientData.gender}`, textStartCol2, currentY, keyWidth, valueMaxWidth);
    currentY += lineSpacing * lines;
    lines = drawDetailRow(doc, 'Contact', patientData.contact, textStartCol2, currentY, keyWidth, valueMaxWidth);
    currentY += lineSpacing * lines;
    lines = drawDetailRow(doc, 'Blood', patientData.bloodGroup, textStartCol2, currentY, keyWidth, valueMaxWidth);
    currentY += lineSpacing * lines;
    lines = drawDetailRow(doc, 'Derm.', patientData.dermatologist, textStartCol2, currentY, keyWidth, valueMaxWidth);
    currentY += lineSpacing * lines;

    const dynamicPatientBoxHeight = (currentY - (yPosition + 4)) + 4;
    doc.rect(col2X, yPosition, boxWidth, dynamicPatientBoxHeight);
    doc.rect(col1X, yPosition, boxWidth, dynamicPatientBoxHeight);

    // Report details
    let reportY = yPosition + 4;
    drawDetailRow(doc, 'Report ID', prediction.reportId || 'N/A', textStartCol1, reportY, keyWidth, valueMaxWidth);
    reportY += lineSpacing;
    drawDetailRow(doc, 'Date', prediction.timestamp || 'N/A', textStartCol1, reportY, keyWidth, valueMaxWidth);
    reportY += lineSpacing;
    drawDetailRow(doc, 'Method', 'AI Deep Learning Model', textStartCol1, reportY, keyWidth, valueMaxWidth);
    reportY += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', textStartCol1, reportY);
    doc.setTextColor(20, 160, 20);
    doc.text('COMPLETED', textStartCol1 + keyWidth, reportY);
    doc.setTextColor(51, 51, 51);

    yPosition = yPosition + dynamicPatientBoxHeight + 10;

    // Analysis & Diagnosis Section
    const sectionTitleColor = [82, 82, 82];
    doc.setFillColor(230, 230, 230);
    doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...sectionTitleColor);
    doc.text('ANALYSIS & DIAGNOSIS RESULTS', marginX + 2, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 5;

    doc.setDrawColor(...headerColor);
    doc.setLineWidth(0.5);
    doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 25);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Primary AI-Detected Condition:', marginX + 5, yPosition);
    yPosition += 10;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    const diagnosisText = prediction.predicted_label.toUpperCase();
    const wrappedDiagnosis = doc.splitTextToSize(diagnosisText, pageWidth - (2 * marginX) - 10);
    doc.text(wrappedDiagnosis, marginX + 5, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 20;

    // Confidence Score
    doc.setFillColor(230, 230, 230);
    doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...sectionTitleColor);
    doc.text('CONFIDENCE SCORE', marginX + 2, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 5;

    const confidencePercent = (prediction.confidence_score * 100).toFixed(2);
    const meterWidth = pageWidth - (2 * marginX) - 20;
    doc.setFillColor(200, 200, 200);
    doc.rect(marginX + 5, yPosition, meterWidth, 6, 'F');

    const confidenceFillWidth = prediction.confidence_score * meterWidth;
    let confidenceColor = [239, 68, 68];
    let confidenceInterpretation = 'Low Confidence: Professional consultation strongly advised.';
    if (prediction.confidence_score >= 0.85) {
        confidenceColor = [20, 160, 20];
        confidenceInterpretation = 'High Confidence: Model prediction is highly reliable.';
    } else if (prediction.confidence_score >= 0.6) {
        confidenceColor = [251, 191, 36];
        confidenceInterpretation = 'Moderate Confidence: Additional clinical review recommended.';
    }
    doc.setFillColor(...confidenceColor);
    doc.rect(marginX + 5, yPosition, confidenceFillWidth, 6, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...confidenceColor);
    doc.text(`${confidencePercent}%`, marginX + 5 + meterWidth + 5, yPosition + 4);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    const wrappedInterpretation = doc.splitTextToSize(`* ${confidenceInterpretation}`, pageWidth - (2 * marginX) - 10);
    doc.text(wrappedInterpretation, marginX + 5, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += (wrappedInterpretation.length * 4) + 5;

    // Treatment Recommendations Table
    doc.setFillColor(230, 230, 230);
    doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...sectionTitleColor);
    doc.text('TREATMENT RECOMMENDATIONS', marginX + 2, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 5;

    const treatments = treatmentSuggestions[prediction.predicted_label] || [];
    const treatmentTableData = treatments.map((treatment, index) => [`${index + 1}`, treatment]);

    autoTable(doc, {
        startY: yPosition,
        head: [['#', 'Recommendation Detail']],
        body: treatmentTableData,
        theme: 'grid',
        headStyles: { fillColor: headerColor, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
        bodyStyles: { fontSize: 9, textColor: [50, 50, 50], minCellHeight: 8 },
        columnStyles: { 0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' }, 1: { cellWidth: 'auto' } },
        margin: { left: marginX, right: marginX },
        alternateRowStyles: { fillColor: [249, 249, 249] }
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Dermatologist Comment
    if (dermComment && dermComment.trim() !== '') {
        if (yPosition > doc.internal.pageSize.getHeight() - 60) { doc.addPage(); yPosition = 20; }
        doc.setFillColor(230, 240, 255);
        doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');
        yPosition += 5;
        doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(...sectionTitleColor);
        doc.text('DERMATOLOGIST REVIEW', marginX + 2, yPosition); doc.setTextColor(0, 0, 0); yPosition += 8;

        const commentBoxColor = [245, 250, 255];
        const commentBorderColor = [59, 130, 246];
        const commentInnerPadding = 3;
        const commentTextX = marginX + commentInnerPadding;
        const commentMaxWidth = pageWidth - (2 * marginX) - (2 * commentInnerPadding);

        doc.setFontSize(9); doc.setFont('helvetica', 'normal');
        const wrappedComment = doc.splitTextToSize(dermComment, commentMaxWidth);
        const commentBoxHeight = (wrappedComment.length * 4) + 8;

        doc.setFillColor(...commentBoxColor);
        doc.rect(marginX, yPosition, pageWidth - (2 * marginX), commentBoxHeight, 'F');
        doc.setDrawColor(...commentBorderColor);
        doc.setLineWidth(0.3);
        doc.rect(marginX, yPosition, pageWidth - (2 * marginX), commentBoxHeight);
        doc.setTextColor(30, 41, 59);
        doc.text(wrappedComment, commentTextX, yPosition + 5);
        doc.setTextColor(0, 0, 0);
        yPosition += commentBoxHeight + 15;
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(0, footerY - 5, pageWidth, footerY - 5);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Document Generated by FacialDerma AI | Page 1 of 1', pageWidth / 2, footerY, { align: 'center' });
    doc.text(`Generated On: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 4, { align: 'center' });

    if (download) {
        doc.save(`Dermatology_Report_${prediction.reportId}_${patientData.name.replace(/\s/g, '')}.pdf`);
        toast.success('PDF report downloaded successfully!');
        return null;
    } else {
        return doc.output('blob');
    }
};

// ✅ Exported functions matching your imports
export const generatePdfReport = (prediction, treatmentSuggestions, userData = null, dermComment = null) => {
    return createPdf(prediction, treatmentSuggestions, userData, dermComment, true);
};

export const generatePdfReportBlob = (prediction, treatmentSuggestions, userData = null, dermComment = null) => {
    return createPdf(prediction, treatmentSuggestions, userData, dermComment, false);
};
