import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiVerifyEmail } from '../api/api';
import { MdCheckCircle, MdError, MdHourglassEmpty } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('Verifying your email...');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            
            if (!token) {
                setStatus('error');
                setMessage('Verification token is missing. Please check your email link.');
                return;
            }

            try {
                console.log('Attempting to verify email with token:', token);
                const response = await apiVerifyEmail(token);
                
                // Log the complete response for debugging
                console.log('Email verification response:', response);
                console.log('Response status:', response.status);
                console.log('Response data:', response.data);
                
                // Check if response is successful (status 200 or 201)
                // Axios returns response with data property, so check both ways
                if (response.status === 200 || response.status === 201 || response.data) {
                    console.log('Email verification successful!');
                    setStatus('success');
                    const successMsg = response.data?.message || 'Email verified successfully! You can now log in to your account.';
                    setMessage(successMsg);
                    
                    // Start countdown for redirect
                    const interval = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(interval);
                                navigate('/Login');
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);

                    return () => clearInterval(interval);
                } else {
                    // Unexpected status code
                    console.warn('Unexpected response status:', response.status);
                    setStatus('error');
                    setMessage('Email verification encountered an issue. Please try again.');
                }
                
            } catch (error) {
                console.error('Email verification error caught:', error);
                console.error('Error response:', error.response);
                
                const errorStatus = error.response?.status;
                const errorData = error.response?.data;
                let errorMsg = errorData?.detail?.error || errorData?.error || errorData?.message || 'Email verification failed.';
                
                console.log('Error status:', errorStatus, 'Error message:', errorMsg);
                
                // Provide specific messages for common errors
                if (errorStatus === 404) {
                    // 404 can mean: token already used (already verified) or invalid token
                    // Since token is deleted after verification, 404 likely means it was already verified
                    errorMsg = 'This verification link has already been used. Your email was verified previously. You can now log in.';
                    setStatus('success');
                    
                    // Treat as success and redirect to login
                    setTimeout(() => navigate('/Login'), 3000);
                    return;
                } else if (errorStatus === 400) {
                    if (errorMsg.toLowerCase().includes('expired')) {
                        errorMsg = 'Verification link has expired. Please request a new verification email.';
                    } else if (errorMsg.toLowerCase().includes('already verified')) {
                        errorMsg = 'Your email is already verified. You can proceed to login.';
                        setStatus('success');
                        
                        // Still redirect to login for already verified users
                        setTimeout(() => navigate('/Login'), 3000);
                        return;
                    }
                }
                
                setStatus('error');
                setMessage(errorMsg);
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    const handleLoginRedirect = () => {
        navigate('/Login');
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
            {/* Background Image with Blur */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070')`,
                }}
            >
                <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl"></div>
            </div>

            {/* Additional Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-900/20"></div>

            {/* Main Container */}
            <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden z-10">
                
                {/* Header with Branding */}
                <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center animate-pulse">
                            <HiSparkles className="text-xl" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">FacialDerma</h1>
                            <p className="text-xs text-gray-300">AI-Powered Skincare</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Status Icon */}
                    <div className="flex justify-center mb-6">
                        {status === 'loading' && (
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                                <MdHourglassEmpty className="text-4xl text-blue-600 animate-spin" />
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                                <MdCheckCircle className="text-4xl text-green-600" />
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <MdError className="text-4xl text-red-600" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
                        {status === 'loading' && 'Verifying Email'}
                        {status === 'success' && 'Email Verified!'}
                        {status === 'error' && 'Verification Failed'}
                    </h2>

                    {/* Message */}
                    <p className="text-center text-gray-600 text-sm leading-relaxed mb-6">
                        {message}
                    </p>

                    {/* Action Buttons */}
                    {status === 'success' && (
                        <div className="space-y-3">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                                <p className="text-xs text-blue-800">
                                    Redirecting to login in <span className="font-bold">{countdown}</span> seconds...
                                </p>
                            </div>
                            <button
                                onClick={handleLoginRedirect}
                                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                Go to Login
                                <FaArrowRight className="text-sm" />
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-3">
                            <button
                                onClick={handleLoginRedirect}
                                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                Go to Login
                                <FaArrowRight className="text-sm" />
                            </button>
                            <button
                                onClick={() => navigate('/Signup')}
                                className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                Try Registering Again
                            </button>
                        </div>
                    )}

                    {status === 'loading' && (
                        <div className="flex justify-center">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
