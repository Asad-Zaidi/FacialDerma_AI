import React from 'react';
import '../Styles/ConfirmLogout.css';

const ConfirmLogout = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <h3>Confirmation</h3>
                <p>{message}</p>
                <div className="popup-actions">
                    <button className="confirm-btn" onClick={onConfirm}>Yes</button>
                    <button className="cancel-btn" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmLogout;
