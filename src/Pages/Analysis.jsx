import React, { useState, useContext, useEffect, useRef } from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import NearestDermatologyMap from '../components/NearestDermatologyMap';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoonLoader } from 'react-spinners';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaMapLocationDot } from 'react-icons/fa6';
import { FiUpload, FiDownload, FiShare2, FiMapPin, FiChevronDown } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdOutlineInfo, MdHistory } from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";
import { AiOutlineWarning } from "react-icons/ai";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import suggestionsData from '../Assets/treatmentSuggestions.json';

const Analysis = () => {
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [treatmentSuggestions, setTreatmentSuggestions] = useState({});
    const [uploadProgress, setUploadProgress] = useState(0);
    const [analysisStep, setAnalysisStep] = useState('');
    // Added new state for map visibility
    const [showMap, setShowMap] = useState(false);
    const { accessToken } = useContext(AuthContext);
    const resultRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
            if (image) URL.revokeObjectURL(image);
        };
    }, [image]);

    useEffect(() => {
        setTreatmentSuggestions(suggestionsData);
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrorMessage('Only image files are allowed.');
            toast.error('Only image files are allowed.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('Image size must be under 5MB.');
            toast.error('Image size must be under 5MB.');
            return;
        }

        setImage(file);
        setErrorMessage(null);
        setPrediction(null);
        setShowResult(false);
        setShowMap(false); // Hide map on new image upload
        toast.success('Image uploaded successfully!');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (file) {
            const fakeEvent = { target: { files: [file] } };
            handleImageChange(fakeEvent);
        }
    };

    const simulateAnalysisSteps = () => {
        const steps = [
            'Uploading image...',
            'Preprocessing facial features...',
            'Running AI model analysis...',
            'Calculating confidence scores...',
            'Generating results...'
        ];

        let stepIndex = 0;
        const interval = setInterval(() => {
            if (stepIndex < steps.length) {
                setAnalysisStep(steps[stepIndex]);
                setUploadProgress((stepIndex + 1) * 20);
                stepIndex++;
            } else {
                clearInterval(interval);
            }
        }, 800);

        return interval;
    };

    const handleAnalyzeClick = async () => {
        if (!accessToken) {
            setErrorMessage('You must be logged in to analyze.');
            toast.error('You must be logged in to analyze.');
            return;
        }

        if (!image) {
            setErrorMessage('Please upload an image first.');
            toast.error('Please upload an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        setIsLoading(true);
        setPrediction(null);
        setErrorMessage(null);
        setShowResult(false);
        setShowMap(false); // Hide map on new analysis
        setUploadProgress(0);
        setAnalysisStep('Initializing...');

        const stepInterval = simulateAnalysisSteps();

        console.log('Sending prediction request...');

        try {
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            console.log('Response status:', response.status);

            const data = await response.json();
            console.log('Response data:', data);

            clearInterval(stepInterval);

            if (!response.ok) {
                const backendError = data.error || 'Image analysis failed. Please try again.';
                setErrorMessage(backendError);
                toast.error(backendError);
                return;
            }

            setPrediction({
                predicted_label: data.predicted_label,
                confidence_score: data.confidence_score,
                timestamp: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                reportId: `DSA-${Date.now()}`
            });
            setShowResult(true);
            setUploadProgress(100);
            setAnalysisStep('Analysis complete!');

            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);

            toast.success('Prediction successful and saved!');
        } catch (error) {
            console.error('Error during image analysis:', error);
            clearInterval(stepInterval);
            const errMsg = error.message || 'Something went wrong during analysis.';
            setErrorMessage(errMsg);
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
            setAnalysisStep('');
            console.log('Loading finished');
        }
    };

    const handleRetry = () => {
        setImage(null);
        setPrediction(null);
        setErrorMessage(null);
        setShowResult(false);
        setShowMap(false); // Hide map on retry
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClearImage = () => {
        setImage(null);
        setErrorMessage(null);
        setPrediction(null);
        setShowResult(false);
        setShowMap(false); // Hide map on clear
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.info('Image cleared');
    };

    const handleDownloadReport = () => {
        if (!prediction) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPosition = 20;

        // ========== HEADER SECTION ==========
        // Logo/Title Area with Background (Deep Charcoal Gray: 52, 58, 64)
        doc.setFillColor(52, 58, 64);
        doc.rect(0, 0, pageWidth, 35, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('DERMATOLOGICAL ANALYSIS REPORT', pageWidth / 2, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('AI-Powered Facial Skin Assessment', pageWidth / 2, 25, { align: 'center' });

        yPosition = 45;

        // ========== PATIENT/REPORT INFORMATION ==========
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(245, 245, 245); // Light Gray
        doc.rect(15, yPosition, pageWidth - 30, 35, 'F');

        yPosition += 8;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('REPORT INFORMATION', 20, yPosition);

        yPosition += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        // Two column layout for report info
        const col1X = 20;
        const col2X = pageWidth / 2 + 10;

        doc.setFont('helvetica', 'bold');
        doc.text('Report ID:', col1X, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(prediction.reportId, col1X + 25, yPosition);

        doc.setFont('helvetica', 'bold');
        doc.text('Analysis Date:', col2X, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(prediction.timestamp, col2X + 30, yPosition);

        yPosition += 6;
        doc.setFont('helvetica', 'bold');
        doc.text('Analysis Method:', col1X, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text('AI Deep Learning Model', col1X + 35, yPosition);

        doc.setFont('helvetica', 'bold');
        doc.text('Report Status:', col2X, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(34, 197, 94); // Green (Kept for status/safety, can be changed to black if desired)
        doc.text('COMPLETED', col2X + 30, yPosition);
        doc.setTextColor(0, 0, 0);

        yPosition += 15;

        // ========== DIAGNOSIS SECTION ==========
        doc.setFillColor(230, 230, 230); // Very Light Gray
        doc.rect(15, yPosition, pageWidth - 30, 12, 'F');

        yPosition += 8;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(108, 117, 125); // Slate Gray
        doc.text('DIAGNOSIS RESULTS', 20, yPosition);
        doc.setTextColor(0, 0, 0);

        yPosition += 10;

        // Diagnosis Box
        doc.setDrawColor(108, 117, 125); // Slate Gray
        doc.setLineWidth(0.5);
        doc.rect(15, yPosition, pageWidth - 30, 25);

        yPosition += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Detected Condition:', 20, yPosition);

        yPosition += 8;
        doc.setFontSize(14);
        doc.setTextColor(52, 58, 64); // Deep Charcoal
        doc.text(prediction.predicted_label.toUpperCase(), 20, yPosition);
        doc.setTextColor(0, 0, 0);

        yPosition += 25;

        // ========== CONFIDENCE ANALYSIS ==========
        doc.setFillColor(230, 230, 230); // Very Light Gray
        doc.rect(15, yPosition, pageWidth - 30, 12, 'F');

        yPosition += 8;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(108, 117, 125); // Slate Gray
        doc.text('CONFIDENCE ANALYSIS', 20, yPosition);
        doc.setTextColor(0, 0, 0);

        yPosition += 10;

        const confidencePercent = (prediction.confidence_score * 100).toFixed(2);

        // Confidence meter background
        doc.setFillColor(230, 230, 230);
        doc.rect(20, yPosition, 150, 8, 'F');

        // Confidence meter fill (Kept Green/Amber/Red for clinical clarity/safety warnings)
        const confidenceWidth = (confidencePercent / 100) * 150;
        if (prediction.confidence_score >= 0.8) {
            doc.setFillColor(34, 197, 94); // Green
        } else if (prediction.confidence_score >= 0.6) {
            doc.setFillColor(251, 191, 36); // Amber
        } else {
            doc.setFillColor(239, 68, 68); // Red
        }
        doc.rect(20, yPosition, confidenceWidth, 8, 'F');

        // Confidence percentage text
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${confidencePercent}%`, 175, yPosition + 6);

        yPosition += 15;

        // Confidence interpretation
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        let confidenceText = '';
        if (prediction.confidence_score >= 0.8) {
            confidenceText = '✓ High Confidence: Model prediction is highly reliable';
            doc.setTextColor(34, 197, 94); // Green
        } else if (prediction.confidence_score >= 0.6) {
            confidenceText = '⚠ Moderate Confidence: Additional clinical review recommended';
            doc.setTextColor(251, 191, 36); // Amber
        } else {
            confidenceText = '⚠ Low Confidence: Professional dermatological consultation strongly advised';
            doc.setTextColor(239, 68, 68); // Red
        }
        doc.text(confidenceText, 20, yPosition);
        doc.setTextColor(0, 0, 0);

        yPosition += 15;

        // ========== TREATMENT RECOMMENDATIONS ==========
        doc.setFillColor(230, 230, 230); // Very Light Gray
        doc.rect(15, yPosition, pageWidth - 30, 12, 'F');

        yPosition += 8;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(108, 117, 125); // Slate Gray
        doc.text('RECOMMENDED TREATMENT OPTIONS', 20, yPosition);
        doc.setTextColor(0, 0, 0);

        yPosition += 10;

        // Treatment suggestions table
        const treatments = treatmentSuggestions[prediction.predicted_label] || [];
        const treatmentTableData = treatments.map((treatment, index) => [
            `${index + 1}`,
            treatment
        ]);

        autoTable(doc, {
            startY: yPosition,
            head: [['#', 'Treatment Recommendation']],
            body: treatmentTableData,
            theme: 'striped',
            headStyles: {
                fillColor: [52, 58, 64], // Deep Charcoal Gray
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 10
            },
            bodyStyles: {
                fontSize: 9,
                textColor: [50, 50, 50]
            },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
                1: { cellWidth: 'auto' }
            },
            margin: { left: 15, right: 15 },
            alternateRowStyles: {
                fillColor: [249, 249, 249]
            }
        });

        yPosition = doc.lastAutoTable.finalY + 15;

        // ========== MEDICAL DISCLAIMER ==========
        if (yPosition > pageHeight - 60) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFillColor(255, 237, 213); // Light amber (Kept for visual warning)
        doc.rect(15, yPosition, pageWidth - 30, 40, 'F');

        doc.setDrawColor(251, 191, 36); // Amber (Kept for visual warning)
        doc.setLineWidth(0.5);
        doc.rect(15, yPosition, pageWidth - 30, 40);

        yPosition += 8;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(180, 83, 9);
        doc.text('⚠ IMPORTANT MEDICAL DISCLAIMER', 20, yPosition);

        yPosition += 8;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 53, 15);

        const disclaimerText = [
            'This AI-generated report is intended for informational and preliminary screening purposes only.',
            'It should NOT be considered as a substitute for professional medical diagnosis or treatment.',
            'Please consult a certified dermatologist or healthcare provider for accurate diagnosis,',
            'personalized treatment plans, and medical advice. The AI model\'s predictions may not account',
            'for all clinical factors and patient-specific conditions.'
        ];

        disclaimerText.forEach((line, index) => {
            doc.text(line, 20, yPosition + (index * 5), { maxWidth: pageWidth - 40 });
        });

        doc.setTextColor(0, 0, 0);

        // ========== FOOTER ==========
        const footerY = pageHeight - 20;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text('Facial Skin Analysis Dashboard - AI-Powered Dermatological Screening', pageWidth / 2, footerY, { align: 'center' });
        doc.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 5, { align: 'center' });
        doc.text(`Page 1 of 1 | Confidential Medical Document`, pageWidth / 2, footerY + 10, { align: 'center' });

        // Save the PDF
        doc.save(`Dermatology_Report_${prediction.reportId}.pdf`);
        toast.success('Professional PDF report downloaded successfully!');
    };

    const handleShareResults = async () => {
        if (!prediction) return;

        const shareText = `My skin analysis results: ${prediction.predicted_label} (${(prediction.confidence_score * 100).toFixed(1)}% confidence)`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Skin Analysis Results',
                    text: shareText,
                });
                toast.success('Results shared successfully!');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareText);
            toast.success('Results copied to clipboard!');
        }
    };

    // Added handler to toggle map visibility
    const handleToggleMap = () => {
        setShowMap(prevShowMap => !prevShowMap);
    };

    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
            {/* Blurred Background */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('../Assets/background.jpg')",
                    filter: 'blur(50px)',
                    zIndex: 0
                }}
            />
            <Header />
            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">


                {/* Page Header with Badge */}
                <div className="flex flex-col justify-center items-center mt-10 md:mt-22 lg:mt-18 px-4 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <BsShieldCheck className="text-green-600 text-xl" />
                        <span className="text-xs md:text-sm text-gray-700 font-medium">AI-Powered Analysis</span>
                    </div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 tracking-tight text-center">
                        Facial Skin Analysis Dashboard
                    </h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-2 text-center max-w-2xl">
                        Advanced dermatological screening using machine learning technology
                    </p>
                </div>

                {/* Main Dashboard */}
                <div className="flex flex-col items-center gap-8 px-4 md:px-12 lg:px-24 py-6 w-full">

                    {/* Upload Section */}
                    <section className="w-full max-w-6xl bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 transition-all duration-300 hover:shadow-2xl">
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">

                            {/* Description & Instructions */}
                            <div className="w-full lg:w-5/12 flex flex-col justify-start items-start text-left space-y-4">
                                <div className="flex items-center gap-2">

                                    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                                        Upload Your Photo
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                                    For accurate skin analysis, please follow the guidelines below to capture a high-quality facial photograph.
                                </p>

                                {/* Guidelines */}
                                <div className="space-y-2.5 pt-2 w-full">
                                    <div className="flex items-start gap-2.5 bg-green-50 p-2.5 rounded-lg border border-green-100">
                                        <IoMdCheckmarkCircleOutline className="text-green-500 text-lg md:text-xl flex-shrink-0 mt-0.5" />
                                        <p className="text-xs md:text-sm text-gray-700">
                                            <span className="font-semibold">Natural Lighting:</span> Use daylight or bright indoor lighting, avoid harsh shadows
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2.5 bg-green-50 p-2.5 rounded-lg border border-green-100">
                                        <IoMdCheckmarkCircleOutline className="text-green-500 text-lg md:text-xl flex-shrink-0 mt-0.5" />
                                        <p className="text-xs md:text-sm text-gray-700">
                                            <span className="font-semibold">No Makeup:</span> Remove all cosmetics, moisturizers, and skincare products
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2.5 bg-green-50 p-2.5 rounded-lg border border-green-100">
                                        <IoMdCheckmarkCircleOutline className="text-green-500 text-lg md:text-xl flex-shrink-0 mt-0.5" />
                                        <p className="text-xs md:text-sm text-gray-700">
                                            <span className="font-semibold">Front-Facing:</span> Position your face directly toward the camera at eye level
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2.5 bg-green-50 p-2.5 rounded-lg border border-green-100">
                                        <IoMdCheckmarkCircleOutline className="text-green-500 text-lg md:text-xl flex-shrink-0 mt-0.5" />
                                        <p className="text-xs md:text-sm text-gray-700">
                                            <span className="font-semibold">Clear & Sharp:</span> Ensure the image is in focus and not blurry
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2.5 bg-green-50 p-2.5 rounded-lg border border-green-100">
                                        <IoMdCheckmarkCircleOutline className="text-green-500 text-lg md:text-xl flex-shrink-0 mt-0.5" />
                                        <p className="text-xs md:text-sm text-gray-700">
                                            <span className="font-semibold">Neutral Expression:</span> Keep a relaxed, neutral facial expression
                                        </p>
                                    </div>
                                </div>

                                {/* Additional Info Boxes */}
                                <div className="space-y-2 w-full">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                                        <MdOutlineInfo className="text-blue-600 text-lg flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-800 leading-relaxed">
                                            <span className="font-semibold">Supported Formats:</span> JPG, PNG, JPEG • Maximum file size: 5MB
                                        </p>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                                        <AiOutlineWarning className="text-amber-600 text-lg flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-800 leading-relaxed">
                                            <span className="font-semibold">Privacy:</span> Your images are processed securely and not stored permanently
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Container */}
                            <div className="w-full lg:w-6/12 flex flex-col items-center gap-4">
                                <div className="relative w-full">
                                    <label
                                        className="relative w-full mt-2 mb-2 max-w-md mx-auto block h-64 md:h-72 lg:h-80 border-2 border-dashed border-gray-300 hover:border-gray-500 rounded-2xl bg-gradient-to-br from-gray-50 to-white cursor-pointer flex items-center justify-center overflow-hidden transition-all duration-300 group"
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        {image ? (
                                            <>
                                                {/* Clear Button - Top Right Corner */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleClearImage();
                                                    }}
                                                    className="absolute top-3 right-3 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 transform hover:scale-110"
                                                    title="Clear image"
                                                >
                                                    <IoClose className="text-xl" />
                                                </button>

                                                {/* Image Info Badge */}
                                                <div className="absolute bottom-3 left-3 z-20 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                    {(image.size / 1024).toFixed(0)} KB
                                                </div>

                                                {/* Image Preview - Contain instead of Cover */}
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain rounded-2xl p-2"
                                                />
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-500 px-4 group-hover:text-gray-700 transition-colors duration-300">
                                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-300 transition-colors">
                                                    <FiUpload className="text-3xl text-gray-700" />
                                                </div>
                                                <p className="text-center text-xs md:text-sm font-medium">
                                                    Drag and drop your image here or <br />
                                                    <span className="font-semibold text-gray-700">click to browse</span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">JPG, PNG, JPEG (Max 5MB)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                {/* Error Message */}
                                {errorMessage && (
                                    <div className="w-full max-w-md bg-red-50 border border-red-300 rounded-lg p-3 text-center space-y-2 shadow-sm animate-shake">
                                        <p className="text-red-700 font-medium text-xs md:text-sm">
                                            {errorMessage}
                                        </p>
                                        <button
                                            onClick={handleRetry}
                                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-4 rounded-lg transition-colors duration-200 text-xs md:text-sm"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-2.5 px-8 rounded-full transition-all duration-300 text-xs md:text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <FiUpload className="text-sm" />
                                        Choose File
                                    </button>
                                    <button
                                        onClick={handleAnalyzeClick}
                                        disabled={!image || isLoading}
                                        className={`font-semibold py-2.5 px-8 rounded-full transition-all duration-300 text-xs md:text-sm shadow-md flex items-center gap-2 ${!image || isLoading
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                                            }`}
                                    >
                                        <BsShieldCheck className="text-sm" />
                                        {isLoading ? 'Analyzing...' : 'Analyze Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Loading Overlay with Progress */}
                    {isLoading && (
                        <div className="fixed inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-50">
                            <div className="flex flex-col items-center gap-6 bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
                                <MoonLoader color="#3B82F6" size={60} />
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-gray-700 font-medium text-sm">{analysisStep}</p>
                                        <p className="text-blue-600 text-xs font-semibold">{uploadProgress}%</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 h-full rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 text-center">
                                    Please wait while we analyze your facial features...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Results Section */}
                    {showResult && (
                        <section
                            ref={resultRef}
                            className="w-full max-w-6xl bg-white/95 backdrop-blur-sm border border-gray-200 mb-3 rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 animate-fade-in"
                        >
                            {/* Results Header with Actions */}
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">✓</span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                                        Analysis Complete
                                    </h3>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDownloadReport}
                                        className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                                        title="Download PDF Report"
                                    >
                                        <FiDownload className="text-sm" />
                                        <span className="hidden sm:inline">Download PDF</span>
                                    </button>
                                    <button
                                        onClick={handleShareResults}
                                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                                        title="Share Results"
                                    >
                                        <FiShare2 className="text-sm" />
                                        <span className="hidden sm:inline">Share</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">

                                {/* Result Box */}
                                <div className="w-full lg:w-5/12 flex flex-col justify-center items-start space-y-4 pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-8">
                                    {prediction && (
                                        <>
                                            <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-100 p-5 rounded-xl w-full border border-gray-300 shadow-sm">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-sm md:text-base font-medium text-gray-700">
                                                        Diagnosis Result
                                                    </h3>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <MdHistory className="text-sm" />
                                                        {prediction.timestamp}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-2">Report ID: {prediction.reportId}</p>
                                                <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 mb-4">
                                                    {prediction.predicted_label}
                                                </p>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-600">Confidence Level</span>
                                                        <span className="font-bold text-gray-800">
                                                            {(prediction.confidence_score * 100).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-grow bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                                                            <div
                                                                className="bg-gradient-to-r from-gray-500 via-gray-700 to-gray-500 h-full rounded-full transition-all duration-1000 shadow-lg"
                                                                style={{ width: `${prediction.confidence_score * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {prediction.confidence_score >= 0.8 ? (
                                                        <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                                                            <BsShieldCheck /> High confidence prediction
                                                        </p>
                                                    ) : prediction.confidence_score >= 0.6 ? (
                                                        <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
                                                            <AiOutlineWarning /> Moderate confidence - consider professional consultation
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-red-600 flex items-center gap-1 mt-2">
                                                            <AiOutlineWarning /> Low confidence - professional consultation recommended
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Disclaimer */}
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 w-full">
                                                <AiOutlineWarning className="text-amber-600 text-lg flex-shrink-0 mt-0.5" />
                                                <p className="text-xs text-amber-800 leading-relaxed">
                                                    <span className="font-semibold">Medical Disclaimer:</span> This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult a certified dermatologist for accurate diagnosis and treatment.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Treatment Suggestions */}
                                <div className="w-full lg:w-6/12 flex flex-col justify-start items-start space-y-4">
                                    {prediction?.predicted_label && (
                                        <>
                                            <div className="flex items-center gap-2 w-full">
                                                <span className="w-1 h-8 bg-gradient-to-b from-gray-700 to-gray-500 rounded-full"></span>
                                                <h4 className="text-base md:text-lg font-semibold text-gray-800">
                                                    Recommended Treatment Options
                                                </h4>
                                            </div>
                                            <p className="text-xs text-gray-600 -mt-2">
                                                Based on AI analysis and dermatological guidelines
                                            </p>
                                            <ul className="space-y-3 text-gray-700 text-xs md:text-sm w-full">
                                                {(treatmentSuggestions[prediction.predicted_label] || []).map((tip, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 bg-gradient-to-r from-gray-50 to-white p-3.5 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-100 hover:border-gray-300 hover:shadow-md group">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-500 text-white rounded-full flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform duration-200">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="leading-relaxed pt-0.5">{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Next Steps CTA */}
                                            <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 rounded-xl w-full mt-4 shadow-lg">
                                                <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                                    <BsShieldCheck /> Next Steps
                                                </h5>
                                                <p className="text-xs leading-relaxed opacity-90">
                                                    Schedule a consultation with a dermatologist for personalized treatment. Download your PDF report to share with your healthcare provider.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* === MODIFIED MAP SECTION === */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                    <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3 md:mb-0 flex items-center gap-2">
                                        Find a Nearby Face Care Centre
                                        <FaMapLocationDot className="inline text-red-600 text-xl md:text-2xl" />
                                    </h3>
                                    <button
                                        onClick={handleToggleMap}
                                        className="w-full md:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 text-xs md:text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        aria-expanded={showMap}
                                        aria-controls="map-container"
                                    >
                                        <FiMapPin className="text-base" />
                                        <span>{showMap ? 'Hide Nearby Map' : 'Show Nearby Map'}</span>
                                        <FiChevronDown
                                            className={`text-base transition-transform duration-300 ${showMap ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                </div>

                                {/* Conditionally rendered map with animation */}
                                {showMap && (
                                    <div id="map-container" className="animate-fade-in rounded-lg overflow-hidden shadow-lg border border-gray-200">
                                        <NearestDermatologyMap />
                                    </div>
                                )}
                            </div>
                            {/* === END OF MODIFIED MAP SECTION === */}

                        </section>
                    )}
                </div>

                <Footer />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>

            {/* Enhanced Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                .animate-shake {
                    animation: shake 0.4s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Analysis;