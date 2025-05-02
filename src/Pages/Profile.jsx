import React, { useState, useEffect } from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import '../Styles/Profile.css';
import { FiEdit2 } from 'react-icons/fi';

const Profile = () => {
    const [profilePic, setProfilePic] = useState(null); // This is for preview
    const [profileFile, setProfileFile] = useState(null); // This is for real upload
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [skinType, setSkinType] = useState('');
    const [skinConcerns, setSkinConcerns] = useState([]);
    const [preferredTreatment, setPreferredTreatment] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const fetchProfile = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/profile/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Profile fetched successfully:', data);
                setUsername(data.username);
                setEmail(data.email);
                setPhone(data.phone || '');
                setGender(data.gender || '');
                setDob(data.dob || '');
                setSkinType(data.skinType || '');
                setSkinConcerns(data.skinConcerns || []);
                setPreferredTreatment(data.preferredTreatment || '');
                setProfilePic(data.profile_picture ? `http://127.0.0.1:8000${data.profile_picture}` : null);
            } else {
                console.error('Failed to fetch profile:', data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);



    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(URL.createObjectURL(file));  // For preview
            setProfileFile(file);          
        }
    };

    const handleChangePasswordClick = () => {
        setShowPasswordFields(true);
    };

    const handleSavePassword = () => {
        setPasswordError('');
        setConfirmPasswordError('');

        if (newPassword === confirmPassword) {
            if (newPassword.length >= 8) {
                console.log("Password saved:", newPassword);
                setNewPassword('');
                setConfirmPassword('');
                setShowPasswordFields(false);
            } else {
                setPasswordError('At least 8 Characters');
            }
        } else {
            setConfirmPasswordError('Passwords Do Not Match.');
        }
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = async () => {
        const token = localStorage.getItem('access_token');

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('gender', gender);
        formData.append('dob', dob);
        formData.append('skinType', skinType);
        formData.append('preferredTreatment', preferredTreatment);
        if (profileFile) {
    formData.append('profile_picture', profileFile);
}

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/profile/update/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Profile updated:', data);
                setIsEditing(false);
                // After saving, fetch profile again to refresh real profile picture
                fetchProfile();
            } else {
                console.error('Update failed:', data);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };



    return (
        <div>
            <Header />
            <div className="profile-container">
                <h2 className="profile-title">User Profile</h2>

                <div className="profile-content">
                    {/* Left Side */}
                    <div className="profile-left">
                        <button className="floating-edit-button" onClick={handleEditClick}>
                            <FiEdit2 size={20} style={{ color: 'gray' }} />
                        </button>

                        <section className="profile-section">
                            <h3>Profile Picture</h3>
                            <label className={`Upload-box ${!isEditing ? 'disabled' : ''}`}>
                                <input type="file" accept="image/*" onChange={handleProfilePicChange} disabled={!isEditing} />
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" className="profile-picture" />
                                ) : (
                                    <div className="default-avatar">Upload Photo</div>
                                )}
                            </label>

                            <div className="basic-info">
                                <div className="info-item">
                                    <label>Username</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="editable-input"
                                        />
                                    ) : (
                                        <p>{username}</p>
                                    )}
                                </div>

                                <div className="info-item">
                                    <label>Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="editable-input"
                                        />
                                    ) : (
                                        <p>{email}</p>
                                    )}
                                </div>

                                <div className="info-item">
                                    <label>Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter phone number"
                                            className="editable-input"
                                        />
                                    ) : (
                                        <p>{phone || "-"}</p>
                                    )}
                                </div>

                                <div className="info-item">
                                    <label>Gender</label>
                                    {isEditing ? (
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="editable-select"
                                        >
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    ) : (
                                        <p>{gender || "-"}</p>
                                    )}
                                </div>

                                <div className="info-item">
                                    <label>Date of Birth</label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            className="editable-input"
                                        />
                                    ) : (
                                        <p>{dob || "-"}</p>
                                    )}
                                </div>

                                {isEditing && (
                                    <div style={{ marginTop: '20px' }}>
                                        <button onClick={handleSaveChanges}>Save Changes</button>

                                        <button onClick={() => setIsEditing(false)} style={{ marginLeft: '10px', backgroundColor: '#6b7280' }}>
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* <div className="input-group">
                                <button onClick={handleChangePasswordClick}>Change Password</button>
                            </div> */}

                            {showPasswordFields && (
                                <div className="password-fields">
                                    <div className="input-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        {passwordError && <p className="error-message">{passwordError}</p>}
                                    </div>

                                    <div className="input-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                                    </div>

                                    <div className="input-group">
                                        <button onClick={handleSavePassword}>Save</button>
                                        <button onClick={() => setShowPasswordFields(false)}>Cancel</button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Side */}
                    <div className="profile-right">
                        <section className="profile-section">
                            <h3>Skin Type & Preferences</h3>
                            <div className="input-group">
                                <label>Skin Type</label>
                                <select value={skinType} onChange={(e) => setSkinType(e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="normal">Normal</option>
                                    <option value="oily">Oily</option>
                                    <option value="dry">Dry</option>
                                    <option value="combination">Combination</option>
                                    <option value="sensitive">Sensitive</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Skin Concerns</label>
                                <div>
                                    {['acne', 'pigmentation', 'wrinkles'].map(concern => (
                                        <label key={concern} style={{ marginRight: '10px' }}>
                                            <input
                                                type="checkbox"
                                                checked={skinConcerns.includes(concern)}
                                                onChange={() =>
                                                    setSkinConcerns(prev =>
                                                        prev.includes(concern) ? prev.filter(item => item !== concern) : [...prev, concern]
                                                    )
                                                }
                                            />
                                            {concern.charAt(0).toUpperCase() + concern.slice(1)}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Preferred Treatment Type</label>
                                <select value={preferredTreatment} onChange={(e) => setPreferredTreatment(e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="home">Home Remedies</option>
                                    <option value="clinical">Clinical Treatments</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>
                        </section>

                        <section className="profile-section">
                            <h3>Medical History</h3>
                            <div className="input-group">
                                <label>Previous Skin Conditions</label>
                                <input type="text" />
                            </div>

                            <div className="input-group">
                                <label>Known Allergies</label>
                                <input type="text" />
                            </div>

                            <div className="input-group">
                                <label>Current Medications</label>
                                <input type="text" />
                            </div>
                        </section>

                        <section className="profile-section">
                            <h3>Uploaded Images History</h3>
                            <button>View Gallery</button>
                        </section>

                        <section className="profile-section">
                            <h3>Reports & Analysis</h3>
                            <button>Download Skin Analysis Reports</button>
                            <button>View Progress Tracking</button>
                            <button>Share Report with Dermatologist</button>
                        </section>

                        <section className="profile-section">
                            <h3>Aesthetic Enhancement</h3>
                            <button>Before-and-After Preview</button>
                            <button>Save or Share Enhancements</button>
                        </section>

                        <section className="profile-section">
                            <button>Logout</button>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Profile;
