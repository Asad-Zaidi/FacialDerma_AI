// import React, { useState, useContext } from 'react';
// import Header from '../Nav_Bar/Header';
// import Footer from '../Nav_Bar/Footer';
// import '../Styles/Analysis.css';
// import { AuthContext } from '../contexts/AuthContext';

// const Analysis = () => {
//     const [image, setImage] = useState(null);
//     const [prediction, setPrediction] = useState(null);
//     const { accessToken } = useContext(AuthContext);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImage(file);
//         }
//     };

//     const handleAnalyzeClick = () => {
//         if (!accessToken) {
//             console.error('Access token is missing. Please login again.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('image', image);

//         fetch('http://localhost:8000/api/auth/analyze/', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//             },
//             body: formData,
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to analyze the image.');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('Prediction Result:', data);
//                 setPrediction(data);
//             })
//             .catch((error) => {
//                 console.error('Error during image analysis:', error);
//             });
//     };

//     return (
//         <div className="analysis-wrapper">
//             <Header />
//             <div className="analysis-header">
//                 <h1>Skin Analysis</h1>
//             </div>
//             <main className="analysis-dashboard">
//                 <section className="upload-section">
//                     <h2>Upload Image</h2>
//                     <p>Upload a clear photo of your face for AI analysis</p>
//                     <label className="upload-box">
//                         <input type="file" accept="image/*" onChange={handleImageChange} />
//                         {image ? (
//                             <img src={URL.createObjectURL(image)} alt="Preview" className="preview-image" />
//                         ) : (
//                             <div className="upload-placeholder">
//                                 <span>&#8682;</span>
//                                 <p>Drag and drop your image here or <br /> click to browse</p>
//                                 <button className="select-btn">Select Image</button>
//                             </div>
//                         )}
//                     </label>
//                     <button
//                         className="analyze-btn"
//                         onClick={handleAnalyzeClick}
//                         disabled={!image}
//                     >
//                         Analyze Skin
//                     </button>
//                 </section>

//                 <section className="result-section">
//                     <h2>Analysis Results</h2>
//                     {prediction ? (
//                         <div className="result-box">
//                             <h3>Prediction: {prediction.predicted_label}</h3>
//                             <p>Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
//                         </div>
//                     ) : (
//                         <div className="result-placeholder">
//                             <span>&#9432;</span>
//                             <p>Upload a photo and click 'Analyze Skin' to get started</p>
//                         </div>
//                     )}
//                 </section>
//             </main>
//             <Footer />
//         </div>
//     );
// };

// export default Analysis;

import React, { useState, useContext } from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/Analysis.css';
import { AuthContext } from '../contexts/AuthContext';

const Analysis = () => {
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { accessToken } = useContext(AuthContext);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

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
            const response = await fetch('http://localhost:8000/api/auth/analyze/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to analyze the image.');

            const data = await response.json();
            console.log('Prediction Result:', data);
            setPrediction(data);
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
                <h1>Skin Analysis</h1>
            </div>
            <main className="analysis-dashboard">
                <section className="upload-section">
                    <h2>Upload Image</h2>
                    <p>Upload a clear photo of your face for AI analysis</p>
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
                    <button
                        className="analyze-btn"
                        onClick={handleAnalyzeClick}
                        disabled={!image || isLoading}
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Skin'}
                    </button>
                </section>

                <section className="result-section">
                    <h2>Analysis Results</h2>
                    {isLoading ? (
                        <div className="loading-spinner"></div>
                    ) : prediction ? (
                        <div className="result-box">
                            <h3>Prediction: {prediction.predicted_label}</h3>
                            <p>Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
                        </div>
                    ) : (
                        <div className="result-placeholder">
                            <span>&#9432;</span>
                            <p>Upload a photo and click 'Analyze Skin' to get started</p>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Analysis;
