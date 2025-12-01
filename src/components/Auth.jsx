import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { MdEmail, MdLock, MdPerson, MdCheckCircle } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import { apiLogin, apiSignUp } from "../api/api";
import { validatePasswordRules } from '../lib/passwordValidation';

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const isLogin = location.pathname === '/Login';

    // States
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('error');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    useEffect(() => {
        if (formData.password.length === 0 && formData.confirmPassword.length === 0) {
            setPasswordsMatch(null);  // neutral state, no error message
        } else if (formData.confirmPassword.length === 0) {
            setPasswordsMatch(null);  // neutral if confirm password is empty
        } else {
            setPasswordsMatch(formData.password === formData.confirmPassword);
        }
    }, [formData.password, formData.confirmPassword]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

    };

    // Login Handler
    // ---------------------------
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!role) {
            setMessage('Please select a role');
            setMessageType('error');
            return;
        }

        setLoading(true);

        const payload = {
            emailOrUsername: formData.email,
            password: formData.password,
            role: role,
        };

        try {
            const response = await apiLogin(payload); // <-- using apiLogin
            const data = response.data;

            // Thorough validation of response structure
            if (!data || typeof data !== 'object') {
                setMessage('Invalid response from server');
                setMessageType('error');
                setLoading(false);
                return;
            }

            if (!data.token || typeof data.token !== 'string' || data.token.trim() === '') {
                setMessage('Invalid token received');
                setMessageType('error');
                setLoading(false);
                return;
            }

            if (!data.user || typeof data.user !== 'object') {
                setMessage('Invalid user data received');
                setMessageType('error');
                setLoading(false);
                return;
            }

            if (!data.user.email || !data.user.username || !data.user.role) {
                setMessage('Incomplete user data received');
                setMessageType('error');
                setLoading(false);
                return;
            }

            // Only proceed if all validations pass
            login(data.token, {
                email: data.user.email,
                username: data.user.username,
                role: data.user.role,
                name: data.user.name
            });

            setTimeout(() => {
                setLoading(false);
                if (data.user.role === 'patient') {
                    navigate('/Profile');
                } else if (data.user.role === 'dermatologist') {
                    navigate('/Dermatologist');
                }
            }, 1500);
        } catch (error) {
            const errMsg = error.response?.data?.error || error.response?.data?.detail?.error || error.response?.data?.message || 'Invalid credentials';
            setMessage(errMsg);
            setMessageType('error');
            setLoading(false);
            return;
        }
    };

    // ---------------------------
    // Signup Handler
    // ---------------------------
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
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

        const payload = {
            role: role,
            name: formData.name || undefined,
            username: formData.username,
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await apiSignUp(payload); // <-- using apiSignUp

            console.log('Signup successful:', response);

            setTimeout(() => {
                setLoading(false); // Stop loader before redirect
                navigate('/Login');
            }, 1500);

        } catch (error) {
            const errMsg = error.response?.data?.detail?.error || error.response?.data?.error || error.response?.data?.message || 'Signup failed';
            setMessage(errMsg);
            setMessageType('error');
            setLoading(false);
        }
    };

    const handleSubmit = isLogin ? handleLoginSubmit : handleSignupSubmit;

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
                <div className="p-8 flex flex-col justify-center bg-white/80 backdrop-blur-sm">

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

                    {/* Role Selection */}
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            {isLogin ? 'Login as' : 'Register as'}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: 'patient', label: 'Patient' },
                                { value: 'dermatologist', label: 'Doctor' }
                            ].map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setRole(option.value)}
                                    className={`relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border-2 font-medium text-xs transition-all transform ${role === option.value
                                        ? 'border-slate-900 bg-slate-50 text-slate-900 shadow-md'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    {option.label}
                                    {role === option.value && (
                                        <MdCheckCircle className="absolute top-1.5 right-1.5 text-slate-900 text-sm animate-scale-in" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {!isLogin && (
                            <>
                                <div className="relative">

    <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />

    <input
        type="text"
        name="username"
        value={formData.username}
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
            ${formData.username
                ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
            }
        `}
    >
        Username
    </label>
</div>


                                {/* ADD THIS NEW FIELD */}
                                <div className="animate-slide-down relative">
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
</div>

                            </>
                        )}

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
        {isLogin ? "Email or Username" : "Email"}
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

    {isLogin && (
        <div className="mt-2 text-right">
            <Link
                to="/forgot-password"
                className="text-xs text-slate-700 hover:text-slate-900 font-medium hover:underline transition-colors"
            >
                Forgot Password?
            </Link>
        </div>
    )}
</div>


                        {!isLogin && (
                            <div className="animate-slide-down relative">
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

                        {/* Error Message Only */}
                        {message && messageType === 'error' && (
                            <div className="relative overflow-hidden p-3 rounded-lg text-xs font-medium animate-slide-down bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-2 border-red-200">
                                <span className="flex-1">{message}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLogin ? 'Sign in' : 'Create account'}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-5 text-center text-xs text-gray-600">
                        {isLogin ? (
                            <p>
                                Don't have an account?{' '}
                                <Link to="/Signup" className="text-slate-900 font-semibold hover:underline transition-all">
                                    Register here
                                </Link>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{' '}
                                <Link to="/Login" className="text-slate-900 font-semibold hover:underline transition-all">
                                    Login here
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Full Screen Loader Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-lg flex items-center justify-center z-[9999] animate-fade-in">
                    <div className="flex flex-col items-center gap-6 animate-scale-in">
                        {/* Large Spinner */}
                        <div className="relative">
                            <div className="w-40 h-40 border-[8px] border-slate-100 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-40 h-40 border-[8px] border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>

                        {/* Loading Text */}
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isLogin ? 'Signing you in...' : 'Creating your account...'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">Please wait a moment</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Animations */}
            <style jsx>{`
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
        </div>
    );
};

export default Auth;