import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';

/**
 * Generates and downloads the dermatological analysis report as a PDF.
 * This version includes hardcoded patient demographics for testing.
 * @param {Object} prediction - The analysis result object.
 * @param {string} prediction.predicted_label
 * @param {number} prediction.confidence_score
 * @param {string} prediction.timestamp
 * @param {string} prediction.reportId
 * @param {Object} treatmentSuggestions - Map of predicted labels to treatment arrays.
 */
export const generatePdfReport = (prediction, treatmentSuggestions) => {
    if (!prediction) {
        console.error("Prediction data is missing.");
        toast.error("Cannot generate report: analysis data is missing.");
        return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // --- MOCK PATIENT DATA (To be replaced with dynamic data later) ---
    const patientData = {
        name: 'Alex Johnson',
        age: 34,
        gender: 'Male',
        contact: '+1 (555) 123-4567',
        bloodGroup: 'A+',
        // Long string to stress test wrapping and border overflow
        allergies: 'Penicillin, Dust Mites, Grass Pollen, Cat Dander, Latex, Seasonal Hay Fever, Ibuprofen (Severe Reaction Risk)',
        dermatologist: 'Dr. Evelyn Reed (ID: 9876)'
    };
    // ----------------------------------------------------------------

    const marginX = 15;
    const col1X = marginX;
    const col2X = pageWidth / 2 + 5; // Start of the second column (approx 110)
    const boxWidth = pageWidth / 2 - marginX - 5; // Width of each column box (approx 85)
    const innerPadding = 2; // Inner padding for text within boxes
    const lineSpacing = 4.5; // Vertical space per line of text
    const keyWidth = 25; // Fixed width for labels (e.g., 'Name:')
    
    const textStartCol1 = col1X + innerPadding;
    const textStartCol2 = col2X + innerPadding;
    
    // Max width available for the text value content after accounting for key width and padding
    const valueMaxWidth = boxWidth - keyWidth - (2 * innerPadding); // 85 - 25 - 4 = 56

    // ========== HELPER FUNCTION: Draw a Detail Row (Handles wrapping and returns line count) ==========
    const drawDetailRow = (doc, key, value, x, y, keyW, maxW) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${key}:`, x, y);
        doc.setFont('helvetica', 'normal');
        
        const valueX = x + keyW;

        // Split text based on calculated max width to ensure padding is respected
        const wrappedText = doc.splitTextToSize(value.toString(), maxW);
        doc.text(wrappedText, valueX, y);
        return wrappedText.length; // Return number of lines
    };


    // ========== HEADER SECTION (Modern & Clean) ==========
    const headerColor = [30, 41, 59]; 
    doc.setFillColor(...headerColor);
    doc.rect(0, 0, pageWidth, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('DERMA-SCAN AI REPORT', pageWidth / 2, 12, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('AI-Assisted Facial Skin Assessment | Confidential', pageWidth / 2, 22, { align: 'center' });

    yPosition = 40;

    // ========== REPORT INFORMATION (Left Column) & PATIENT DEMOGRAPHICS (Right Column) ==========
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51); // Dark Gray

    // --- Section Titles ---
    doc.setFillColor(240, 240, 240); // Lightest Gray
    doc.rect(col2X, yPosition - 5, boxWidth, 8, 'F');
    doc.text('PATIENT DEMOGRAPHICS', textStartCol2, yPosition);

    doc.rect(col1X, yPosition - 5, boxWidth, 8, 'F');
    doc.text('REPORT DETAILS', textStartCol1, yPosition);

    yPosition += 8;
    doc.setLineWidth(0.1);
    doc.setDrawColor(200, 200, 200); // Very Light Gray

    // === Patient Data Details (Right Column) - Calculate Dynamic Height ===
    doc.setFontSize(9);
    let currentY = yPosition + 4;
    let lines = 0;
    
    // Draw all patient details sequentially, one per line, using the safe wrapper
    
    // 1. Name
    lines = drawDetailRow(doc, 'Name', patientData.name, textStartCol2, currentY, keyWidth, valueMaxWidth);
    currentY += lineSpacing * lines;

    // 2. Age / Gender
    lines = drawDetailRow(doc, 'Age/Gender', `${patientData.age} / ${patientData.gender}`, textStartCol2, currentY, keyWidth, valueMaxWidth);
    currentY += lineSpacing * lines;

    // 3. Contact
    lines = drawDetailRow(doc, 'Contact', patientData.contact, textStartCol2, currentY, keyWidth, valueMaxWidth);
    currentY += lineSpacing * lines;
    
    // 4. Blood
    lines = drawDetailRow(doc, 'Blood', `${patientData.bloodGroup}`, textStartCol2, currentY, keyWidth, valueMaxWidth);
    currentY += lineSpacing * lines;

    // 5. Dermatologist
    lines = drawDetailRow(doc, 'Derm.', patientData.dermatologist, textStartCol2, currentY, keyWidth, valueMaxWidth);
    currentY += lineSpacing * lines;

    // 6. Allergies (Stress Test)
    lines = drawDetailRow(doc, 'Allergies', patientData.allergies, textStartCol2, currentY, keyWidth, valueMaxWidth);
    currentY += lineSpacing * lines;

    // Calculate Dynamic Height
    const dynamicPatientBoxHeight = (currentY - (yPosition + 4)) + 4; // Total height needed + bottom padding (4 units)

    // --- Draw the Box based on Dynamic Height ---
    doc.rect(col2X, yPosition, boxWidth, dynamicPatientBoxHeight);
    doc.rect(col1X, yPosition, boxWidth, dynamicPatientBoxHeight); // Match height for symmetry

    // === Report Data Details (Left Column) ===
    let reportY = yPosition + 4;

    // Report ID
    drawDetailRow(doc, 'Report ID', prediction.reportId, textStartCol1, reportY, keyWidth, valueMaxWidth);

    // Analysis Date
    reportY += lineSpacing;
    drawDetailRow(doc, 'Date', prediction.timestamp, textStartCol1, reportY, keyWidth, valueMaxWidth);
    
    // Analysis Method
    reportY += lineSpacing;
    drawDetailRow(doc, 'Method', 'AI Deep Learning Model', textStartCol1, reportY, keyWidth, valueMaxWidth);

    // Report Status
    reportY += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', textStartCol1, reportY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 160, 20); // Dark Green
    doc.text('COMPLETED', textStartCol1 + keyWidth, reportY);
    doc.setTextColor(51, 51, 51); // Reset to Dark Gray

    yPosition = yPosition + dynamicPatientBoxHeight + 10; // Move below the dynamically sized boxes


    // ========== DIAGNOSIS RESULTS (Rest of the report uses existing safe logic) ==========
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

    // Diagnosis Box
    doc.setDrawColor(headerColor[0], headerColor[1], headerColor[2]); 
    doc.setLineWidth(0.5);
    doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 25);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Primary AI-Detected Condition:', marginX + 5, yPosition);

    yPosition += 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59); // Deep Navy
    // Ensure the Diagnosis label is also padded/doesn't overflow
    const diagnosisText = prediction.predicted_label.toUpperCase();
    const wrappedDiagnosis = doc.splitTextToSize(diagnosisText, pageWidth - (2 * marginX) - 10); 
    doc.text(wrappedDiagnosis, marginX + 5, yPosition);
    doc.setTextColor(0, 0, 0);

    yPosition += 20;

    // ========== CONFIDENCE ANALYSIS ==========
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

    // Confidence meter background
    doc.setFillColor(200, 200, 200);
    doc.rect(marginX + 5, yPosition, meterWidth, 6, 'F');

    // Confidence meter fill
    const confidenceFillWidth = (prediction.confidence_score) * meterWidth;
    let confidenceColor = [239, 68, 68]; // Red (Low)
    let confidenceInterpretation = 'Low Confidence: Professional consultation strongly advised.';

    if (prediction.confidence_score >= 0.85) {
        confidenceColor = [20, 160, 20]; // Dark Green (High)
        confidenceInterpretation = 'High Confidence: Model prediction is highly reliable.';
    } else if (prediction.confidence_score >= 0.6) {
        confidenceColor = [251, 191, 36]; // Amber (Moderate)
        confidenceInterpretation = 'Moderate Confidence: Additional clinical review recommended.';
    }
    
    doc.setFillColor(...confidenceColor);
    doc.rect(marginX + 5, yPosition, confidenceFillWidth, 6, 'F');

    // Confidence percentage text
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...confidenceColor);
    doc.text(`${confidencePercent}%`, marginX + 5 + meterWidth + 5, yPosition + 4);
    doc.setTextColor(0, 0, 0);

    yPosition += 10;

    // Confidence interpretation text (Needs max width for wrapping)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    const wrappedInterpretation = doc.splitTextToSize(`* ${confidenceInterpretation}`, pageWidth - (2 * marginX) - 10);
    doc.text(wrappedInterpretation, marginX + 5, yPosition);
    doc.setFont('helvetica', 'normal');

    yPosition += (wrappedInterpretation.length * 4) + 5;

    // ========== TREATMENT RECOMMENDATIONS ==========
    doc.setFillColor(230, 230, 230);
    doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 8, 'F');

    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...sectionTitleColor);
    doc.text('TREATMENT RECOMMENDATIONS', marginX + 2, yPosition);
    doc.setTextColor(0, 0, 0);

    yPosition += 5;

    // Treatment suggestions table
    const treatments = treatmentSuggestions[prediction.predicted_label] || [];
    const treatmentTableData = treatments.map((treatment, index) => [
        `${index + 1}`,
        treatment
    ]);

    autoTable(doc, {
        startY: yPosition,
        head: [['#', 'Recommendation Detail']],
        body: treatmentTableData,
        theme: 'grid',
        headStyles: {
            fillColor: headerColor, 
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [50, 50, 50],
            minCellHeight: 8 
        },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
            1: { cellWidth: 'auto' }
        },
        margin: { left: marginX, right: marginX },
        alternateRowStyles: {
            fillColor: [249, 249, 249]
        }
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // ========== MEDICAL DISCLAIMER (Footer Section) ==========
    if (yPosition > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage();
        yPosition = 20;
    }

    // Disclaimer Box
    const disclaimerBoxColor = [255, 245, 230]; 
    const disclaimerBorderColor = [251, 191, 36]; 

    const disclaimerInnerMargin = 3;
    const disclaimerTextX = marginX + disclaimerInnerMargin;
    const disclaimerMaxWidth = pageWidth - (2 * marginX) - (2 * disclaimerInnerMargin);
    let disclaimerCurrentY = yPosition + 5;

    // Box size is now dynamically sized by default but drawing it here for border
    doc.setFillColor(...disclaimerBoxColor);
    doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 30, 'F'); 
    doc.setDrawColor(...disclaimerBorderColor);
    doc.setLineWidth(0.4);
    doc.rect(marginX, yPosition, pageWidth - (2 * marginX), 30); 

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9); 
    doc.text('CONFIDENTIAL - MEDICAL DISCLAIMER', disclaimerTextX, disclaimerCurrentY);

    disclaimerCurrentY += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 53, 15); 

    const disclaimerText = [
        'This AI report is for informational and preliminary screening only. It is NOT a substitute for professional medical diagnosis or treatment.',
        'Always consult a certified dermatologist or healthcare provider for personalized advice. AI predictions may not account for all clinical factors.'
    ];

    // Text wrapping applied here
    disclaimerText.forEach((line) => {
        const wrappedLine = doc.splitTextToSize(line, disclaimerMaxWidth);
        doc.text(wrappedLine, disclaimerTextX, disclaimerCurrentY);
        disclaimerCurrentY += wrappedLine.length * 3.5; 
    });

    doc.setTextColor(0, 0, 0);

    // ========== FOOTER BAR ==========
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(0, footerY - 5, pageWidth, footerY - 5);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Document Generated by Derma-Scan AI | Page 1 of 1', pageWidth / 2, footerY, { align: 'center' });
    doc.text(`Generated On: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 4, { align: 'center' });

    // Save the PDF
    doc.save(`Dermatology_Report_${prediction.reportId}_${patientData.name.replace(/\s/g, '')}.pdf`);
    toast.success('PDF report downloaded successfully!');
};