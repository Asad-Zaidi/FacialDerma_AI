import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/ForgetPassword.css';

const ForgetPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('OTP sent to your email.');
                setStep(2);
            } else {
                setError(data.message || 'Failed to send OTP.');
            }
        } catch (err) {
            setError('An error occurred.');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('OTP verified. Please enter a new password.');
                setStep(3);
            } else {
                setError(data.message || 'Invalid OTP.');
            }
        } catch (err) {
            setError('An error occurred.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Password reset successfully. Redirecting to login...');
                setTimeout(() => navigate('/Login'), 2000);
            } else {
                setError(data.message || 'Password reset failed.');
            }
        } catch (err) {
            setError('An error occurred.');
        }
    };

    return (
        <>
            <Header />
            <div className="reset-page-wrapper">
                <div className="reset-container">
                    <h1 className="reset-title">Reset Password</h1>
                    {step === 1 && (
                        <>
                            <p className="reset-subtitle">Enter your email to receive OTP.</p>
                            <form onSubmit={handleEmailSubmit} className="reset-form">
                                <input
                                    className="reset-input"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button className="reset-button" type="submit">Send OTP</button>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <p className="reset-subtitle">Enter the 4-digit OTP sent to your email.</p>
                            <form onSubmit={handleOtpSubmit} className="reset-form">
                                <input
                                    className="reset-input"
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                                <button className="reset-button" type="submit">Verify OTP</button>
                            </form>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <p className="reset-subtitle">Set your new password.</p>
                            <form onSubmit={handleResetPassword} className="reset-form">
                                <input
                                    className="reset-input"
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <input
                                    className="reset-input"
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button className="reset-button" type="submit">Reset Password</button>
                            </form>
                        </>
                    )}

                    {message && <p className="reset-message" style={{ color: 'green' }}>{message}</p>}
                    {error && <p className="reset-message" style={{ color: 'red' }}>{error}</p>}

                    <div className="reset-footer">
                        Remember your password? <Link to="/Login">Login</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ForgetPassword;
