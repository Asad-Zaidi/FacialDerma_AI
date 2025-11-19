import React from 'react';
import '../Styles/Notifications.css';

const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};

const Notifications = ({ notifications, onItemClick, onMarkAsRead, onClose, onClearAll, onDeleteNotification }) => {
    const getText = (n) => {
        // Extract notification text from various possible formats
        if (typeof n === 'string') return n;
        if (!n) return 'No notification details';

        // Priority order: message > title > type
        return n.message || n.title || n.type || JSON.stringify(n);
    };

    return (
        <div className="notifications-dropdown">
            <div className="notifications-header">
                <h4>Notifications</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {notifications.length > 0 && (
                        <button
                            className="text-[12px] text-gray-500 font-medium cursor-pointer hover:text-[#3f3f3f]"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClearAll && onClearAll();
                            }}
                        >
                            Clear All
                        </button>

                    )}
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
            </div>
            <ul>
                {notifications.length > 0 ? (
                    notifications.map((n, idx) => (
                        <li
                            key={n.id || n._id || idx}
                            className="notification-item"
                            style={{ cursor: onItemClick ? 'pointer' : 'default', position: 'relative' }}
                        >
                            <div
                                onClick={() => onItemClick && onItemClick(n)}
                                style={{ flex: 1 }}
                            >
                                <div className="notification-content">
                                    <p className="notification-text">{getText(n)}</p>
                                    {n.createdAt && (
                                        <span className="notification-time">
                                            {formatDateTime(n.createdAt)}
                                        </span>
                                    )}
                                </div>
                                {/* Backend uses 'isRead' field */}
                                {!n.isRead && !n.read && <span className="unread-badge"></span>}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteNotification && onDeleteNotification(n.id || n._id);
                                }}
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#999',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    padding: '4px 8px',
                                    lineHeight: '1'
                                }}
                                title="Delete notification"
                            >
                                ×
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="notification-item">No new notifications</li>
                )}
            </ul>
        </div>
    );
};

export default Notifications;