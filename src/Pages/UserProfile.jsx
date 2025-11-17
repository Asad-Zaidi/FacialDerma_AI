import React, { useState, useEffect } from "react";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaHistory,
    FaEdit,
    FaTrash,
    FaUser,
    FaWeight,
    FaRuler,
    FaTint,
    FaBirthdayCake,
    FaVenusMars,
    FaPhone,
    FaExclamationTriangle,
} from "react-icons/fa";
import { MdSave, MdCancel } from "react-icons/md";
import { apiGetFullProfile, apiUpdateProfile } from "../api/api";
import Header from '../Nav_Bar/Header';
import MaleAvatar from "../Assets/male-avatar.png";
import FemaleAvatar from "../Assets/female-avatar.png";

const CardSection = ({ title, icon, children, editHandler, gradient = false }) => (
    <div className={`${gradient ? 'bg-gradient-to-br from-white via-gray-50 to-white' : 'bg-white'} border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 transform hover:-translate-y-1`}>
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 rounded-lg">{icon && icon}</span>
                {title}
            </h3>
            {editHandler && (
                <button
                    onClick={editHandler}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                    <FaEdit className="text-xs" />
                    Edit
                </button>
            )}
        </div>
        {children}
    </div>
);

const InfoItem = ({ icon, label, value, iconColor = "text-gray-400" }) => (
    <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
        <div className={`${iconColor} mt-0.5 text-base`}>{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-semibold text-gray-800 break-words">{value || "N/A"}</p>
        </div>
    </div>
);

const UserProfile = () => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(null);
    const [editData, setEditData] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await apiGetFullProfile();
            setPatient(response.data);
            setError(null);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            setError(error.response?.data?.detail || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            setSelectedImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!selectedImage) return;

        try {
            setLoading(true);

            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result;

                const response = await apiUpdateProfile({
                    profileImage: base64Image
                });

                setPatient(response.data.user);
                setSelectedImage(null);
                setImagePreview(null);
                alert('Profile picture updated successfully');
            };
            reader.readAsDataURL(selectedImage);

        } catch (error) {
            console.error('Failed to upload image:', error);
            alert(error.response?.data?.detail || 'Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleRemoveImage = async () => {
        if (!window.confirm('Are you sure you want to remove your profile picture?')) {
            return;
        }

        try {
            setLoading(true);

            const response = await apiUpdateProfile({
                profileImage: ""
            });

            setPatient(response.data.user);
            setSelectedImage(null);
            setImagePreview(null);
            alert('Profile picture removed successfully');
        } catch (error) {
            console.error('Failed to remove image:', error);
            alert(error.response?.data?.detail || 'Failed to remove image');
        } finally {
            setLoading(false);
        }
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

    const handleEdit = (section) => {
        setEditMode(section);

        if (section === "Basic Information") {
            setEditData({
                name: patient.name || "",
                gender: patient.gender || "",
                age: patient.age || "",
                height: patient.height || "",
                weight: patient.weight || "",
                bloodGroup: patient.bloodGroup || ""
            });
        } else if (section === "Contact Information") {
            setEditData({
                phone: patient.phone || "",
                emergencyContact: patient.emergencyContact || "",
                address: patient.address || ""
            });
        }
    };

    const handleSave = async (section) => {
        try {
            setLoading(true);
            const response = await apiUpdateProfile(editData);
            setPatient(response.data.user);
            setEditMode(null);
            setEditData({});
            alert(response.data.message);
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert(error.response?.data?.detail || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditMode(null);
        setEditData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleViewReport = (id) => {
        alert(`Navigate to report ${id}`);
    };

    if (loading && !patient) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                        <div className="relative w-16 h-16 border-4 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-base font-semibold text-gray-700 animate-pulse">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-gray-100">
                <div className="text-center bg-white p-6 rounded-2xl shadow-xl max-w-md">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FaExclamationTriangle className="text-2xl text-red-600" />
                    </div>
                    <p className="text-red-600 mb-4 font-medium text-sm">{error || "No profile data available"}</p>
                    <button
                        onClick={fetchProfile}
                        className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
            <Header />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-1">
                        Profile
                    </h1>
                    <p className="text-gray-600 text-xs">Manage your health information and medical records</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="space-y-5">
                        <div className="bg-gradient-to-br from-white via-blue-50 to-white border border-gray-200 rounded-xl shadow-xl p-5 text-center transform hover:scale-105 transition-all duration-300">
                            <div className="relative inline-block mb-3">
                                <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                                {imagePreview || patient.profileImage ? (
                                    <img
                                        src={imagePreview || patient.profileImage}
                                        alt="Profile"
                                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                                    />
                                ) : (
                                    <DefaultAvatar
                                        gender={patient.gender}
                                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                                    />
                                )}

                                <label
                                    htmlFor="profile-image-input"
                                    className="absolute bottom-1 right-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-all transform hover:scale-110"
                                    title="Change profile picture"
                                >
                                    <FaEdit className="h-3.5 w-3.5" />
                                </label>

                                {!selectedImage && patient.profileImage && (
                                    <button
                                        onClick={handleRemoveImage}
                                        className="absolute bottom-1 left-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-all transform hover:scale-110"
                                        title="Remove profile picture"
                                    >
                                        <FaTrash className="h-3.5 w-3.5" />
                                    </button>
                                )}

                                <input
                                    id="profile-image-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>

                            {selectedImage && (
                                <div className="flex gap-2 mb-3">
                                    <button
                                        onClick={handleImageUpload}
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 font-medium text-xs disabled:opacity-50 transition-all transform hover:scale-105 shadow-md"
                                    >
                                        <MdSave className="text-sm" /> Upload
                                    </button>
                                    <button
                                        onClick={handleCancelImage}
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-400 font-medium text-xs transition-all transform hover:scale-105 shadow-md"
                                    >
                                        <MdCancel className="text-sm" /> Cancel
                                    </button>
                                </div>
                            )}

                            <h2 className="text-xl font-bold text-gray-800 mb-1">
                                {patient.name || patient.username}
                            </h2>
                            <p className="text-blue-600 font-medium text-sm mb-1">{patient.email}</p>
                            <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs">
                                <FaMapMarkerAlt />
                                <span>{patient.address || "No address provided"}</span>
                            </div>
                        </div>

                        <CardSection
                            title="Basic Information"
                            icon={<FaUser className="text-blue-600 text-sm" />}
                            editHandler={() => handleEdit("Basic Information")}
                            gradient={true}
                        >
                            {editMode === "Basic Information" ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Gender</label>
                                        <select
                                            name="gender"
                                            value={editData.gender}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={editData.age}
                                            onChange={handleInputChange}
                                            placeholder="Enter age"
                                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Height</label>
                                        <input
                                            type="text"
                                            name="height"
                                            value={editData.height}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 175 cm"
                                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Weight</label>
                                        <input
                                            type="text"
                                            name="weight"
                                            value={editData.weight}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 70 kg"
                                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                        <select
                                            name="bloodGroup"
                                            value={editData.bloodGroup}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <button
                                            onClick={() => handleSave("Basic Information")}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white py-2 text-xs rounded-lg hover:bg-blue-700 font-semibold transition-all transform hover:scale-105 shadow-md"
                                            disabled={loading}
                                        >
                                            <MdSave /> Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-300 text-gray-700 py-2 text-xs rounded-lg hover:bg-gray-400 font-semibold transition-all transform hover:scale-105 shadow-md"
                                        >
                                            <MdCancel /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <InfoItem icon={<FaVenusMars />} label="Gender" value={patient.gender} iconColor="text-purple-500" />
                                    <InfoItem icon={<FaBirthdayCake />} label="Age" value={patient.age} iconColor="text-pink-500" />
                                    <InfoItem icon={<FaRuler />} label="Height" value={patient.height} iconColor="text-green-500" />
                                    <InfoItem icon={<FaWeight />} label="Weight" value={patient.weight} iconColor="text-orange-500" />
                                    <InfoItem icon={<FaTint />} label="Blood Group" value={patient.bloodGroup} iconColor="text-red-500" />
                                </div>
                            )}
                        </CardSection>

                        <CardSection
                            title="Contact Information"
                            icon={<FaPhone className="text-green-600 text-sm" />}
                            editHandler={() => handleEdit("Contact Information")}
                            gradient={true}
                        >
                            {editMode === "Contact Information" ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={editData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+92 312 4567890"
                                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Emergency Contact</label>
                                        <input
                                            type="text"
                                            name="emergencyContact"
                                            value={editData.emergencyContact}
                                            onChange={handleInputChange}
                                            placeholder="+92 334 9876543"
                                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Address</label>
                                        <textarea
                                            name="address"
                                            value={editData.address}
                                            onChange={handleInputChange}
                                            placeholder="Enter your complete address"
                                            rows="2"
                                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <button
                                            onClick={() => handleSave("Contact Information")}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white py-2 text-xs rounded-lg hover:bg-blue-700 font-semibold transition-all transform hover:scale-105 shadow-md"
                                            disabled={loading}
                                        >
                                            <MdSave /> Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-300 text-gray-700 py-2 text-xs rounded-lg hover:bg-gray-400 font-semibold transition-all transform hover:scale-105 shadow-md"
                                        >
                                            <MdCancel /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <InfoItem icon={<FaPhoneAlt />} label="Phone" value={patient.phone} iconColor="text-green-500" />
                                    <InfoItem icon={<FaExclamationTriangle />} label="Emergency Contact" value={patient.emergencyContact} iconColor="text-red-500" />
                                    <InfoItem icon={<FaMapMarkerAlt />} label="Address" value={patient.address} iconColor="text-blue-500" />
                                    <InfoItem icon={<FaEnvelope />} label="Email" value={patient.email} iconColor="text-purple-500" />
                                </div>
                            )}
                        </CardSection>
                    </div>

                    <div className="lg:col-span-2 space-y-5">


                        <CardSection
                            title="Recent Reports"
                            icon={<FaHistory className="text-blue-600 text-sm" />}
                            gradient={true}
                        >
                            {patient.recentReports && patient.recentReports.length > 0 ? (
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {patient.recentReports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="group bg-gradient-to-br from-white to-blue-50 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                            onClick={() => handleViewReport(report.id)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors mb-0.5">
                                                        {report.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 font-medium">{report.date}</p>
                                                </div>
                                                <div className="text-blue-600 group-hover:translate-x-1 transition-transform text-lg">
                                                    →
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <FaHistory className="text-gray-400 text-xl" />
                                    </div>
                                    <p className="text-gray-500 font-medium text-sm">No recent reports available</p>
                                </div>
                            )}
                        </CardSection>

                        <CardSection
                            title="History of Analysis"
                            icon={<FaHistory className="text-green-600 text-sm" />}
                            gradient={true}
                        >
                            {patient.history && patient.history.length > 0 ? (
                                <div className="relative space-y-4">
                                    <div className="absolute left-4 top-0 h-full border-l-2 border-dashed border-gray-300"></div>
                                    {patient.history.map((entry, index) => (
                                        <div key={entry.id} className="relative pl-10 group">
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full ring-4 ring-white shadow-lg flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform">
                                                {index + 1}
                                            </div>
                                            <div
                                                className="bg-gradient-to-br from-white to-green-50 p-4 rounded-xl border-2 border-gray-200 hover:border-green-400 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                                onClick={() => handleViewReport(entry.id)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-800 text-sm group-hover:text-green-600 transition-colors mb-0.5">
                                                            {entry.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 font-medium">{entry.date}</p>
                                                    </div>
                                                    <div className="text-green-600 group-hover:translate-x-1 transition-transform text-lg">
                                                        →
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <FaHistory className="text-gray-400 text-xl" />
                                    </div>
                                    <p className="text-gray-500 font-medium text-sm">No analysis history available</p>
                                </div>
                            )}
                        </CardSection>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;