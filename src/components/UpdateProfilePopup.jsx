import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationCircle, FaTimes, FaUserEdit } from 'react-icons/fa';

const UpdateProfilePopup = ({ onClose, userRole }) => {
    const navigate = useNavigate();

    const handleUpdateProfile = () => {
        if (userRole === 'dermatologist') {
            navigate('/DProfile', { state: { autoEditBasic: true } });
        } else {
            navigate('/Profile', { state: { autoEditBasic: true } });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 p-3 rounded-full">
                            <FaExclamationCircle className="text-3xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Complete Your Profile</h2>
                            <p className="text-orange-100 text-sm">Action Required</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 text-base leading-relaxed mb-4">
                            Your profile is incomplete. Please update your information to get the most out of FacialDerma AI.
                        </p>
                        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
                            <p className="text-sm text-orange-800">
                                <strong>Why update?</strong> A complete profile helps us provide better personalized recommendations and improves your experience.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleUpdateProfile}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <FaUserEdit className="text-lg" />
                            Update Profile
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Later
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default UpdateProfilePopup;
