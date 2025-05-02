import React from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/About.css';

const About = () => {
    return (
        <div>
            <Header />
            <div className="about-container">
                <h2 className="about-title">About Us</h2>
                
                <section className="about-section">
                    <h3 className="section-title">Welcome to FacialDerma AI — Your Personal Skin Health Companion</h3>
                    <p className="section-content">
                        At FacialDerma AI, we are passionate about combining artificial intelligence and dermatological science to empower individuals to take charge of their skin health.
                    </p>
                    <p className="section-content">
                        Our platform uses cutting-edge machine learning models to detect facial skin conditions, recommend personalized treatments, and help you track your skin’s progress over time — all from the convenience of your mobile phone or desktop.
                    </p>
                    <p className="section-content">
                        With just a simple image upload, FacialDerma AI analyzes your facial skin and identifies conditions such as acne, eczema, rosacea, hyperpigmentation, and more.
                    </p>
                    <p className="section-content">
                        We not only detect skin conditions but also offer tailored skincare treatment plans, aesthetic enhancement previews (such as wrinkle reduction and scar smoothing), and generate detailed medical reports that can be shared with dermatologists.
                    </p>
                </section>

                <section className="about-section">
                    <h3 className="section-title">FacialDerma AI is designed for:</h3>
                    <ul className="about-list">
                        <li>Patients seeking early skin analysis and recommendations.</li>
                        <li>Dermatologists who want faster initial assessments.</li>
                        <li>Beauty and skincare enthusiasts who want to track and improve their skin health with technology.</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h3 className="section-title">Our Mission</h3>
                    <p className="section-content">
                        Our mission is to make skin health assessment accessible, fast, and reliable for everyone — powered by smart, secure, and science-backed AI technology.
                    </p>
                </section>

                <section className="about-section">
                    <h3 className="section-title">Our Vision</h3>
                    <p className="section-content">
                        We envision a future where personalized skincare advice and early skin health detection is available to anyone, anywhere, helping people gain confidence in their skin.
                    </p>
                </section>

                <section className="about-section">
                    <h3 className="section-title">Why Choose FacialDerma AI?</h3>
                    <ul className="about-list">
                        <li>✅ Instant facial skin condition detection</li>
                        <li>✅ Personalized treatment recommendations</li>
                        <li>✅ Aesthetic enhancement visualization</li>
                        <li>✅ Secure report generation and sharing</li>
                        <li>✅ User-friendly mobile and web experience</li>
                        <li>✅ Trusted by users and dermatologists alike</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h3 className="section-title">Get Started Today!</h3>
                    <p className="section-content">
                        Upload your photo, discover insights about your skin, and start your journey towards healthier skin with FacialDerma AI.
                    </p>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default About;
