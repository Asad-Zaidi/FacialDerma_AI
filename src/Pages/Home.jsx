import React from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/Home.css';

const Home = () => {
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

                    <div className="button-group">
                        <a href="/Login" className="btn-primary">Get Started →</a>
                        <img src="/Assets/google-play-badge.png" alt="Google Play" className="google-play-badge" />
                    </div>
                </div>

                <div className="home-right">
                <img src="/Assets/home1.png" alt="Facial AI Diagnosis" className="static-image" />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
