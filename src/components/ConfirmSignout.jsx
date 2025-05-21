import React from "react";
import "../Styles/ConfirmSignout.css";
import { PiWarningCircleLight } from "react-icons/pi";

const ConfirmSignOut = ({ onConfirm, onCancel }) => {
    return (
        <div className="confirm-signout-overlay">
            <div className="confirm-signout-box">
                <PiWarningCircleLight color="#E53935" size={70}/>
                <h3>Are you sure you want to logout?</h3>
                <div className="confirm-buttons">
                    <button className="confirm-btn" onClick={onConfirm}>Yes, Logout</button>
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmSignOut;
