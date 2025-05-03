import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/AuthForm.css';

const SignupForm = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
        };

        const confirmPassword = e.target.confirmPassword.value;

        if (formData.password !== confirmPassword) {
            setMessage('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/signup/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setMessage(data.message || 'Signup failed');
            }
        } catch (error) {
            setMessage('An error occurred.');
        }
    };

    const location = useLocation();

    return (
        <>
            <Header />
            <div className="auth-page-wrapper">
            <div className="auth-container">
                <h2>Signup</h2>
                <div className="auth-tabs-container">
                    <Link
                        to="/Login"
                        className={`auth-tab-button ${location.pathname === '/Login' ? 'active' : ''}`}
                    >
                        Login
                    </Link>
                    <Link
                        to="/Signup"
                        className={`auth-tab-button ${location.pathname === '/Signup' ? 'active' : ''}`}
                    >
                        Signup
                    </Link>
                </div>


                {message && <p style={{ color: 'red' }}>{message}</p>}
                <form onSubmit={handleSignupSubmit}>
                    <input className="auth-input" type="text" name="username" placeholder="Username" required />
                    <input className="auth-input" type="email" name="email" placeholder="Email" required />
                    <input className="auth-input" type="password" name="password" placeholder="Password" required />
                    <input className="auth-input" type="password" name="confirmPassword" placeholder="Confirm Password" required />
                    <button className="auth-button" type="submit">Signup</button>
                </form>
                <div className="auth-footer">
                    Already have an account? <Link to="/Login">Login</Link>
                </div>
            </div>
            </div>
            <Footer />
        </>
    );
};

export default SignupForm;
