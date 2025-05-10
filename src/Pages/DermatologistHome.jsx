
// Dermatologist Profile Component
import React from 'react';
import './DermatologistProfile.css';

const DermatologistProfile = ({ doctor }) => {
    return (
        <div className="dermatologist-profile">
            <div className="profile-header">
                <div className="profile-image">
                    <img src={doctor.image || '/default-doctor.png'} alt={doctor.name} />
                </div>
                <div className="profile-info">
                    <h2>{doctor.name}</h2>
                    <p className="credentials">MD, Dermatologist</p>
                    <p className="experience">{doctor.experience} Years Experience</p>
                </div>
            </div>

            <div className="profile-details">
                <div className="detail-section">
                    <h3>Specializations</h3>
                    <ul>
                        {doctor.specializations?.map((spec, index) => (
                            <li key={index}>{spec}</li>
                        ))}
                    </ul>
                </div>

                <div className="detail-section">
                    <h3>Education</h3>
                    <ul>
                        {doctor.education?.map((edu, index) => (
                            <li key={index}>{edu}</li>
                        ))}
                    </ul>
                </div>

                <div className="detail-section">
                    <h3>Available Hours</h3>
                    <div className="schedule">
                        {doctor.availableHours?.map((hours, index) => (
                            <p key={index}>{hours}</p>
                        ))}
                    </div>
                </div>

                <div className="detail-section">
                    <h3>Contact Information</h3>
                    <p>Email: {doctor.email}</p>
                    <p>Phone: {doctor.phone}</p>
                    <p>Address: {doctor.address}</p>
                </div>
            </div>

            <div className="appointment-section">
                <button className="book-appointment">Book Appointment</button>
            </div>
        </div>
    );
};

export default DermatologistProfile;

// Sample CSS
.dermatologist - profile {
    max - width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: #fff;
    border - radius: 8px;
    box - shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile - header {
    display: flex;
    align - items: center;
    margin - bottom: 30px;
}

.profile - image img {
    width: 150px;
    height: 150px;
    border - radius: 50 %;
    object - fit: cover;
    margin - right: 30px;
}

.profile - info h2 {
    margin: 0;
    color: #333;
    font - size: 24px;
}

.credentials {
    color: #666;
    margin: 5px 0;
}

.experience {
    color: #2196f3;
    font - weight: bold;
}

.detail - section {
    margin - bottom: 25px;
}

.detail - section h3 {
    color: #333;
    border - bottom: 2px solid #f0f0f0;
    padding - bottom: 10px;
    margin - bottom: 15px;
}

.detail - section ul {
    list - style: none;
    padding: 0;
}

.detail - section li {
    margin - bottom: 8px;
    color: #555;
}

.schedule p {
    margin: 5px 0;
    color: #555;
}

.appointment - section {
    text - align: center;
    margin - top: 30px;
}

.book - appointment {
    background: #2196f3;
    color: white;
    border: none;
    padding: 12px 30px;
    border - radius: 25px;
    font - size: 16px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.book - appointment:hover {
    background: #1976d2;
}