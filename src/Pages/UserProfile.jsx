import React from 'react';
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
            </div>
            <Footer />
        </>
    );
};

export default UserProfile;
