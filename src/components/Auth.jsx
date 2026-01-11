import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft, FaClinicMedical } from 'react-icons/fa';
import { MdEmail, MdLock, MdPerson, MdCheckCircle, MdOutlineDateRange, MdSettings } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { GrLicense } from "react-icons/gr";
import { useAuth } from '../contexts/AuthContext';
import { apiLogin, apiSignUp } from "../api/api";
import { apiCheckUsername } from "../api/api";
import { validatePasswordRules } from '../lib/passwordValidation';
import DropDown from './ui/DropDown';
import EmailVerificationOTPModal from './EmailVerificationOTPModal';

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const isLogin = location.pathname === '/Login';

    // Specialization options for dermatologists
    const specializationOptions = [
        { value: 'Medical Dermatology', label: 'Medical Dermatology' },
        { value: 'Surgical Dermatology', label: 'Surgical Dermatology' },
        { value: 'Dermatopathology', label: 'Dermatopathology' },
        { value: 'Pediatric Dermatology', label: 'Pediatric Dermatology' },
        { value: 'Cosmetic Dermatology', label: 'Cosmetic Dermatology' },
        { value: 'Immunodermatology', label: 'Immunodermatology' },
        { value: 'Other', label: 'Other' },
    ];

    // States
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        license: '',
        specialization: '',
        customSpecialization: '',
        clinic: '',
        experience: '',
    });
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('error');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [usernameCheck, setUsernameCheck] = useState({ checking: false, available: null, message: '' });
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [pendingMessage, setPendingMessage] = useState('');
    const [signupStep, setSignupStep] = useState(1);
    const [showCustomSpecialization, setShowCustomSpecialization] = useState(false);
    const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState('');

    // Hard-block any native form submissions anywhere on this page (capture phase)
    useEffect(() => {
        const preventNativeSubmit = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.nativeEvent) {
                e.nativeEvent.preventDefault();
                if (e.nativeEvent.stopImmediatePropagation) {
                    e.nativeEvent.stopImmediatePropagation();
                }
            }
        };

        window.addEventListener('submit', preventNativeSubmit, true);

        return () => window.removeEventListener('submit', preventNativeSubmit, true);
    }, []);

    const isDermSignup = !isLogin && role === 'dermatologist';

    useEffect(() => {
        if (formData.password.length === 0 && formData.confirmPassword.length === 0) {
            setPasswordsMatch(null);  // neutral state, no error message
        } else if (formData.confirmPassword.length === 0) {
            setPasswordsMatch(null);  // neutral if confirm password is empty
        } else {
            setPasswordsMatch(formData.password === formData.confirmPassword);
        }
    }, [formData.password, formData.confirmPassword]);

    // Clear messages when switching between login and signup
    useEffect(() => {
        setMessage('');
        setMessageType('error');
        setSignupStep(1);
    }, [isLogin]);

    // Auto-clear messages after 5 seconds (only for success messages)
    useEffect(() => {
        if (message && messageType === 'success') {
            const timer = setTimeout(() => {
                setMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, messageType]);

    // Reset steps when role changes
    useEffect(() => {
        setSignupStep(1);
    }, [role]);

    // Debounced username availability check (signup only)
    useEffect(() => {
        if (isLogin) return; // only on signup
        const username = formData.username?.trim();
        if (!username) {
            setUsernameCheck({ checking: false, available: null, message: '' });
            return;
        }

        setUsernameCheck(prev => ({ ...prev, checking: true, message: '' }));
        const timer = setTimeout(async () => {
            try {
                const res = await apiCheckUsername(username);
                const available = !!res.data?.available;
                setUsernameCheck({ checking: false, available, message: available ? 'Username is available' : 'Username is already taken' });
            } catch (err) {
                setUsernameCheck({ checking: false, available: null, message: 'Unable to check the username' });
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [formData.username, isLogin]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Show custom specialization field if "Other" is selected
        if (name === 'specialization') {
            setShowCustomSpecialization(value === 'Other');
            if (value !== 'Other') {
                setFormData(prev => ({ ...prev, customSpecialization: '' }));
            }
        }
    };

    // Multi-step helpers for dermatologist signup
    const canProceedStep1 = Boolean(formData.username.trim() && formData.name.trim() && formData.email.trim() && usernameCheck.available !== false);
    const experienceValue = Number(formData.experience);
    const hasPositiveExperience = Number.isFinite(experienceValue) && experienceValue > 0;
    const experienceInvalid = formData.experience !== '' && !hasPositiveExperience;
    const canProceedStep2 = Boolean(
        formData.license.trim() && 
        formData.specialization.trim() && 
        hasPositiveExperience &&
        (formData.specialization !== 'Other' || formData.customSpecialization.trim())
    );

    const handleDermStepForward = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.nativeEvent) {
                e.nativeEvent.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
            }
        }

        if (signupStep === 1 && !canProceedStep1) {
            setMessage('Please provide name, username, and email to continue.');
            setMessageType('error');
            return;
        }
        if (signupStep === 2 && !canProceedStep2) {
            setMessage('License number, specialization, and experience (greater than 0) are required.');
            setMessageType('error');
            return;
        }
        setMessage('');
        setMessageType('error');
        setSignupStep(prev => Math.min(3, prev + 1));
    };

    const handleDermStepBack = () => {
        setMessage('');
        setSignupStep(prev => Math.max(1, prev - 1));
    };

    const handleDermSubmit = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.nativeEvent) {
                e.nativeEvent.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
            }
        }

        if (signupStep < 3) {
            handleDermStepForward(e);
            return false;
        }
        return handleSignupSubmit(e);
    };

    // Login Handler
    // ---------------------------
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent any default form behavior
        if (e && e.nativeEvent) {
            e.nativeEvent.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
        }
        
        setMessage('');
        setLoading(true);

        const payload = {
            emailOrUsername: formData.email,
            password: formData.password,
        };

        console.log('🔐 Login attempt with:', { emailOrUsername: payload.emailOrUsername });
        console.log('%c💡 TIP: Enable "Preserve log" in your browser console to keep logs after navigation', 'color: #00a8ff; font-weight: bold;');

        try {
            const response = await apiLogin(payload);
            const data = response.data;

            console.log('✅ Login response received:', { 
                hasToken: !!data?.token, 
                hasUser: !!data?.user, 
                role: data?.user?.role 
            });

            // Thorough validation of response structure
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response from server');
            }

            if (!data.token || typeof data.token !== 'string' || data.token.trim() === '') {
                throw new Error('Invalid token received');
            }

            if (!data.user || typeof data.user !== 'object') {
                throw new Error('Invalid user data received');
            }

            if (!data.user.email || !data.user.username || !data.user.role) {
                throw new Error('Incomplete user data received');
            }

            // Only proceed if all validations pass
            console.log('✅ Login successful, redirecting now...');

            // Store credentials
            login(data.token, data.user);

            // Navigate immediately based on role
            if (data.user.role === 'patient') {
                navigate('/Profile');
            } else if (data.user.role === 'dermatologist') {
                navigate('/Dermatologist');
            } else if (data.user.role === 'admin') {
                navigate('/Admin');
            }

            setLoading(false);
            return;
        } catch (error) {
            console.error('❌ Login error caught:', error);
            
            const status = error.response?.status;
            const errorData = error.response?.data;
            let errMsg = errorData?.error || errorData?.detail?.error || errorData?.message || error.message || 'Invalid credentials';

            // Ensure errMsg is a string
            if (typeof errMsg === 'object') {
                errMsg = errMsg.message || errMsg.error || JSON.stringify(errMsg) || 'An error occurred';
            }

            console.error('❌ Login error details:', { 
                status, 
                errMsg, 
                errorData,
                fullError: error 
            });

            // Handle 403 Forbidden errors (access denied)
            if (status === 403) {
                const errMsgLower = errMsg.toLowerCase();

                // Email not verified
                if (errMsgLower.includes('email') && errMsgLower.includes('verif')) {
                    setUnverifiedEmail(formData.email);
                    setShowEmailVerificationModal(true);
                    return;
                }
                // Pending admin approval
                else if (errMsgLower.includes('pending') && errMsgLower.includes('approval')) {
                    setPendingMessage('Your account is pending admin approval. You will receive an email once your credentials are verified by our team. This usually takes 24-48 hours.');
                    setShowPendingModal(true);
                    return;
                }
                // Account rejected
                else if (errMsgLower.includes('rejected')) {
                    setMessage(errMsg);
                    setMessageType('error');
                }
                // Needs admin verification
                else if (errMsgLower.includes('admin verification') || errMsgLower.includes('needs verification')) {
                    setMessage('Your account needs admin verification. Please complete your profile or contact support.');
                    setMessageType('error');
                }
                // Account suspended
                else if (errMsgLower.includes('suspended')) {
                    setMessage(errMsg);
                    setMessageType('error');
                }
                // Generic 403
                else {
                    setMessage(errMsg || 'Access denied. Please contact support.');
                    setMessageType('error');
                }
            }
            // Handle 401 Unauthorized (invalid credentials)
            else if (status === 401) {
                const errorMsg = errMsg || 'Invalid email/username or password.';
                console.log('⚠️ Setting error message:', errorMsg);
                setMessage(errorMsg);
                setMessageType('error');
            }
            // Other errors
            else {
                const errorMsg = errMsg || 'Login failed. Please try again.';
                console.log('⚠️ Setting error message:', errorMsg);
                setMessage(errorMsg);
                setMessageType('error');
            }
        } finally {
            console.log('🔄 Finally block - setting loading to false');
            setLoading(false);
        }
    };

    // ---------------------------
    // Signup Handler
    // ---------------------------
    const handleSignupSubmit = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.nativeEvent) {
                e.nativeEvent.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
            }
        }
        setMessage('');

        if (!role) {
            setMessage('Please select a role.');
            setMessageType('error');
            return;
        }

        // Password strength validation
        const passwordValidation = validatePasswordRules(formData.password);
        if (!passwordValidation.isValid) {
            setMessage(passwordValidation.errors.join(' '));
            setMessageType('error');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match!');
            setMessageType('error');
            return;
        }

        setLoading(true);

        // Determine final specialization value
        const finalSpecialization = formData.specialization === 'Other' 
            ? formData.customSpecialization 
            : formData.specialization;

        const payload = {
            role: role,
            name: formData.name || undefined,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            ...(role === 'dermatologist' && formData.license && { license: formData.license }),
            ...(role === 'dermatologist' && finalSpecialization && { specialization: finalSpecialization }),
            ...(role === 'dermatologist' && formData.clinic && { clinic: formData.clinic }),
            ...(role === 'dermatologist' && formData.experience && { experience: formData.experience }),
        };

        try {
            const response = await apiSignUp(payload); // <-- using apiSignUp

            console.log('Signup successful:', response);

            // Show email verification message
            setMessage('Registration successful! Please check your email to verify your account.');
            setMessageType('success');
            setLoading(false);

            // Redirect to login after user reads the message (6 seconds to give them time)
            setTimeout(() => {
                navigate('/Login');
            }, 6000);

        } catch (error) {
            let errMsg = error.response?.data?.detail?.error || error.response?.data?.error || error.response?.data?.message || 'Signup failed';

            // Ensure errMsg is a string
            if (typeof errMsg === 'object') {
                errMsg = errMsg.message || errMsg.error || JSON.stringify(errMsg) || 'An error occurred';
            }

            setMessage(errMsg);
            setMessageType('error');
            setLoading(false);
        }
    };

    const handleSubmit = isLogin ? handleLoginSubmit : handleSignupSubmit;

    const handleFormSubmit = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.nativeEvent) {
                e.nativeEvent.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
            }
        }
        const handler = isDermSignup ? handleDermSubmit : handleSubmit;
        return handler(e);
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

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 font-medium px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1 group"
            >
                <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="text-sm">Back to Home</span>
            </button>

            {/* Main Container */}
            <div className="relative w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-[1fr_1.2fr] z-10">

                {/* Left Side - Branding */}
                <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-slate-800 via-slate-900 to-black p-10 text-white relative overflow-hidden">
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center animate-pulse">
                                <HiSparkles className="text-xl" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">FacialDerma</h1>
                                <p className="text-xs text-gray-300">AI-Powered Skincare</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold leading-tight">
                                Advanced Skin Analysis at Your Fingertips
                            </h2>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Join thousands of users who trust our AI-powered platform for accurate diagnostics and personalized treatment.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-3">
                        <h3 className="text-sm font-semibold text-white mb-3">Password Requirements</h3>
                        <div className="space-y-2">
                            <div className={`flex items-center gap-2 transition-colors duration-200 ${formData.password.length >= 8 ? 'text-green-400' : 'text-gray-400'}`}>
                                <MdCheckCircle className="flex-shrink-0 text-xs" />
                                <span className="text-xs">At least 8 characters</span>
                            </div>
                            <div className={`flex items-center gap-2 transition-colors duration-200 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`}>
                                <MdCheckCircle className="flex-shrink-0 text-xs" />
                                <span className="text-xs">One uppercase letter (A-Z)</span>
                            </div>
                            <div className={`flex items-center gap-2 transition-colors duration-200 ${/[a-z]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`}>
                                <MdCheckCircle className="flex-shrink-0 text-xs" />
                                <span className="text-xs">One lowercase letter (a-z)</span>
                            </div>
                            <div className={`flex items-center gap-2 transition-colors duration-200 ${/\d/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`}>
                                <MdCheckCircle className="flex-shrink-0 text-xs" />
                                <span className="text-xs">One number (0-9)</span>
                            </div>
                            <div className={`flex items-center gap-2 transition-colors duration-200 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'}`}>
                                <MdCheckCircle className="flex-shrink-0 text-xs" />
                                <span className="text-xs">One special character</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 flex flex-col justify-center bg-white/80 backdrop-blur-sm relative">

                    {/* Mobile Logo */}
                    <div className="md:hidden flex items-center justify-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center animate-pulse">
                            <HiSparkles className="text-white text-lg" />
                        </div>
                        <span className="text-lg font-bold">FacialDerma</span>
                    </div>

                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </h2>
                        <p className="text-gray-500 text-xs">
                            {isLogin
                                ? 'Enter your credentials to access your account'
                                : 'Start your journey to healthier skin'
                            }
                        </p>
                    </div>

                    {/* Simple Tab Switcher */}
                    <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => navigate('/Login')}
                            className={`flex-1 py-2 px-4 rounded-md text-xs font-medium transition-colors duration-200 ${isLogin
                                ? 'bg-gray-900 text-gray-300 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/Signup')}
                            className={`flex-1 py-2 px-4 rounded-md text-xs font-medium transition-colors duration-200 ${!isLogin
                                ? 'bg-gray-900 text-gray-300 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Sign up
                        </button>
                    </div>

                    {/* Role Selection - Only for Signup */}
                    {!isLogin && (
                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                Register as
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: 'patient', label: 'Patient' },
                                    { value: 'dermatologist', label: 'Doctor' }
                                ].map(option => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-2 cursor-pointer select-none pl-8"
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={option.value}
                                            checked={role === option.value}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="sr-only"
                                        />

                                        {/* Custom radio circle */}
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
            ${role === option.value ? "border-slate-900 bg-slate-900" : "border-gray-400"}
        `}
                                        >
                                            {role === option.value && (
                                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                            )}
                                        </div>

                                        {/* Label text */}
                                        <span className="text-sm font-medium text-gray-700">
                                            {option.label}
                                        </span>
                                    </label>

                                ))}
                            </div>
                        </div>
                    )}                    {/* Form */}
                    <div
                        role="form"
                        className={isLogin ? "space-y-6" : "space-y-4"}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.nativeEvent) {
                                    e.nativeEvent.preventDefault();
                                    e.nativeEvent.stopImmediatePropagation();
                                }
                                handleFormSubmit(e);
                            }
                        }}
                    >

                        {/* Login View */}
                        {isLogin && (
                            <>
                                <div className="relative animate-slide-down">
                                    <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="
                                            w-full pl-10 pr-3 py-3
                                            border border-gray-300 rounded-lg
                                            focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                            outline-none transition-all text-sm bg-white peer
                                        "
                                    />
                                    <label
                                        className={`
                                            absolute left-10 bg-white px-1 pointer-events-none
                                            text-gray-500 transition-all duration-200
                                            ${formData.email
                                                ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                            }
                                        `}
                                    >
                                        Email or Username
                                    </label>
                                </div>

                                <div className="relative">
                                    <div className="relative">
                                        <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />

                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="
                                                w-full pl-10 pr-10 py-3
                                                border border-gray-300 rounded-lg
                                                focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                outline-none transition-all text-sm bg-white peer
                                            "
                                        />

                                        <button
                                            type="button"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                                        >
                                            {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                        </button>

                                        <label
                                            className={`
                                                absolute left-10 bg-white px-1 pointer-events-none
                                                text-gray-500 transition-all duration-200
                                                ${formData.password
                                                    ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                    : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                }
                                            `}
                                        >
                                            Password
                                        </label>
                                    </div>

                                    <div className="mt-2 text-right">
                                        <Link
                                            to="/forgot-password"
                                            className="text-xs text-slate-700 hover:text-slate-900 font-medium hover:underline transition-colors"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    {isLogin && message && messageType === 'error' && (
                                        <p className="mt-2 text-xs text-red-700 font-medium animate-slide-down">
                                            {message}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Signup View */}
                        {!isLogin && (
                            <>
                                {isDermSignup && (
                                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                                        <span>Step {signupStep} of 3</span>
                                        <span className="text-gray-400">Dermatologist registration</span>
                                    </div>
                                )}

                                {/* Dermatologist multi-step */}
                                {isDermSignup ? (
                                    <>
                                        {signupStep === 1 && (
                                            <div className="space-y-3 animate-slide-down">
                                                <div>
                                                    <div className="relative">
                                                        <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            required
                                                            className="
                                                                w-full pl-10 pr-3 py-3
                                                                border border-gray-300 rounded-lg
                                                                focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                                outline-none transition-all text-sm bg-white peer
                                                            "
                                                        />
                                                        <label
                                                            className={`
                                                                absolute left-10 bg-white px-1 pointer-events-none
                                                                text-gray-500 transition-all duration-200
                                                                ${formData.name
                                                                    ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                                    : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                                }
                                                            `}
                                                        >
                                                            Full Name
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="relative">
                                                        <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />
                                                        <input
                                                            type="text"
                                                            name="username"
                                                            value={formData.username}
                                                            onChange={handleChange}
                                                            required
                                                            className={`
                                                                w-full pl-10 pr-3 py-3
                                                                border border-gray-300 rounded-lg
                                                                focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                                outline-none transition-all text-sm bg-white peer
                                                                ${usernameCheck.available === false ? 'border-red-500' : usernameCheck.available === true ? 'border-green-500' : ''}
                                                            `}
                                                        />
                                                        <label
                                                            className={`
                                                                absolute left-10 bg-white px-1 pointer-events-none
                                                                text-gray-500 transition-all duration-200
                                                                ${formData.username
                                                                    ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                                    : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                                }
                                                            `}
                                                        >
                                                            Username
                                                        </label>
                                                    </div>
                                                    <div className="mt-1 text-xs min-h-[16px] leading-4">
                                                        {formData.username && (
                                                            <>
                                                                {usernameCheck.checking ? (
                                                                    <span className="text-gray-500">Checking availability...</span>
                                                                ) : usernameCheck.available === true ? (
                                                                    <span className="text-green-600">{usernameCheck.message}</span>
                                                                ) : usernameCheck.available === false ? (
                                                                    <span className="text-red-600">{usernameCheck.message}</span>
                                                                ) : usernameCheck.message ? (
                                                                    <span className="text-gray-500">{usernameCheck.message}</span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {signupStep === 1 && (
                                            <div className="relative animate-slide-down">
                                                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />
                                                <input
                                                    type="text"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="
                                                        w-full pl-10 pr-3 py-3
                                                        border border-gray-300 rounded-lg
                                                        focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                        outline-none transition-all text-sm bg-white peer
                                                    "
                                                />
                                                <label
                                                    className={`
                                                        absolute left-10 bg-white px-1 pointer-events-none
                                                        text-gray-500 transition-all duration-200
                                                        ${formData.email
                                                            ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                            : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                        }
                                                    `}
                                                >
                                                    Email
                                                </label>
                                            </div>
                                        )}

                                        {signupStep === 2 && (
                                            <div className="space-y-3 animate-slide-down">
                                                <div className="relative">
                                                    <GrLicense className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />
                                                    <input
                                                        type="text"
                                                        name="license"
                                                        value={formData.license}
                                                        onChange={handleChange}
                                                        required
                                                        className="
                                                            w-full pl-10 pr-3 py-3
                                                            border border-gray-300 rounded-lg
                                                            focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                            outline-none transition-all text-sm bg-white peer
                                                        "
                                                    />
                                                    <label
                                                        className={`
                                                            absolute left-10 bg-white px-1 pointer-events-none
                                                            text-gray-500 transition-all duration-200
                                                            ${formData.license
                                                                ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                                : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                            }
                                                        `}
                                                    >
                                                        License No. *
                                                    </label>
                                                </div>

                                                <div className="relative">
                                                    <MdSettings className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10 pointer-events-none" />
                                                    <DropDown
                                                        name="specialization"
                                                        value={formData.specialization}
                                                        onChange={handleChange}
                                                        options={specializationOptions}
                                                        placeholder="Specialization"
                                                        widthClass="w-full"
                                                        borderClass="border-gray-300"
                                                        selectedClass="bg-slate-300 text-gray-900"
                                                        highlightClass="bg-slate-200 text-slate-900"
                                                        ringClass="ring-slate-300"
                                                        placeholderClass="text-gray-500"
                                                        triggerPadding="py-3 pl-10 pr-3"
                                                        triggerFontSize="text-sm"
                                                    />
                                                    <label
                                                        className={`
                                                            absolute left-10 bg-white px-1 pointer-events-none
                                                            text-gray-500 transition-all duration-200
                                                            ${formData.specialization
                                                                ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                                : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                            }
                                                        `}
                                                    >
                                                        Specialization *
                                                    </label>
                                                </div>

                                                {showCustomSpecialization && (
                                                    <div className="relative animate-slide-down">
                                                        <MdSettings className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />
                                                        <input
                                                            type="text"
                                                            name="customSpecialization"
                                                            value={formData.customSpecialization}
                                                            onChange={handleChange}
                                                            required
                                                            className="
                                                                w-full pl-10 pr-3 py-3
                                                                border border-gray-300 rounded-lg
                                                                focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                                outline-none transition-all text-sm bg-white peer
                                                            "
                                                        />
                                                        <label
                                                            className={`
                                                                absolute left-10 bg-white px-1 pointer-events-none
                                                                text-gray-500 transition-all duration-200
                                                                ${formData.customSpecialization
                                                                    ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                                    : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                                }
                                                            `}
                                                        >
                                                            Custom Specialization *
                                                        </label>
                                                    </div>
                                                )}

                                                <div className="relative">
                                                    <FaClinicMedical className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />
                                                    <input
                                                        type="text"
                                                        name="clinic"
                                                        value={formData.clinic}
                                                        onChange={handleChange}
                                                        className="
                                                            w-full pl-10 pr-3 py-3
                                                            border border-gray-300 rounded-lg
                                                            focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                            outline-none transition-all text-sm bg-white peer
                                                        "
                                                    />
                                                    <label
                                                        className={`
                                                            absolute left-10 bg-white px-1 pointer-events-none
                                                            text-gray-500 transition-all duration-200
                                                            ${formData.clinic
                                                                ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                                : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                            }
                                                        `}
                                                    >
                                                        Clinic (optional)
                                                    </label>
                                                </div>

                                                <div className="relative">
                                                    <MdOutlineDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />
                                                    <input
                                                        type="number"
                                                        name="experience"
                                                        value={formData.experience}
                                                        onChange={handleChange}
                                                        required
                                                        min="1"
                                                        className={`
                                                            w-full pl-10 pr-3 py-3
                                                            border rounded-lg
                                                            focus:ring-2 focus:border-transparent
                                                            outline-none transition-all text-sm bg-white peer
                                                            ${experienceInvalid
                                                                ? 'border-red-500 focus:ring-red-500'
                                                                : 'border-gray-300 focus:ring-slate-900'}
                                                        `}
                                                    />
                                                    <label
                                                        className={`
                                                            absolute left-10 bg-white px-1 pointer-events-none
                                                            text-gray-500 transition-all duration-200
                                                            ${formData.experience
                                                                ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                                : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                            }
                                                        `}
                                                    >
                                                        Years of experience *
                                                    </label>
                                                    {experienceInvalid && (
                                                        <p className="text-red-600 text-xs mt-1">Experience must be greater than 0</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {signupStep === 3 && (
                                            <div className="space-y-3 animate-slide-down">
                                                <div className="relative">
                                                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />

                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        required
                                                        className="
                                                            w-full pl-10 pr-10 py-3
                                                            border border-gray-300 rounded-lg
                                                            focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                            outline-none transition-all text-sm bg-white peer
                                                        "
                                                    />

                                                    <button
                                                        type="button"
                                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                                                    >
                                                        {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                                    </button>

                                                    <label
                                                        className={`
                                                            absolute left-10 bg-white px-1 pointer-events-none
                                                            text-gray-500 transition-all duration-200
                                                            ${formData.password
                                                                ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                                : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                            }
                                                        `}
                                                    >
                                                        Password
                                                    </label>
                                                </div>

                                                <div className="relative">
                                                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />

                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        required
                                                        aria-describedby="confirm-password-error"
                                                        className={`
                                                            ${passwordsMatch === null
                                                                ? 'border-gray-300'
                                                                : passwordsMatch
                                                                    ? 'border-green-500'
                                                                    : 'border-red-500'
                                                            }
                                                            w-full pl-10 pr-10 py-3
                                                            border rounded-lg
                                                            focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                            outline-none transition-all text-sm bg-white peer
                                                        `}
                                                    />

                                                    <button
                                                        type="button"
                                                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                                                    >
                                                        {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                                    </button>

                                                    <label
                                                        className={`
                                                            absolute left-10 bg-white px-1 pointer-events-none
                                                            text-gray-500 transition-all duration-200
                                                            ${formData.confirmPassword
                                                                ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                                : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                            }
                                                        `}
                                                    >
                                                        Confirm Password
                                                    </label>
                                                </div>

                                                {passwordsMatch === false && (
                                                    <p id="confirm-password-error" className="text-red-600 text-xs mt-1">
                                                        Passwords do not match
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Patient signup single step */
                                    <div className="space-y-3 animate-slide-down">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <div className="relative">
                                                    <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        required
                                                        className={`
                                                            w-full pl-10 pr-3 py-3
                                                            border border-gray-300 rounded-lg
                                                            focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                            outline-none transition-all text-sm bg-white peer
                                                            ${usernameCheck.available === false ? 'border-red-500' : usernameCheck.available === true ? 'border-green-500' : ''}
                                                        `}
                                                    />
                                                    <label
                                                        className={`
                                                            absolute left-10 bg-white px-1 pointer-events-none
                                                            text-gray-500 transition-all duration-200
                                                            ${formData.username
                                                                ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                                : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                            }
                                                        `}
                                                    >
                                                        Username
                                                    </label>
                                                </div>
                                                <div className="mt-1 text-xs min-h-[16px] leading-4">
                                                    {formData.username && (
                                                        <>
                                                            {usernameCheck.checking ? (
                                                                <span className="text-gray-500">Checking availability...</span>
                                                            ) : usernameCheck.available === true ? (
                                                                <span className="text-green-600">{usernameCheck.message}</span>
                                                            ) : usernameCheck.available === false ? (
                                                                <span className="text-red-600">{usernameCheck.message}</span>
                                                            ) : usernameCheck.message ? (
                                                                <span className="text-gray-500">{usernameCheck.message}</span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="relative">
                                                    <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="
                                                            w-full pl-10 pr-3 py-3
                                                            border border-gray-300 rounded-lg
                                                            focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                            outline-none transition-all text-sm bg-white peer
                                                        "
                                                    />
                                                    <label
                                                        className={`
                                                            absolute left-10 bg-white px-1 pointer-events-none
                                                            text-gray-500 transition-all duration-200
                                                            ${formData.name
                                                                ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                                : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                            }
                                                        `}
                                                    >
                                                        Full Name (Optional)
                                                    </label>
                                                </div>
                                                <div className="mt-1 text-xs min-h-[16px] leading-4"></div>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />
                                            <input
                                                type="text"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="
                                                    w-full pl-10 pr-3 py-3
                                                    border border-gray-300 rounded-lg
                                                    focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                    outline-none transition-all text-sm bg-white peer
                                                "
                                            />
                                            <label
                                                className={`
                                                    absolute left-10 bg-white px-1 pointer-events-none
                                                    text-gray-500 transition-all duration-200
                                                    ${formData.email
                                                        ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                        : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                    }
                                                `}
                                            >
                                                Email
                                            </label>
                                        </div>

                                        <div className="relative">
                                            <div className="relative">
                                                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />

                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    className="
                                                        w-full pl-10 pr-10 py-3
                                                        border border-gray-300 rounded-lg
                                                        focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                        outline-none transition-all text-sm bg-white peer
                                                    "
                                                />

                                                <button
                                                    type="button"
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                                                >
                                                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                                </button>

                                                <label
                                                    className={`
                                                        absolute left-10 bg-white px-1 pointer-events-none
                                                        text-gray-500 transition-all duration-200
                                                        ${formData.password
                                                            ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                            : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                        }
                                                    `}
                                                >
                                                    Password
                                                </label>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <div className="relative">
                                                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />

                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    required
                                                    aria-describedby="confirm-password-error"
                                                    className={`
                                                        ${passwordsMatch === null
                                                            ? 'border-gray-300'
                                                            : passwordsMatch
                                                                ? 'border-green-500'
                                                                : 'border-red-500'
                                                        }
                                                        w-full pl-10 pr-10 py-3
                                                        border rounded-lg
                                                        focus:ring-2 focus:ring-slate-900 focus:border-transparent
                                                        outline-none transition-all text-sm bg-white peer
                                                    `}
                                                />

                                                <button
                                                    type="button"
                                                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                                                >
                                                    {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                                                </button>

                                                <label
                                                    className={`
                                                        absolute left-10 bg-white px-1 pointer-events-none
                                                        text-gray-500 transition-all duration-200
                                                        ${formData.confirmPassword
                                                            ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                            : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                        }
                                                    `}
                                                >
                                                    Confirm Password
                                                </label>
                                            </div>

                                            {passwordsMatch === false && (
                                                <p id="confirm-password-error" className="text-red-600 text-xs mt-1">
                                                    Passwords do not match
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Success Message */}
                        {/* {message && messageType === 'success' && (
                            <div className="relative overflow-hidden text-xs font-medium animate-slide-down bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mt-0 mb-4">
                                <div className="flex items-start gap-2">
                                    <span className="text-lg flex-shrink-0">✓</span>
                                    <div className="flex-1">
                                        <span className="font-semibold block">{message}</span>
                                        <span className="text-xs text-green-600 block mt-1">Redirecting to login in a few seconds...</span>
                                    </div>
                                </div>
                            </div>
                        )} */}

                        {/* Error Message (inline) */}
                        {/* {message && messageType === 'error' && (
                            <div className="relative overflow-hidden text-xs font-medium animate-slide-down bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mt-0 mb-4">
                                <div className="flex items-start gap-2">
                                    <span className="text-lg flex-shrink-0">✕</span>
                                    <span className="flex-1">{message}</span>
                                </div>
                            </div>
                        )} */}

                        {/* Actions */}
                        {isDermSignup ? (
                            <div className="flex items-center gap-3">
                                {signupStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={handleDermStepBack}
                                        className="flex-1 border border-gray-300 text-gray-800 font-semibold py-2.5 rounded-lg transition-all hover:bg-gray-100 text-sm"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleFormSubmit}
                                    disabled={
                                        loading ||
                                        (signupStep === 1 && !canProceedStep1) ||
                                        (signupStep === 2 && !canProceedStep2) ||
                                        (signupStep === 3 && usernameCheck.available === false)
                                    }
                                    className="flex-[2] bg-slate-900 hover:bg-black text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {signupStep < 3 ? 'Next' : 'Create account'}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleFormSubmit}
                                disabled={loading || (!isLogin && usernameCheck.available === false)}
                                className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isLogin ? 'Sign in' : 'Create account'}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </button>
                        )}
                    </div>

                    {/* Footer Link */}
                    <div className="mt-5 text-center text-xs text-gray-600">
                        {isLogin ? (
                            <p>
                                Don't have an account?{' '}
                                <Link to="/Signup" className="text-slate-900 font-semibold hover:underline transition-all">
                                    Register
                                </Link>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{' '}
                                <Link to="/Login" className="text-slate-900 font-semibold hover:underline transition-all">
                                    Login
                                </Link>
                            </p>
                        )}
                    </div>

                    {/* Loader Overlay within the form area */}
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 animate-fade-in rounded-lg">
                            <div className="flex flex-col items-center gap-4 animate-scale-in">
                                {/* Smaller Spinner */}
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
                                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>

                                {/* Loading Text */}
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {isLogin ? 'Signing you in...' : 'Creating your account...'}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Please wait a moment</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .animate-slide-in {
                    animation: slide-in 0.5s ease-out;
                }

                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }

                .hover\\:scale-102:hover {
                    transform: scale(1.02);
                }
            `}</style>

            {/* Pending Verification Modal */}
            {showPendingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                        {/* Decorative top bar */}
                        <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500"></div>

                        <div className="p-8">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center animate-pulse">
                                    <svg
                                        className="w-10 h-10 text-yellow-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
                                Verification Pending
                            </h3>

                            {/* Message */}
                            <p className="text-gray-600 text-center mb-8 leading-relaxed">
                                {pendingMessage}
                            </p>

                            {/* Button */}
                            <button
                                onClick={() => setShowPendingModal(false)}
                                className="w-full py-3 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-102"
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Verification OTP Modal */}
            <EmailVerificationOTPModal
                show={showEmailVerificationModal}
                onClose={() => {
                    setShowEmailVerificationModal(false);
                    setUnverifiedEmail('');
                }}
                email={unverifiedEmail}
                onVerificationSuccess={() => {
                    setMessage('Email verified successfully! You can now log in.');
                    setMessageType('success');
                    setShowEmailVerificationModal(false);
                    setUnverifiedEmail('');
                }}
            />
        </div>
    );
};

export default Auth;