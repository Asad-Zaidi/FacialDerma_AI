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
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import { MdSave, MdCancel } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosHourglass } from "react-icons/io";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { apiGetFullProfile, apiUpdateProfile, getAllPredictions, apiGetReviewRequests, apiGetReviewRequest, apiDeletePrediction } from "../api/api";
import Header from '../Nav_Bar/Header';
import MaleAvatar from "../Assets/male-avatar.png";
import FemaleAvatar from "../Assets/female-avatar.png";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateProfilePopup from '../components/UpdateProfilePopup';
import PatientReviewModal from '../components/PatientReviewModal';
import AnimatedCheck from '../components/ui/AnimatedCheck';

const CardSection = ({ title, icon, children, editHandler, gradient = false }) => (
    <div className={`${gradient ? 'bg-gradient-to-br from-white via-gray-50 to-white' : 'bg-white'} border border-gray-200 rounded-xl shadow-lg p-4`}>
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
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [reviewRequests, setReviewRequests] = useState([]);
    const [showPatientReview, setShowPatientReview] = useState(false);
    const [patientReviewData, setPatientReviewData] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState(null);
    const [sortBy, setSortBy] = useState('date'); // 'date', 'disease', 'status'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });


    useEffect(() => {
        fetchProfile();
        fetchPredictions();
        fetchReviewRequests();
    }, []);


    useEffect(() => {
        if (patient) {
            // Check if we've already shown the popup this session
            const popupShownThisSession = sessionStorage.getItem('profilePopupShown');

            // Check if essential fields are missing
            const isIncomplete = !patient.name || !patient.age || !patient.phone ||
                !patient.gender || !patient.bloodGroup || !patient.address;

            // Only show if incomplete AND not already shown this session
            if (isIncomplete && !popupShownThisSession) {
                setShowUpdatePopup(true);
                sessionStorage.setItem('profilePopupShown', 'true');
            }
        }
    }, [patient]);

    const fetchPredictions = async () => {
        try {
            const response = await getAllPredictions();
            setPredictions(response.data || []);
        } catch (error) {
            console.error("Failed to fetch predictions:", error);
        }
    };

    const fetchReviewRequests = async () => {
        try {
            const response = await apiGetReviewRequests();
            setReviewRequests(response.data?.requests || []);
        } catch (error) {
            console.error("Failed to fetch review requests:", error);
        }
    };

    // Helper function to get review request status for a prediction
    const getReviewStatus = (predictionId) => {
        const request = reviewRequests.find(
            (req) => req.predictionId === predictionId
        );
        if (!request) return null;
        return request.status; // 'pending', 'reviewed', or 'rejected'
    };

    // Helper function to render status badge
    const renderStatusBadge = (status) => {
        if (!status) {
            return (
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-200 text-gray-600">
                    No Request
                </span>
            );
        }

        const statusConfig = {
            pending: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-700',
                icon: <IoIosHourglass className="text-yellow-700 h-3.5 w-3.5" />,
                label: 'Pending'
            },
            reviewed: {
                bg: 'bg-green-100',
                text: 'text-green-700',
                icon: '✓',
                label: 'Approved'
            },
            rejected: {
                bg: 'bg-red-100',
                text: 'text-red-700',
                icon: '✗',
                label: 'Rejected'
            }
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1 ${config.bg} ${config.text}`}>
                <span>{config.icon}</span>
                {config.label}
            </span>
        );
    };

    // Function to get sorted predictions
    const getSortedPredictions = () => {
        if (!predictions || predictions.length === 0) return [];

        let sorted = [...predictions];

        // Sort based on selected criteria
        sorted.sort((a, b) => {
            let comparison = 0;

            if (sortBy === 'disease') {
                const nameA = (a.result?.predicted_label || '').toLowerCase();
                const nameB = (b.result?.predicted_label || '').toLowerCase();
                comparison = nameA.localeCompare(nameB);
            } else if (sortBy === 'date') {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                comparison = dateA - dateB;
            } else if (sortBy === 'status') {
                const statusA = getReviewStatus(a.id) || 'none';
                const statusB = getReviewStatus(b.id) || 'none';
                const statusOrder = { 'reviewd': 1, 'pending': 2, 'rejected': 3, 'none': 4 };
                comparison = (statusOrder[statusA] || 5) - (statusOrder[statusB] || 5);
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return sorted;
    };

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await apiGetFullProfile();
            setPatient(response.data);
            setError(null);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            const errorMsg = error.response?.data?.detail?.error || error.response?.data?.detail || error.message || "Failed to load profile";
            setError(errorMsg);
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
                // alert('Profile picture updated successfully');
                toast.success('Profile picture updated successfully');
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
            // alert('Profile picture removed successfully');
            toast.success('Profile picture removed successfully');
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
        setEditData({ ...patient });
        console.log("Edit Data:", { ...patient });
    };

    const validateBasicInfo = () => {
        if (editData.age && (editData.age < 0 || editData.age > 150)) {
            alert("Please enter a valid age");
            return false;
        }
        if (editData.phone && !/^\+?[\d\s-]{10,}$/.test(editData.phone)) {
            alert("Please enter a valid phone number");
            return false;
        }
        return true;
    };

    const handleSave = async (section) => {
        if (section === "Basic Information" && !validateBasicInfo()) {
            return;
        }
        try {
            setLoading(true);
            const response = await apiUpdateProfile(editData);
            setPatient(response.data.user);
            setEditMode(null);
            setEditData({});
            toast.success(response.data.message);
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

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('All password fields are required');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters');
            return;
        }

        try {
            setPasswordLoading(true);
            // You'll need to add this API endpoint
            const response = await fetch('http://localhost:5000/api/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setPasswordSuccess(true);
                setTimeout(() => {
                    toast.success(data.message || 'Password changed successfully');
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordSuccess(false);
                    setShowPasswords({ current: false, new: false, confirm: false });
                }, 2000);
            } else {
                toast.error(data.detail?.error || data.error || 'Failed to change password');
            }
        } catch (error) {
            console.error('Failed to change password:', error);
            toast.error('Failed to change password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        hours = String(hours).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    };

    const handleDeleteAnalysis = async (predictionId) => {
        if (!window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
            return;
        }

        try {
            await apiDeletePrediction(predictionId);
            toast.success('Analysis deleted successfully');
            
            // Refresh the predictions list
            await fetchPredictions();
            await fetchReviewRequests();
        } catch (error) {
            console.error("Failed to delete analysis:", error);
            const errorMsg = error.response?.data?.detail?.error || error.response?.data?.detail || 'Failed to delete analysis';
            toast.error(errorMsg);
        }
    };

    const handleViewAnalysis = async (predictionId) => {
        try {
            setReviewLoading(true);
            setReviewError(null);
            setShowPatientReview(true);

            // Find the prediction
            const prediction = predictions.find(p => p.id === predictionId);

            if (!prediction) {
                setReviewError("Prediction not found");
                setReviewLoading(false);
                return;
            }

            // Find review request for this prediction (reviewed or rejected)
            const reviewRequest = reviewRequests.find(r => r.predictionId === predictionId && (r.status === 'reviewed' || r.status === 'rejected'));

            if (reviewRequest) {
                // Fetch full review details including dermatologist info
                try {
                    const reviewResponse = await apiGetReviewRequest(reviewRequest.id);
                    const reviewData = reviewResponse.data;
                    
                    // Ensure prediction imageUrl is present
                    // If the review response doesn't have imageUrl, use it from the original prediction
                    if (reviewData.prediction && !reviewData.prediction.imageUrl && prediction.imageUrl) {
                        reviewData.prediction.imageUrl = prediction.imageUrl;
                    }
                    
                    setPatientReviewData(reviewData);
                } catch (err) {
                    console.error("Failed to fetch review details:", err);
                    // Fallback to just showing prediction
                    setPatientReviewData({
                        prediction: prediction,
                        status: 'pending',
                        comment: null,
                        dermatologistInfo: null,
                        reviewedAt: null
                    });
                }
            } else {
                // No review request or not reviewed/rejected yet
                setPatientReviewData({
                    prediction: prediction,
                    status: 'pending',
                    comment: null,
                    dermatologistInfo: null,
                    reviewedAt: null
                });
            }
        } catch (error) {
            console.error("Failed to load analysis:", error);
            setReviewError("Failed to load analysis details");
        } finally {
            setReviewLoading(false);
        }
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
                        className="px-5 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
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
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-1">
                        Profile
                    </h1>
                    <p className="text-gray-600 text-xs">Manage your health information and medical records</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="space-y-5">
                        <div className="bg-gradient-to-br from-white via-blue-50 to-white border border-gray-200 rounded-xl shadow-xl p-5 text-center ">
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
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            min="0"
                                            max="150"
                                            value={editData.age}
                                            onChange={handleInputChange}
                                            placeholder="Enter age"
                                            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Height</label>
                                        <input
                                            type="number"
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
                                            type="number"
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

                        {/* Change Password Button */}
                        {/* <button
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl hover:from-gray-700 hover:to-gray-800 font-semibold transition-all transform shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Change Password
                        </button> */}
                    </div>

                    <div className="lg:col-span-2 space-y-5">

                        {/* Custom Card Section with Dropdown Filter */}
                        <div className="bg-gradient-to-br from-white via-green-50 to-white border border-gray-200 rounded-xl shadow-lg p-5 backdrop-blur-sm">
                            {/* Custom Header with Title and Filter Dropdown */}
                            <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-green-200">
                                <div className="flex items-center gap-2.5">
                                    <div className="bg-gradient-to-br from-green-500 to-teal-600 p-2 rounded-lg shadow-md">
                                        <FaHistory className="text-white text-lg" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">Analysis History</h3>
                                </div>
                                
                                {/* Filter Controls */}
                                <div className="flex items-center gap-3">
                                    {/* Sort By Dropdown */}
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-semibold text-gray-700">Sort by:</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="py-0.5 text-xs font-medium border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer hover:border-green-400 transition-all"
                                        >
                                            <option value="date">Date</option>
                                            <option value="disease">Disease</option>
                                            <option value="status">Status</option>
                                        </select>
                                    </div>
                                    
                                    {/* Sort Order Toggle */}
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="px-2.5 py-1 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-1.5 shadow-md"
                                        title={sortOrder === 'asc' ? 'Ascending Order' : 'Descending Order'}
                                    >
                                        {sortOrder === 'asc' ? (
                                            <>
                                                <FaSortUp className="text-sm top-1" />
                                                <span>Asce</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaSortDown className="text-sm" />
                                                <span>Desc</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            {predictions && predictions.length > 0 ? (
                                <>

                                    <div className="overflow-x-auto max-h-[800px] overflow-y-auto">
                                        <table className="w-full border-collapse">
                                        <thead className="sticky top-0 z-10">
                                            <tr className="bg-gradient-to-r from-green-50 to-teal-50 border-b-2 border-green-200">
                                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Disease Name</th>
                                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Date</th>
                                                <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">Review Status</th>
                                                <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getSortedPredictions().map((prediction, index) => (
                                                <tr 
                                                    key={prediction.id} 
                                                    className={`border-b border-gray-200 hover:bg-green-50 transition-colors ${
                                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                    }`}
                                                >
                                                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                                                        {prediction.result?.predicted_label || 'Skin Analysis'}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">
                                                        {formatDateTime(prediction.createdAt)}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        {renderStatusBadge(getReviewStatus(prediction.id))}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleViewAnalysis(prediction.id)}
                                                                className="px-4 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAnalysis(prediction.id)}
                                                                className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center gap-1"
                                                                title="Delete this analysis"
                                                            >
                                                                <FaTrash className="text-xs" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <FaHistory className="text-gray-400 text-xl" />
                                    </div>
                                    <p className="text-gray-500 font-medium text-sm">No analysis history available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showUpdatePopup && (
                <UpdateProfilePopup
                    onClose={() => setShowUpdatePopup(false)}
                    userRole="patient"
                />
            )}
            <PatientReviewModal
                open={showPatientReview}
                onClose={() => {
                    setShowPatientReview(false);
                    setPatientReviewData(null);
                    setReviewError(null);
                }}
                loading={reviewLoading}
                error={reviewError}
                reviewData={patientReviewData}
                currentUser={patient}
            />

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                        {passwordSuccess ? (
                            <AnimatedCheck 
                                title="Password Changed!"
                                message="Your password has been updated successfully"
                            />
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Change Password
                                    </h2>
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    setShowPasswords({ current: false, new: false, confirm: false });
                                }}
                                disabled={passwordLoading}
                                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordInputChange}
                                        disabled={passwordLoading}
                                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={passwordLoading}
                                    >
                                        {showPasswords.current ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordInputChange}
                                        disabled={passwordLoading}
                                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Enter new password (min 8 characters)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={passwordLoading}
                                    >
                                        {showPasswords.new ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordInputChange}
                                        disabled={passwordLoading}
                                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={passwordLoading}
                                    >
                                        {showPasswords.confirm ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={passwordLoading}
                                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold transition-all transform hover: shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {passwordLoading ? (
                                        <>
                                            <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                                            <span>Changing...</span>
                                        </>
                                    ) : (
                                        'Change Password'
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                        setShowPasswords({ current: false, new: false, confirm: false });
                                    }}
                                    disabled={passwordLoading}
                                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold transition-all transform hover: shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;