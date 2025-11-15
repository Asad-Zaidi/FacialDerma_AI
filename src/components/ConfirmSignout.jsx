import React from "react";
import { PiWarningCircleLight } from "react-icons/pi";
import { MdLogout, MdClose } from "react-icons/md";
import { BsShieldExclamation } from "react-icons/bs";

const ConfirmSignOut = ({ onConfirm, onCancel }) => {
    const handleConfirmLogout = () => {
        onConfirm(); // Call the original logout function
        window.location.reload(); // Refresh the page
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in">
            {/* Modal Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                
                {/* Decorative Top Bar */}
                <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
                
                {/* Close Button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                    aria-label="Close"
                >
                    <MdClose className="text-xl" />
                </button>

                {/* Content */}
                <div className="p-8 text-center">
                    
                    {/* Icon with Animation */}
                    <div className="relative inline-block mb-6">
                        {/* Pulsing Background Circle */}
                        <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                        
                        {/* Static Background Circle */}
                        <div className="relative w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                                <PiWarningCircleLight className="text-red-500 text-5xl" />
                            </div>
                        </div>
                    </div>

                    {/* Heading */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Logout Confirmation
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-2">
                        Are you sure you want to logout from your account?
                    </p>
                    <p className="text-gray-500 text-xs mb-8 flex items-center justify-center gap-1.5">
                        <BsShieldExclamation className="text-base" />
                        You'll need to sign in again to access your account
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Logout Button - UPDATED */}
                        <button
                            onClick={handleConfirmLogout}
                            className="flex-1 group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <MdLogout className="text-lg" />
                                Yes, Logout
                            </span>
                            <div className="absolute inset-0 bg-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </button>

                        {/* Cancel Button */}
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Additional Info */}
                    <p className="text-xs text-gray-400 mt-4">
                        Your session will be ended and you'll be redirected to the home page
                    </p>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
            `}</style>
        </div>
    );
};

export default ConfirmSignOut;