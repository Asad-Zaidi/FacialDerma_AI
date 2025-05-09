import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/AuthForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CustomSelect = ({ onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("Login as");

    const handleSelect = (value) => {
        setSelected(value.label);
        setIsOpen(false);
        onChange(value.value);
    };

    const options = [
        { label: "Dermatologist", value: "doctor" },
        { label: "User", value: "patient" }
    ];

    return (
        <div className="custom-select-wrapper" onClick={() => setIsOpen(!isOpen)}>
            <div className="custom-select">
                {selected}
                {isOpen ? <FaChevronUp className="icon" /> : <FaChevronDown className="icon" />}
            </div>
            {isOpen && (
                <ul className="select-options">
                    {options.map((opt, index) => (
                        <li key={index} onClick={() => handleSelect(opt)}>
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const LoginForm = () => {
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            email: e.target.email.value,
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
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
                navigate('/');
            } else {
                setMessage('Invalid credentials');
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
                    <h2>Login</h2>
                    <div className="auth-tabs-container">
                        <Link to="/Login" className={`auth-tab-button ${location.pathname === '/Login' ? 'active' : ''}`}>Login</Link>
                        <Link to="/Signup" className={`auth-tab-button ${location.pathname === '/Signup' ? 'active' : ''}`}>Signup</Link>
                    </div>

                    <CustomSelect onChange={(value) => setRole(value)} />

                    <form className="auth-form" onSubmit={handleLoginSubmit}>
                        <input
                            className="auth-input"
                            type="text"
                            name="email"
                            placeholder="Username or Email"
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
                            <span onClick={() => setShowPassword(!showPassword)} className="auth-eye-icon">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {message && <p className="auth-message">{message}</p>}

                        <div className="auth-footer" style={{ textAlign: 'left', width: '100%', marginTop: '5px' }}>
                            <Link to="/forget-password">Forgot Password?</Link>
                        </div>

                        <button className="auth-button" type="submit">Login</button>
                    </form>

                    <div className="auth-footer" style={{ marginTop: '115px' }}>
                        Don't have an account? <Link to="/Signup">Signup</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LoginForm;
