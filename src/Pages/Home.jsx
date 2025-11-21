import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import { BsShieldCheck, BsCpuFill, BsGraphUpArrow, BsClock } from 'react-icons/bs';
import { FiCheckCircle } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { IoMdCheckmarkCircle } from 'react-icons/io';

const Home = () => {
    const isLoggedIn = !!localStorage.getItem('token');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <Header />

            {/* Hero Section */}
            <main className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                        {/* Left Content */}
                        <div className={`space-y-6 md:space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>

                            {/* Tagline with Icon */}
                            <div className="flex items-center gap-2">
                                <HiOutlineSparkles className="text-gray-700 text-2xl md:text-3xl animate-pulse" />
                                <span className="text-gray-700 font-semibold text-sm md:text-base lg:text-lg tracking-normal uppercase">
                                    AI-Powered Skin Analysis
                                </span>
                            </div>

                            {/* Main Title with Enhanced Typography */}
                            <div className="space-y-3">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                    <span className="block">Facial</span>
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-600 via-gray-700 to-gray-900 animate-gradient">
                                        Derma AI
                                    </span>
                                </h1>
                            </div>

                            {/* Enhanced Description */}
                            <p className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl">
                                Upload a photo and get <span className="font-semibold text-gray-900">instant AI-powered analysis</span> of your skin conditions,
                                personalized treatment recommendations, and aesthetic enhancement suggestions.{' '}
                                <Link
                                    to="/About"
                                    className="inline-flex items-center gap-1 text-gray-800 hover:text-gray-900 font-semibold underline decoration-2 underline-offset-4 transition-colors duration-200 group"
                                >
                                    Learn More
                                    <span className="transform transition-transform group-hover:translate-x-1">→</span>
                                </Link>
                            </p>

                            {/* CTA Buttons - Conditionally render only if NOT logged in */}
                            {!isLoggedIn && (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                                    <Link
                                        to="/Login"
                                        className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white font-bold py-4 px-8 rounded-xl text-base md:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Get Started Free
                                            <span className="transform transition-transform group-hover:translate-x-1">→</span>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>

                                    {/* Enhanced Google Play Badge */}
                                    <button
                                        onClick={() => alert('Google Play download coming soon!')}
                                        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
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
                        </div>

                        {/* Right Content - Enhanced Image Section */}
                        <div className={`relative transition-all duration-1000 transform delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                            <div className="relative">
                                <div className="relative bg-white rounded-3xl     transform hover:scale-105 transition-transform duration-500">
                                    <img
                                        src="/Assets/home1.png"
                                        alt="Facial AI Diagnosis"
                                        className="w-full h-auto rounded-2xl shadow-lg"
                                    />

                                    <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-xl p-3 md:p-4 border border-gray-100 animate-float hover:shadow-2xl transition-shadow duration-300">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-full flex items-center justify-center">
                                                <BsShieldCheck className="text-white text-lg" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-600">Scan Status</div>
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

                                    <div className="absolute top-4 right-4 bg-white rounded-xl shadow-2xl p-2 md:p-3 md:px-6 border-gray-300 animate-float animation-delay-2000">
                                        <div className="flex items-center gap-2 text-white">
                                            <BsClock className="text-base md:text-lg text-blue-600" />
                                            <div className="text-xs md:text-sm">
                                                <div className="text-sm text-gray-500">Get Instant</div>
                                                <div className="text-blue-700 font-bold">Results</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white/50 backdrop-blur-sm rounded-3xl my-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">Works</span>
                        </h2>
                        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                            Get professional skin analysis in three simple steps
                        </p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Connection Line */}
                        <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-800 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                            {/* Step 1 */}
                            <div className="relative text-center group">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                                    1
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Photo</h3>
                                <p className="text-gray-600 text-sm">Take or upload a clear photo of your face</p>
                            </div>

                            {/* Step 2 */}
                            <div className="relative text-center group">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Analysis</h3>
                                <p className="text-gray-600 text-sm">Our AI analyzes your skin in seconds</p>
                            </div>

                            {/* Step 3 */}
                            <div className="relative text-center group">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
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
                            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">FacialDerma AI?</span>
                        </h2>
                        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                            Advanced technology meets dermatological expertise for accurate, instant skin analysis
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Feature Card 1 */}
                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-gray-400 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <BsCpuFill className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Analysis</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                State-of-the-art deep learning models trained on millions of dermatological images for precise diagnosis.
                            </p>
                            <div className="flex items-center gap-2 text-gray-800 text-sm font-semibold">
                                <FiCheckCircle />
                                <span>Clinical Grade Accuracy</span>
                            </div>
                        </div>

                        {/* Feature Card 2 */}
                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-gray-400 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <BsShieldCheck className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Enterprise-grade data encryption ensures your medical information remains completely confidential and secure.
                            </p>
                            <div className="flex items-center gap-2 text-gray-800 text-sm font-semibold">
                                <FiCheckCircle />
                                <span>256-bit Encryption</span>
                            </div>
                        </div>

                        {/* Feature Card 3 */}
                        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-gray-400 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <BsGraphUpArrow className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Results</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Get comprehensive skin analysis and personalized treatment recommendations in seconds, not days.
                            </p>
                            <div className="flex items-center gap-2 text-gray-800 text-sm font-semibold">
                                <FiCheckCircle />
                                <span>Real-Time Analysis</span>
                            </div>
                        </div>
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