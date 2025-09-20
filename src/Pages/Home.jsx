// import React from 'react';
// import Header from '../Nav_Bar/Header';
// import Footer from '../Nav_Bar/Footer';
// import '../Styles/Home.css';
// import { useAuth } from '../contexts/AuthContext';


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

const Home = () => {
    const { accessToken } = useAuth();
    const isLoggedIn = !!accessToken;

    console.log("accessToken in Home.jsx:", accessToken);

    return (
        <div>
            <Header />
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

                    <div className="feature-card">
                        <img src="/Assets/aesthetic-suggestions.png" alt="Aesthetic Enhancement Suggestions" className="feature-icon" />
                        <h3 className="feature-name">Aesthetic Enhancement Suggestions</h3>
                        <p className="feature-description">
                            Receive expert suggestions for skincare and cosmetic enhancements.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
