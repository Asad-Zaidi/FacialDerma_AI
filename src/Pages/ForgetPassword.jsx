// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Header from '../Nav_Bar/Header';
// import Footer from '../Nav_Bar/Footer';
// import '../Styles/ForgetPassword.css';

// const ForgetPassword = () => {
//     const [email, setEmail] = useState('');
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setMessage('');
//         setError('');

//         try {
//             const response = await fetch('http://127.0.0.1:8000/api/auth/send-otp/', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 setMessage('A 4-digit OTP has been sent to your email.');
//                 setTimeout(() => {
//                     navigate('/VerifyOTP', { state: { email } });
//                 }, 1500);
//             } else {
//                 setError(data.message || 'Failed to send OTP.');
//             }
//         } catch (err) {
//             setError('An error occurred.');
//         }
//     };

//     return (
//         <>
//             <Header />
//             <div className="reset-page-wrapper">
//                 <div className="reset-container">
//                     <h1 className="reset-title">Reset Password</h1>
//                     <p className="reset-subtitle">Enter your email to Reset Password.</p>

//                     <form onSubmit={handleSubmit} className="reset-form">
//                         <input
//                             className="reset-input"
//                             type="email"
//                             placeholder="Enter your Email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                         {message && <p className="reset-message" style={{ color: 'green' }}>{message}</p>}
//                         {error && <p className="reset-message" style={{ color: 'red' }}>{error}</p>}

//                         <button className="reset-button" type="submit">
//                             Send Code
//                         </button>
//                     </form>

//                     <div className="reset-footer">
//                         Remember your Password? <Link to="/Login">Login</Link>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default ForgetPassword;

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
            <div className="reset-page-wrapper">
                <div className="reset-container">
                    <h1 className="reset-title">Reset Password</h1>
                    <p className="reset-subtitle">Enter your email to Reset Password.</p>
                    <form onSubmit={handleSubmit} className="reset-form">
                        <input
                            className="reset-input"
                            type="email"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {message && <p className="reset-message" style={{ color: 'green' }}>{message}</p>}
                        {error && <p className="reset-message" style={{ color: 'red' }}>{error}</p>}
                        <button className="reset-button" type="submit">Send Code</button>
                    </form>
                    <div className="reset-footer">
                        Remember your Password? <Link to="/Login">Login</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ForgetPassword;
