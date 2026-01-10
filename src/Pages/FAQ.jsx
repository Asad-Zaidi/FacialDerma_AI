import React, { useState } from 'react';
import Header from '../Nav_Bar/Header';
import { FaQuestionCircle, FaShieldAlt, FaUserMd, FaCheckCircle, FaClock, FaEnvelopeOpenText } from 'react-icons/fa';

const faqs = [
    {
        category: 'Getting Started',
        items: [
            {
                q: 'What is FacialDerma AI?',
                a: 'FacialDerma AI is an AI-powered dermatology assistant that helps you analyze skin conditions, get guidance, and securely share results with certified dermatologists.'
            },
            {
                q: 'Do I need an account to use the analysis?',
                a: 'You can explore the app, but creating an account lets you save results, track progress, and share securely with your dermatologist.'
            },
            {
                q: 'How do I upload photos for analysis?',
                a: 'After logging in, go to the Analysis section, follow the prompts to take or upload clear photos of your skin condition, and submit for AI analysis.'
            }
        ]
    },
    {
        category: 'Privacy & Security',
        items: [
            {
                q: 'How is my data protected?',
                a: 'We use encrypted storage and transport (TLS) for all uploads, and follow least-privilege access so only you and assigned clinicians can view your data.'
            },
            {
                q: 'Who can see my photos?',
                a: 'Only you and the dermatologist you explicitly share with. We never sell or share your images with third parties.'
            },
            {
                q: 'How long is my data stored?',
                a: 'Your data is stored securely for as long as your account is active. You can request deletion at any time by contacting support.'
            }
        ]
    },
    {
        category: 'Analysis & Accuracy',
        items: [
            {
                q: 'Is the AI a medical diagnosis?',
                a: 'No. The AI provides likelihoods and guidance, but a licensed dermatologist must confirm any diagnosis.'
            },
            {
                q: 'How do I get the best results?',
                a: 'Use clear, well-lit photos without makeup, capture multiple angles, and follow the on-screen framing guide.'
            },
            {
                q: 'What skin conditions can the AI analyze?',
                a: 'The AI is trained on common conditions like acne, eczema, psoriasis, and rosacea. We are continually expanding its capabilities.'
            },
            {
                q: 'How accurate is the AI analysis?',
                a: 'The AI has been validated in clinical studies with high accuracy, but it is not infallible. Always consult a dermatologist for confirmation.'
            },
            {
                q: 'Does Skinive replace a Doctor?',
                a: 'No. Skinive is a tool to assist dermatologists and provide preliminary analysis. It does not replace professional medical advice or diagnosis.'
            }
        ]
    },
    {
        category: 'Account & Support',
        items: [
            {
                q: 'How long does support take to respond?',
                a: 'We typically respond within 24-48 hours. For urgent security issues, email admin@facialderma.ai.'
            },
            {
                q: 'How can I contact support?',
                a: 'Use the Contact Support form in the app or email support@facialderma.ai. For critical issues, use admin@facialderma.ai.'
            },
            {
                q: 'How do I reset my password?',
                a: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to you.'
            },
            {
                q: 'Can I delete my account?',
                a: 'Yes. Contact support to request account deletion. We will remove your data in accordance with our privacy policy.'
            },
            {
                q: 'How do I update my profile information?',
                a: 'Go to your Profile page to update personal details, change your password, and manage notification settings.'
            }
        ]
    }
];

const FAQ = () => {
    const [openQuestion, setOpenQuestion] = useState(null);

    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    let runningIndex = 0;

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-10">
                <div className="max-w-6xl mx-auto">
                    {/* Hero */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-10 border border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                    <FaQuestionCircle />
                                    <span>FAQ & Help Center</span>
                                </div>
                                <h1 className="mt-4 text-2xl md:3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                    Answers to your most common questions
                                </h1>
                                <p className="mt-3 text-gray-600 max-w-2xl text-base md:text-lg">
                                    Find quick guidance on privacy, accuracy, and how to get the best results. Need more help? Reach out anytime.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
                                    <span className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-800 border-2 border-gray-300 rounded-full hover:bg-slate-300 hover:text-slate-900"><FaShieldAlt /> Privacy first</span>
                                    <span className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-800 border-2 border-gray-300 rounded-full hover:bg-slate-300 hover:text-slate-900"><FaUserMd /> Dermatologist aligned</span>
                                    <span className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-800 border-2 border-gray-300 rounded-full hover:bg-slate-300 hover:text-slate-900"><FaClock /> 24/7 support</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white rounded-2xl p-6 md:p-8 shadow-xl w-full md:max-w-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaEnvelopeOpenText className="text-3xl" />
                                    <div>
                                        <p className="text-sm text-slate-200">Still need help?</p>
                                        <p className="text-lg font-semibold">Contact Support</p>
                                    </div>
                                </div>
                                <p className="text-slate-200 text-sm leading-relaxed mb-4">
                                    Can’t find what you’re looking for? Our team is here to help you with account, privacy, and product questions.
                                </p>
                                <a
                                    href="/contact-support"
                                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-white text-slate-900 font-semibold rounded-lg shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
                                >
                                    Go to Contact Support
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* FAQ sections */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {faqs.map((section, sectionIdx) => (
                            <div key={section.category} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                                        <FaCheckCircle />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-gray-400">Section</p>
                                        <h3 className="text-lg font-bold text-gray-900">{section.category}</h3>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {section.items.map((item) => {
                                        runningIndex += 1;
                                        const idx = runningIndex;
                                        const isOpen = openQuestion === idx;
                                        return (
                                            <div key={item.q} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleQuestion(idx)}
                                                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left bg-white hover:bg-slate-50 transition-colors"
                                                >
                                                    <span className="font-semibold text-gray-900 text-sm md:text-base">{item.q}</span>
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${isOpen ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                                        {isOpen ? 'Hide' : 'View'}
                                                    </span>
                                                </button>
                                                {isOpen && (
                                                    <div className="px-4 pb-4 text-gray-700 text-sm md:text-base leading-relaxed bg-white">
                                                        {item.a}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FAQ;
