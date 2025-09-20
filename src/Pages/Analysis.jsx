import React, { useState, useContext, useEffect, useRef } from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/Analysis.css';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoonLoader } from 'react-spinners';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
// import { IoClose } from "react-icons/io5";
import suggestionsData from '../Assets/treatmentSuggestions.json';

const Analysis = () => {
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [treatmentSuggestions, setTreatmentSuggestions] = useState({});
    const { accessToken } = useContext(AuthContext);
    const resultRef = useRef(null);

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
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('Image size must be under 5MB.');
            return;
        }

        setImage(file);
        setErrorMessage(null);
        setPrediction(null);
        setShowResult(false);
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

    try {
        const response = await fetch('http://localhost:5000/api/predictions/predict', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            const backendError = data.error || 'Image analysis failed. Please try again.';
            setErrorMessage(backendError);
            toast.error(backendError);
            return;
        }

        setPrediction(data);
        setShowResult(true);

        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);

        toast.success('Prediction successful!');
    } catch (error) {
        console.error('Error during image analysis:', error);
        const errMsg = error.message || 'Something went wrong during analysis.';
        setErrorMessage(errMsg);
        toast.error(errMsg);
    } finally {
        setIsLoading(false);
    }
};
const handleRetry = () => {
    setImage(null);
    setPrediction(null);
    setErrorMessage(null);
    setShowResult(false);
};

    return (
        <div className="analysis-wrapper">
            <div className="analysis-content">
                <Header />
                <div className="analysis-header">
                    <h1>Facial Skin Analysis Dashboard</h1>
                </div>

                <div className="analysis-dashboard">
                    <section className="upload-section">
                        <div className="description-section">
                            <h1>Upload Your Photo</h1>
                            <p className="description">Take a clear, well-lit photo of your face without makeup. For best results, capture your face straight-on in natural lighting.</p>
                            <div className="instructions">
                                <p><IoMdCheckmarkCircleOutline color="#22C55E" size={24} />Use natural lighting</p>
                                <p><IoMdCheckmarkCircleOutline color="#22C55E" size={24} />Remove makeup</p>
                                <p><IoMdCheckmarkCircleOutline color="#22C55E" size={24} />Face the camera directly</p>
                            </div>
                        </div>

                        <div className="upload-container">
                            {/* <IoClose color="#22C55E" size={30} alignSelf="right" className="close-btn" onClick={handleRetry} /> */}
                                <label className="upload-box">
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                                {image ? (
                                    <img src={URL.createObjectURL(image)} alt="Preview" className="preview-image" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <FiUpload color="#666" size={35} />
                                        <p>Drag and drop your image here or <br /> click to browse</p>
                                    </div>
                                )}
                            </label> 
                            {errorMessage && (
                                <div className="error-box">
                                    <p className="error-message">{errorMessage}</p>
                                    <button className="retry-btn" onClick={handleRetry}>Retry</button>
                                </div>
                            )}  

                            <div className="button-container">
                                <button
                                    className="upload-btn"
                                    onClick={() => document.querySelector('input[type="file"]').click()}
                                >
                                    Upload
                                </button>
                                <button
                                    className="analyze-btn"
                                    onClick={handleAnalyzeClick}
                                    disabled={!image || isLoading}
                                >
                                    Analyze
                                </button>
                            </div>
                        </div>
                    </section>

                    {isLoading && (
                        <div className="loading-overlay">
                            <MoonLoader color="#E11584" size={100} />
                        </div>
                    )}

                    {showResult && (
                        <section ref={resultRef} className="result-section fade-in">
                            <div className="result-box">
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                {prediction && (
                                    <>
                                        <h3>Predicted Disease: {prediction.predicted_label}</h3>
                                        <p>Confidence: {(prediction.confidence_score * 100).toFixed(2)}%</p>
                                    </>
                                )}
                            </div>
                            <div className="suggestion-box">
                                {prediction?.predicted_label && (
                                    <>
                                        <h4>Treatment Suggestions:</h4>
                                        <ul>
                                            {(treatmentSuggestions[prediction.predicted_label] || []).map((tip, idx) => (
                                                <li key={idx}>{tip}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                <Footer />
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};

export default Analysis;
