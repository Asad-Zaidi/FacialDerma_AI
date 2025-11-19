// import React from 'react';
// import '../Styles/Notifications.css';

// const formatDateTime = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     let hours = date.getHours();
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12 || 12;
//     hours = String(hours).padStart(2, '0');
//     return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
// };

// const Notifications = ({ notifications, onItemClick, onMarkAsRead, onClose, onClearAll, onDeleteNotification }) => {
//     const getText = (n) => {
//         // Extract notification text from various possible formats
//         if (typeof n === 'string') return n;
//         if (!n) return 'No notification details';

//         // Priority order: message > title > type
//         return n.message || n.title || n.type || JSON.stringify(n);
//     };

//     return (
//         <div className="notifications-dropdown">
//             <div className="notifications-header">
//                 <h4>Notifications</h4>
//                 <div style={{ display: 'flex', gap: '8px' }}>
//                     {notifications.length > 0 && (
//                         <button
//                             className="text-[12px] text-gray-500 font-medium cursor-pointer hover:text-[#3f3f3f]"
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 onClearAll && onClearAll();
//                             }}
//                         >
//                             Clear All
//                         </button>

//                     )}
//                     <button className="close-btn" onClick={onClose}>×</button>
//                 </div>
//             </div>
//             <ul>
//                 {notifications.length > 0 ? (
//                     notifications.map((n, idx) => (
//                         <li
//                             key={n.id || n._id || idx}
//                             className="notification-item"
//                             style={{ cursor: onItemClick ? 'pointer' : 'default', position: 'relative' }}
//                         >
//                             <div
//                                 onClick={() => onItemClick && onItemClick(n)}
//                                 style={{ flex: 1 }}
//                             >
//                                 <div className="notification-content">
//                                     <p className="notification-text">{getText(n)}</p>
//                                     {n.createdAt && (
//                                         <span className="notification-time">
//                                             {formatDateTime(n.createdAt)}
//                                         </span>
//                                     )}
//                                 </div>
//                                 {/* Backend uses 'isRead' field */}
//                                 {!n.isRead && !n.read && <span className="unread-badge"></span>}
//                             </div>
//                             <button
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     onDeleteNotification && onDeleteNotification(n.id || n._id);
//                                 }}
//                                 style={{
//                                     position: 'absolute',
//                                     right: '8px',
//                                     top: '50%',
//                                     transform: 'translateY(-50%)',
//                                     background: 'transparent',
//                                     border: 'none',
//                                     color: '#999',
//                                     fontSize: '18px',
//                                     cursor: 'pointer',
//                                     padding: '4px 8px',
//                                     lineHeight: '1'
//                                 }}
//                                 title="Delete notification"
//                             >
//                                 ×
//                             </button>
//                         </li>
//                     ))
//                 ) : (
//                     <li className="notification-item">No new notifications</li>
//                 )}
//             </ul>
//         </div>
//     );
// };

// export default Notifications;

import React, { useState } from 'react';

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
        <div className="absolute top-16 right-0 sm:right-4 w-[95vw] sm:w-[420px] bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col font-sans ring-1 ring-white/5">
            
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 bg-[#202023] border-b border-[#27272a]">
                <h4 className="text-sm font-semibold text-zinc-200 tracking-wide">
                    Notifications 
                    {notifications.length > 0 && (
                        <span className="ml-2 bg-[#27272a] text-zinc-400 px-2 py-0.5 rounded-full text-xs border border-[#3f3f46]">
                            {notifications.length}
                        </span>
                    )}
                </h4>
                <div className="flex items-center gap-4">
                    {notifications.length > 0 && (
                        <button
                            className="text-xs text-zinc-500 font-medium hover:text-zinc-300 transition-colors duration-200 uppercase tracking-wider"
                            onClick={handleClearAllWithAnimation}
                        >
                            Clear All
                        </button>
                    )}
                    <button 
                        className="text-zinc-500 hover:text-zinc-100 transition-colors text-xl leading-none" 
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
            </div>

            {/* List */}
            <ul className="max-h-[400px] overflow-y-auto custom-scrollbar bg-[#18181b]">
                {notifications.length > 0 ? (
                    notifications.map((n, idx) => {
                        const id = n.id || n._id || idx;
                        const isRead = n.isRead || n.read;
                        const isExiting = exitingItems.includes(id) || isClearingAll;

                        return (
                            <li
                                key={id}
                                onClick={() => onItemClick && onItemClick(n)}
                                className={`
                                    relative p-4 border-b border-[#27272a] last:border-0 cursor-pointer transition-all duration-300 ease-in-out
                                    ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
                                    ${!isRead ? 'bg-[#202023] hover:bg-[#27272a]' : 'bg-[#18181b] hover:bg-[#1f1f22]'}
                                `}
                            >
                                <div className="flex items-start pr-6">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${!isRead ? 'text-zinc-200 font-medium' : 'text-zinc-500 font-normal'}`}>
                                            {getText(n)}
                                        </p>
                                        {n.createdAt && (
                                            <span className="text-[11px] text-zinc-600 tracking-wide">
                                                {formatDateTime(n.createdAt)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Blue Dot Indicator (Only if Unread) */}
                                    {!isRead && (
                                        <span className="absolute top-5 right-10 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse"></span>
                                    )}
                                </div>

                                {/* Delete 'X' Button */}
                                <button
                                    onClick={(e) => handleDeleteWithAnimation(e, id)}
                                    className="absolute top-1/2 -translate-y-1/2 right-3 p-1.5 text-zinc-600 hover:text-red-400 hover:bg-[#2a2a2d] rounded-md transition-all duration-200 group"
                                    title="Delete"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </li>
                        );
                    })
                ) : (
                    <li className="p-8 text-center text-zinc-600 text-sm italic flex flex-col items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        No new notifications
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Notifications;