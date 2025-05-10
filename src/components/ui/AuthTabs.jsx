import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AuthTabs.css';

const AuthTabs = () => {
    const location = useLocation();
    const isLogin = location.pathname === '/Login';

    return (
        <div className="auth-tabs-container">
            <div className="slide-controls">
                <Link to="/Login" className={`auth-tab-button ${isLogin ? 'active' : ''}`}>Login</Link>
                <Link to="/Signup" className={`auth-tab-button ${!isLogin ? 'active' : ''}`}>Signup</Link>
                <div className="slider-tab" style={{ left: isLogin ? '0%' : '50%' }}></div>
            </div>
        </div>
    );
};

export default AuthTabs;
