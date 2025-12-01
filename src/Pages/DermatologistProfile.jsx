import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaStethoscope, FaBriefcase, FaIdCard,
    FaHospital, FaMoneyBillWave, FaEdit, FaSave, FaTimes, FaCamera, FaKey, FaSignOutAlt
} from 'react-icons/fa';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import { apiGetFullProfile, apiUpdateProfile } from '../api/api';
import MaleAvatar from '../Assets/male-avatar.png';
import FemaleAvatar from '../Assets/female-avatar.png';
import UpdateProfilePopup from '../components/UpdateProfilePopup';
import ConfirmSignout from '../components/ConfirmSignout';
import ChangePassword from '../components/ChangePassword';
import { useAuth } from '../contexts/AuthContext';

const DermatologistProfile = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingBasic, setIsEditingBasic] = useState(false);
    const [isEditingProfessional, setIsEditingProfessional] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [editData, setEditData] = useState({});
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => { fetchProfile(); }, []);

    useEffect(() => {
        if (profile) {
            const popupShown = sessionStorage.getItem('profilePopupShown');
            const isIncomplete = !profile.name || !profile.phone || !profile.specialization || !profile.license || !profile.clinic;
            if (isIncomplete && !popupShown) {
                setShowUpdatePopup(true);
                sessionStorage.setItem('profilePopupShown', 'true');
            }
        }
    }, [profile]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiGetFullProfile();
            setProfile(response.data);
            setEditData(response.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return alert('Image size should be <5MB');

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                await apiUpdateProfile({ profileImage: reader.result });
                fetchProfile();
            } catch (err) {
                console.error(err);
                alert('Failed to upload image');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = async () => {
        if (!window.confirm('Remove profile picture?')) return;
        try {
            await apiUpdateProfile({ profileImage: '' });
            fetchProfile();
        } catch (err) {
            console.error(err);
            alert('Failed to remove image');
        }
    };

    const handleEditChange = (field, value) => setEditData(prev => ({ ...prev, [field]: value }));

    const handleSaveBasic = async () => {
        try {
            await apiUpdateProfile({ name: editData.name, gender: editData.gender, age: editData.age });
            fetchProfile();
            setIsEditingBasic(false);
        } catch {
            alert('Failed to update profile');
        }
    };

    const handleSaveProfessional = async () => {
        try {
            await apiUpdateProfile({
                specialization: editData.specialization,
                license: editData.license,
                experience: editData.experience,
                clinic: editData.clinic,
                fees: editData.fees,
                bio: editData.bio
            });
            fetchProfile();
            setIsEditingProfessional(false);
        } catch {
            alert('Failed to update profile');
        }
    };

    const handleSaveContact = async () => {
        try {
            await apiUpdateProfile({ phone: editData.phone, address: editData.address });
            fetchProfile();
            setIsEditingContact(false);
        } catch {
            alert('Failed to update profile');
        }
    };

    const handleCancelEdit = (section) => {
        setEditData(profile);
        if (section === 'basic') setIsEditingBasic(false);
        if (section === 'professional') setIsEditingProfessional(false);
        if (section === 'contact') setIsEditingContact(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/home', { replace: true });
    };

    const DefaultAvatar = ({ gender, className }) => {
        const getDefaultAvatar = () => {
            if (gender === "Female") {
                return FemaleAvatar;
            } else if (gender === "Male") {
                return MaleAvatar;
            } else {
                return MaleAvatar;
            }
        };

        return (
            <img
                src={getDefaultAvatar()}
                alt="Default Avatar"
                className={className}
            />
        );
    };

    if (loading) return (
        <>
            <Header />
            <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-ping absolute"></div>
                    <div className="w-20 h-20 border-4 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-lg font-semibold text-gray-700 animate-pulse">Loading your profile...</p>
            </div>
            <Footer />
        </>
    );

    if (error) return (
        <>
            <Header />
            <div className="flex flex-col justify-center items-center min-h-screen gap-4 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-red-600 text-base sm:text-lg font-medium">{error}</p>
                </div>
                <button onClick={fetchProfile} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">Retry</button>
            </div>
            <Footer />
        </>
    );

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 sm:py-8 px-2 sm:px-4">
                <div className="max-w-6xl mx-auto flex flex-col gap-6">

                    {/* Profile + Basic Info */}
                    <div className="flex flex-col md:flex-row gap-6">

                        {/* Profile Header */}
                        <div className="flex flex-row items-center gap-6 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 w-full">
                            <div className="relative flex-shrink-0">
                                {profile?.profileImage ? (
                                    <img src={profile.profileImage} alt="Profile" className="w-28 h-28 sm:w-32 sm:h-32 border-2 border-gray-950 rounded-xl shadow-lg object-cover" />
                                ) : (
                                    <DefaultAvatar gender={profile?.gender} className="w-28 h-28 sm:w-32 sm:h-32 border-2 border-gray-950 rounded-xl shadow-lg" />
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <label className="cursor-pointer text-gray-600 hover:text-white">
                                        <FaCamera size={18} className="sm:w-5 sm:h-5" />
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                    {profile?.profileImage && (
                                        <button onClick={handleRemoveImage} className="text-white hover:text-red-300">
                                            <FaTimes size={18} className="sm:w-5 sm:h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center flex-1 text-left">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dr. {profile?.name || 'Not set'}</h1>
                                <p className="text-gray-600 text-sm sm:text-base">{profile?.email}</p>
                                <p className="text-gray-600 text-sm sm:text-base">@{profile?.username}</p>
                                <p className="text-gray-700 mt-1 text-sm sm:text-base">Specialization: {profile?.specialization || 'Dermatologist'}</p>

                                {/* Change Password and Logout Buttons */}
                                <div className="mt-4 flex justify-start gap-3">
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200"
                                    >
                                        <FaKey className="text-sm" />
                                        Change Password
                                    </button>
                                    <button
                                        onClick={() => setShowLogoutModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-all duration-200"
                                    >
                                        <FaSignOutAlt className="text-sm" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 w-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaUser className="text-blue-600 text-lg sm:text-xl" /> Basic Information
                                </h2>
                                {!isEditingBasic ? (
                                    <button onClick={() => setIsEditingBasic(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto justify-center"><FaEdit /> Edit</button>
                                ) : (
                                    <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                                        <button onClick={handleSaveBasic} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base flex-1 sm:flex-none justify-center"><FaSave /> Save</button>
                                        <button onClick={() => handleCancelEdit('basic')} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base flex-1 sm:flex-none justify-center"><FaTimes /> Cancel</button>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                    {isEditingBasic ? (
                                        <input type="text" value={editData.name || ''} onChange={e => handleEditChange('name', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" />
                                    ) : (<p className="text-gray-800 text-sm sm:text-base">{profile?.name || 'Not set'}</p>)}
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Gender</label>
                                    {isEditingBasic ? (
                                        <select value={editData.gender || ''} onChange={e => handleEditChange('gender', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base">
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (<p className="text-gray-800 text-sm sm:text-base">{profile?.gender || 'Not set'}</p>)}
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Age</label>
                                    {isEditingBasic ? (
                                        <input type="number" value={editData.age || ''} onChange={e => handleEditChange('age', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" />
                                    ) : (<p className="text-gray-800 text-sm sm:text-base">{profile?.age || 'Not set'}</p>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FaStethoscope className="text-blue-600 text-lg sm:text-xl" /> Professional Information
                            </h2>

                            {!isEditingProfessional ? (
                                <button
                                    onClick={() => setIsEditingProfessional(true)}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto justify-center"
                                >
                                    <FaEdit /> Edit
                                </button>
                            ) : (
                                <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                                    <button
                                        onClick={handleSaveProfessional}
                                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base flex-1 sm:flex-none justify-center"
                                    >
                                        <FaSave /> Save
                                    </button>
                                    <button
                                        onClick={() => handleCancelEdit('professional')}
                                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base flex-1 sm:flex-none justify-center"
                                    >
                                        <FaTimes /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ===== VIEW MODE (3 COLUMNS) ===== */}
                        {!isEditingProfessional ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-800 text-sm sm:text-base">

                                <div><span className="font-semibold">Specialization:</span> {profile?.specialization || 'Not set'}</div>
                                <div><span className="font-semibold">License:</span> {profile?.license || 'Not set'}</div>
                                <div><span className="font-semibold">Experience:</span> {profile?.experience ? `${profile.experience} years` : 'Not set'}</div>

                                <div><span className="font-semibold">Clinic:</span> {profile?.clinic || 'Not set'}</div>
                                <div><span className="font-semibold">Fees:</span> {profile?.fees ? `$${profile.fees}` : 'Not set'}</div>

                                {/* Full-width bio on large screens */}
                                <div className="lg:col-span-3">
                                    <span className="font-semibold">Bio:</span> {profile?.bio || 'Not set'}
                                </div>
                            </div>
                        ) : (
                            /* ===== EDIT MODE (Already Good) ===== */
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1"><FaStethoscope className="text-blue-600 text-sm" /> Specialization</label>
                                    <input type="text" value={editData.specialization || ''} onChange={e => handleEditChange('specialization', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" placeholder="Dermatology" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1"><FaIdCard className="text-blue-600 text-sm" /> License Number</label>
                                    <input type="text" value={editData.license || ''} onChange={e => handleEditChange('license', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" placeholder="Medical License" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1"><FaBriefcase className="text-blue-600 text-sm" /> Experience</label>
                                    <input type="number" value={editData.experience || ''} onChange={e => handleEditChange('experience', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1"><FaHospital className="text-blue-600 text-sm" /> Clinic/Hospital</label>
                                    <input type="text" value={editData.clinic || ''} onChange={e => handleEditChange('clinic', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" placeholder="Clinic or Hospital" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1"><FaMoneyBillWave className="text-blue-600 text-sm" /> Consultation Fees</label>
                                    <input type="number" value={editData.fees || ''} onChange={e => handleEditChange('fees', parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" placeholder="Fees per consultation" />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1"><FaStethoscope className="text-blue-600 text-sm" /> Bio</label>
                                    <textarea value={editData.bio || ''} onChange={e => handleEditChange('bio', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" rows={3} placeholder="Write a short bio" />
                                </div>
                            </div>
                        )}
                    </div>


                    {/* Contact Information */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaEnvelope className="text-blue-600 text-lg sm:text-xl" /> Contact Information
        </h2>

        {!isEditingContact ? (
            <button
                onClick={() => setIsEditingContact(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
                <FaEdit /> Edit
            </button>
        ) : (
            <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                <button
                    onClick={handleSaveContact}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base flex-1 sm:flex-none justify-center"
                >
                    <FaSave /> Save
                </button>
                <button
                    onClick={() => handleCancelEdit('contact')}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base flex-1 sm:flex-none justify-center"
                >
                    <FaTimes /> Cancel
                </button>
            </div>
        )}
    </div>

    {/* ===== VIEW MODE (3 COLUMNS) ===== */}
    {!isEditingContact ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-800 text-sm sm:text-base">
            <div><span className="font-semibold">Email:</span> {profile?.email || 'Not set'}</div>
            <div><span className="font-semibold">Phone:</span> {profile?.phone || 'Not set'}</div>
            <div><span className="font-semibold">Address:</span> {profile?.address || 'Not set'}</div>
        </div>
    ) : (
        /* ===== EDIT MODE (unchanged) ===== */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    <FaEnvelope className="text-blue-600 text-sm" /> Email
                </label>
                <input
                    type="email"
                    value={editData.email || ''}
                    onChange={e => handleEditChange('email', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base"
                    placeholder="Email address"
                />
            </div>

            <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    <FaPhone className="text-blue-600 text-sm" /> Phone
                </label>
                <input
                    type="text"
                    value={editData.phone || ''}
                    onChange={e => handleEditChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base"
                    placeholder="Phone number"
                />
            </div>

            <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    <FaMapMarkerAlt className="text-blue-600 text-sm" /> Address
                </label>
                <input
                    type="text"
                    value={editData.address || ''}
                    onChange={e => handleEditChange('address', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base"
                    placeholder="Address"
                />
            </div>
        </div>
    )}
</div>

                </div>

                {showUpdatePopup && (
                    <UpdateProfilePopup profile={profile} onClose={() => setShowUpdatePopup(false)} onUpdate={fetchProfile} />
                )}

                {/* Change Password Modal */}
                <ChangePassword
                    isOpen={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                />

                {/* Logout Confirmation Modal */}
                {showLogoutModal && (
                    <ConfirmSignout
                        onConfirm={handleLogout}
                        onCancel={() => setShowLogoutModal(false)}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default DermatologistProfile;
