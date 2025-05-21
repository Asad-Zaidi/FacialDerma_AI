import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/AuthForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { ScaleLoader } from 'react-spinners';
import AuthTabs from '../components/ui/AuthTabs';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        if (!role) {
            setMessage('Please select a role');
            setLoading(false);
            return;
        }

        const formData = {
            emailOrUsername: e.target.emailOrUsername.value,
            password: e.target.password.value,
            role: role,
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, {
                    email: data.user.email,
                    username: data.user.username,
                    role: data.user.role
                });

                if (data.user.role === 'patient') {
                    navigate('/home');
                } else if (data.user.role === 'dermatologist') {
                    navigate('/DProfile');
                }

                console.log('Login successful');
            } else {
                setMessage(data.error || 'Invalid credentials');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="auth-page-wrapper">
                <div className="auth-container">
                    <h2>Login</h2>
                    <AuthTabs />
                    <div className="auth-role-selection">
                        <p>Login As:</p>
                        <input
                            type="radio"
                            id="User"
                            name="User_role"
                            value="patient"
                            checked={role === 'patient'}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        <label htmlFor="User">User</label>

                        <input
                            type="radio"
                            id="Dermatologist"
                            name="User_role"
                            value="dermatologist"
                            checked={role === 'dermatologist'}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        <label htmlFor="Dermatologist">Dermatologist</label>
                    </div>

                    <form className="auth-form" onSubmit={handleLoginSubmit}>
                        <input
                            className="auth-input"
                            type="text"
                            name="emailOrUsername"
                            placeholder="Email or Username"
                            required
                        />

                        <div className="auth-password-wrapper">
                            <input
                                className="auth-input"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="auth-eye-icon"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {message && <p className="auth-message">{message}</p>}

                        <div
                            className="auth-footer"
                            style={{ textAlign: 'right', width: '100%', marginTop: '2px' }}
                        >
                            <Link to="/forget-password">Forgot Password?</Link>
                        </div>

                        <button className="auth-button" type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/Signup">Signup</Link>
                    </div>
                </div>
            </div>
            <Footer />
            {loading && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999
                    }}
                >
                    <ScaleLoader color="#E11584" height={100} />
                </div>
            )}
        </>
    );
};

export default LoginForm;
