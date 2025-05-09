// import React, { useState } from 'react';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import Header from '../Nav_Bar/Header';
// import Footer from '../Nav_Bar/Footer';
// import { FaEye, FaEyeSlash } from 'react-icons/fa6';
// import '../Styles/AuthForm.css';

// const SignupForm = () => {
//     const [message, setMessage] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();

//     const handleSignupSubmit = async (e) => {
//         e.preventDefault();

//         const formData = {
//             name: e.target.username.value,
//             email: e.target.email.value,
//             role: e.target.role.value,
//             password: e.target.password.value,
//             password2: e.target.confirmPassword.value,
//         };

//         const confirmPassword = e.target.confirmPassword.value;

//         if (formData.password !== confirmPassword) {
//             setMessage('Passwords do not match!');
//             return;
//         }
    
//         try {
//             const response = await fetch('http://127.0.0.1:8000/api/auth/signup/', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData),
//             });
    
//             const data = await response.json();
    
//             if (response.ok) {
//                 navigate('/login');
//             } else {
//                 setMessage(data.password || data.detail || 'Signup failed');
//             }
//         } catch (error) {
//             setMessage('An error occurred.');
//         }
//     };
    


//     return (
//         <>
//             <Header />
//             <div className="auth-page-wrapper">
//                 <div className="auth-container">
//                     <h2>Signup</h2>
//                     <div className="auth-tabs-container">
//                         <Link to="/Login" className={`auth-tab-button ${location.pathname === '/Login' ? 'active' : ''}`}>Login</Link>
//                         <Link to="/Signup" className={`auth-tab-button ${location.pathname === '/Signup' ? 'active' : ''}`}>Signup</Link>
//                     </div>
//                     {message && <p style={{ color: 'red' }}>{message}</p>}
//                     <form onSubmit={handleSignupSubmit}>
//                         <select name="role" className="auth-input" required>
//                             <option value="" disabled selected>Signup as</option>
//                             <option value="doctor">Dermatotlogist</option>
//                             <option value="patient">User</option>
//                         </select>

//                         <input className="auth-input" type="text" name="username" placeholder="Username" required />
//                         <input className="auth-input" type="email" name="email" placeholder="Email" required />
//                         {/* <input className="auth-input" type="password" name="password" placeholder="Password" required />
//                         <input className="auth-input" type="password" name="confirmPassword" placeholder="Confirm Password" required /> */}
//                         <div className="auth-password-wrapper">
//                             <input
//                                 className="auth-input"
//                                 type={showPassword ? 'text' : 'password'}
//                                 name="password"
//                                 placeholder="Password"
//                                 required
//                             />
//                             <span onClick={() => setShowPassword(!showPassword)} className="auth-eye-icon">
//                                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//                             </span>
//                         </div>
//                         <div className="auth-password-wrapper">
//                             <input
//                                 className="auth-input"
//                                 type={showConfirmPassword ? 'text' : 'password'}
//                                 name="confirmPassword"
//                                 placeholder="Confirm Password"
//                                 required
//                             />
//                             <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="auth-eye-icon">
//                                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                             </span>
//                         </div>
//                         <button className="auth-button" type="submit">Signup</button>
//                     </form>
//                     <div className="auth-footer">
//                         Already have an account? <Link to="/Login">Login</Link>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default SignupForm;

import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import '../Styles/AuthForm.css';

const CustomSelect = ({ onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("Register as");

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

const SignupForm = () => {
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: e.target.username.value,
            email: e.target.email.value,
            role: role,
            password: e.target.password.value,
            password2: e.target.confirmPassword.value,
        };

        if (formData.password !== formData.password2) {
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
                setMessage(data.password || data.detail || 'Signup failed');
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
                    <div className="auth-tabs-container">
                        <Link to="/Login" className={`auth-tab-button ${location.pathname === '/Login' ? 'active' : ''}`}>Login</Link>
                        <Link to="/Signup" className={`auth-tab-button ${location.pathname === '/Signup' ? 'active' : ''}`}>Signup</Link>
                    </div>
                    {message && <p style={{ color: 'red' }}>{message}</p>}
                    <form onSubmit={handleSignupSubmit}>
                        <CustomSelect onChange={(value) => setRole(value)} />
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
