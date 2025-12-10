import React from 'react';

const DiseaseLikelihood = ({ prediction, className = "" }) => {
    if (!prediction?.all_probabilities) {
        return null;
    }

    return (
        <div className={`w-full mt-4 pt-4 border-t border-gray-300 ${className}`}>
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Disease Likelihood Analysis</h4>
            <div className="space-y-3">
                {Object.entries(prediction.all_probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .map(([disease, probability], idx) => {
                        const percentageValue = probability * 100;
                        const isPredicted = disease === prediction.predicted_label;
                        const isVerySmall = percentageValue < 1;

                        // Color logic based on percentage ranges
                        let barColor = '';
                        if (percentageValue >= 80) {
                            barColor = 'bg-gradient-to-r from-green-500 to-green-600';
                        } else if (percentageValue >= 40) {
                            barColor = 'bg-gradient-to-r from-orange-500 to-orange-500';
                        } else {
                            barColor = 'bg-gradient-to-r from-red-500 to-red-600';
                        }

                        // Add special styling for predicted disease
                        if (isPredicted) {
                            barColor += ' shadow-md';
                        }

                        return (
                            <div key={idx} className="flex items-center gap-2 md:gap-3">
                                {/* Disease Name */}
                                <div className="w-32 md:w-40 flex-shrink-0">
                                    <p className={`text-xs md:text-sm font-medium truncate ${isPredicted
                                        ? 'text-gray-950 font-bold inline-block border-b-2 border-gray-950'
                                        : 'text-gray-500'
                                        }`}>
                                        {disease}
                                    </p>
                                </div>

                                {/* Bar Container */}
                                <div className="flex-grow flex items-center gap-2">
                                    <div className="flex-grow bg-gray-100 rounded-full h-5 md:h-5 overflow-hidden shadow-sm border border-gray-300 relative">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 flex items-center justify-center px-2 font-bold text-white text-xs ${barColor}`}
                                            style={{
                                                width: `${Math.max(percentageValue, 3)}%`,
                                                minWidth: isVerySmall ? '30px' : 'auto'
                                            }}
                                        >
                                            {/* Show percentage inside bar only for sufficiently large bars */}
                                            {percentageValue >= 20 && (
                                                <span className="text-center whitespace-nowrap">
                                                    {percentageValue.toFixed(1)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Percentage Text Outside */}
                                    <span className="w-14 md:w-16 text-right text-xs md:text-sm font-bold text-gray-800 flex-shrink-0">
                                        {percentageValue.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default DiseaseLikelihood;