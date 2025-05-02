import React, { useState, useContext } from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/Analysis.css';
import { AuthContext } from '../contexts/AuthContext';

const Analysis = () => {
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const { accessToken } = useContext(AuthContext);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleAnalyzeClick = () => {
        if (!accessToken) {
            console.error('Access token is missing. Please login again.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        fetch('http://localhost:8000/api/auth/analyze/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to analyze the image.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Prediction Result:', data);
                setPrediction(data);
            })
            .catch((error) => {
                console.error('Error during image analysis:', error);
            });
    };

    return (
        <div className="analysis-page">
            <div className="background-layer" />
            <div className="foreground-content">
                <Header />
                <div className="analysis-container">
                    <h2 className="analysis-title">Upload Image for Analysis</h2>

                    <label className="uploadbox">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {image ? (
                            <img src={URL.createObjectURL(image)} alt="Preview" className="preview-image" />
                        ) : (
                            <span>Click or Drag & Drop an image</span>
                        )}
                    </label>

                    <div className="button-container">
                        <label className="add-from-file-btn">
                            <span>Add from File</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>


                        <button
                            className="analyze-btn"
                            onClick={handleAnalyzeClick}
                            disabled={!image}
                        >
                            Analyze
                        </button>
                    </div>

                    {prediction && (
                        <div className="prediction-result">
                            <h3>Prediction: {prediction.predicted_label}</h3>
                            <p>Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Analysis;
