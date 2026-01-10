import React, { useState, useRef, useEffect } from 'react';
import { MdEmail, MdVerifiedUser, MdClose } from 'react-icons/md';
import { apiVerifyEmailOTP, apiResendVerificationEmail } from '../api/api';

const EmailVerificationOTPModal = ({ show, onClose, email, onVerificationSuccess }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef([]);

    // Start 60-second cooldown when modal opens
    useEffect(() => {
        if (show) {
            setResendCooldown(60);
        }
    }, [show]);

    // Cooldown timer for resend button
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        // Handle paste
        if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then(text => {
                const digits = text.replace(/\D/g, '').slice(0, 6).split('');
                const newOtp = [...otp];
                digits.forEach((digit, i) => {
                    if (i < 6) newOtp[i] = digit;
                });
                setOtp(newOtp);
                if (digits.length > 0) {
                    const lastIndex = Math.min(digits.length - 1, 5);
                    inputRefs.current[lastIndex]?.focus();
                }
            });
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text');
        const digits = pasteData.replace(/\D/g, '').slice(0, 6).split('');
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
            if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        if (digits.length > 0) {
            const lastIndex = Math.min(digits.length - 1, 5);
            inputRefs.current[lastIndex]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiVerifyEmailOTP({ email, otp: otpCode });
            setSuccess(response.data.message || 'Email verified successfully!');
            setIsVerified(true);
            
            // Wait a moment then close and notify parent
            setTimeout(() => {
                if (onVerificationSuccess) {
                    onVerificationSuccess();
                }
                onClose();
            }, 2000);

        } catch (err) {
            const errorMsg = err.response?.data?.detail?.error || 
                           err.response?.data?.error || 
                           err.response?.data?.message || 
                           'Verification failed. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setResendLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiResendVerificationEmail({ email });
            const successMsg = response.data.message || 'Verification code sent! Check your email.';
            setSuccess(successMsg);
            setResendCooldown(60); // 60 second cooldown
            setOtp(['', '', '', '', '', '']); // Clear OTP inputs
            
            // Clear success message after 3 seconds to keep inputs enabled
            setTimeout(() => {
                setSuccess('');
            }, 3000);
            
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        } catch (err) {
            const errorMsg = err.response?.data?.detail?.error || 
                           err.response?.data?.error || 
                           'Failed to resend code. Please try again.';
            setError(errorMsg);
        } finally {
            setResendLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                {/* Decorative top bar */}
                <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>

                <div className="p-8 relative">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                    >
                        <MdClose size={24} />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                            {success ? (
                                <MdVerifiedUser className="w-10 h-10 text-green-600" />
                            ) : (
                                <MdEmail className="w-10 h-10 text-blue-600" />
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
                        Verify Your Email
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 text-sm text-center mb-6 leading-relaxed">
                        We've sent a verification link and a 6-digit OTP code to
                        <br />
                        <span className="font-semibold text-gray-800">"{email}"</span>
                        <br />
                        <span className="text-sm block">
                            Click the link in your email to verify, or enter the OTP code below
                        </span>
                    </p>

                    {/* OTP Input */}
                    <div className="flex justify-center gap-2 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                disabled={loading || isVerified}
                                className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg
                                    ${error ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:outline-none transition-colors
                                    disabled:bg-gray-100 disabled:cursor-not-allowed`}
                            />
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-600 text-sm text-center">{success}</p>
                        </div>
                    )}

                    {/* Verify Button */}
                    <button
                        onClick={handleVerify}
                        disabled={loading || otp.join('').length !== 6 || isVerified}
                        className={`w-full py-3 px-6 font-semibold rounded-xl transition-all duration-200 shadow-lg
                            ${loading || otp.join('').length !== 6 || isVerified
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-102'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Verifying...
                            </span>
                        ) : isVerified ? (
                            'Verified ✓'
                        ) : (
                            'Verify Email'
                        )}
                    </button>

                    {/* Resend Code */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            Didn't receive the code?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={resendLoading || resendCooldown > 0 || isVerified}
                            className={`text-sm font-semibold transition-colors
                                ${resendLoading || resendCooldown > 0 || isVerified
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-blue-600 hover:text-blue-700'
                                }`}
                        >
                            {resendLoading ? (
                                'Sending...'
                            ) : resendCooldown > 0 ? (
                                `Resend in ${resendCooldown}s`
                            ) : (
                                'Resend Code'
                            )}
                        </button>
                    </div>

                    {/* Note */}
                    <p className="mt-6 text-xs text-gray-500 text-center">
                        The verification code expires in 10 minutes
                    </p>
                </div>
            </div>

            <style>{`
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
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }

                .hover\\:scale-102:hover {
                    transform: scale(1.02);
                }
            `}</style>
        </div>
    );
};

export default EmailVerificationOTPModal;
