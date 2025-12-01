import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdEmail, MdLock, MdCheckCircle, MdArrowBack } from 'react-icons/md';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { BsEnvelopeCheck } from 'react-icons/bs';
import { RiLockPasswordLine } from 'react-icons/ri';
import { apiForgotPassword, apiVerifyOtp, apiResetPassword } from '../api/api';
import { validatePasswordRules, getPasswordRuleStatuses } from '../lib/passwordValidation';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); 
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('error');
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [passwordRules, setPasswordRules] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const specialCharsDisplay = "!@#$%^&*(),.?\":{}<>";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'newPassword') {
            const rules = getPasswordRuleStatuses(value);
            setPasswordRules(rules);
        }
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await apiForgotPassword({ email: formData.email });
            const data = response.data;

            if (response.status === 200 && data.message) {
                setMessage(data.message || 'Verification code sent to your email!');
                setMessageType('success');
                setStep(2);
                startCountdown();
            } else {
                setMessage(data.detail?.error || data.error || 'Email not found');
                setMessageType('error');
            }
        } catch (error) {
            const errMsg = error.response?.data?.detail?.error || error.response?.data?.error || error.response?.data?.message || 'An error occurred. Please try again.';
            setMessage(errMsg);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await apiVerifyOtp({ 
                email: formData.email, 
                otp: formData.code 
            });
            const data = response.data;

            if (response.status === 200 && data.message) {
                setMessage(data.message || 'Code verified successfully!');
                setMessageType('success');
                setStep(3);
            } else {
                setMessage(data.detail?.error || data.error || 'Invalid verification code');
                setMessageType('error');
            }
        } catch (error) {
            const errMsg = error.response?.data?.detail?.error || error.response?.data?.error || error.response?.data?.message || 'An error occurred. Please try again.';
            setMessage(errMsg);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('Passwords do not match!');
            setMessageType('error');
            return;
        }

        const passwordValidation = validatePasswordRules(formData.newPassword);
        if (!passwordValidation.isValid) {
            setMessage(passwordValidation.errors.join(' '));
            setMessageType('error');
            return;
        }

        setLoading(true);

        try {
            const response = await apiResetPassword({ 
                email: formData.email,
                otp: formData.code,
                newPassword: formData.newPassword 
            });
            const data = response.data;

            if (response.status === 200) {
                setStep(4);
            } else {
                setMessage(data.detail?.error || data.error || 'Password reset failed');
                setMessageType('error');
            }
        } catch (error) {
            const errMsg = error.response?.data?.detail?.error || error.response?.data?.error || error.response?.data?.message || 'An error occurred. Please try again.';
            setMessage(errMsg);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const startCountdown = () => {
        setCanResend(false);
        setCountdown(60);
        
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendCode = () => {
        if (canResend) {
            handleRequestReset({ preventDefault: () => {} });
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
            
            {/* Subtle Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate('/Login')}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 font-medium px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1 group"
            >
                <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="text-sm">Back to Login</span>
            </button>

            {/* Main Container */}
            <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden z-10">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
                    
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <RiLockPasswordLine className="text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                        <p className="text-sm text-gray-300">
                            {step === 1 && "Enter your email to receive a reset code"}
                            {step === 2 && "Enter the verification code sent to your email"}
                            {step === 3 && "Create your new password"}
                            {step === 4 && "Password reset successful!"}
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="px-8 pt-6">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((s) => (
                            <React.Fragment key={s}>
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300 ${
                                    step >= s 
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-110' 
                                        : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {step > s ? <MdCheckCircle className="text-xl" /> : s}
                                </div>
                                {s < 4 && (
                                    <div className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                                        step > s ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600 font-medium">
                        <span>Email</span>
                        <span>Code</span>
                        <span>Password</span>
                        <span>Done</span>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                    
                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <form onSubmit={handleRequestReset} className="space-y-5 animate-slide-in">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your registered email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm font-medium ${
                                    messageType === 'success'
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Verification Code */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-5 animate-slide-in">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Verification Code
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1"
                                    >
                                        <MdArrowBack className="block text-sm" />
                                        Change Email
                                    </button>
                                </div>
                                <div className="relative">
                                    <BsEnvelopeCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text" 
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm text-center text-2xl tracking-widest font-mono"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Code sent to: <span className="font-semibold">{formData.email}</span>
                                </p>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm font-medium ${
                                    messageType === 'success'
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>

                            {/* Resend Code and Change Email */}
                            <div className="flex items-center justify-between">
                                <div className="text-center flex-1">
                                    {canResend ? (
                                        <button
                                            type="button"
                                            onClick={handleResendCode}
                                            className="text-sm text-slate-900 font-semibold hover:underline"
                                        >
                                            Resend Code
                                        </button>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Resend code in <span className="font-semibold text-slate-900">{countdown}s</span>
                                        </p>
                                    )}
                                </div>
                                
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-5 animate-slide-in">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        required
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        required
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-xs font-medium text-gray-600 mb-2">Password Requirements:</p>
                                <div className="grid grid-cols-1 gap-1 text-xs">
                                    <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.length ? 'text-green-600' : 'text-red-500'}`}>
                                        <span className={`text-xs ${passwordRules.length ? 'text-green-600' : 'text-red-500'}`}>✓</span>
                                        At least 8 characters
                                    </div>
                                    <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                                        <span className={`text-xs ${passwordRules.uppercase ? 'text-green-600' : 'text-red-500'}`}>✓</span>
                                        One uppercase letter (A-Z)
                                    </div>
                                    <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                                        <span className={`text-xs ${passwordRules.lowercase ? 'text-green-600' : 'text-red-500'}`}>✓</span>
                                        One lowercase letter (a-z)
                                    </div>
                                    <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.number ? 'text-green-600' : 'text-red-500'}`}>
                                        <span className={`text-xs ${passwordRules.number ? 'text-green-600' : 'text-red-500'}`}>✓</span>
                                        One number (0-9)
                                    </div>
                                    <div className={`flex items-center gap-2 transition-colors duration-200 ${passwordRules.special ? 'text-green-600' : 'text-red-500'}`}>
                                        <span className={`text-xs ${passwordRules.special ? 'text-green-600' : 'text-red-500'}`}>✓</span>
                                        One special character ({specialCharsDisplay})
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm font-medium ${
                                    messageType === 'success'
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="text-center space-y-6 animate-scale-in py-8">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                                <div className="relative w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
                                        <MdCheckCircle className="text-green-500 text-6xl" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Password Reset Successful!
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Your password has been changed successfully.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/Login')}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Continue to Login
                            </button>
                        </div>
                    )}

                </div>

                {/* Footer */}
                {step < 4 && (
                    <div className="px-8 pb-8 text-center">
                        <p className="text-xs text-gray-500">
                            Remember your password?{' '}
                            <Link to="/Login" className="text-slate-900 font-semibold hover:underline">
                                Back to Login
                            </Link>
                        </p>
                    </div>
                )}
            </div>

            {/* Full Screen Loader */}
            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-lg flex items-center justify-center z-[9999] animate-fade-in">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 border-[6px] border-slate-100 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-20 h-20 border-[6px] border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-gray-700 font-medium">Processing...</p>
                    </div>
                </div>
            )}

            {/* Custom Animations */}
            <style>{`
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
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

                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .animate-slide-in {
                    animation: slide-in 0.4s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;