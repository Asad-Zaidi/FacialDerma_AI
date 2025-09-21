// import React from 'react';
// import Header from '../Nav_Bar/Header';
// import Footer from '../Nav_Bar/Footer';
// import '../Styles/Home.css';
// import { useAuth } from '../contexts/AuthContext';
// import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaDiscord, FaEnvelope,  } from "react-icons/fa";

// const Home = () => {
//     const { accessToken } = useAuth();
//     const isLoggedIn = !!accessToken;

//     console.log("accessToken in Home.jsx:", accessToken);

//     return (
//         <div>
//             <Header />
//             <div className="home-container">
//                 <div className="home-left">
//                     <span className="tagline">AI-Powered Skin Analysis</span>
//                     <h1 className="main-title">FacialDerma AI</h1>
//                     <p className="sub-description">
//                         Upload a photo and get instant AI-powered analysis of your skin conditions,
//                         personalized treatment recommendations, and aesthetic enhancement suggestions.{' '}
//                         <a href="/About" className="learn-link">Learn More...</a>
//                     </p>

//                     {!isLoggedIn && (
//                         <div className="button-group">
//                             <a href="/Login" className="btn-primary">Get Started →</a>
//                             <img src="/Assets/google-play-badge.png" alt="Google Play" className="google-play-badge" />
//                         </div>
//                     )}
//                 </div>

//                 <div className="home-right">
//                     <img src="/Assets/home1.png" alt="Facial AI Diagnosis" className="static-image" />
//                 </div>
//             </div>

//             {/* Features Section */}
//             <section className="features-section">
//                 <h2 className="features-title">Our Features</h2>
//                 <div className="features-flex">
//                     <div className="feature-card">
//                         <img src="/Assets/skin-detection.png" alt="Skin Condition Detection" className="feature-icon" />
//                         <h3 className="feature-name">Skin Condition Detection</h3>
//                         <p className="feature-description">
//                             Detect acne, eczema, pigmentation & more via AI from just a photo.
//                         </p>
//                     </div>

//                     <div className="feature-card">
//                         <img src="/Assets/treatment-plan.png" alt="Personalized Treatment Plan" className="feature-icon" />
//                         <h3 className="feature-name">Personalized Treatment Plan</h3>
//                         <p className="feature-description">
//                             We generate a treatment plan tailored to your skin type and conditions.
//                         </p>
//                     </div>

//                     <div className="feature-card">
//                         <img src="/Assets/progress-tracking.png" alt="Progress Tracking" className="feature-icon" />
//                         <h3 className="feature-name">Progress Tracking</h3>
//                         <p className="feature-description">
//                             Track your skin’s improvements over time with before–after comparisons.
//                         </p>
//                     </div>

//                     <div className="feature-card">
//                         <img src="/Assets/aesthetic-suggestions.png" alt="Aesthetic Enhancement Suggestions" className="feature-icon" />
//                         <h3 className="feature-name">Aesthetic Enhancement Suggestions</h3>
//                         <p className="feature-description">
//                             Receive expert suggestions for skincare and cosmetic enhancements.
//                         </p>
//                     </div>
//                 </div>
//             </section>

//             <section className="how-it-works">
//                 <h2 className="features-title">How It Works?</h2>
//                 <div className="steps-container">
//                     <div className="step-card">
//                         <img src="/Assets/upload.png" alt="Upload" className="step-icon" />
//                         <h3>Upload Your Photo</h3>
//                         <p>Simply take or upload a clear photo of your face.</p>
//                     </div>
//                     <div className="step-card">
//                         <img src="/Assets/analysis.png" alt="AI Analysis" className="step-icon" />
//                         <h3>AI Analysis</h3>
//                         <p>Our advanced AI scans your skin for potential conditions.</p>
//                     </div>
//                     <div className="step-card">
//                         <img src="/Assets/report.png" alt="Report" className="step-icon" />
//                         <h3>Get Your Report</h3>
//                         <p>Receive instant results with treatment and care suggestions.</p>
//                     </div>
//                 </div>
//             </section>

//             {/* Social Media Section */}
//             <section className="social-media-section">
//                 <h2 className="social-title">Follow Us</h2>
//                 <div className="social-icons">
//                     <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
//                     <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
//                     <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
//                     <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
//                     <a href="https://discord.com" target="_blank" rel="noreferrer"><FaDiscord /></a>
//                     <a href="mailto:someone@gmail.com"><FaEnvelope /></a>
//                 </div>
//             </section>

//             <Footer />
//         </div>
//     );
// };

// export default Home;


import React from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/Home.css';
import { useAuth } from '../contexts/AuthContext';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaDiscord } from "react-icons/fa";
import {SiGmail} from "react-icons/si";

const Home = () => {
    const { accessToken } = useAuth();
    const isLoggedIn = !!accessToken;

    console.log("accessToken in Home.jsx:", accessToken);

    return (
        <div>
            <Header />

            {/* Hero Section */}
            <div className="home-container">
                <div className="home-left">
                    <span className="tagline">AI-Powered Skin Analysis</span>
                    <h1 className="main-title">FacialDerma AI</h1>
                    <p className="sub-description">
                        Upload a photo and get instant AI-powered analysis of your skin conditions,
                        personalized treatment recommendations, and aesthetic enhancement suggestions.{' '}
                        <a href="/About" className="learn-link">Learn More...</a>
                    </p>

                    {!isLoggedIn && (
                        <div className="button-group">
                            <a href="/Login" className="btn-primary">Get Started →</a>
                            <img src="/Assets/google-play-badge.png" alt="Google Play" className="google-play-badge" />
                        </div>
                    )}
                </div>

                <div className="home-right">
                    <img src="/Assets/home1.png" alt="Facial AI Diagnosis" className="static-image" />
                </div>
            </div>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="features-title">Our Features</h2>
                <div className="features-flex">
                    <div className="feature-card">
                        <img src="/Assets/skin-detection.png" alt="Skin Condition Detection" className="feature-icon" />
                        <h3 className="feature-name">Skin Condition Detection</h3>
                        <p className="feature-description">
                            Detect acne, eczema, pigmentation & more via AI from just a photo.
                        </p>
                    </div>

                    <div className="feature-card">
                        <img src="/Assets/treatment-plan.png" alt="Personalized Treatment Plan" className="feature-icon" />
                        <h3 className="feature-name">Personalized Treatment Plan</h3>
                        <p className="feature-description">
                            We generate a treatment plan tailored to your skin type and conditions.
                        </p>
                    </div>

                    <div className="feature-card">
                        <img src="/Assets/progress-tracking.png" alt="Progress Tracking" className="feature-icon" />
                        <h3 className="feature-name">Progress Tracking</h3>
                        <p className="feature-description">
                            Track your skin’s improvements over time with before–after comparisons.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <h2 className="features-title">How It Works?</h2>
                <div className="steps-container">
                    <div className="step-card">
                        <img src="/Assets/upload.png" alt="Upload" className="step-icon" />
                        <h3>Upload Your Photo</h3>
                        <p>Simply take or upload a clear photo of your face.</p>
                    </div>
                    <div className="step-card">
                        <img src="/Assets/analysis.png" alt="AI Analysis" className="step-icon" />
                        <h3>AI Analysis</h3>
                        <p>Our advanced AI scans your skin for potential conditions.</p>
                    </div>
                    <div className="step-card">
                        <img src="/Assets/report.png" alt="Report" className="step-icon" />
                        <h3>Get Your Report</h3>
                        <p>Receive instant results with treatment and care suggestions.</p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="contact-left">
                    <h2>Get in Touch</h2>
                    <p className="contact-subtext">I'd like to hear from you!</p>
                    <p>If you have any inquiries or just want to say hi, please use the contact form!</p>

                    <div className="contact-details">
                        <SiGmail className="contact-icon" />
                        <a href="mailto:syedasad1410@gmail.com">syedasad1410@gmail.com</a>
                    </div>

                    <div className="contact-socials">
                        <a href="https://www.facebook.com/assadzaidii/" target="_blank" rel="noreferrer"><FaFacebook /></a>
                        <a href="https://www.instagram.com/assadzaidii/" target="_blank" rel="noreferrer"><FaInstagram /></a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
                        <a href="https://wa.me/+923084401410" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
                        <a href="https://discord.com" target="_blank" rel="noreferrer"><FaDiscord /></a>
                    </div>
                </div>

                <div className="contact-right">
                    <form>
                        <div className="form-row">
                            <input type="text" placeholder="First Name" required />
                            <input type="text" placeholder="Last Name" required />
                        </div>
                        <input type="email" placeholder="Email *" required />
                        <textarea placeholder="Message" rows="5"></textarea>
                        <button type="submit" className="btn-send">Send</button>
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
