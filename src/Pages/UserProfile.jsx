import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/UserProfile.css';

const UserProfile = () => {
    const hardcodedInfo = {
        fullName: 'Asad Jamil',
        age: 28,
        gender: 'Male',
        height: "5'6\"",
        phone: '+92 03084401410',
        location: 'Lahore, Pakistan',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlqmDtz_F0mxL0m6iOnBbC32Ve38vRYNvBFt98b5seDB6c2T5QfSglB68MZE1DHk4WEGs&usqp=CAU',
    };

    const [user, setUser] = useState(null);
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        fetchUser();
        fetchPredictions();
    }, []);

    const fetchUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("No token found. User might not be logged in.");
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user info:', error);
        }
    };

    const fetchPredictions = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("No token found. User might not be logged in.");
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/predictions/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPredictions(response.data);
        } catch (error) {
            console.error('Failed to fetch predictions:', error);
        }
    };

    if (!user) {
        return <p>Loading user info...</p>;
    }

    return (
        <>
            <Header />
            <div className="user-profile-wrapper">
                <div className="user-profile-card">
                    <div className="user-profile-img">
                        <img src={hardcodedInfo.image} alt="User" />
                        <h2>{hardcodedInfo.fullName}</h2>
                        <p className="user-username">@{user.username}</p>
                    </div>

                    <div className="user-profile-info">
                        <div><strong>Age:</strong> {hardcodedInfo.age}</div>
                        <div><strong>Gender:</strong> {hardcodedInfo.gender}</div>
                        <div><strong>Height:</strong> {hardcodedInfo.height}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Phone:</strong> {hardcodedInfo.phone}</div>
                        <div><strong>Location:</strong> {hardcodedInfo.location}</div>
                        <div><strong>Role:</strong> {user.role}</div>
                    </div>
                </div>

                <div className="prediction-history">
                    <h3>Prediction History</h3>
                    {predictions.length === 0 ? (
                        <p>No past predictions found.</p>
                    ) : (
                        <div className="prediction-table">
                            <div className="prediction-header">
                                <span>Date</span>
                                <span>Disease</span>
                                <span>Confidence</span>
                            </div>
                            {predictions.map((pred, idx) => (
                                <div key={idx} className="prediction-row">
                                    <span>{new Date(pred.createdAt).toLocaleString()}</span>
                                    <span>{pred.result?.predicted_label || 'N/A'}</span>
                                    <span>{(pred.result?.confidence_score * 100).toFixed(2)}%</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            <Footer />
        </>
    );
};

export default UserProfile;
