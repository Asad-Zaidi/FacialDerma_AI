import React from 'react';
import '../Styles/Notifications.css';

const formatDateTime = (dateString) => {
    if (!dateString) return '';
    console.log('Original dateString:', dateString);
    console.log('Date object:', new Date(dateString));
    console.log('ISO String:', new Date(dateString).toISOString());
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
    const formatted = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    console.log('Formatted:', formatted);
    return formatted;
};

const Notifications = ({ notifications, onItemClick, onMarkAsRead, onClose }) => {
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
                <button className="close-btn" onClick={onClose}>×</button>
            </div>
            <ul>
                {notifications.length > 0 ? (
                    notifications.map((n, idx) => (
                        <li
                            key={n.id || n._id || idx}
                            className="notification-item"
                            onClick={() => onItemClick && onItemClick(n)}
                            style={{ cursor: onItemClick ? 'pointer' : 'default' }}
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