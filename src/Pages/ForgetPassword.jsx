import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/ForgetPassword.css';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/send-otp/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('A 4-digit OTP has been sent to your email.');
                setTimeout(() => {
                    navigate('/VerifyOTP', { state: { email } });
                }, 1500);
            } else {
                setError(data.message || 'Failed to send OTP.');
            }
        } catch (err) {
            setError('An error occurred.');
        }
    };

    return (
        <>
            <Header />
            <div className="reset-auth-page-wrapper">
                <div className="reset-auth-container">
                    <h2 className="reset-title">Forgot Password</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            className="reset-auth-input"
                            type="email"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {message && <p className="reset-message" style={{ color: 'green' }}>{message}</p>}
                        {error && <p className="reset-message">{error}</p>}

                        <button className="reset-auth-button" type="submit">
                            Send OTP
                        </button>
                    </form>

                    <div className="reset-auth-footer">
                        Remember your Password? <Link to="/Login">Login</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ForgetPassword;
