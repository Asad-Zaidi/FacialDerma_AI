import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaUserMd, FaBell, FaChartLine, FaCalendar, FaTimes, FaTrash } from 'react-icons/fa';
import { IoIosHourglass } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import ReviewPreviewModal from '../components/ReviewPreviewModal';
import { apiGetFullProfile, apiGetReviewRequests, apiGetReviewRequest, apiSubmitReview, apiRejectReview, apiDeleteReviewRequest } from '../api/api';

const DermatologistHome = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pending: 0,
        reviewed: 0,
        rejected: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [allRequests, setAllRequests] = useState([]);
    const [showListModal, setShowListModal] = useState(false);
    const [listModalType, setListModalType] = useState('');
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const formatNotificationTime = (dateString) => {
        if (!dateString) return 'Just now';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
    };

    const fetchProfile = async () => {
        try {
            const response = await apiGetFullProfile();
            setProfile(response.data);
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const fetchReviewRequests = async () => {
        try {
            const response = await apiGetReviewRequests();
            const requests = response.data.requests || [];
            
            // Store all requests
            setAllRequests(requests);
            
            // Calculate stats
            const pending = requests.filter(r => r.status === 'pending').length;
            const reviewed = requests.filter(r => r.status === 'reviewed').length;
            const rejected = requests.filter(r => r.status === 'rejected').length;
            setStats({ pending, reviewed, rejected });
            
            // Filter and map recent activity
            const activityRequests = requests
                .filter(r => r.status === 'reviewed' || r.status === 'rejected')
                .sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt));
            
            const mappedActivity = activityRequests.map(req => ({
                icon: req.status === 'reviewed' ? <FaCheck /> : <span className="text-lg">✗</span>,
                text: `Report ${req.status === 'reviewed' ? 'reviewed' : 'rejected'} for ${req.patientUsername || 'patient'}`,
                time: formatNotificationTime(req.reviewedAt),
                status: req.status,
                id: req.id
            }));
            
            setRecentActivity(mappedActivity);
        } catch (err) {
            console.error('Error fetching review requests:', err);
            setRecentActivity([]);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    fetchProfile(),
                    fetchReviewRequests()
                ]);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAllData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCurrentGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleStatCardClick = (type) => {
        let filtered = [];
        if (type === 'pending') {
            filtered = allRequests.filter(r => r.status === 'pending');
        } else if (type === 'reviewed') {
            filtered = allRequests.filter(r => r.status === 'reviewed');
        } else if (type === 'rejected') {
            filtered = allRequests.filter(r => r.status === 'rejected');
        }
        setFilteredRequests(filtered);
        setListModalType(type);
        setShowListModal(true);
    };

    const handleRequestClick = async (requestId) => {
        try {
            setModalLoading(true);
            const response = await apiGetReviewRequest(requestId);
            setSelectedRequest(response.data);
            setShowListModal(false);
            setShowReviewModal(true);
        } catch (err) {
            console.error('Error fetching request details:', err);
            alert('Failed to load request details');
        } finally {
            setModalLoading(false);
        }
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setSelectedRequest(null);
    };

    const handleCloseListModal = () => {
        setShowListModal(false);
        setFilteredRequests([]);
        setListModalType('');
    };

    const handleSubmitComment = async (comment) => {
        try {
            await apiSubmitReview(selectedRequest.id, comment);
            // Refresh data before closing modal
            await fetchReviewRequests();
            return true; // Indicate success
        } catch (err) {
            console.error('Error submitting review:', err);
            throw err; // Re-throw so modal can handle it
        }
    };

    const handleRejectRequest = async (comment) => {
        try {
            await apiRejectReview(selectedRequest.id, comment);
            // Refresh data before closing modal
            await fetchReviewRequests();
            return true; // Indicate success
        } catch (err) {
            console.error('Error rejecting review:', err);
            throw err; // Re-throw so modal can handle it
        }
    };

    const handleDeleteRequest = async (requestId, e) => {
        e.stopPropagation(); // Prevent opening the modal
        
        if (!window.confirm('Are you sure you want to delete this review request? This action cannot be undone.')) {
            return;
        }
        
        try {
            await apiDeleteReviewRequest(requestId);
            
            // Update filtered requests immediately to remove from UI
            setFilteredRequests(prev => prev.filter(req => req.id !== requestId));
            
            // Update all requests list
            setAllRequests(prev => prev.filter(req => req.id !== requestId));
            
            // Refresh stats and recent activity
            await fetchReviewRequests();
            
            alert('Review request deleted successfully!');
        } catch (err) {
            console.error('Error deleting review request:', err);
            alert('Failed to delete review request. Please try again.');
        }
    };

    const statsCards = [
        {
            icon: <IoIosHourglass className="text-2xl" />,
            title: 'Pending Reviews',
            value: stats.pending.toString(),
            color: 'amber',
            type: 'pending'
        },
        {
            icon: <FaCheck className="text-2xl" />,
            title: 'Cases Reviewed',
            value: stats.reviewed.toString(),
            color: 'emerald',
            type: 'reviewed'
        },
        {
            icon: <span className="text-2xl">✗</span>,
            title: 'Rejected Reviews',
            value: stats.rejected.toString(),
            color: 'rose',
            type: 'rejected'
        },
    ];

    const recentNotifications = recentActivity.length > 0 ? recentActivity : [
        {
            icon: <FaBell />,
            text: 'No recent activity',
            time: 'Just now',
            status: 'info',
            id: 'default-1'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            amber: {
                bg: 'bg-amber-500',
                light: 'bg-amber-50',
                text: 'text-amber-600'
            },
            emerald: {
                bg: 'bg-emerald-500',
                light: 'bg-emerald-50',
                text: 'text-emerald-600'
            },
            rose: {
                bg: 'bg-rose-500',
                light: 'bg-rose-50',
                text: 'text-rose-600'
            },
            blue: {
                bg: 'bg-blue-500',
                light: 'bg-blue-50',
                text: 'text-blue-600'
            }
        };
        return colors[color] || colors.blue;
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading dashboard...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">

                {/* TOP HEADER */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    {getCurrentGreeting()}, Dr. {profile?.name || 'Doctor'}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <FaCalendar className="text-xs" />
                                    {getCurrentDate()}
                                </p>
                            </div>

                            <Link
                                to="/DProfile"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                            >
                                <FaUserMd />
                                View Profile
                            </Link>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* GRID: LEFT (Stats) | RIGHT (Profile + Notifications) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT SIDE → Stats (2 columns) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                {statsCards.map((stat) => {
                                    const colors = getColorClasses(stat.color);
                                    return (
                                        <div
                                            key={stat.title}
                                            onClick={() => handleStatCardClick(stat.type)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleStatCardClick(stat.type)}
                                            role="button"
                                            tabIndex={0}
                                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer transform hover:scale-105"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-12 h-12 ${colors.light} rounded-lg flex items-center justify-center ${colors.text}`}>
                                                    {stat.icon}
                                                </div>
                                                <HiOutlineDotsVertical className="text-gray-500" />
                                            </div>

                                            <p className="text-sm text-gray-600">{stat.title}</p>
                                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>

                        {/* RIGHT SIDE → Profile Card + Notifications */}
                        <div className="space-y-6">

                            {/* Profile Card */}
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                            {profile?.profileImage ? (
                                                <img src={profile.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <FaUserMd className="text-blue-600 text-2xl" />
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg">Dr. {profile?.name || 'Your Name'}</h3>
                                            <p className="text-blue-100 text-sm">{profile?.specialization || 'Dermatologist'}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-white/10 rounded-lg p-2">
                                            <p className="text-blue-100 text-xs">Experience</p>
                                            <p className="font-semibold">{profile?.experience ? `${profile.experience} years` : 'N/A'}</p>
                                        </div>

                                        <div className="bg-white/10 rounded-lg p-2">
                                            <p className="text-blue-100 text-xs">License</p>
                                            <p className="font-semibold">{profile?.license || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 border-t">
                                    <Link to="/DProfile" className="block text-center text-blue-600 font-medium hover:text-blue-700">
                                        View Full Profile →
                                    </Link>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <FaChartLine className="text-blue-600" /> Recent Activity
                                    </h3>

                                    <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                                        {recentActivity.length}
                                    </span>
                                </div>

                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    {recentNotifications.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className={`flex items-start gap-3 p-3 rounded-lg ${
                                                activity.status === 'reviewed' ? 'bg-green-50' : 
                                                activity.status === 'rejected' ? 'bg-red-50' : 'bg-gray-50'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                activity.status === 'reviewed' ? 'bg-green-100 text-green-600' : 
                                                activity.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {activity.icon}
                                            </div>

                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{activity.text}</p>
                                                <p className="text-xs text-gray-500">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* List Modal for Requests */}
            {showListModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white capitalize">
                                {listModalType} Review Requests
                            </h2>
                            <button
                                onClick={handleCloseListModal}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                            {filteredRequests.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No {listModalType} requests found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredRequests.map((request) => (
                                        <div
                                            key={request.id}
                                            className={`p-4 border rounded-lg transition hover:shadow-md ${
                                                request.status === 'pending' ? 'border-amber-200 bg-amber-50' :
                                                request.status === 'reviewed' ? 'border-green-200 bg-green-50' :
                                                'border-red-200 bg-red-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div 
                                                    className="flex-1 cursor-pointer"
                                                    onClick={() => handleRequestClick(request.id)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleRequestClick(request.id)}
                                                    role="button"
                                                    tabIndex={0}
                                                >
                                                    <p className="font-semibold text-gray-800">
                                                        Patient: {request.patientUsername || 'Unknown'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Request ID: {request.id.substring(0, 8)}...
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(request.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        request.status === 'pending' ? 'bg-amber-200 text-amber-800' :
                                                        request.status === 'reviewed' ? 'bg-green-200 text-green-800' :
                                                        'bg-red-200 text-red-800'
                                                    }`}>
                                                        {request.status.toUpperCase()}
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleDeleteRequest(request.id, e)}
                                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                        title="Delete review request"
                                                    >
                                                        <FaTrash className="text-sm" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {modalLoading && (
                                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                    <div className="bg-white rounded-lg p-4">
                                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Review Preview Modal */}
            {showReviewModal && selectedRequest && (
                <ReviewPreviewModal
                    open={showReviewModal}
                    onClose={handleCloseReviewModal}
                    loading={modalLoading}
                    error={null}
                    prediction={{
                        prediction: selectedRequest.prediction,
                        status: selectedRequest.status,
                        comment: selectedRequest.comment,
                        patientName: selectedRequest.patientName,
                        dermatologistInfo: selectedRequest.dermatologistInfo,
                        reviewedAt: selectedRequest.reviewedAt
                    }}
                    onSubmitComment={handleSubmitComment}
                    onRejectRequest={handleRejectRequest}
                />
            )}

            <Footer />
        </>
    );
};

export default DermatologistHome;
