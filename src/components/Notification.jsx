import React, { useEffect, useState } from 'react';
import "../Styles/Notification.css"; // Import your CSS file for styling

const Notification = ({ message, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000); // auto-hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="notification">
            <p>{message}</p>
            <button className="close-btn" onClick={onClose}>×</button>
        </div>
    );
};

export default Notification;
