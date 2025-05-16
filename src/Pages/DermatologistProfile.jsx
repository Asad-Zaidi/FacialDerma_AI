import React from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/DermatologistProfile.css'

const DermatologistProfile = () => {
    const dermatologist = {
        fullName: 'Dr. Ayesha Khan',
        username: 'ayeshaskinexpert',
        age: 38,
        gender: 'Female',
        height: "5'6\"",
        qualification: 'MBBS, MD Dermatology',
        expertise: 'Acne, Eczema, Skin Allergies, Cosmetic Dermatology',
        experience: '12+ years',
        clinic: 'SkinGlow Clinic, Mumbai',
        image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        email: 'dr.ayesha@example.com',
        phone: '+91 9876543210',
    };

    return (
        <>
            <Header />
            <div className="profile-wrapper">
                <div className="profile-card">
                    <div className="profile-img">
                        <img src={dermatologist.image} alt="Dermatologist" />
                        <h2>{dermatologist.fullName}</h2>
                        <p className="username">@{dermatologist.username}</p>
                    </div>

                    <div className="profile-info-grid">
                        <div><strong>Age:</strong> {dermatologist.age}</div>
                        <div><strong>Gender:</strong> {dermatologist.gender}</div>
                        <div><strong>Height:</strong> {dermatologist.height}</div>
                        <div><strong>Email:</strong> {dermatologist.email}</div>
                        <div><strong>Phone:</strong> {dermatologist.phone}</div>
                        <div><strong>Qualification:</strong> {dermatologist.qualification}</div>
                        <div><strong>Expertise:</strong> {dermatologist.expertise}</div>
                        <div><strong>Experience:</strong> {dermatologist.experience}</div>
                        <div><strong>Clinic:</strong> {dermatologist.clinic}</div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DermatologistProfile;
