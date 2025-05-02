/* import React, { useState } from 'react';
import '../Styles/AuthForm.css';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMessage('');
    };
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            identifier: e.target.identifier.value,
            password: e.target.password.value,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log('Login API Response:', data);

            if (response.ok) {
                localStorage.clear(); // Clears everything in localStorage

                localStorage.setItem('access_token', data.access_token);
                console.log("Login API Response Data:", data); // This should include access_token and refresh_token

                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.setItem('user', JSON.stringify(data.user || {}));
                setMessage('Login successful! Redirecting...');
                setTimeout(() => navigate('/profile'), 1500);
            } else {
                setMessage('Login failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Something went wrong. Please try again.');
        }
    };
    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            username: e.target.username.value,
            email: e.target.email.value,
            age: e.target.age.value,
            gender: e.target.gender.value,
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Signup successful! Please login now.');
                setActiveTab('login');
            } else {
                setMessage('Signup failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div>
            <Header />
            <div className="auth-container">
                <div className="auth-tabs">
                    <button
                        className={activeTab === 'login' ? 'active' : ''}
                        onClick={() => handleTabChange('login')}
                    >
                        Login
                    </button>
                    <button
                        className={activeTab === 'signup' ? 'active' : ''}
                        onClick={() => handleTabChange('signup')}
                    >
                        Signup
                    </button>
                </div>

                {message && <div className="auth-message">{message}</div>}

                <div className="form-wrapper">
                    {activeTab === 'login' ? (
                        <form className="auth-form" onSubmit={handleLoginSubmit}>
                            <h2>Login</h2>
                            <input type="text" name="identifier" placeholder="Username or Email" required />
                            <input type="password" name="password" placeholder="Password" required />
                            <button type="submit">Login</button>
                            <p className="switch-text">
                                Don't have an account?{' '}
                                <span onClick={() => handleTabChange('signup')} className="switch-link">
                                    Signup
                                </span>
                            </p>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleSignupSubmit}>
                            <h2>Signup</h2>
                            <input type="text" name="username" placeholder="Username" required />
                            <input type="email" name="email" placeholder="Email" required />
                            <input type="number" name="age" placeholder="Age" min="0" required />
                            <select name="gender" defaultValue="" required>
                                <option value="" disabled>Gender</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="other">Other</option>
                            </select>
                            <input type="password" name="password" placeholder="Password" required />
                            <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
                            <button type="submit">Signup</button>
                            <p className="switch-text">
                                Already have an account?{' '}
                                <span onClick={() => handleTabChange('login')} className="switch-link">
                                    Login
                                </span>
                            </p>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AuthForm; */


import React, { useState, useContext } from 'react';
import '../Styles/AuthForm.css';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';  // Import AuthContext

const AuthForm = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const { login } = useContext(AuthContext);  // Get login function from context

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMessage('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            identifier: e.target.identifier.value,
            password: e.target.password.value,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log('Login API Response:', data);

            if (response.ok) {
                // Save token in context and localStorage
                login(data.access_token);

                // Optionally store refresh token and user info in localStorage
                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.setItem('user', JSON.stringify(data.user || {}));

                setMessage('Login successful! Redirecting...');
                setTimeout(() => navigate('/profile'), 1500);
            } else {
                setMessage('Login failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Something went wrong. Please try again.');
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            username: e.target.username.value,
            email: e.target.email.value,
            age: e.target.age.value,
            gender: e.target.gender.value,
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Signup successful! Please login now.');
                setActiveTab('login');
            } else {
                setMessage('Signup failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div>
            <Header />
            <div className="auth-container">
                <div className="auth-tabs">
                    <button
                        className={activeTab === 'login' ? 'active' : ''}
                        onClick={() => handleTabChange('login')}
                    >
                        Login
                    </button>
                    <button
                        className={activeTab === 'signup' ? 'active' : ''}
                        onClick={() => handleTabChange('signup')}
                    >
                        Signup
                    </button>
                </div>

                {message && <div className="auth-message">{message}</div>}

                <div className="form-wrapper">
                    {activeTab === 'login' ? (
                        <form className="auth-form" onSubmit={handleLoginSubmit}>
                            <h2>Login</h2>
                            <input type="text" name="identifier" placeholder="Username or Email" required />
                            <input type="password" name="password" placeholder="Password" required />
                            <button type="submit">Login</button>
                            <p className="switch-text">
                                Don't have an account?{' '}
                                <span onClick={() => handleTabChange('signup')} className="switch-link">
                                    Signup
                                </span>
                            </p>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleSignupSubmit}>
                            <h2>Signup</h2>
                            <input type="text" name="username" placeholder="Username" required />
                            <input type="email" name="email" placeholder="Email" required />
                            <input type="number" name="age" placeholder="Age" min="0" required />
                            <select name="gender" defaultValue="" required>
                                <option value="" disabled>Gender</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="other">Other</option>
                            </select>
                            <input type="password" name="password" placeholder="Password" required />
                            <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
                            <button type="submit">Signup</button>
                            <p className="switch-text">
                                Already have an account?{' '}
                                <span onClick={() => handleTabChange('login')} className="switch-link">
                                    Login
                                </span>
                            </p>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AuthForm;
