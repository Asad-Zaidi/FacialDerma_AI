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
            setErrorMessage('Access token is missing. Please log in again.');
            return;
        }

        if (!image) {
            setErrorMessage('Please upload an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        setIsLoading(true);
        setPrediction(null);
        setErrorMessage(null);
        setShowResult(false);

        try {
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to analyze the image.');
            const data = await response.json();
            setPrediction(data);
            setShowResult(true);

            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 300);

            await fetch('http://localhost:5000/api/analysis/save', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    result: {
                        predicted_label: data.predicted_label,
                        confidence_score: data.confidence_score,
                    },
                    image_url: data.image_url,
                }),
            });

            toast.success('Prediction saved successfully!');
        } catch (error) {
            console.error('Error during image analysis:', error);
            setErrorMessage('Image analysis failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
