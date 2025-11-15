import React from "react";

const Footer = () => {
    return (
        // Replaced external CSS and nested footers with Tailwind classes
        // using charcoal black (gray-900) and light text (gray-300) for aesthetics.
        <footer className="fixed bottom-0 inset-x-0 z-40 w-full bg-gray-900 text-white py-2 md:py-2 shadow-inner">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm font-medium text-gray-300">
                    &copy; {new Date().getFullYear()} FacialDerma AI. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;