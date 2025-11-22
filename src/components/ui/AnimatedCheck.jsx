import React from 'react';

const AnimatedCheck = ({ title = "Success!", message = "Operation completed successfully" }) => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-24 h-24">
                {/* Animated Circle */}
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="4"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        className="animate-drawCircle"
                    />
                </svg>
                {/* Animated Checkmark */}
                <svg 
                    className="absolute inset-0 w-24 h-24" 
                    viewBox="0 0 100 100"
                >
                    <path
                        d="M25 50 L45 70 L75 35"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="100"
                        strokeDashoffset="100"
                        className="animate-drawCheck"
                    />
                </svg>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-800">{title}</h3>
            <p className="mt-2 text-gray-600 text-center">{message}</p>
            
            <style jsx>{`
                @keyframes drawCircle {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes drawCheck {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                .animate-drawCircle {
                    animation: drawCircle 0.6s ease-out forwards;
                }
                .animate-drawCheck {
                    animation: drawCheck 0.4s 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AnimatedCheck;
