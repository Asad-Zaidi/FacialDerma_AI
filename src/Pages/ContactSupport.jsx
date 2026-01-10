import React, { useState } from 'react';
import { FaEnvelope, FaUser, FaQuestionCircle, FaCommentDots, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Header from '../Nav_Bar/Header';
import { apiSubmitSupportTicket } from '../api/api';
import DropDown from '../components/ui/DropDown';

const ContactSupport = () => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        category: '',
        subject: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const categoryOptions = [
        { value: 'Account', label: 'Account Issues' },
        { value: 'Technical', label: 'Technical Support' },
        { value: 'Privacy', label: 'Privacy & Security' },
        { value: 'General', label: 'General Inquiry' },
        { value: 'Other', label: 'Other' }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await apiSubmitSupportTicket(formData);

            if (response.data) {
                setSubmitted(true);
                // Reset form after 3 seconds but stay on the page
                setTimeout(() => {
                    setSubmitted(false);
                    setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        category: '',
                        subject: '',
                        message: ''
                    });
                }, 3000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.detail?.error
                || err.response?.data?.error
                || err.response?.data?.detail
                || err.message
                || 'Failed to submit. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-scale-in">
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <FaCheckCircle className="text-5xl text-green-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Submitted!</h2>
                        <p className="text-gray-600 mb-6">
                            We've received your support request. Our team will respond within 24-48 hours.
                        </p>
                        <p className="text-sm text-gray-500">Redirecting to home...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">

                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-6 md:gap-8">
                            <div className="inline-block bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 shadow-xl flex-shrink-0">
                                <FaCommentDots className="text-4xl text-white" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    Contact Support
                                </h1>
                                <p className="text-md text-gray-600 max-w-2xl">
                                    Need help? We're here for you. Submit your inquiry and our team will get back to you within 24-48 hours.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="grid md:grid-cols-5">
                            {/* Left Sidebar - Info */}
                            <div className="md:col-span-2 bg-gradient-to-br from-slate-800 via-slate-900 to-black p-8 text-white">
                                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FaEnvelope className="text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1">Email Us</h4>
                                            <p className="text-sm text-gray-300">admin@facialderma.ai</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FaQuestionCircle className="text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1">Response Time</h4>
                                            <p className="text-sm text-gray-300">We aim to respond within 24-48 hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FaCheckCircle className="text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1">Track Your Request</h4>
                                            <p className="text-sm text-gray-300">You'll receive a confirmation email with your ticket ID</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                                    <p className="text-sm text-gray-300">
                                        <strong>Note:</strong> For urgent security issues, please contact us immediately at admin@facialderma.ai
                                    </p>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="md:col-span-3 p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name & Email */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="relative">
                                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm z-10" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm bg-white peer"
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
                                                    Your Name *
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="relative">
                                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm z-10" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm bg-white peer"
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
                                                    Your Email *
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div className="relative">
                                        <DropDown
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            options={categoryOptions}
                                            placeholder="Select a category"
                                            widthClass="w-full"
                                            borderClass="border-slate-300"
                                            selectedClass="bg-gray-400 text-gray-900"
                                            highlightClass="bg-slate-100 text-slate-900"
                                            ringClass="ring-slate-300"
                                            triggerPadding="py-3 px-4"
                                            triggerFontSize="text-sm"
                                        />
                                        <label
                                            className={`
                                                absolute left-4 bg-white px-1 pointer-events-none
                                                text-gray-500 transition-all duration-200
                                                ${formData.category
                                                    ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                    : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
                                                }
                                            `}
                                        >
                                            {formData.category ? "Category *" : "Select a category *"}
                                        </label>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm bg-white peer"
                                            />
                                            <label
                                                className={`
                                                    absolute left-4 bg-white px-1 pointer-events-none
                                                    text-gray-500 transition-all duration-200
                                                    ${formData.subject
                                                        ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                        : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-slate-900"
                                                    }
                                                `}
                                            >
                                                Subject *
                                            </label>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <div className="relative">
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows="6"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm resize-none bg-white peer"
                                            />
                                            <label
                                                className={`
                                                    absolute left-4 bg-white px-1 pointer-events-none
                                                    text-gray-500 transition-all duration-200
                                                    ${formData.message
                                                        ? "top-0 -translate-y-1/2 text-xs font-medium text-slate-900"
                                                        : "top-0 -translate-y-1/2 text-xs font-medium text-gray-400 peer-focus:text-slate-900"
                                                    }
                                                `}
                                            >
                                                Message *
                                            </label>
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm relative overflow-hidden group"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <FaPaperPlane />
                                                    Submit
                                                </>
                                            )}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
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

                .animate-scale-in {
                    animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
            `}</style>
            </div>
        </>
    );
};

export default ContactSupport;
