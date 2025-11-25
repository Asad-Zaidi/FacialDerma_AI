// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { toast } from 'react-toastify';

// /**
//  * Core function to generate the PDF, optionally returning as Blob instead of downloading.
//  * @param {Object} prediction
//  * @param {Object} treatmentSuggestions
//  * @param {Object|null} userData
//  * @param {string|null} dermComment
//  * @param {boolean} download - whether to download the PDF (true) or return blob (false)
//  */
// const createPdf = (prediction, treatmentSuggestions, userData = null, dermComment = null, download = true, imageDataUrl = null) => {
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

//     const headerColor = [30, 41, 59];

//     const drawDetailRow = (doc, key, value, x, y, keyW, maxW) => {
//         doc.setFont('helvetica', 'bold');
//         doc.text(`${key}:`, x, y);
//         doc.setFont('helvetica', 'normal');

//         const valueX = x + keyW;
//         const safeValue = (value === null || value === undefined) ? 'N/A' : String(value);
//         const wrappedText = doc.splitTextToSize(safeValue, maxW);
//         doc.text(wrappedText, valueX, y);
//         return wrappedText.length; // number of lines
//     };

//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'bold');

//     // Header boxes
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

//     // Patient details
//     lines = drawDetailRow(doc, 'Name', patientData.name, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;
//     lines = drawDetailRow(doc, 'Age/Gender', `${patientData.age} / ${patientData.gender}`, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;
//     lines = drawDetailRow(doc, 'Contact', patientData.contact, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;
//     lines = drawDetailRow(doc, 'Blood', patientData.bloodGroup, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;
//     lines = drawDetailRow(doc, 'Derm.', patientData.dermatologist, textStartCol2, currentY, keyWidth, valueMaxWidth);
//     currentY += lineSpacing * lines;

//     const dynamicPatientBoxHeight = (currentY - (yPosition + 4)) + 4;
//     doc.rect(col2X, yPosition, boxWidth, dynamicPatientBoxHeight);
//     doc.rect(col1X, yPosition, boxWidth, dynamicPatientBoxHeight);

//     // Report details
//     let reportY = yPosition + 4;
//     drawDetailRow(doc, 'Report ID', prediction.reportId || 'N/A', textStartCol1, reportY, keyWidth, valueMaxWidth);
//     reportY += lineSpacing;
//     drawDetailRow(doc, 'Date', prediction.timestamp || 'N/A', textStartCol1, reportY, keyWidth, valueMaxWidth);
//     reportY += lineSpacing;
//     drawDetailRow(doc, 'Method', 'AI Deep Learning Model', textStartCol1, reportY, keyWidth, valueMaxWidth);
//     reportY += lineSpacing;
//     doc.setFont('helvetica', 'bold');
//     doc.text('Status:', textStartCol1, reportY);
//     doc.setTextColor(20, 160, 20);
//     doc.text('COMPLETED', textStartCol1 + keyWidth, reportY);
//     doc.setTextColor(51, 51, 51);

//     yPosition = yPosition + dynamicPatientBoxHeight + 10;

//     // Analysis & Diagnosis Section
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

//     doc.setDrawColor(...headerColor);
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

//     // If we have an image, place it to the left of the diagnosis and wrap text to its right
//     let imgRenderedHeight = 0;
//     const imageGap = 8; // gap between image and diagnosis text
//     if (imageDataUrl) {
//         try {
//             const imgProps = doc.getImageProperties ? doc.getImageProperties(imageDataUrl) : null;
//             const imgW = 60; // fixed display width for the thumbnail in PDF
//             let imgH = imgW;
//             if (imgProps && imgProps.width && imgProps.height) {
//                 imgH = (imgProps.height / imgProps.width) * imgW;
//             }
//             const imgX = marginX + 5;
//             const imgY = yPosition - 4; // slightly higher to align with title area
//             const imgFormat = (typeof imageDataUrl === 'string' && imageDataUrl.includes('image/png')) ? 'PNG' : 'JPEG';
//             doc.addImage(imageDataUrl, imgFormat, imgX, imgY, imgW, imgH);
//             imgRenderedHeight = imgH;

//             // Diagnosis text to the right of the image
//             const diagX = imgX + imgW + imageGap;
//             const diagAvailableWidth = pageWidth - diagX - marginX - 5;
//             const wrappedDiagnosis = doc.splitTextToSize(diagnosisText, diagAvailableWidth);
//             doc.text(wrappedDiagnosis, diagX, yPosition);
//             doc.setTextColor(0, 0, 0);
//             // advance yPosition to the greater of image bottom or diagnosis text block
//             const diagLineHeight = 6;
//             const diagBlockHeight = wrappedDiagnosis.length * diagLineHeight;
//             yPosition += Math.max(imgRenderedHeight, diagBlockHeight) + 6;
//         } catch (err) {
//             console.warn('Failed to render image in PDF, falling back to text-only diagnosis', err);
//             const wrappedDiagnosis = doc.splitTextToSize(diagnosisText, pageWidth - (2 * marginX) - 10);
//             doc.text(wrappedDiagnosis, marginX + 5, yPosition);
//             doc.setTextColor(0, 0, 0);
//             yPosition += 20;
//         }
//     } else {
//         const wrappedDiagnosis = doc.splitTextToSize(diagnosisText, pageWidth - (2 * marginX) - 10);
//         doc.text(wrappedDiagnosis, marginX + 5, yPosition);
//         doc.setTextColor(0, 0, 0);
//         yPosition += 20;
//     }

//     // Confidence Score
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

//     const confidenceFillWidth = prediction.confidence_score * meterWidth;
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

//     // Treatment Recommendations Table
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
//     const treatmentTableData = treatments.map((treatment, index) => [`${index + 1}`, treatment]);

//     autoTable(doc, {
//         startY: yPosition,
//         head: [['#', 'Recommendation Detail']],
//         body: treatmentTableData,
//         theme: 'grid',
//         headStyles: { fillColor: headerColor, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
//         bodyStyles: { fontSize: 9, textColor: [50, 50, 50], minCellHeight: 8 },
//         columnStyles: { 0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' }, 1: { cellWidth: 'auto' } },
//         margin: { left: marginX, right: marginX },
//         alternateRowStyles: { fillColor: [249, 249, 249] }
//     });

//     yPosition = doc.lastAutoTable.finalY + 15;

//     // Dermatologist Comment
//     if (dermComment && dermComment.trim() !== '') {
//         if (yPosition > doc.internal.pageSize.getHeight() - 60) { doc.addPage(); yPosition = 20; }
//         doc.setFillColor(230, 240, 255);
//         doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');
//         yPosition += 5;
//         doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(...sectionTitleColor);
//         doc.text('DERMATOLOGIST REVIEW', marginX + 2, yPosition); doc.setTextColor(0, 0, 0); yPosition += 8;

//         const commentBoxColor = [245, 250, 255];
//         const commentBorderColor = [59, 130, 246];
//         const commentInnerPadding = 3;
//         const commentTextX = marginX + commentInnerPadding;
//         const commentMaxWidth = pageWidth - (2 * marginX) - (2 * commentInnerPadding);

//         doc.setFontSize(9); doc.setFont('helvetica', 'normal');
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

//     // Footer
//     const footerY = doc.internal.pageSize.getHeight() - 15;
//     doc.setDrawColor(200, 200, 200);
//     doc.setLineWidth(0.3);
//     doc.line(0, footerY - 5, pageWidth, footerY - 5);
//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'italic');
//     doc.setTextColor(100, 100, 100);
//     doc.text('Document Generated by FacialDerma AI | Page 1 of 1', pageWidth / 2, footerY, { align: 'center' });
//     doc.text(`Generated On: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 4, { align: 'center' });

//     if (download) {
//         doc.save(`Dermatology_Report_${prediction.reportId}_${patientData.name.replace(/\s/g, '')}.pdf`);
//         toast.success('PDF report downloaded successfully!');
//         return null;
//     } else {
//         return doc.output('blob');
//     }
// };

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';

/** Helper to get the condition data from the new JSON structure */
const getTreatmentData = (predictedLabel, treatmentSuggestions) => {
    if (!predictedLabel || !treatmentSuggestions?.skin_conditions) return null;
    return treatmentSuggestions.skin_conditions.find(
        condition => condition.name.toLowerCase() === predictedLabel.toLowerCase()
    );
};

/**
 * Core function to generate the PDF, optionally returning as Blob instead of downloading.
 * @param {Object} prediction
 * @param {Object} treatmentSuggestions
 * @param {Object|null} userData
 * @param {string|null} dermComment
 * @param {boolean} download - whether to download the PDF (true) or return blob (false)
 */
const createPdf = (prediction, treatmentSuggestions, userData = null, dermComment = null, download = true, imageDataUrl = null) => {
    if (!prediction) {
        console.error("Prediction data is missing.");
        toast.error("Cannot generate report: analysis data is missing.");
        return null;
    }

    // --- Debug logs for treatmentSuggestions ---
    const conditionData = getTreatmentData(prediction.predicted_label, treatmentSuggestions);
    console.log('treatmentSuggestions loaded:', treatmentSuggestions);
    console.log('matched condition for', prediction?.predicted_label, ':', conditionData);

    const treatments = conditionData?.treatments || [];
    const prevention = conditionData?.prevention || [];
    const resources = conditionData?.resources || [];

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

    const headerColor = [30, 41, 59];

    const drawDetailRow = (doc, key, value, x, y, keyW, maxW) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${key}:`, x, y);
        doc.setFont('helvetica', 'normal');

        const valueX = x + keyW;
        const safeValue = (value === null || value === undefined) ? 'N/A' : String(value);
        const wrappedText = doc.splitTextToSize(safeValue, maxW);
        doc.text(wrappedText, valueX, y);
        return wrappedText.length; // number of lines
    };

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

    // If we have an image, place it to the left of the diagnosis and wrap text to its right
    let imgRenderedHeight = 0;
    const imageGap = 8; // gap between image and diagnosis text
    if (imageDataUrl) {
        try {
            const imgProps = doc.getImageProperties ? doc.getImageProperties(imageDataUrl) : null;
            const imgW = 60;
            let imgH = imgW;
            if (imgProps && imgProps.width && imgProps.height) {
                imgH = (imgProps.height / imgProps.width) * imgW;
            }
            const imgX = marginX + 5;
            const imgY = yPosition - 4;
            const imgFormat = (typeof imageDataUrl === 'string' && imageDataUrl.includes('image/png')) ? 'PNG' : 'JPEG';
            doc.addImage(imageDataUrl, imgFormat, imgX, imgY, imgW, imgH);
            imgRenderedHeight = imgH;

            const diagX = imgX + imgW + imageGap;
            const diagAvailableWidth = pageWidth - diagX - marginX - 5;
            const wrappedDiagnosis = doc.splitTextToSize(diagnosisText, diagAvailableWidth);
            doc.text(wrappedDiagnosis, diagX, yPosition);
            doc.setTextColor(0, 0, 0);

            const diagLineHeight = 6;
            const diagBlockHeight = wrappedDiagnosis.length * diagLineHeight;
            yPosition += Math.max(imgRenderedHeight, diagBlockHeight) + 6;
        } catch (err) {
            console.warn('Failed to render image in PDF, falling back to text-only diagnosis', err);
            const wrappedDiagnosis = doc.splitTextToSize(diagnosisText, pageWidth - (2 * marginX) - 10);
            doc.text(wrappedDiagnosis, marginX + 5, yPosition);
            doc.setTextColor(0, 0, 0);
            yPosition += 20;
        }
    } else {
        const wrappedDiagnosis = doc.splitTextToSize(diagnosisText, pageWidth - (2 * marginX) - 10);
        doc.text(wrappedDiagnosis, marginX + 5, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 20;
    }

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

    // --- TREATMENT RECOMMENDATIONS ---
    doc.setFillColor(230, 230, 230);
    doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...sectionTitleColor);
    doc.text('TREATMENT RECOMMENDATIONS', marginX + 2, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 5;

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

    // --- PREVENTION SECTION ---
    if (prevention.length) {
        doc.setFillColor(230, 230, 230);
        doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');
        yPosition += 5;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...sectionTitleColor);
        doc.text('PREVENTION RECOMMENDATIONS', marginX + 2, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 5;

        prevention.forEach((tip, i) => {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`${i + 1}. ${tip}`, marginX + 5, yPosition);
            yPosition += 5;
        });
        yPosition += 5;
    }

    // --- RESOURCES SECTION ---
    if (resources.length) {
        doc.setFillColor(230, 230, 230);
        doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');
        yPosition += 5;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...sectionTitleColor);
        doc.text('HELPFUL RESOURCES', marginX + 2, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 5;

        resources.forEach((link, i) => {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`${i + 1}. ${link}`, marginX + 5, yPosition);
            yPosition += 5;
        });
        yPosition += 5;
    }

    // --- Remaining code (Dermatologist Comment, Footer, download) remains unchanged ---
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

// --- The rest of your helper functions remain unchanged ---


// Helper: load image URL and convert to data URL
const loadImageAsDataUrl = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Image fetch failed');
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Failed to read image blob'));
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (err) {
        console.warn('Failed to load image as data URL:', err);
        return null;
    }
};

// Async functions for consumers
export const generatePdfReportBlob = async (prediction, treatmentSuggestions, userData = null, dermComment = null) => {
    // Load image data URL if available
    let imageDataUrl = null;
    if (prediction?.imageUrl) {
        imageDataUrl = await loadImageAsDataUrl(prediction.imageUrl);
    }
    const blob = createPdf(prediction, treatmentSuggestions, userData, dermComment, false, imageDataUrl);
    return blob;
};

export const generatePdfReport = async (prediction, treatmentSuggestions, userData = null, dermComment = null) => {
    const blob = await generatePdfReportBlob(prediction, treatmentSuggestions, userData, dermComment);
    if (!blob) return;
    const fileName = `Dermatology_Report_${prediction.reportId || 'report'}_${(userData?.name || 'patient').replace(/\s/g, '')}.pdf`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('PDF report downloaded successfully!');
    return;
};
