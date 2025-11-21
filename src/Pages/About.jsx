import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import {
    FaBrain,
    FaUserMd,
    FaMobileAlt,
    FaCheckCircle,
    FaRocket,
    FaHeart,
    FaLightbulb,
    FaStar,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const About = () => {
    const navigate = useNavigate();
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const features = [
        {
            icon: <FaBrain className="text-3xl" />,
            title: "AI-Powered Analysis",
            description: "Cutting-edge machine learning models for accurate skin condition detection",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: <FaUserMd className="text-3xl" />,
            title: "Dermatologist Trusted",
            description: "Science-backed recommendations trusted by medical professionals",
            color: "from-green-500 to-green-600"
        },
        {
            icon: <FaMobileAlt className="text-3xl" />,
            title: "Instant Results",
            description: "Get comprehensive skin analysis in seconds from any device",
            color: "from-purple-500 to-purple-600"
        },
    ];

    const benefits = [
        "Instant facial skin condition detection",
        "Personalized treatment recommendations",
        "Aesthetic enhancement visualization",
        "Secure report generation and sharing",
        "User-friendly mobile and web experience",
        "Trusted by users and dermatologists alike"
    ];

    const targetAudience = [
        {
            icon: <FaHeart className="text-2xl" />,
            title: "Patients",
            description: "Seeking early skin analysis and personalized recommendations"
        },
        {
            icon: <FaUserMd className="text-2xl" />,
            title: "Dermatologists",
            description: "Who want faster initial assessments and better patient insights"
        },
        {
            icon: <HiSparkles className="text-2xl" />,
            title: "Beauty Enthusiasts",
            description: "Who want to track and improve their skin health with technology"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            <Header />

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <motion.div
                        {...fadeInUp}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20
                        transition-all duration-300 cursor-pointer hover:bg-white/20 hover:border-white/40
                        ">
                            <HiSparkles className="text-yellow-400" />
                            <span>AI-Powered Skin Health Platform</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            Welcome to{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                FacialDerma AI
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                            Your Personal Skin Health Companion
                        </p>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                            Combining artificial intelligence and dermatological science to empower individuals to take charge of their skin health
                        </p>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </motion.div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* What We Do Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                <FaBrain className="text-white text-2xl" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What We Do</h2>
                        </div>

                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p className="text-lg">
                                Our platform uses <span className="font-semibold text-gray-900">cutting-edge machine learning models</span> to detect facial skin conditions, recommend personalized treatments, and help you track your skin's progress over time — all from the convenience of your mobile phone or desktop.
                            </p>
                            <p className="text-lg">
                                With just a simple image upload, FacialDerma AI analyzes your facial skin and identifies conditions such as <span className="font-semibold text-gray-900">acne, eczema, rosacea, hyperpigmentation</span>, and more.
                            </p>
                            <p className="text-lg">
                                We not only detect skin conditions but also offer <span className="font-semibold text-gray-900">tailored skincare treatment plans</span>, aesthetic enhancement previews (such as wrinkle reduction and scar smoothing), and generate detailed medical reports that can be shared with dermatologists.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Features Grid */}
                <motion.section
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Everything you need for comprehensive skin health management
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 group"
                            >
                                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Target Audience */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Designed For Everyone
                            </h2>
                            <p className="text-gray-300 text-lg">
                                FacialDerma AI serves a diverse community of users
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {targetAudience.map((audience, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-white/20 rounded-lg">
                                            {audience.icon}
                                        </div>
                                        <h3 className="text-xl font-bold">{audience.title}</h3>
                                    </div>
                                    <p className="text-gray-300">{audience.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-xl p-8 text-white"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <FaRocket className="text-2xl" />
                            </div>
                            <h2 className="text-3xl font-bold">Our Mission</h2>
                        </div>
                        <p className="text-blue-100 text-lg leading-relaxed">
                            Our mission is to make skin health assessment <span className="font-semibold text-white">accessible, fast, and reliable</span> for everyone — powered by smart, secure, and science-backed AI technology.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl shadow-xl p-8 text-white"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <FaLightbulb className="text-2xl" />
                            </div>
                            <h2 className="text-3xl font-bold">Our Vision</h2>
                        </div>
                        <p className="text-purple-100 text-lg leading-relaxed">
                            We envision a future where <span className="font-semibold text-white">personalized skincare advice</span> and early skin health detection is available to anyone, anywhere, helping people gain confidence in their skin.
                        </p>
                    </motion.div>
                </div>

                {/* Why Choose Us */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-200">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                                <FaStar className="text-white text-2xl" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose FacialDerma AI?</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <FaCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-1" />
                                    <span className="text-gray-700 font-medium">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden"
                >
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl p-12 text-center text-white relative">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                                <HiSparkles className="text-3xl animate-pulse" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                Ready to Transform Your Skin Health?
                            </h2>
                            <p className="text-base  text-gray-300 mb-8 max-w-2xl mx-auto">
                                Upload your photo, discover insights about your skin, and start your journey towards healthier skin with FacialDerma AI.
                            </p>
                            <button
                                onClick={() => navigate('/analysis')}
                                className="px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base">
                                Get Started Today
                            </button>
                        </div>
                    </div>
                </motion.section>

            </div>

            <Footer />
        </div>
    );
};

export default About;