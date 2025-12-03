// ========== PDF GENERATION (IMPROVED VERSION) ==========
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';

/** Find matching condition in treatmentSuggestions JSON */
const getTreatmentData = (predictedLabel, treatmentSuggestions) => {
    if (!predictedLabel || !treatmentSuggestions?.skin_conditions) return null;
    return treatmentSuggestions.skin_conditions.find(
        c => c.name.toLowerCase() === predictedLabel.toLowerCase()
    );
};

/** Load image as dataURL */
const loadImageAsDataUrl = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch image");

        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject("Failed to read blob");
            reader.readAsDataURL(blob);
        });
    } catch (err) {
        console.warn("Image load error:", err);
        return null;
    }
};

/** MAIN PDF CREATION FUNCTION (Supports blob return) */
const createPdf = (prediction, treatmentSuggestions, userData, dermComment, download = true, imageDataUrl = null) => {
    if (!prediction) {
        toast.error("Missing prediction data.");
        return null;
    }

    const conditionData = getTreatmentData(prediction.predicted_label, treatmentSuggestions);
    const treatments = conditionData?.treatments || [];
    const prevention = conditionData?.prevention || [];
    const resources = conditionData?.resources || [];

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    let y = 20;

    /** Patient Data */
    const patient = {
        name: userData?.name || "N/A",
        age: userData?.age || "N/A",
        gender: userData?.gender || "N/A",
        contact: userData?.phone || "N/A",
        bloodGroup: userData?.bloodGroup || "N/A",
        dermatologist: userData?.dermatologist || "Not Assigned",
    };

    const headerBg = [30, 41, 59];
    const sectionBg = [230, 230, 230];

    // ---------------------- HEADER BOXES ----------------------
    const colWidth = (pageWidth - margin * 2) / 2 - 5;
    const col1X = margin;
    const col2X = margin + colWidth + 10;

    doc.setFillColor(...headerBg);
    doc.rect(col1X, y, colWidth, 8, "F");
    doc.rect(col2X, y, colWidth, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("REPORT DETAILS", col1X + 4, y + 5);
    doc.text("PATIENT DEMOGRAPHICS", col2X + 4, y + 5);

    y += 15;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    // Left Column
    const reportLeft = [
        ["Report ID", prediction.reportId || "N/A"],
        ["Date", prediction.timestamp || "N/A"],
        ["Method", "AI Deep Learning Model"],
        ["Status", "Completed"],
    ];

    reportLeft.forEach(([k, v]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${k}:`, col1X + 4, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(v), col1X + 32, y);
        y += 6;
    });

    // Reset Y for patient col
    let y2 = 35;

    const patientLeft = [
        ["Name", patient.name],
        ["Age/Gender", `${patient.age} / ${patient.gender}`],
        ["Contact", patient.contact],
        ["Blood Group", patient.bloodGroup],
        ["Derm.", patient.dermatologist],
    ];

    patientLeft.forEach(([k, v]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${k}:`, col2X + 4, y2);
        doc.setFont("helvetica", "normal");
        doc.text(String(v), col2X + 32, y2);
        y2 += 6;
    });

    y += 10;

    // ---------------------- SECTION: Diagnosis ----------------------
    const addSectionHeader = (title) => {
        doc.setFillColor(...sectionBg);
        doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(70, 70, 70);
        doc.text(title, margin + 2, y + 5);
        doc.setTextColor(0, 0, 0);
        y += 12;
    };

    addSectionHeader("ANALYSIS & DIAGNOSIS RESULTS");

    doc.setFontSize(10);
    doc.text("Primary AI-Detected Condition:", margin + 2, y);
    y += 8;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);

    const diagnosisText = prediction.predicted_label.toUpperCase();

    // Diagnosis + Image
    if (imageDataUrl) {
        try {
            let imgW = 55;
            let imgH = 55;

            const xImg = margin + 2;
            const yImg = y;

            doc.addImage(imageDataUrl, "JPEG", xImg, yImg, imgW, imgH);

            doc.text(diagnosisText, xImg + imgW + 8, yImg + 10);

            y += imgH + 10;
        } catch (err) {
            console.warn("Image error:", err);
            doc.text(diagnosisText, margin + 2, y);
            y += 18;
        }
    } else {
        doc.text(diagnosisText, margin + 2, y);
        y += 18;
    }

    doc.setTextColor(0, 0, 0);

    // ---------------------- CONFIDENCE METER ----------------------
    addSectionHeader("CONFIDENCE SCORE");

    const meterWidth = pageWidth - margin * 2 - 30;
    const meterX = margin + 2;

    doc.setFillColor(200, 200, 200);
    doc.rect(meterX, y, meterWidth, 6, "F");

    let confidenceColor = [239, 68, 68];
    let message = "Low Confidence — clinical verification recommended.";

    if (prediction.confidence_score >= 0.85) {
        confidenceColor = [20, 160, 20];
        message = "High Confidence — prediction is reliable.";
    } else if (prediction.confidence_score >= 0.6) {
        confidenceColor = [251, 191, 36];
        message = "Moderate Confidence — consider clinical review.";
    }

    const filled = meterWidth * prediction.confidence_score;

    doc.setFillColor(...confidenceColor);
    doc.rect(meterX, y, filled, 6, "F");

    doc.setFontSize(10);
    doc.setTextColor(...confidenceColor);
    doc.text(`${(prediction.confidence_score * 100).toFixed(2)}%`, meterX + meterWidth + 5, y + 4);

    y += 12;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`* ${message}`, meterX, y);
    y += 10;

    // ---------------------- TREATMENT ----------------------
    addSectionHeader("TREATMENT RECOMMENDATIONS");

    autoTable(doc, {
        startY: y,
        theme: "grid",
        headStyles: { fillColor: headerBg, textColor: 255 },
        head: [["#", "Recommendation"]],
        body: treatments.map((t, i) => [i + 1, t]),
        margin: { left: margin, right: margin },
        styles: { fontSize: 9 },
    });

    y = doc.lastAutoTable.finalY + 10;

    // ---------------------- PREVENTION ----------------------
    if (prevention.length) {
        addSectionHeader("PREVENTION GUIDELINES");
        prevention.forEach((item, i) => {
            doc.setFontSize(9);
            doc.text(`${i + 1}. ${item}`, margin + 2, y);
            y += 5;
        });
        y += 8;
    }

    // ---------------------- RESOURCES ----------------------
    if (resources.length) {
        addSectionHeader("HELPFUL RESOURCES");
        resources.forEach((item, i) => {
            doc.setFontSize(9);
            doc.text(`${i + 1}. ${item}`, margin + 2, y);
            y += 5;
        });
        y += 8;
    }

    // ---------------------- DERM COMMENT ----------------------
    if (dermComment?.trim()) {
        if (y > pageHeight - 40) {
            doc.addPage();
            y = 20;
        }
        addSectionHeader("DERMATOLOGIST REVIEW");

        const wrapped = doc.splitTextToSize(dermComment, pageWidth - margin * 2 - 4);

        doc.setFontSize(10);
        doc.text(wrapped, margin + 2, y);
        y += wrapped.length * 5 + 10;
    }

    // ---------------------- FOOTER ----------------------
    // Existing footer
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "italic");
    doc.text(
        `Generated by FacialDerma AI | ${new Date().toLocaleString()}`,
        pageWidth / 2,
        pageHeight - 20,
        { align: "center" }
    );

    // Add disclaimer in yellow with Times New Roman
    doc.setFont("times", "normal"); // Change font
    doc.setFontSize(7);
    doc.setTextColor(255, 190, 10); // Yellow color
    const disclaimer = "Disclaimer: Facial Derma AI uses automated image analysis to detect potential skin conditions. While we strive for accuracy, the predictions may contain errors and should not replace professional medical advice, diagnosis, or treatment. Always consult a certified dermatologist for proper evaluation.";

    // Split text to fit page width
    const wrappedDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 20);
    doc.text(wrappedDisclaimer, 10, pageHeight - 12); // Left aligned with margin


    // ---------------------- OUTPUT ----------------------
    if (!download) return doc.output("blob");

    const fileName = `Report_${prediction.reportId}_${patient.name.replace(/\s/g, "")}.pdf`;
    doc.save(fileName);
    toast.success("PDF Generated Successfully!");
    return null;
};

/** Public Function – returns Blob */
export const generatePdfReportBlob = async (prediction, treatmentSuggestions, userData, dermComment) => {
    let imageDataUrl = prediction?.imageUrl ? await loadImageAsDataUrl(prediction.imageUrl) : null;
    return createPdf(prediction, treatmentSuggestions, userData, dermComment, false, imageDataUrl);
};

/** Public Function – automatic Download */
export const generatePdfReport = async (prediction, treatmentSuggestions, userData, dermComment) => {
    const blob = await generatePdfReportBlob(prediction, treatmentSuggestions, userData, dermComment);
    if (!blob) return;

    const fileName = `Report_${prediction.reportId}_${(userData?.name || userData?.username || "patient").replace(/\s/g, " ")}.pdf`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("PDF Report Downloaded!");
};
