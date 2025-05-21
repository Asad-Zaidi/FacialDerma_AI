import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/UserProfile.css';

const UserProfile = () => {
    const user = {
        fullName: 'Asad Jamil',
        username: 'asad-zaidi',
        age: 28,
        gender: 'Male',
        height: "5'6\"",
        email: 'syedasad2080@gmail.com',
        phone: '+92 03084401410',
        location: 'Lahore, Pakistan',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlqmDtz_F0mxL0m6iOnBbC32Ve38vRYNvBFt98b5seDB6c2T5QfSglB68MZE1DHk4WEGs&usqp=CAU',
    };

    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        fetchPredictions();
    }, []);

    const fetchPredictions = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("No token found. User might not be logged in.");
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/predictions/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setPredictions(response.data);
        } catch (error) {
            console.error('Failed to fetch predictions:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="user-profile-wrapper">
                <div className="user-profile-card">
                    <div className="user-profile-img">
                        <img src={user.image} alt="User" />
                        <h2>{user.fullName}</h2>
                        <p className="user-username">@{user.username}</p>
                    </div>

                    <div className="user-profile-info">
                        <div><strong>Age:</strong> {user.age}</div>
                        <div><strong>Gender:</strong> {user.gender}</div>
                        <div><strong>Height:</strong> {user.height}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Phone:</strong> {user.phone}</div>
                        <div><strong>Location:</strong> {user.location}</div>
                    </div>
                </div>

                <div className="prediction-history">
                    <h3>Prediction History</h3>
                    {predictions.length === 0 ? (
                        <p>No past predictions found.</p>
                    ) : (
                        <ul>
                            {predictions.map((pred, idx) => (
                                <li key={idx} className="prediction-card">
                                    <p><strong>Disease:</strong> {pred.result?.predicted_label || 'N/A'}</p>
                                    <p><strong>Confidence:</strong> {(pred.result?.confidence_score * 100).toFixed(2)}%</p>
                                    <p><strong>Date:</strong> {new Date(pred.createdAt).toLocaleString()}</p>
                                    {pred.imageUrl && (
                                        <img
                                            src={`http://localhost:5000/uploads/${pred.imageUrl}`}
                                            alt="Uploaded"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '5px' }}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserProfile;
