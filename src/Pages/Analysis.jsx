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
import suggestionsData from '../Assets/treatmentSuggestions.json';
import { generatePdfReport, generatePdfReportBlob } from '../components/PdfReportGenerator';
import {
    apiUpload,
    getAllPredictions,
    apiListDermatologists,
    apiCreateReviewRequest,
    apiGetFullProfile,
    apiGetReviewRequests
} from '../api/api';
import DermatologistPicker from '../components/DermatologistPicker';

const Analysis = () => {
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [treatmentSuggestions, setTreatmentSuggestions] = useState({});
    const [uploadProgress, setUploadProgress] = useState(0);
    const [analysisStep, setAnalysisStep] = useState('');
    const [showMap, setShowMap] = useState(false);
    const { accessToken, user } = useContext(AuthContext);
    const resultRef = useRef(null);
    const fileInputRef = useRef(null);
    // New state for review workflow
    const [showDermPicker, setShowDermPicker] = useState(false);
    const [derms, setDerms] = useState([]);
    const [dermSearch, setDermSearch] = useState("");
    const [dermLoading, setDermLoading] = useState(false);
    const [latestPredictionId, setLatestPredictionId] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [reviewData, setReviewData] = useState(null);

    // Fetch full user profile and review requests on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiGetFullProfile();
                setUserProfile(response.data);
                
                // Fetch review requests to get dermatologist info
                const reviewsResponse = await apiGetReviewRequests();
                if (reviewsResponse?.data && reviewsResponse.data.length > 0) {
                    // Get the most recent reviewed request
                    const reviewed = reviewsResponse.data.find(r => r.status === 'reviewed');
                    if (reviewed) {
                        setReviewData(reviewed);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        
        if (accessToken) {
            fetchUserData();
        }
    }, [accessToken]);

    useEffect(() => {
        // Since api.js is not provided in full, we assume a mechanism to set the token is needed
        // The original code only used accessToken to check login status, and relied on a manual header
        // For demonstration, we'll primarily use apiUpload and rely on the context for the login check.
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
            // UPDATED: Use apiUpload function from api.js
            // The apiUpload function is expected to handle the Axios call, headers, and base URL.
            const response = await apiUpload(formData);
            const data = response.data; // Axios response data is in the 'data' property

            console.log('Response data:', data);

            clearInterval(stepInterval);

            // Axios throws an error for non-2xx status codes, so response.ok check isn't strictly necessary here.
            // If an error occurs, it will be caught in the catch block.

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

            toast.success('Prediction successful and saved!');            // Fetch latest prediction to get predictionId (backend returns newest first)
            try {
                const predsResp = await getAllPredictions();
                const latest = predsResp?.data?.[0];
                setLatestPredictionId(latest?.id || null);
            } catch (e) {
                console.warn("Could not fetch latest prediction id:", e);
                setLatestPredictionId(null);
            }

        } catch (error) {
            console.error('Error during image analysis:', error);
            clearInterval(stepInterval);

            let errMsg = 'Something went wrong during analysis.';
            if (error.response) {
                const errorData = error.response.data;
                // Safely extract the error message. 
                // Prioritize 'detail' or 'error' key, and ensure it's a string.
                let backendError = errorData.detail || errorData.error;

                if (typeof backendError === 'object' && backendError !== null) {
                    // If it's an object, try to extract the error message from it
                    if (backendError.error) {
                        errMsg = backendError.error;
                    } else if (backendError.message) {
                        errMsg = backendError.message;
                    } else {
                        // Try to get the first value from the object
                        const firstValue = Object.values(backendError)[0];
                        errMsg = typeof firstValue === 'string' ? firstValue : 'Image analysis failed. Please try again.';
                    }
                } else if (backendError) {
                    // Use the extracted string error
                    errMsg = String(backendError);
                } else {
                    // Fallback for an unknown structure
                    errMsg = `Image analysis failed with status ${error.response.status}.`;
                }
            } else if (error.request) {
                errMsg = 'No response from the server. Check your network connection.';
            } else {
                errMsg = error.message || 'Something went wrong during analysis.';
            }

            setErrorMessage(errMsg); // Now, errMsg is guaranteed to be a string
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

    // UPDATED: Renamed function call to use the new utility name
    const handleDownloadReport = () => {
        if (!prediction) return;
        // Create enhanced user data with dermatologist info from review
        const userDataWithDerm = {
            ...(userProfile || user),
            dermatologist: reviewData?.dermatologistUsername 
                ? `Dr. ${reviewData.dermatologistUsername}` 
                : 'Not Assigned'
        };
        // Pass dermatologist comment if available
        const dermComment = reviewData?.comment || null;
        generatePdfReport(prediction, treatmentSuggestions, userDataWithDerm, dermComment);
    };

    const handleShareResults = async () => {
        if (!prediction) return;
        // Prepare user data for PDF
        const userDataWithDerm = {
            ...(userProfile || user),
            dermatologist: reviewData?.dermatologistUsername 
                ? `Dr. ${reviewData.dermatologistUsername}` 
                : 'Not Assigned'
        };
        const dermComment = reviewData?.comment || null;
        const pdfBlob = generatePdfReportBlob(prediction, treatmentSuggestions, userDataWithDerm, dermComment);
        if (!pdfBlob) return;
        const file = new File([pdfBlob], `Dermatology_Report_${prediction.reportId}_${userDataWithDerm.name?.replace(/\s/g, '')}.pdf`, { type: 'application/pdf' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'Dermatology Report',
                    text: 'Your AI-assisted dermatology report.'
                });
                toast.success('PDF report shared successfully!');
            } catch (err) {
                toast.error('Sharing was cancelled or failed.');
            }
        } else {
            // Fallback: download
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.info('Sharing not supported, PDF downloaded instead.');
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
                                        className="relative w-full mt-2 mb-2 max-w-sm mx-auto block h-64 md:h-72 lg:h-80 border-2 border-dashed border-gray-300 hover:border-gray-500 rounded-2xl bg-gradient-to-br from-gray-50 to-white cursor-pointer flex items-center justify-center overflow-hidden transition-all duration-300 group"
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
                                                    className="absolute top-3 right-3 z-20  transition-all duration-200 transform hover:scale-110"
                                                    title="Clear image"
                                                >
                                                    <IoClose className="text-2xl text-gray-600" />
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
                            className="w-full max-w-6xl bg-white/95 backdrop-blur-sm border border-gray-200 mb-3 rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 animate-fade-in">
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
                                                <button
                                                    disabled={!latestPredictionId}
                                                    onClick={async () => {
                                                        setShowDermPicker(true);
                                                        // Load initial dermatologists list
                                                        setDermLoading(true);
                                                        try {
                                                            const res = await apiListDermatologists("", 10);
                                                            setDerms(res.data || []);
                                                        } catch (e) {
                                                            toast.error("Failed to load dermatologists");
                                                        } finally {
                                                            setDermLoading(false);
                                                        }
                                                    }}
                                                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    Review from Expert
                                                </button>
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
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    zIndex={10000}
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

            <DermatologistPicker
                isOpen={showDermPicker}
                onClose={() => setShowDermPicker(false)}
                derms={derms}
                loading={dermLoading}
                searchValue={dermSearch}
                onSearchChange={setDermSearch}
                onSearchClick={async () => {
                    setDermLoading(true);
                    try {
                        const res = await apiListDermatologists(dermSearch, 10);
                        setDerms(res.data || []);
                    } catch {
                        toast.error("Search failed");
                    } finally {
                        setDermLoading(false);
                    }
                }}
                onSelectDermatologist={async (d) => {
                    if (!latestPredictionId) {
                        toast.error("Missing prediction ID. Try analyzing again.");
                        return;
                    }
                    try {
                        await apiCreateReviewRequest({
                            predictionId: latestPredictionId,
                            dermatologistId: d.id || d._id,
                        });
                        toast.success("Review request sent!");
                        setShowDermPicker(false);
                    } catch (err) {
                        const code = err?.response?.status;
                        const msg = err?.response?.data?.error || err?.message || "Failed to create request";
                        if (code === 409) {
                            toast.error("Review already requested for this prediction and dermatologist.");
                        } else {
                            toast.error(msg);
                        }
                    }
                }}
            />
        </div>
    );
};

export default Analysis;