import React from 'react';
import '../Styles/Notifications.css';

const Notifications = ({ notifications, onClose }) => {
    return (
        <div className="notifications-dropdown">
            <div className="notifications-header">
                <h4>Notifications</h4>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>
            <ul>
                {notifications.length > 0 ? (
                    notifications.map((note, index) => (
                        <li key={index} className="notification-item">
                            {note}
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
