import React, { useState, useContext, useEffect } from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/Analysis.css';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoonLoader } from 'react-spinners';

const Analysis = () => {
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(image);
            }
        };
    }, [image]);

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
    };

    // const handleAnalyzeClick = async () => {
    //     if (!accessToken) {
    //         setErrorMessage('Access token is missing. Please log in again.');
    //         return;
    //     }

    //     if (!image) {
    //         setErrorMessage('Please upload an image first.');
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('image', image);

    //     setIsLoading(true);
    //     setPrediction(null);
    //     setErrorMessage(null);

    //     try {
    //         const response = await fetch('http://localhost:5000/api/analysis/predict', {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //             },
    //             body: formData,
    //         });

    //         if (!response.ok) throw new Error('Failed to analyze the image.');

    //         const data = await response.json();
    //         setPrediction(data);

    //         await fetch('http://localhost:5000/api/analysis/save', {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 result: {
    //                     predicted_label: data.predicted_label,
    //                     confidence_score: data.confidence_score,
    //                 },
    //                 image_url: data.image_url,
    //             }),
    //         });

    //         toast.success('Prediction saved successfully!');
    //     } catch (error) {
    //         console.error('Error during image analysis:', error);
    //         setErrorMessage('Image analysis failed. Please try again.');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleAnalyzeClick = async () => {
        if (!accessToken) {
            console.error('Access token is missing. Please login again.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        setIsLoading(true);
        setPrediction(null);

        try {
            // 1. Send image to Flask
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to analyze the image.');
            const data = await response.json();

            // 2. Show result on UI
            setPrediction(data);

            // 3. Save result to Node.js backend
            await fetch('http://localhost:5000/api/analysis/save', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
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

            console.log('Saved result:', data);

        } catch (error) {
            console.error('Error during image analysis:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="analysis-wrapper">
            <Header />
            <div className="analysis-header">
                <h1>Facial Skin Analysis Dashboard</h1>
            </div>

            <main className="analysis-dashboard">
                <section className="upload-section">
                    <h2>Upload Image</h2>
                    <p>Upload a clear photo of your face for AI analysis</p>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <label className="upload-box">
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="preview-image"
                            />
                        ) : (
                            <div className="upload-placeholder">
                                <span>&#8682;</span>
                                <p>Drag and drop your image here or <br /> click to browse</p>
                                <button className="select-btn">Select Image</button>
                            </div>
                        )}
                    </label>
                    <div className="button-group">
                        <label htmlFor="upload-input" className="upload-btn">
                            Upload
                            <input
                                id="upload-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                        <button
                            className="analyze-btn"
                            onClick={handleAnalyzeClick}
                            disabled={!image || isLoading}
                        >
                            {isLoading ? 'Analyzing...' : 'Analyze'}
                        </button>
                    </div>
                    {isLoading && <div className="loading-spinner"></div>}
                </section>

                <section className="result-section">
                    <h2>Analysis Results</h2>
                    <p>Upload a clear photo of your face for AI analysis</p>
                    {/* Moon add Loader */}
                    
                    <label className="result-box">

                    </label>
                    
                </section>
                {/* <section className="result-section">
                    {isLoading ? (
                        <div className="loading-spinner"></div>
                    ) : prediction ? (
                        <div className="result-box">
                            <h3>Prediction: {prediction.predicted_label}</h3>
                            <p>Confidence: {(prediction.confidence_score * 100).toFixed(2)}%</p>
                            <img
                                src={`http://localhost:8000${prediction.image_url}`}
                                alt="Analyzed"
                                className="analyzed-image"
                            />
                        </div>
                    ) : (
                        <div className="result-placeholder">
                            <span>&#9432;</span>
                            <p>Upload a photo and click 'Analyze Skin' to get started</p>
                        </div>
                    )}
                </section> */}

            </main>

            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Analysis;
