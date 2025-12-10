import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import NearestDermatologyMap from '../components/NearestDermatologyMap';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoonLoader } from 'react-spinners';
import { FaMapLocationDot, FaCheck } from 'react-icons/fa6';
import { FiUpload, FiDownload, FiShare2, FiMapPin, FiChevronDown } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdOutlineInfo, MdHistory } from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";
import { AiOutlineWarning } from "react-icons/ai";
import suggestionsData from '../Assets/treatmentSuggestions.json';
import Treatment from '../components/Treatment';
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
import DiseaseLikelihood from '../components/DiseaseLikelihood';

const Analysis = () => {
    const { accessToken, user } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [treatmentSuggestions, setTreatmentSuggestions] = useState({});
    const [uploadProgress, setUploadProgress] = useState(0);
    const [analysisStep, setAnalysisStep] = useState('');
    const [showMap, setShowMap] = useState(false);
    const resultRef = useRef(null);
    const fileInputRef = useRef(null);
    const [showDermPicker, setShowDermPicker] = useState(false);
    const [derms, setDerms] = useState([]);
    const [dermSearch, setDermSearch] = useState("");
    const [dermLoading, setDermLoading] = useState(false);
    const [latestPredictionId, setLatestPredictionId] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [reviewData, setReviewData] = useState(null);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiGetFullProfile();
                setUserProfile(response.data);


                const reviewsResponse = await apiGetReviewRequests();
                if (reviewsResponse?.data && reviewsResponse.data.length > 0) {

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

        return () => {
            if (image) URL.revokeObjectURL(image);
        };
    }, [image]);

    useEffect(() => {
        setTreatmentSuggestions(suggestionsData);
    }, []);

    const getTreatmentData = useCallback(
        (disease) => {
            if (!disease || !treatmentSuggestions) return null;
            const list = treatmentSuggestions.skin_conditions;
            if (!Array.isArray(list)) return null;
            const target = list.find(
                (item) => String(item?.name || '').toLowerCase().trim() === String(disease).toLowerCase().trim()
            );
            return target || null;
        },
        [treatmentSuggestions]
    );

    useEffect(() => {
        console.log("treatmentSuggestions loaded:", treatmentSuggestions);
        console.log(
            "matched condition for",
            prediction?.predicted_label,
            ":",
            getTreatmentData(prediction?.predicted_label)
        );
    }, [prediction, treatmentSuggestions, getTreatmentData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;


        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            setErrorMessage('Only JPG, JPEG, or PNG images are allowed.');
            toast.error('Invalid image format. Please upload a JPG, JPEG, or PNG file.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setErrorMessage('Image size must be under 10MB.');
            toast.error('Image size must be under 10MB.');
            return;
        }

        setImage(file);
        setErrorMessage(null);
        setPrediction(null);
        setShowResult(false);
        setShowMap(false);
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
        setShowMap(false);
        setUploadProgress(0);
        setAnalysisStep('Initializing...');

        const stepInterval = simulateAnalysisSteps();

        console.log('Sending prediction request...');

        try {
            const response = await apiUpload(formData);
            const data = response.data;
            console.log('Response data:', data);
            clearInterval(stepInterval);

            setPrediction({
                predicted_label: data.predicted_label,
                confidence_score: data.confidence_score,
                all_probabilities: data.all_probabilities,
                timestamp: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                reportId: data.report_id
            });
            setShowResult(true);
            setUploadProgress(100);
            setAnalysisStep('Analysis complete!');

            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: "nearest" });
            }, 300);

            toast.success('Prediction successful and saved!');
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


                let backendError = errorData.detail || errorData.error;

                if (typeof backendError === 'object' && backendError !== null) {

                    if (backendError.error) {
                        errMsg = backendError.error;
                    } else if (backendError.message) {
                        errMsg = backendError.message;
                    } else {

                        const firstValue = Object.values(backendError)[0];
                        errMsg = typeof firstValue === 'string' ? firstValue : 'Image analysis failed. Please try again.';
                    }
                } else if (backendError) {

                    errMsg = String(backendError);
                } else {

                    errMsg = `Image analysis failed with status ${error.response.status}.`;
                }
            } else if (error.request) {
                errMsg = 'No response from the server. Check your network connection.';
            } else {
                errMsg = error.message || 'Something went wrong during analysis.';
            }

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
        setShowMap(false);
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
        setShowMap(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.info('Image cleared');
    };

    const handleDownloadReport = async () => {
        if (!prediction) return;

        const userDataWithDerm = {
            ...(userProfile || user),
            dermatologist: reviewData?.dermatologistUsername
                ? `Dr. ${reviewData.dermatologistUsername}`
                : 'Not Assigned'
        };

        const dermComment = reviewData?.comment || null;
        await generatePdfReport(prediction, treatmentSuggestions, userDataWithDerm, dermComment);
    };

    const handleShareResults = async () => {
        if (!prediction) return;

        const userDataWithDerm = {
            ...(userProfile || user),
            dermatologist: reviewData?.dermatologistUsername
                ? `Dr. ${reviewData.dermatologistUsername}`
                : 'Not Assigned'
        };
        const dermComment = reviewData?.comment || null;
        const pdfBlob = await generatePdfReportBlob(prediction, treatmentSuggestions, userDataWithDerm, dermComment);
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

    const handleToggleMap = () => {
        setShowMap(prevShowMap => !prevShowMap);
    };

    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">

            <Header />
            <div className="relative z-10 flex flex-col min-h-screen">

                <div className="flex flex-col justify-center items-center mt-6 px-4 mb-2">
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

                <div className="flex flex-col items-center gap-8 px-4 md:px-12 lg:px-24 py-2 w-full">
                    <section className="w-full max-w-6xl bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 transition-all duration-300 hover:shadow-2xl">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                            <div className="w-full lg:w-6/12 flex flex-col justify-start items-start text-left space-y-4">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">
                                        Upload Your Photo
                                    </h2>
                                </div>
                                <p className="text-gray-600 font-bold text-xs md:text-sm leading-relaxed">
                                    For accurate skin analysis, Please follow the guidelines below to capture a high-quality facial photograph.
                                </p>

                                <div className="space-y-2.5 pt-2 w-full bg-green-50 p-2.5 rounded-lg border border-green-200">
                                    <div className="flex items-start gap-2.5">
                                        <FaCheck className="text-green-500 text-lg md:text-xl flex-shrink-0 mt-0.5" />
                                        <p className="text-xs md:text-sm text-gray-700">
                                            <span className="font-semibold">Natural Lighting:</span> Use daylight or bright indoor lighting, avoid harsh shadows
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <FaCheck className="text-green-500 text-lg md:text-xl flex-shrink-0 mt-0.5" />
                                        <p className="text-xs md:text-sm text-gray-700">
                                            <span className="font-semibold">No Makeup:</span> Remove all cosmetics, moisturizers, and skincare products
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <FaCheck className="text-green-500 text-lg md:text-xl flex-shrink-0 mt-0.5" />
                                        <p className="text-xs md:text-sm text-gray-700">
                                            <span className="font-semibold">Front-Facing:</span> Position your face directly toward the camera at eye level
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <FaCheck className="text-green-500 text-lg md:text-xl flex-shrink-0 mt-0.5" />
                                        <p className="text-xs md:text-sm text-gray-700">
                                            <span className="font-semibold">Clear & Sharp:</span> Ensure the image is in focus and not blurry
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <FaCheck className="text-green-500 text-lg md:text-xl flex-shrink-0 mt-0.5" />
                                        <p className="text-xs md:text-sm text-gray-700">
                                            <span className="font-semibold">Neutral Expression:</span> Keep a relaxed, neutral facial expression
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 w-full">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 flex gap-2">
                                        <MdOutlineInfo className="text-blue-600 text-lg flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-800 leading-relaxed">
                                            <span className="font-semibold">Supported Formats:</span> JPG, PNG, JPEG • Maximum file size: 10MB
                                        </p>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex gap-2">
                                        <AiOutlineWarning className="text-amber-600 text-lg flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-800 leading-relaxed">
                                            <span className="font-semibold">Privacy:</span> Your images are processed securely and not stored permanently
                                        </p>
                                    </div>
                                </div>
                            </div>

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

                                                <div className="absolute bottom-3 left-3 z-20 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                    {(image.size / 1024).toFixed(0)} KB
                                                </div>

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
                                                <p className="text-xs text-gray-400 mt-2">JPG, PNG, JPEG (Max 10MB)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>

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

                                <div className="flex flex-wrap gap-3 justify-center">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-2.5 px-4 rounded-full transition-all duration-300 text-xs md:text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <FiUpload className="text-sm" />
                                        Upload
                                    </button>

                                    {/* <button
                                        onClick={handleCameraCapture}
                                        className="bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-semibold py-2.5 px-4 rounded-full transition-all duration-300 text-xs md:text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <FaCamera className="text-sm" />
                                        Camera
                                    </button> */}
                                    <button
                                        onClick={handleAnalyzeClick}
                                        disabled={!image || isLoading}
                                        className={`font-semibold py-2.5 px-4 rounded-full transition-all duration-300 text-xs md:text-sm shadow-md flex items-center gap-2 ${!image || isLoading
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

                    {showResult && (
                        <section
                            ref={resultRef}
                            className="w-full max-w-6xl bg-white/95 backdrop-blur-sm border border-gray-200 mb-8 rounded-2xl shadow-xl p-6 md:px-8 lg:px-10 animate-fade-in">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">✓</span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                                        Analysis Complete
                                    </h3>
                                </div>
                                {/* <div className="flex gap-2">
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
                                </div> */}
                            </div>

                            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">

                                <div className="w-full lg:w-6/12 flex flex-col justify-center items-start space-y-4 pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-8">
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
                                                <div>
                                                    <p className="mt-2 text-md font-semibold text-gray-600 inline-block border-b-2 border-gray-700">
                                                        Detected Condition:
                                                    </p>
                                                    <div className="text-center">
                                                        <p className="inline-block border-b-2 border-gray-700 text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-950 text-center mt-4 mb-2">
                                                        {prediction.predicted_label}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-600">Confidence Level</span>
                                                        <span className={`font-bold ${
                                                            prediction.confidence_score >= 0.8
                                                                ? 'text-green-600'
                                                                : prediction.confidence_score >= 0.5
                                                                ? 'text-amber-600'
                                                                : 'text-red-600'
                                                        }`}>
                                                            {(prediction.confidence_score * 100).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-grow bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-1000 shadow-lg ${prediction.confidence_score >= 0.8
                                                                        ? 'bg-gradient-to-r from-green-500 via-green-600 to-green-700'
                                                                        : prediction.confidence_score >= 0.5
                                                                            ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700'
                                                                            : 'bg-gradient-to-r from-red-500 via-red-600 to-red-700'
                                                                    }`}
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

                                                {/* Disease Likelihood Analysis */}
                                                {prediction?.all_probabilities && (
                                                    <DiseaseLikelihood
                                                        prediction={prediction}
                                                    />
                                                )}

                                                <div className="flex flex-col gap-3 mt-5">
                                                    <p className="text-md text-gray-600">Want Review from an Expert?</p>
                                                    <button
                                                        disabled={!latestPredictionId}
                                                        onClick={async () => {
                                                            setShowDermPicker(true);

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
                                                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 w-full sm:w-auto"
                                                    >
                                                        Get Review
                                                    </button>
                                                </div>

                                                {/* Download/Share Buttons */}
                                                <div className="flex flex-col gap-3 mt-5">
                                                    <p className="text-md text-gray-600">Download or share your Report:</p>
                                                    <div className="flex justify-center gap-2">
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
                                            </div>

                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 w-full">
                                                <AiOutlineWarning className="text-amber-600 text-lg flex-shrink-0 mt-0.5" />
                                                <p className="text-xs text-amber-800 leading-relaxed">
                                                    <span className="font-semibold">Medical Disclaimer:</span> This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult a certified dermatologist for accurate diagnosis and treatment.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="w-full lg:w-6/12 flex flex-col justify-start items-start space-y-4">
                                    {/* {prediction?.predicted_label && (
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
                                                {(getTreatmentData(prediction?.predicted_label)?.treatments || []).map((tip, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 bg-gradient-to-r from-gray-50 to-white p-3.5 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-100 hover:border-gray-300 hover:shadow-md group">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-500 text-white rounded-full flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform duration-200">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="leading-relaxed pt-0.5">{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 rounded-xl w-full mt-4 shadow-lg">
                                                <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                                    <BsShieldCheck /> Next Steps
                                                </h5>
                                                <p className="text-xs leading-relaxed opacity-90">
                                                    Schedule a consultation with a dermatologist for personalized treatment. Download your PDF report to share with your healthcare provider.
                                                </p>
                                            </div>
                                        </>
                                    )} */}
                                    <Treatment prediction={prediction} />

                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                    <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3 md:mb-0 flex items-center gap-2">
                                        Find a Nearby Face Care Centre
                                        <FaMapLocationDot className="inline text-red-600 text-xl md:text-2xl" />
                                    </h3>
                                    <button
                                        onClick={handleToggleMap}
                                        className="w-full md:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 text-xs md:text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        aria-expanded={showMap}
                                        aria-controls="map-container">
                                        <FiMapPin className="text-base" />
                                        <span>{showMap ? 'Hide Nearby Map' : 'Show Nearby Map'}</span>
                                        <FiChevronDown
                                            className={`text-base transition-transform duration-300 ${showMap ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                </div>

                                {showMap && (
                                    <div id="map-container" className="animate-fade-in rounded-lg overflow-hidden shadow-lg border border-gray-200">
                                        <NearestDermatologyMap />
                                    </div>
                                )}
                            </div>

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