import React from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/DermatologistProfile.css'

const DermatologistProfile = () => {
    const dermatologist = {
        fullName: 'Haseeb Tufaill',
        username: 'haseeb.tufail',
        age: 38,
        gender: 'Male',
        height: "5'8\"",
        qualification: 'MBBS, MD Dermatology',
        expertise: 'Acne, Eczema, Skin Allergies, Cosmetic Dermatology',
        experience: '12+ years',
        clinic: 'Karachi, Pakistan',
        image: 'https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg',
        email: 'dr.haseebt@gmail.com',
        phone: '+92 3456789011',
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
