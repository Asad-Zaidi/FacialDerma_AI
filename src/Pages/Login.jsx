// import React, { useContext, useState } from 'react';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import Header from '../Nav_Bar/Header';
// import Footer from '../Nav_Bar/Footer';
// // import '../Styles/Login.css';
// // import { FaEye, FaEyeSlash } from 'react-icons/fa6';
// import '../Styles/AuthForm.css';

// const LoginForm = () => {
//     const [message, setMessage] = useState('');
//     const navigate = useNavigate();
//     const { login } = useContext(AuthContext);
//     const location = useLocation();

//     const handleLoginSubmit = async (e) => {
//         e.preventDefault();

//         const formData = {
//             identifier: e.target.identifier.value,
//             password: e.target.password.value,
//         };

//         try {
//             const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 login(data.user, data.token);
//                 navigate('/');
//             } else {
//                 setMessage(data.message || 'Login failed');
//             }
//         } catch (error) {
//             setMessage('An error occurred.');
//         }
//     };

//     return (
//         <>
//             <Header />
//             <div className="login-auth-page-wrapper">
//                 <div className="login-auth-container">
//                     <h2 className="login-title">Login</h2>

//                     <div className="login-auth-tabs-container">
//                         <Link
//                             to="/Login"
//                             className={`login-auth-tab-button ${location.pathname === '/Login' ? 'login-active' : ''}`}
//                         >
//                             Login
//                         </Link>
//                         <Link
//                             to="/Signup"
//                             className={`login-auth-tab-button ${location.pathname === '/Signup' ? 'login-active' : ''}`}
//                         >
//                             Signup
//                         </Link>
//                     </div>

//                     <form onSubmit={handleLoginSubmit}>
//                         <input
//                             className="login-auth-input"
//                             type="text"
//                             name="identifier"
//                             placeholder="Username or Email"
//                             required
//                         />
//                         <input
//                             className="login-auth-input"
//                             type="password"
//                             name="password"
//                             placeholder="Password"
//                             required
//                         />
//                         {message && <p className="login-message">{message}</p>}
//                         <div className="login-forgot-password">
//                             <Link to="/forget-password">Forgot Password?</Link>
//                         </div>

//                         <button className="login-auth-button" type="submit">
//                             Login
//                         </button>
//                     </form>

//                     <div className="login-auth-footer">
//                         Don't have an account? <Link to="/Signup">Signup</Link>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default LoginForm;

import React, { useContext, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/AuthForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

const LoginForm = () => {
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const location = useLocation();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/login/', {
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

                        <button className="auth-button" type="submit">
                            Login
                        </button>
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
