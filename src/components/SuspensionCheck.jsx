import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MdBlock } from 'react-icons/md';
import { BsShieldExclamation } from 'react-icons/bs';

const SuspensionCheck = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is suspended
        if (user && user.isSuspended) {
            // Don't redirect immediately, show the suspended message
            return;
        }
    }, [user]);

    // If user is suspended, show suspension screen
    if (user && user.isSuspended) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4 z-[9999]">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[scaleIn_0.3s_ease]">
                    {/* Decorative Top Bar */}
                    <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
                    
                    {/* Content */}
                    <div className="p-8 text-center">
                        {/* Icon with Animation */}
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                            <div className="relative w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
                                    <MdBlock className="text-red-500 text-6xl" />
                                </div>
                            </div>
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Account Suspended
                        </h2>
                        
                        {/* Description */}
                        <p className="text-gray-600 text-base mb-2">
                            Your account has been suspended by an administrator.
                        </p>
                        <p className="text-gray-500 text-sm mb-8 flex items-center justify-center gap-2">
                            <BsShieldExclamation className="text-lg" />
                            You cannot access your account at this time
                        </p>

                        {/* User Info */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm text-gray-600 mb-1">
                                <strong className="text-gray-800">Account:</strong> {user.email}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong className="text-gray-800">Role:</strong> {user.role}
                            </p>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Need help?</strong> Please contact our support team at{' '}
                                <a href="mailto:support@facialdermaai.com" className="underline font-semibold">
                                    support@facialdermaai.com
                                </a>
                            </p>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Custom Animations */}
                <style jsx>{`
                    @keyframes scaleIn {
                        from {
                            opacity: 0;
                            transform: scale(0.9);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                `}</style>
            </div>
        );
    }

    // If not suspended, render children normally
    return <>{children}</>;
};

export default SuspensionCheck;
