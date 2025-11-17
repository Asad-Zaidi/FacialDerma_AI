import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaStethoscope, FaBriefcase, FaIdCard, FaHospital, FaMoneyBillWave, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import { apiGetFullProfile, apiUpdateProfile } from '../api/api';
import MaleAvatar from '../Assets/male-avatar.png';
import FemaleAvatar from '../Assets/female-avatar.png';

const DermatologistProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingBasic, setIsEditingBasic] = useState(false);
    const [isEditingProfessional, setIsEditingProfessional] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiGetFullProfile();
            setProfile(response.data);
            setEditData(response.data);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.detail || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const base64String = reader.result;
                await apiUpdateProfile({ profileImage: base64String });
                await fetchProfile();
            } catch (err) {
                console.error('Error uploading image:', err);
                alert('Failed to upload image');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = async () => {
        if (!window.confirm('Are you sure you want to remove your profile picture?')) {
            return;
        }
        try {
            await apiUpdateProfile({ profileImage: "" });
            await fetchProfile();
        } catch (err) {
            console.error('Error removing image:', err);
            alert('Failed to remove image');
        }
    };

    const handleEditChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveBasic = async () => {
        try {
            await apiUpdateProfile({
                name: editData.name,
                gender: editData.gender,
                age: editData.age,
            });
            await fetchProfile();
            setIsEditingBasic(false);
        } catch (err) {
            console.error('Error updating profile:', err);
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
                bio: editData.bio,
            });
            await fetchProfile();
            setIsEditingProfessional(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile');
        }
    };

    const handleSaveContact = async () => {
        try {
            await apiUpdateProfile({
                phone: editData.phone,
                address: editData.address,
            });
            await fetchProfile();
            setIsEditingContact(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile');
        }
    };

    const handleCancelEdit = (section) => {
        setEditData(profile);
        if (section === 'basic') setIsEditingBasic(false);
        if (section === 'professional') setIsEditingProfessional(false);
        if (section === 'contact') setIsEditingContact(false);
    };

    const DefaultAvatar = ({ gender, className }) => {
        if (gender === 'Male') {
            return <img src={MaleAvatar} alt="Male Avatar" className={className} />;
        } else if (gender === 'Female') {
            return <img src={FemaleAvatar} alt="Female Avatar" className={className} />;
        }
        return <div className={`${className} bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold`}>
            <FaUser />
        </div>;
    };

    if (loading) {
        return (
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
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="flex flex-col justify-center items-center min-h-screen gap-4 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                    <div className="bg-red-100 p-4 rounded-lg">
                        <p className="text-red-600 text-base sm:text-lg font-medium">{error}</p>
                    </div>
                    <button onClick={fetchProfile} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                        Retry
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 sm:py-8 px-2 sm:px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mb-4 sm:mb-6">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24 sm:h-32"></div>
                        <div className="px-4 sm:px-8 pb-6 sm:pb-8">
                            <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 sm:-mt-16 gap-4 sm:gap-6">
                                <div className="relative group">
                                    {profile?.profileImage ? (
                                        <img 
                                            src={profile.profileImage} 
                                            alt="Profile" 
                                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                        />
                                    ) : (
                                        <DefaultAvatar 
                                            gender={profile?.gender} 
                                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <label className="cursor-pointer text-white hover:text-blue-300">
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
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dr. {profile?.name || 'Not set'}</h1>
                                    <p className="text-gray-600 text-base sm:text-lg">@{profile?.username}</p>
                                    <p className="text-blue-600 font-semibold mt-1 text-sm sm:text-base">{profile?.specialization || 'Dermatologist'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FaUser className="text-blue-600 text-lg sm:text-xl" /> Basic Information
                            </h2>
                            {!isEditingBasic ? (
                                <button onClick={() => setIsEditingBasic(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto justify-center">
                                    <FaEdit /> Edit
                                </button>
                            ) : (
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button onClick={handleSaveBasic} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base flex-1 sm:flex-none justify-center">
                                        <FaSave /> Save
                                    </button>
                                    <button onClick={() => handleCancelEdit('basic')} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base flex-1 sm:flex-none justify-center">
                                        <FaTimes /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                {isEditingBasic ? (
                                    <input type="text" value={editData.name || ''} onChange={(e) => handleEditChange('name', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" />
                                ) : (
                                    <p className="text-gray-800 text-sm sm:text-base">{profile?.name || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Gender</label>
                                {isEditingBasic ? (
                                    <select value={editData.gender || ''} onChange={(e) => handleEditChange('gender', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base">
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                ) : (
                                    <p className="text-gray-800 text-sm sm:text-base">{profile?.gender || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Age</label>
                                {isEditingBasic ? (
                                    <input type="number" value={editData.age || ''} onChange={(e) => handleEditChange('age', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" />
                                ) : (
                                    <p className="text-gray-800 text-sm sm:text-base">{profile?.age || 'Not set'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FaStethoscope className="text-blue-600 text-lg sm:text-xl" /> Professional Information
                            </h2>
                            {!isEditingProfessional ? (
                                <button onClick={() => setIsEditingProfessional(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto justify-center">
                                    <FaEdit /> Edit
                                </button>
                            ) : (
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button onClick={handleSaveProfessional} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base flex-1 sm:flex-none justify-center">
                                        <FaSave /> Save
                                    </button>
                                    <button onClick={() => handleCancelEdit('professional')} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base flex-1 sm:flex-none justify-center">
                                        <FaTimes /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <FaStethoscope className="text-blue-600 text-sm" /> Specialization
                                </label>
                                {isEditingProfessional ? (
                                    <input type="text" value={editData.specialization || ''} onChange={(e) => handleEditChange('specialization', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" placeholder="e.g., Dermatology, Cosmetic Dermatology" />
                                ) : (
                                    <p className="text-gray-800 text-sm sm:text-base">{profile?.specialization || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <FaIdCard className="text-blue-600 text-sm" /> License Number
                                </label>
                                {isEditingProfessional ? (
                                    <input type="text" value={editData.license || ''} onChange={(e) => handleEditChange('license', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" placeholder="Medical License Number" />
                                ) : (
                                    <p className="text-gray-800 text-sm sm:text-base">{profile?.license || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <FaBriefcase className="text-blue-600 text-sm" /> Experience (Years)
                                </label>
                                {isEditingProfessional ? (
                                    <input type="number" value={editData.experience || ''} onChange={(e) => handleEditChange('experience', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" />
                                ) : (
                                    <p className="text-gray-800 text-sm sm:text-base">{profile?.experience ? `${profile.experience} years` : 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <FaHospital className="text-blue-600 text-sm" /> Clinic/Hospital
                                </label>
                                {isEditingProfessional ? (
                                    <input type="text" value={editData.clinic || ''} onChange={(e) => handleEditChange('clinic', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" placeholder="Clinic or Hospital Name" />
                                ) : (
                                    <p className="text-gray-800 text-sm sm:text-base">{profile?.clinic || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-blue-600 text-sm" /> Consultation Fees
                                </label>
                                {isEditingProfessional ? (
                                    <input type="number" value={editData.fees || ''} onChange={(e) => handleEditChange('fees', parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" placeholder="Fee amount" />
                                ) : (
                                    <p className="text-gray-800 text-sm sm:text-base">{profile?.fees ? `Rs. ${profile.fees}` : 'Not set'}</p>
                                )}
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Bio</label>
                                {isEditingProfessional ? (
                                    <textarea value={editData.bio || ''} onChange={(e) => handleEditChange('bio', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" rows="3" placeholder="Professional bio and expertise" />
                                ) : (
                                    <p className="text-gray-800 text-sm sm:text-base">{profile?.bio || 'Not set'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FaEnvelope className="text-blue-600 text-lg sm:text-xl" /> Contact Information
                            </h2>
                            {!isEditingContact ? (
                                <button onClick={() => setIsEditingContact(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto justify-center">
                                    <FaEdit /> Edit
                                </button>
                            ) : (
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button onClick={handleSaveContact} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base flex-1 sm:flex-none justify-center">
                                        <FaSave /> Save
                                    </button>
                                    <button onClick={() => handleCancelEdit('contact')} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base flex-1 sm:flex-none justify-center">
                                        <FaTimes /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-blue-600 text-lg sm:text-xl" />
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-600">Email</p>
                                    <p className="text-gray-800 font-medium text-sm sm:text-base break-all">{profile?.email}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <FaPhone className="text-blue-600 text-sm" /> Phone
                                </label>
                                {isEditingContact ? (
                                    <input type="text" value={editData.phone || ''} onChange={(e) => handleEditChange('phone', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" placeholder="+92 XXX XXXXXXX" />
                                ) : (
                                    <p className="text-gray-800 text-sm sm:text-base">{profile?.phone || 'Not set'}</p>
                                )}
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-blue-600 text-sm" /> Address
                                </label>
                                {isEditingContact ? (
                                    <textarea value={editData.address || ''} onChange={(e) => handleEditChange('address', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base" rows="2" placeholder="Clinic address" />
                                ) : (
                                    <p className="text-gray-800 text-sm sm:text-base">{profile?.address || 'Not set'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DermatologistProfile;