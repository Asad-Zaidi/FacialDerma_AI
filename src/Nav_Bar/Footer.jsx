import React from "react";

const Footer = () => {
    return (
        <footer className="fixed bottom-0 inset-x-0 z-40 w-full bg-gray-950 text-white py-1 md:py-1 shadow-inner">
            <div className="px-4 sm:px-6 lg:px-6">
                <p className="text-center text-xs font-small text-gray-300">
                    &copy; {new Date().getFullYear()} FacialDerma AI. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;