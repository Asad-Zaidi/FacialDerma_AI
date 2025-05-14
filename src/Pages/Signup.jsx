import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import '../Styles/AuthForm.css';
import AuthTabs from '../components/ui/AuthTabs';

const SignupForm = () => {
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            role: role,
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            password2: e.target.confirmPassword.value,
        };

        if (!role) {
            setMessage('Please select a role.');
            return;
        }

        if (formData.password !== formData.password2) {
            setMessage('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Signup successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                setMessage(data.error || data.message || 'Signup failed');
            }

        } catch (error) {
            setMessage('An error occurred.');
        }
    };

    return (
        <>
            <Header />
            <div className="auth-page-wrapper">
                <div className="auth-container">
                    <h2>Signup</h2>
                    <AuthTabs />
                    <form onSubmit={handleSignupSubmit}>
                        <div className="auth-role-selection">
                            <p>Register as:</p>
                            <input
                                type="radio"
                                id="patient"
                                name="role"
                                value="patient"
                                checked={role === 'patient'}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <label htmlFor="patient">User</label>

                            <input
                                type="radio"
                                id="dermatologist"
                                name="role"
                                value="dermatologist"
                                checked={role === 'dermatologist'}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <label htmlFor="dermatologist">Dermatologist</label>
                        </div>

                        <input className="auth-input" type="text" name="username" placeholder="Username" required />
                        <input className="auth-input" type="email" name="email" placeholder="Email" required />

                        <div className="auth-password-wrapper">
                            <input
                                className="auth-input"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                required
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="auth-eye-icon">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className="auth-password-wrapper">
                            <input
                                className="auth-input"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                required
                            />
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="auth-eye-icon">
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {message && <p className="auth-message">{message}</p>}

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
