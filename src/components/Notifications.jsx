import React, { useState } from 'react';
import { FaBell, FaClock, FaTimes } from 'react-icons/fa';

// Helper to format date
const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

const Notifications = ({ 
    notifications, 
    onItemClick, 
    onClose, 
    onClearAll, 
    onDeleteNotification 
}) => {
    // Local state to manage items currently being animated out
    const [exitingItems, setExitingItems] = useState([]);
    const [isClearingAll, setIsClearingAll] = useState(false);

    const getText = (n) => {
        if (typeof n === 'string') return n;
        if (!n) return 'No details';
        return n.message || n.title || n.type || JSON.stringify(n);
    };

    // Handle single delete with animation
    const handleDeleteWithAnimation = (e, id) => {
        e.stopPropagation();
        setExitingItems((prev) => [...prev, id]);
        
        // Wait for animation (300ms) before calling parent prop
        setTimeout(() => {
            if (onDeleteNotification) onDeleteNotification(id);
            setExitingItems((prev) => prev.filter((itemId) => itemId !== id));
        }, 300);
    };

    // Handle Clear All with animation
    const handleClearAllWithAnimation = (e) => {
        e.stopPropagation();
        setIsClearingAll(true);
        
        setTimeout(() => {
            if (onClearAll) onClearAll();
            setIsClearingAll(false);
        }, 300);
    };

    return (
        <div className="absolute top-16 right-0 sm:right-4 w-[95vw] sm:w-[440px] max-w-[calc(100vw-2rem)] bg-gradient-to-b from-white to-gray-400 border border-gray-300 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 overflow-hidden flex flex-col font-sans backdrop-blur-sm">
            
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-1 bg-gray-300">
                <h4 className="text-base font-bold text-gray-950 tracking-wide flex items-center gap-2">
                    <FaBell className="h-4 w-4" />
                    Notifications 
                    {notifications.length > 0 && (
                        <span className="ml-1 bg-white/25 text-gray-950 px-2.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/30">
                            {notifications.length}
                        </span>
                    )}
                </h4>
                <div className="flex items-center gap-3">
                    {notifications.length > 0 && (
                        <button
                            className="text-sm text-gray-600 font-semibold hover:text-gray-800"
                            onClick={handleClearAllWithAnimation}
                        >
                            Clear All
                        </button>
                    )}
                    <button 
                        className="text-gray-600 hover:text-gray-700 transition-all duration-200 text-2xl leading-none w-8 h-8 " 
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
            </div>

            {/* List */}
            <ul className="max-h-[500px] overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-2"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 #f1f5f9'
                }}>
                {notifications.length > 0 ? (
                    notifications.map((n, idx) => {
                        const id = n.id || n._id || idx;
                        const isRead = n.isRead || n.read;
                        const isExiting = exitingItems.includes(id) || isClearingAll;

                        return (
                            <li
                                key={id}
                                onClick={() => {
                                    if (onItemClick) {
                                        onItemClick(n);
                                    }
                                }}
                                className={`
                                    relative mb-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out
                                    bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300
                                    ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
                                `}
                            >
                                <div className="flex items-start p-1 pl-4 pr-12">
                                    <div className="flex-1 flex flex-col">
                                        <p className={`text-sm leading-relaxed transition-all duration-300 ${
                                            !isRead 
                                                ? 'text-gray-900 font-bold' 
                                                : 'text-gray-600 font-normal'
                                        }`}>
                                            {getText(n)}
                                        </p>
                                        {n.createdAt && (
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <FaClock className="h-3 w-3" />
                                                {formatDateTime(n.createdAt)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Blue Dot Indicator (Only if Unread) - Will disappear when read */}
                                    {!isRead && (
                                        <span className="absolute top-4 right-12 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
                                    )}
                                </div>

                                {/* Delete 'X' Button */}
                                <button
                                    onClick={(e) => handleDeleteWithAnimation(e, id)}
                                    className="absolute top-2 right-4 p-1.5 text-gray-400 hover:text-gray-500"
                                    title="Delete notification"
                                >
                                    <FaTimes className="h-4 w-4" />
                                </button>
                            </li>
                        );
                    })
                ) : (
                    <li className="p-12 text-center flex flex-col items-center gap-3">
                        <div className="w-16 h-10  flex items-center justify-center">
                            <FaBell className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">No new notifications</p>
                        <p className="text-gray-400 text-xs">You're all caught up!</p>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Notifications;