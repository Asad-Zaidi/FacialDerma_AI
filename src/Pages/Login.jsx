import React, { useContext, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/AuthForm.css';

const LoginForm = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            identifier: e.target.identifier.value,
            password: e.target.password.value,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user, data.token);
                navigate('/');
            } else {
                setMessage(data.message || 'Login failed');
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
                    <h2>Login</h2>

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


                    <form onSubmit={handleLoginSubmit}>
                        <input className="auth-input" type="text" name="identifier" placeholder="Username or Email" required />
                        <input className="auth-input" type="password" name="password" placeholder="Password" required />
                        {message && <p >{message}</p>}
                        <div className="forgot-password">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>

                        <button className="auth-button" type="submit">Login</button>
                    </form>
                    <div className="auth-footer">
                        Don't have an account? <Link to="/Signup">Signup</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LoginForm;