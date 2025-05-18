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