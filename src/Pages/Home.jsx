import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import { BsShieldCheck, BsCpuFill, BsGraphUpArrow, BsClock } from 'react-icons/bs';
import { FiTarget, FiUsers, FiAward, FiMessageCircle, FiCheckCircle } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { MdVerified, MdSecurity, MdVideoCall } from 'react-icons/md';
import { RiStethoscopeLine } from 'react-icons/ri';
import { IoMdCheckmarkCircle } from 'react-icons/io';

const Home = () => {
    // Check login status (adjust key based on your auth setup)
    const isLoggedIn = !!localStorage.getItem('token');
    const [isVisible, setIsVisible] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const testimonials = [
        {
            name: "Dr. Sarah Johnson",
            role: "Dermatologist, Mayo Clinic",
            text: "FacialDerma AI has revolutionized our preliminary screening process. The accuracy is remarkable.",
            rating: 5,
            avatar: "👩‍⚕️"
        },
        {
            name: "Michael Chen",
            role: "Patient",
            text: "Got instant results and personalized recommendations. Saved me a trip to the clinic!",
            rating: 5,
            avatar: "👨"
        },
        {
            name: "Dr. Emily Rodriguez",
            role: "Clinical Researcher",
            text: "The AI model's precision and the detailed reports are industry-leading. Highly recommended.",
            rating: 5,
            avatar: "👩‍🔬"
        }
    ];

    const certifications = [
        { icon: <BsShieldCheck />, label: "FDA Compliant", colorClass: "bg-green-100 text-green-700" },
        { icon: <MdVerified />, label: "AI-Certified", colorClass: "bg-blue-100 text-blue-700" },
        { icon: <MdSecurity />, label: "HIPAA Secure", colorClass: "bg-purple-100 text-purple-700" },
        { icon: <RiStethoscopeLine />, label: "Clinically Validated", colorClass: "bg-pink-100 text-pink-700" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <Header />

            {/* Hero Section */}
            <main className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-18">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                        {/* Left Content */}
                        <div className={`space-y-6 md:space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>

                            {/* Enhanced Trust Badges with Tooltips */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {certifications.map((cert, idx) => (
                                    <span
                                        key={idx}
                                        className={`group relative inline-flex items-center gap-1.5 ${cert.colorClass} px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
                                    >
                                        <span className="text-base">{cert.icon}</span>
                                        {cert.label}
                                        {/* Tooltip */}
                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                            {cert.label}
                                        </span>
                                    </span>
                                ))}
                            </div>

                            {/* Tagline with Icon */}
                            <div className="flex items-center border-gray-800 gap-2">
                                <HiOutlineSparkles className="text-pink-500 text-2xl border-1 md:text-3xl animate-pulse" />
                                <span className="text-pink-600  font-semibold text-sm md:text-base lg:text-lg tracking-normal uppercase">
                                    AI-Powered Skin Analysis
                                </span>
                            </div>

                            {/* Main Title with Enhanced Typography */}
                            <div className="space-y-3">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                                    <span className="block">Facial</span>
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient">
                                        Derma AI
                                    </span>
                                </h1>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                                    <span className="text-xs text-gray-500 font-medium">Trusted by many Users</span>
                                </div>
                            </div>

                            {/* Enhanced Description */}
                            <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl">
                                Upload a photo and get <span className="font-semibold text-pink-600">instant AI-powered analysis</span> of your skin conditions,
                                personalized treatment recommendations, and aesthetic enhancement suggestions.{' '}
                                <Link
                                    to="/About"
                                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold underline decoration-2 underline-offset-4 transition-colors duration-200 group"
                                >
                                    Learn More
                                    <span className="transform transition-transform group-hover:translate-x-1">→</span>
                                </Link>
                            </p>

                            {/* Enhanced Feature Pills with Icons */}
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:shadow-md hover:border-pink-300 transition-all duration-300">
                                    <BsCpuFill className="text-pink-500" />
                                    <span className="text-xs md:text-sm font-medium text-gray-700">Advanced AI Model</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-300">
                                    <FiTarget className="text-purple-500" />
                                    <span className="text-xs md:text-sm font-medium text-gray-700">98% Accuracy</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-300">
                                    <BsGraphUpArrow className="text-blue-500" />
                                    <span className="text-xs md:text-sm font-medium text-gray-700">Instant Results</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-300">
                                    <MdVideoCall className="text-green-500" />
                                    <span className="text-xs md:text-sm font-medium text-gray-700">Telemedicine Ready</span>
                                </div>
                            </div>

                            {/* CTA Buttons - Conditionally render only if NOT logged in */}
                            {!isLoggedIn && (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                                    <Link
                                        to="/Login"
                                        className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold py-4 px-8 rounded-full text-base md:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Get Started Free
                                            <span className="transform transition-transform group-hover:translate-x-1">→</span>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>

                                    {/* Enhanced Google Play Badge */}
                                    <button
                                        onClick={() => alert('Google Play download coming soon!')}
                                        className="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="text-xs opacity-80">Download on</div>
                                            <div className="text-sm font-bold -mt-1">Google Play</div>
                                        </div>
                                    </button>
                                </div>
                            )}

                            {/* Enhanced Stats Section with Animation */}
                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                                <div className="text-center group cursor-pointer">
                                    <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold text-gray-900 mb-1 group-hover:scale-110 transition-transform duration-300">
                                        <FiUsers className="text-pink-500" />
                                        50K+
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-600">Active Users</div>
                                </div>
                                <div className="text-center group cursor-pointer">
                                    <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold text-gray-900 mb-1 group-hover:scale-110 transition-transform duration-300">
                                        <BsShieldCheck className="text-purple-500" />
                                        98%
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-600">Accuracy Rate</div>
                                </div>
                                <div className="text-center group cursor-pointer">
                                    <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold text-gray-900 mb-1 group-hover:scale-110 transition-transform duration-300">
                                        <FiAward className="text-blue-500" />
                                        4.9
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-600">User Rating</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Enhanced Image Section */}
                        <div className={`relative transition-all duration-1000 transform delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                            <div className="relative">
                                {/* Decorative Elements */}
                                <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
                                <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>

                                {/* Main Image Container */}
                                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-4 md:p-6 border border-gray-200 transform hover:scale-105 transition-transform duration-500">
                                    <img
                                        src="/Assets/home1.png"
                                        alt="Facial AI Diagnosis"
                                        className="w-full h-auto rounded-2xl shadow-lg"
                                    />

                                    {/* Enhanced Floating Info Cards */}
                                    <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-xl p-3 md:p-4 border border-gray-100 animate-float hover:shadow-2xl transition-shadow duration-300">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                                <BsShieldCheck className="text-white text-lg" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Scan Status</div>
                                                <div className="text-sm font-bold text-green-600 flex items-center gap-1">
                                                    Verified <IoMdCheckmarkCircle />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-xl p-3 md:p-4 border border-gray-100 animate-float animation-delay-1000 hover:shadow-2xl transition-shadow duration-300">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                                                <BsCpuFill className="text-white text-lg" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">AI Confidence</div>
                                                <div className="text-sm font-bold text-purple-600">80%+</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Processing Time Badge */}
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg p-2 md:p-3 border border-white animate-float animation-delay-2000">
                                        <div className="flex items-center gap-2 text-white">
                                            <BsClock className="text-base md:text-lg" />
                                            <div className="text-xs md:text-sm font-bold">
                                                <div>Results in</div>
                                                <div className="text-lg md:text-xl">5 sec</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works Section - FIXED LINE */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white/50 backdrop-blur-sm rounded-3xl my-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Works</span>
                        </h2>
                        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                            Get professional skin analysis in three simple steps
                        </p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Connection Line - PROPERLY CENTERED */}
                        <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                            {/* Step 1 */}
                            <div className="relative text-center group">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                                    1
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Photo</h3>
                                <p className="text-gray-600 text-sm">Take or upload a clear photo of your face</p>
                            </div>

                            {/* Step 2 */}
                            <div className="relative text-center group">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Analysis</h3>
                                <p className="text-gray-600 text-sm">Our AI analyzes your skin in seconds</p>
                            </div>

                            {/* Step 3 */}
                            <div className="relative text-center group">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Get Results</h3>
                                <p className="text-gray-600 text-sm">Receive detailed report & recommendations</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Features Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">FacialDerma AI?</span>
                        </h2>
                        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                            Advanced technology meets dermatological expertise for accurate, instant skin analysis
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Feature Card 1 */}
                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-pink-300 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <BsCpuFill className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Analysis</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                State-of-the-art deep learning models trained on millions of dermatological images for precise diagnosis.
                            </p>
                            <div className="flex items-center gap-2 text-pink-600 text-sm font-semibold">
                                <FiCheckCircle />
                                <span>99.2% Clinical Accuracy</span>
                            </div>
                        </div>

                        {/* Feature Card 2 */}
                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-purple-300 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <BsShieldCheck className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                HIPAA-compliant data encryption ensures your medical information remains completely confidential and secure.
                            </p>
                            <div className="flex items-center gap-2 text-purple-600 text-sm font-semibold">
                                <FiCheckCircle />
                                <span>256-bit Encryption</span>
                            </div>
                        </div>

                        {/* Feature Card 3 */}
                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <BsGraphUpArrow className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Results</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Get comprehensive skin analysis and personalized treatment recommendations in seconds, not days.
                            </p>
                            <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                                <FiCheckCircle />
                                <span>Results in 3 Seconds</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Carousel */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Users Say</span>
                        </h2>
                        <p className="text-gray-600 text-base md:text-lg">
                            Trusted by patients and healthcare professionals worldwide
                        </p>
                    </div>

                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200 max-w-4xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`transition-all duration-500 ${activeTestimonial === index ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="text-6xl mb-4">{testimonial.avatar}</div>
                                    <div className="flex justify-center mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-xl">★</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-700 text-lg md:text-xl italic mb-6 leading-relaxed">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}

                        {/* Carousel Indicators */}
                        <div className="flex justify-center gap-2 mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTestimonial(index)}
                                    aria-label={`View testimonial ${index + 1}`}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === index
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 w-8'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Telemedicine CTA Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <MdVideoCall className="text-3xl" />
                                    <span className="text-sm font-semibold uppercase tracking-wide">Telemedicine Available</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    Consult with Dermatologists Online
                                </h2>
                                <p className="text-base md:text-lg opacity-90 mb-6">
                                    Get your AI analysis results reviewed by certified dermatologists through secure video consultations. Available 24/7.
                                </p>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <IoMdCheckmarkCircle className="text-xl" />
                                        <span>Board-Certified Doctors</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IoMdCheckmarkCircle className="text-xl" />
                                        <span>24/7 Availability</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <Link
                                    to="/telemedicine"
                                    className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold py-4 px-8 rounded-full text-base md:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    <FiMessageCircle />
                                    Book Consultation
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Trust Indicators Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                            Trusted by Healthcare Professionals
                        </h2>
                        <p className="text-base md:text-lg opacity-90 mb-8 max-w-3xl mx-auto">
                            Join thousands of users who rely on FacialDerma AI for accurate skin analysis and personalized dermatological care
                        </p>
                        {!isLoggedIn && (
                            <Link
                                to="/Login"
                                className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold py-4 px-8 rounded-full text-base md:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                            >
                                Start Your Free Analysis
                                <span className="transform transition-transform group-hover:translate-x-1">→</span>
                            </Link>
                        )}
                    </div>
                </div>
            </main>

            <Footer />

            {/* Enhanced Custom Animations */}
            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default Home;