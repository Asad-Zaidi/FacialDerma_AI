import React, { useState, useEffect } from 'react';
import { FiDownload, FiShare2 } from 'react-icons/fi';
import { IoClose } from "react-icons/io5";
import { toast } from 'react-toastify';
import { apiGetTreatmentSuggestions } from '../api/api';
import { generatePdfReport, generatePdfReportBlob } from './PdfReportGenerator';

const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    date.setHours(date.getHours() + 5);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};

const PatientReviewModal = ({ open, onClose, loading, error, reviewData, currentUser = null }) => {
    const [allConditions, setAllConditions] = useState([]);

    useEffect(() => {
        const fetchTreatmentData = async () => {
            try {
                const response = await apiGetTreatmentSuggestions();
                setAllConditions(response.data || []);
            } catch (error) {
                console.error('Error fetching treatment suggestions:', error);
            }
        };
        fetchTreatmentData();
    }, []);

    if (!open) return null;

    const formatConfidence = (score) => {
        if (typeof score !== 'number') return '-';
        return `${(score * 100).toFixed(1)}%`;
    };

    const predictedLabel = reviewData?.prediction?.result?.predicted_label;

    // Find treatment data from API response
    const conditionData = allConditions.find(
        condition => condition.name.toLowerCase() === predictedLabel?.toLowerCase()
    );

    const recommendedTreatments = conditionData?.treatments || ["Consult a dermatologist for personalized advice."];
    const preventionTips = conditionData?.prevention || [];
    const resourcesLinks = conditionData?.resources || [];

    const handleDownloadPdf = async () => {
        if (!reviewData?.prediction) return;

        const patientSource = reviewData.patientInfo || currentUser || {};

        const predictionData = {
            predicted_label: reviewData.prediction.result?.predicted_label || 'N/A',
            confidence_score: reviewData.prediction.result?.confidence_score || 0,
            timestamp: formatDateTime(reviewData.prediction.createdAt),
            reportId: reviewData.prediction.reportId || reviewData.prediction.id || reviewData.prediction._id || reviewData.id || 'N/A'
        };

        const userData = {
            name: patientSource.name || patientSource.username || 'N/A',
            age: patientSource.age || 'N/A',
            gender: patientSource.gender || 'N/A',
            phone: patientSource.phone || 'N/A',
            bloodGroup: patientSource.bloodGroup || 'N/A',
            allergies: patientSource.allergies || 'None reported',
            dermatologist: reviewData.dermatologistInfo?.name || reviewData.dermatologistInfo?.username
                ? `Dr. ${reviewData.dermatologistInfo?.name || reviewData.dermatologistInfo?.username}`
                : 'Not Assigned'
        };

        const dermComment = reviewData.comment || null;

        await generatePdfReport(predictionData, { skin_conditions: allConditions }, userData, dermComment, true, reviewData.prediction?.imageUrl);
    };

    const handleSharePdf = async () => {
        if (!reviewData?.prediction) return;

        const patientSource = reviewData.patientInfo || currentUser || {};
        const predictionData = {
            predicted_label: reviewData.prediction.result?.predicted_label || 'N/A',
            confidence_score: reviewData.prediction.result?.confidence_score || 0,
            timestamp: formatDateTime(reviewData.prediction.createdAt),
            reportId: reviewData.prediction.reportId || reviewData.prediction.id || reviewData.prediction._id || reviewData.id || 'N/A'
        };

        const userData = {
            name: patientSource.name || patientSource.username || 'N/A',
            age: patientSource.age || 'N/A',
            gender: patientSource.gender || 'N/A',
            phone: patientSource.phone || 'N/A',
            bloodGroup: patientSource.bloodGroup || 'N/A',
            allergies: patientSource.allergies || 'None reported',
            dermatologist: reviewData.dermatologistInfo?.name || reviewData.dermatologistInfo?.username
                ? `Dr. ${reviewData.dermatologistInfo?.name || reviewData.dermatologistInfo?.username}`
                : 'Not Assigned'
        };

        const dermComment = reviewData.comment || null;

        const pdfBlob = await generatePdfReportBlob(predictionData, { skin_conditions: allConditions }, userData, dermComment, reviewData.prediction?.imageUrl);
        if (!pdfBlob) return;

        const file = new File([pdfBlob], `Dermatology_Report_${predictionData.reportId}_${userData.name.replace(/\s/g, '')}.pdf`, { type: 'application/pdf' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'Dermatology Report',
                    text: 'Your AI-assisted dermatology report.'
                });
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

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`flex items-center justify-between p-4 border-b ${reviewData?.status === 'rejected' ? 'bg-gradient-to-r from-red-50 to-pink-50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {reviewData?.status === 'rejected' ? 'Review Request Rejected' : 'Dermatologist Review'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {reviewData?.status === 'rejected' ? 'Your review request was not approved' : 'Your analysis has been reviewed'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {reviewData?.status !== 'rejected' && (
                            <>
                                <button
                                    onClick={handleDownloadPdf}
                                    className="px-3 py-1.5 rounded-md text-sm bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors flex items-center gap-2"
                                >
                                    <FiDownload className="w-4 h-4" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={handleSharePdf}
                                    className="px-3 py-1.5 rounded-md text-sm bg-green-600 hover:bg-green-700 text-white font-medium transition-colors flex items-center gap-2"
                                >
                                    <FiShare2 className="w-4 h-4" />
                                    Share
                                </button>
                            </>
                        )}
                        <button onClick={onClose}>
                            <IoClose className="text-gray-500 w-6 h-6 hover:text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {loading && (
                        <div className="flex items-center justify-center h-60">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">{error}</div>
                    )}

                    {!loading && !error && reviewData && (
                        <div className="space-y-6">
                            {/* Analysis Image and Results */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="w-full">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Uploaded Image</h4>
                                    <img
                                        src={reviewData.prediction?.imageUrl}
                                        alt="Your skin analysis"
                                        className="w-full h-60 object-contain bg-gray-50 rounded-lg border"
                                    />
                                    {reviewData.prediction?.createdAt && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Analysis Date: {formatDateTime(reviewData.prediction.createdAt)}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700">Predicted Condition</h4>
                                        <p className="text-xl font-bold text-gray-900 mt-1">{predictedLabel}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700">Confidence Score</h4>
                                        <p className="text-lg font-medium text-gray-800 mt-1">{formatConfidence(reviewData.prediction?.result?.confidence_score)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recommended Treatments */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h4 className="text-sm font-semibold text-blue-900 mb-2">Recommended Treatments</h4>
                                <ul className="space-y-1">
                                    {recommendedTreatments.map((treatment, idx) => (
                                        <li key={idx} className="text-sm text-blue-800 flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>{treatment}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Prevention Tips */}
                            {preventionTips.length > 0 && (
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                    <h4 className="text-sm font-semibold text-yellow-900 mb-2">Prevention Tips</h4>
                                    <ul className="space-y-1">
                                        {preventionTips.map((tip, idx) => (
                                            <li key={idx} className="text-sm text-yellow-800 flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Resources */}
                            {resourcesLinks.length > 0 && (
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h4 className="text-sm font-semibold text-green-900 mb-2">Helpful Resources</h4>
                                    <ul className="space-y-1">
                                        {resourcesLinks.map((res, idx) => {
                                            // If resource is a string in 'name: url' format, split and render properly
                                            if (typeof res === 'string') {
                                                // Try to split by ':' and check if the second part is a valid URL
                                                const parts = res.split(/:\s*/);
                                                if (parts.length === 2 && /^https?:\/\//.test(parts[1])) {
                                                    return (
                                                        <li key={idx} className="text-sm text-green-800">
                                                            <span>{parts[0]}: </span>
                                                            <a href={parts[1]} target="_blank" rel="noopener noreferrer" className="underline">{parts[1]}</a>
                                                        </li>
                                                    );
                                                } else if (/^https?:\/\//.test(res)) {
                                                    // Just a URL string
                                                    return (
                                                        <li key={idx} className="text-sm text-green-800">
                                                            <a href={res} target="_blank" rel="noopener noreferrer" className="underline">{res}</a>
                                                        </li>
                                                    );
                                                } else {
                                                    // Plain text
                                                    return (
                                                        <li key={idx} className="text-sm text-green-800">{res}</li>
                                                    );
                                                }
                                            } else if (typeof res === 'object' && res.url) {
                                                return (
                                                    <li key={idx} className="text-sm text-green-800">
                                                        {res.name ? <span>{res.name}: </span> : null}
                                                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="underline">{res.url}</a>
                                                    </li>
                                                );
                                            } else {
                                                return (
                                                    <li key={idx} className="text-sm text-green-800">{String(res)}</li>
                                                );
                                            }
                                        })}
                                    </ul>
                                </div>
                            )}

                            {/* Dermatologist Information */}
                            {reviewData.dermatologistInfo && (
                                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
                                    <h4 className="text-sm font-semibold text-green-900 mb-3">Reviewed By</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-green-800 w-20">Name:</span>
                                            <span className="text-sm text-green-900">{reviewData.dermatologistInfo.name || reviewData.dermatologistInfo.username || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-green-800 w-20">Email:</span>
                                            <span className="text-sm text-green-900">{reviewData.dermatologistInfo.email || 'N/A'}</span>
                                        </div>
                                        {reviewData.reviewedAt && (
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-green-800 w-20">Date:</span>
                                                <span className="text-sm text-green-900">{formatDateTime(reviewData.reviewedAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Rejection Status Banner */}
                            {reviewData.status === 'rejected' && (
                                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <h4 className="text-sm font-semibold text-red-900 mb-1">Review Request Not Approved</h4>
                                            <p className="text-sm text-red-800">The dermatologist was unable to approve this review request. Please see their explanation below.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Dermatologist's Comment/Reason */}
                            {reviewData.comment && (
                                <div className={`p-4 rounded-lg border-2 ${reviewData.status === 'rejected' ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-200'}`}>
                                    <h4 className={`text-sm font-semibold mb-2 ${reviewData.status === 'rejected' ? 'text-red-900' : 'text-yellow-900'}`}>
                                        {reviewData.status === 'rejected'
                                            ? 'Reason for Rejection'
                                            : `Dr. ${reviewData.dermatologistInfo?.name || reviewData.dermatologistInfo?.username || 'Dermatologist'}'s Comment`
                                        }
                                    </h4>
                                    <p className={`text-sm whitespace-pre-wrap ${reviewData.status === 'rejected' ? 'text-red-900' : 'text-yellow-900'}`}>
                                        {reviewData.comment}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientReviewModal;
