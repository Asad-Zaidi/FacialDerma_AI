// import React, { useState, useEffect } from 'react';
// import treatmentSuggestions from '../Assets/treatmentSuggestions.json';

// const formatDateTime = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   let hours = date.getHours();
//   const minutes = String(date.getMinutes()).padStart(2, '0');
//   const seconds = String(date.getSeconds()).padStart(2, '0');
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   hours = hours % 12 || 12;
//   hours = String(hours).padStart(2, '0');
//   return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
// };

// const ReviewPreviewModal = ({ open, onClose, loading, error, prediction, onSubmitComment, onRejectRequest }) => {
//   const [comment, setComment] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [rejecting, setRejecting] = useState(false);

//   useEffect(() => {
//     if (prediction?.comment) {
//       setComment(prediction.comment);
//     } else {
//       setComment('');
//     }
//   }, [prediction]);

//   if (!open) return null;

//   const formatConfidence = (score) => {
//     if (typeof score !== 'number') return '-';
//     return `${(score * 100).toFixed(1)}%`;
//   };

//   const handleSubmit = async () => {
//     if (!comment.trim()) return;
//     setSubmitting(true);
//     try {
//       await onSubmitComment(comment);
//       alert('Review submitted successfully!');
//       onClose();
//     } catch (err) {
//       console.error('Failed to submit comment:', err);
//       alert('Failed to submit review. Please try again.');
//       setSubmitting(false);
//     }
//   };

//   const handleReject = async () => {
//     if (!comment.trim()) {
//       alert('Please provide a reason for rejection');
//       return;
//     }
//     if (!window.confirm('Are you sure you want to reject this review request? The patient will be notified.')) {
//       return;
//     }
//     setRejecting(true);
//     try {
//       await onRejectRequest(comment);
//       alert('Review request rejected successfully!');
//       onClose();
//     } catch (err) {
//       console.error('Failed to reject request:', err);
//       alert('Failed to reject request. Please try again.');
//       setRejecting(false);
//     }
//   };

//   const isReviewed = prediction?.status === 'reviewed';
//   const isRejected = prediction?.status === 'rejected';
  
//   // Get recommended treatment from frontend JSON
//   const predictedLabel = prediction?.prediction?.result?.predicted_label;
//   const recommendedTreatment = treatmentSuggestions[predictedLabel] || ["Consult a dermatologist for personalized advice."];

//   return (
//     <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
//       <div
//         className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between p-4 border-b bg-gray-50">
//           <div>
//             <h3 className="text-lg font-semibold">Patient Analysis Review</h3>
//             {prediction?.patientName && (
//               <p className="text-sm text-gray-600">Patient: {prediction.patientName}</p>
//             )}
//           </div>
//           <button onClick={onClose} className="px-3 py-1.5 rounded-md text-sm bg-gray-200 hover:bg-gray-300 font-medium">Close</button>
//         </div>

//         <div className="p-6 overflow-y-auto flex-1">
//           {loading && (
//             <div className="flex items-center justify-center h-60">
//               <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin"></div>
//             </div>
//           )}

//           {!loading && error && (
//             <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">{error}</div>
//           )}

//           {!loading && !error && prediction && (
//             <div className="space-y-6">
//               {/* Image and Analysis Results */}
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="w-full">
//                   <h4 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Image</h4>
//                   <img
//                     src={prediction.prediction?.imageUrl}
//                     alt="Uploaded by patient"
//                     className="w-full h-80 object-contain bg-gray-50 rounded-lg border"
//                   />
//                   {prediction.prediction?.createdAt && (
//                     <p className="text-xs text-gray-500 mt-2">
//                       Date: {formatDateTime(prediction.prediction.createdAt)}
//                     </p>
//                   )}
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="text-sm font-semibold text-gray-700">Predicted Condition</h4>
//                     <p className="text-xl font-bold text-gray-900 mt-1">{prediction.prediction?.result?.predicted_label}</p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-semibold text-gray-700">Confidence Score</h4>
//                     <p className="text-lg font-medium text-gray-800 mt-1">{formatConfidence(prediction.prediction?.result?.confidence_score)}</p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommended Treatment</h4>
//                     <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
//                       {recommendedTreatment?.map((item, idx) => (
//                         <li key={idx}>{item}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               {/* Comment Section */}
//               <div className="border-t pt-4">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   {isReviewed ? 'Your Review Comment' : isRejected ? 'Rejection Reason' : 'Add Your Professional Comment'}
//                 </label>
//                 <textarea
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   disabled={isReviewed || isRejected || submitting || rejecting}
//                   placeholder={isRejected ? "Reason for rejection..." : "Enter your professional review and recommendations for the patient..."}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   rows="5"
//                 />
//                 {!isReviewed && !isRejected && (
//                   <div className="flex gap-3 mt-3">
//                     <button
//                       onClick={handleSubmit}
//                       disabled={!comment.trim() || submitting || rejecting}
//                       className="flex-1 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       {submitting ? 'Approving...' : 'Approve & Submit Review'}
//                     </button>
//                     <button
//                       onClick={handleReject}
//                       disabled={!comment.trim() || submitting || rejecting}
//                       className="flex-1 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       {rejecting ? 'Rejecting...' : 'Reject Request'}
//                     </button>
//                   </div>
//                 )}
//                 {isReviewed && (
//                   <p className="mt-2 text-sm text-green-600 font-medium">✓ Review already submitted and approved</p>
//                 )}
//                 {isRejected && (
//                   <p className="mt-2 text-sm text-red-600 font-medium">✗ This review request was rejected</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewPreviewModal;


import React, { useState, useEffect } from 'react';
import treatmentSuggestions from '../Assets/treatmentSuggestions.json';

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  hours = String(hours).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};

const ReviewPreviewModal = ({ open, onClose, loading, error, prediction, onSubmitComment, onRejectRequest }) => {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    if (prediction?.comment) {
      setComment(prediction.comment);
    } else {
      setComment('');
    }
  }, [prediction]);

  if (!open) return null;

  const formatConfidence = (score) => {
    if (typeof score !== 'number') return '-';
    return `${(score * 100).toFixed(1)}%`;
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await onSubmitComment(comment);
      alert('Review submitted successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to submit comment:', err);
      alert('Failed to submit review. Please try again.');
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    if (!window.confirm('Are you sure you want to reject this review request? The patient will be notified.')) {
      return;
    }
    setRejecting(true);
    try {
      await onRejectRequest(comment);
      alert('Review request rejected successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to reject request:', err);
      alert('Failed to reject request. Please try again.');
      setRejecting(false);
    }
  };

  const isReviewed = prediction?.status === 'reviewed';
  const isRejected = prediction?.status === 'rejected';

  const predictedLabel = prediction?.prediction?.result?.predicted_label;

  // New JSON handling: find condition in treatmentSuggestions JSON
  const conditionData = treatmentSuggestions.skin_conditions?.find(
    cond => cond.name.toLowerCase() === predictedLabel?.toLowerCase()
  );

  const recommendedTreatment = conditionData?.treatments || ["Consult a dermatologist for personalized advice."];
  const preventionTips = conditionData?.prevention || [];
  const resources = conditionData?.resources || [];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div>
            <h3 className="text-lg font-semibold">Patient Analysis Review</h3>
            {prediction?.patientName && (
              <p className="text-sm text-gray-600">Patient: {prediction.patientName}</p>
            )}
          </div>
          <button onClick={onClose} className="px-3 py-1.5 rounded-md text-sm bg-gray-200 hover:bg-gray-300 font-medium">Close</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading && (
            <div className="flex items-center justify-center h-60">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">{error}</div>
          )}

          {!loading && !error && prediction && (
            <div className="space-y-6">
              {/* Image and Analysis Results */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="w-full">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Image</h4>
                  <img
                    src={prediction.prediction?.imageUrl}
                    alt="Uploaded by patient"
                    className="w-full h-80 object-contain bg-gray-50 rounded-lg border"
                  />
                  {prediction.prediction?.createdAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Date: {formatDateTime(prediction.prediction.createdAt)}
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
                    <p className="text-lg font-medium text-gray-800 mt-1">{formatConfidence(prediction.prediction?.result?.confidence_score)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommended Treatment</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {recommendedTreatment?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {preventionTips.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Prevention Tips</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {preventionTips.map((tip, idx) => <li key={idx}>{tip}</li>)}
                      </ul>
                    </div>
                  )}
                  {resources.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Helpful Resources</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {resources.map((res, idx) => <li key={idx}>{res}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Comment Section */}
              <div className="border-t pt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {isReviewed ? 'Your Review Comment' : isRejected ? 'Rejection Reason' : 'Add Your Professional Comment'}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={isReviewed || isRejected || submitting || rejecting}
                  placeholder={isRejected ? "Reason for rejection..." : "Enter your professional review and recommendations for the patient..."}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  rows="5"
                />
                {!isReviewed && !isRejected && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={handleSubmit}
                      disabled={!comment.trim() || submitting || rejecting}
                      className="flex-1 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? 'Approving...' : 'Approve & Submit Review'}
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={!comment.trim() || submitting || rejecting}
                      className="flex-1 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {rejecting ? 'Rejecting...' : 'Reject Request'}
                    </button>
                  </div>
                )}
                {isReviewed && (
                  <p className="mt-2 text-sm text-green-600 font-medium">✓ Review already submitted and approved</p>
                )}
                {isRejected && (
                  <p className="mt-2 text-sm text-red-600 font-medium">✗ This review request was rejected</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPreviewModal;
