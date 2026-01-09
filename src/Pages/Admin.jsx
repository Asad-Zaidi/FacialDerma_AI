import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    apiGetDashboardStats,
    apiGetPendingVerifications,
    apiGetRejectedVerifications,
    apiVerifyDermatologist,
    apiGetAllUsers,
    apiSuspendUser,
    apiUnsuspendUser,
    apiDeleteUser,
    apiChangeAdminPassword,
    apiGetActivityLogs
} from '../api/api';
import {
    FaUsers,
    FaUserMd,
    FaUserInjured,
    FaClipboardList,
    FaCheckCircle,
    FaTimesCircle,
    FaSpinner,
    FaChartBar,
    FaBan,
    FaTrash,
    FaUserShield,
    FaKey,
    FaBars,
    FaTimes,
    FaSignOutAlt
} from 'react-icons/fa';
import { PiWarningCircleLight } from 'react-icons/pi';
import { MdClose, MdEmail } from 'react-icons/md';
import { BsShieldExclamation } from 'react-icons/bs';
import { RxActivityLog } from "react-icons/rx";
import { IoMedkit } from "react-icons/io5";
import { LuBrainCircuit } from "react-icons/lu";
import ConfirmSignOut from '../components/ConfirmSignout';
import DropDown from "../components/ui/DropDown";
import ActivityLog from '../components/ActivityLog';
import TreatmentManagement from '../components/TreatmentManagement';

const Admin = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // logout is used in handleLogout

    // Check if user is admin
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    // State Management
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [unverifiedDermatologists, setUnverifiedDermatologists] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ role: '', skip: 0, limit: 50 });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: ''
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [userToSuspend, setUserToSuspend] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [verificationToReject, setVerificationToReject] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activityLogs, setActivityLogs] = useState([]);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(timer);
    }, []);

    // Get greeting based on time
    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Format date and day
    const formatDate = () => {
        return currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    // Fetch Dashboard Stats
    const fetchDashboardStats = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiGetDashboardStats();
            setStats(response.data);
        } catch (error) {
            toast.error('Failed to fetch dashboard stats');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch Pending Verifications
    const fetchPendingVerifications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiGetPendingVerifications();
            setPendingVerifications(response.data);
        } catch (error) {
            toast.error('Failed to fetch pending verifications');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch Rejected Verifications
    const fetchRejectedVerifications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiGetRejectedVerifications();
            setUnverifiedDermatologists(response.data);
        } catch (error) {
            toast.error('Failed to fetch rejected verifications');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch Activity Logs
    const fetchActivityLogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiGetActivityLogs();
            setActivityLogs(response.data);
        } catch (error) {
            toast.error('Failed to fetch activity logs');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch All Users
    const fetchAllUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiGetAllUsers(filters);
            setAllUsers(response.data.users || []);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Verify Dermatologist
    const handleVerifyDermatologist = async (dermatologistId, status, reviewComments = '') => {
        try {
            setLoading(true);
            await apiVerifyDermatologist(dermatologistId, { status, reviewComments });
            toast.success(`Dermatologist ${status} successfully`);
            fetchPendingVerifications();
            fetchRejectedVerifications();
            fetchDashboardStats();
        } catch (error) {
            console.error('Verify dermatologist error:', error);
            const errorMsg = error.response?.data?.detail || error.message || `Failed to ${status} dermatologist`;
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Suspend/Unsuspend User
    const handleSuspendUser = async () => {
        if (!userToSuspend) return;

        const isCurrentlySuspended = userToSuspend.isSuspended;

        try {
            setLoading(true);

            if (isCurrentlySuspended) {
                await apiUnsuspendUser(userToSuspend.id);
                toast.success('User unsuspended successfully');
            } else {
                await apiSuspendUser(userToSuspend.id);
                toast.success('User suspended successfully');
            }

            setShowSuspendModal(false);
            setUserToSuspend(null);
            fetchAllUsers();
        } catch (error) {
            console.error('Suspend/Unsuspend user error:', error);
            const errorMsg = error.response?.data?.detail || error.message || `Failed to ${isCurrentlySuspended ? 'unsuspend' : 'suspend'} user`;
            toast.error(errorMsg);
            setShowSuspendModal(false);
            setUserToSuspend(null);
        } finally {
            setLoading(false);
        }
    };

    // Delete User
    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            setLoading(true);
            await apiDeleteUser(userToDelete.id);
            toast.success('User deleted successfully');
            setShowDeleteModal(false);
            setUserToDelete(null);
            fetchAllUsers();
            fetchPendingVerifications();
            fetchRejectedVerifications();
        } catch (error) {
            console.error('Delete user error:', error);
            const errorMsg = error.response?.data?.detail || error.message || 'Failed to delete user';
            toast.error(errorMsg);
            setShowDeleteModal(false);
            setUserToDelete(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle Logout
    // eslint-disable-next-line no-unused-vars
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Change Password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await apiChangeAdminPassword(passwordData);
            toast.success('Password changed successfully');
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchDashboardStats();
        } else if (activeTab === 'verifications') {
            fetchPendingVerifications();
            fetchRejectedVerifications();
        } else if (activeTab === 'users') {
            fetchAllUsers();
        } else if (activeTab === 'activityLog') {
            fetchActivityLogs();
        }
    }, [activeTab, filters, fetchDashboardStats, fetchPendingVerifications, fetchRejectedVerifications, fetchAllUsers, fetchActivityLogs]);

    // Stat Card Component
    const StatCard = ({ icon: Icon, title, value, color }) => {
        const colorClasses = {
            primary: 'from-purple-500 to-purple-700',
            info: 'from-cyan-400 to-indigo-900',
            success: 'from-green-500 to-teal-500',
            warning: 'from-yellow-400 to-red-400',
            secondary: 'from-gray-600 to-gray-800',
            danger: 'from-red-500 to-red-700'
        };

        return (
            <div className="flex items-center gap-5 p-6 rounded-xl bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className={`flex items-center justify-center w-16 h-16 md:w-[70px] md:h-[70px] rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white text-3xl md:text-4xl`}>
                    <Icon />
                </div>
                <div className="flex-1">
                    <h3 className="m-0 mb-1 text-gray-600 text-xs md:text-sm uppercase tracking-wider">{title}</h3>
                    <p className="m-0 text-2xl md:text-3xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
        );
    };

    // Verification Card Component
    const VerificationCard = ({ verification }) => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
            approved: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200',
            unverified: 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
        };

        return (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-gray-100">
                    <div className="flex-1">
                        <h4 className="m-0 mb-1 text-gray-800 text-lg font-semibold">{verification.name || 'N/A'}</h4>
                        <p className="m-0 my-1 text-gray-600 text-sm">{verification.email || 'N/A'}</p>
                        <p className="m-0 mt-1 text-gray-500 text-xs italic">@{verification.username || 'N/A'}</p>
                    </div>
                    <span className={`px-2 py-1 border rounded-full text-xs font-semibold uppercase transition-colors duration-200 ${statusColors[verification.status] || statusColors.pending}`}>
                        {verification.status === 'rejected' ? 'unverified' : verification.status}
                    </span>
                </div>
                <div className="mb-4">
                    <p className="my-2 text-gray-700 text-sm"><strong className="text-gray-800 font-semibold">License:</strong> {verification.license || 'N/A'}</p>
                    <p className="my-2 text-gray-700 text-sm"><strong className="text-gray-800 font-semibold">Specialization:</strong> {verification.specialization || 'N/A'}</p>
                    <p className="my-2 text-gray-700 text-sm"><strong className="text-gray-800 font-semibold">Clinic:</strong> {verification.clinic || 'N/A'}</p>
                    <p className="my-2 text-gray-700 text-sm"><strong className="text-gray-800 font-semibold">Experience:</strong> {verification.experience || 'N/A'} years</p>
                    <p className="my-2 text-gray-700 text-sm"><strong className="text-gray-800 font-semibold">Submitted:</strong> {new Date(verification.submittedAt).toLocaleString('en-GB')}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
                    <button
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-br from-green-500 to-teal-500 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-sm"
                        onClick={() => handleVerifyDermatologist(verification.dermatologistId, 'approved')}
                        disabled={loading}
                    >
                        <FaCheckCircle /> {verification.status === 'rejected' ? 'Re-Approve' : 'Approve'}
                    </button>
                    {verification.status === 'pending' && (
                        <button
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-br from-red-500 to-red-700 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-sm"
                            onClick={() => {
                                setVerificationToReject(verification);
                                setRejectionReason('');
                                setShowRejectModal(true);
                            }}
                            disabled={loading}
                        >
                            <FaTimesCircle /> Reject
                        </button>
                    )}
                    {verification.status === 'rejected' && (
                        <button
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-br from-red-500 to-red-700 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-sm"
                            onClick={() => {
                                setUserToDelete({ id: verification.dermatologistId, name: verification.name, email: verification.email });
                                setShowDeleteModal(true);
                            }}
                            disabled={loading}
                        >
                            <FaTrash /> Delete
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // User Card Component
    const UserCard = ({ user }) => {
        return (
            <div
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => {
                    setSelectedUser(user);
                    setShowUserModal(true);
                }}
            >
                <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-gray-100">
                    <div className="flex-1 min-w-0 pr-2">
                        <h4 className="m-0 mb-1 text-gray-800 text-lg font-semibold truncate">{user.name || user.username}</h4>
                        <p className="m-0 mt-1 text-gray-600 text-sm truncate">{user.email}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <span className={`px-2 py-1 border rounded-full text-xs font-semibold uppercase transition-colors duration-200 whitespace-nowrap ${user.role === 'patient' ? 'bg-cyan-100 text-cyan-800 border-cyan-300 hover:bg-cyan-200' :
                            user.role === 'dermatologist' ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' :
                                'bg-red-100 text-red-800 border-red-300 hover:bg-red-200'
                            }`}>
                            {user.role}
                        </span>
                    </div>
                </div>
                <div className="mb-4">
                    <p className="my-2 text-gray-700 text-sm"><strong className="text-gray-800 font-semibold">Username:</strong> {user.username}</p>
                    <p className="my-2 text-gray-700 text-sm"><strong className="text-gray-800 font-semibold">Created:</strong> {new Date(user.createdAt).toLocaleDateString('en-GB')}</p>
                    {user.role === 'dermatologist' && (
                        <p className="my-2 text-gray-700 text-sm"><strong className="text-gray-800 font-semibold">Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</p>
                    )}
                    <p className={`my-2 text-sm ${user.isSuspended ? 'text-red-600' : 'text-green-600'}`}>
                        <strong className="font-semibold">Status:</strong> {user.isSuspended ? 'Suspended' : 'Active'}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
                    <button
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold ${user.isSuspended ? 'bg-gradient-to-br from-green-500 to-teal-500' : 'bg-gradient-to-br from-yellow-400 to-red-400'} text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-sm`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setUserToSuspend(user);
                            setShowSuspendModal(true);
                        }}
                        disabled={loading}
                    >
                        <FaBan /> {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                    <button
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gradient-to-br from-red-500 to-red-700 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setUserToDelete(user);
                            setShowDeleteModal(true);
                        }}
                        disabled={loading}
                    >
                        <FaTrash /> Delete
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '10px',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                        style: {
                            background: '#f0fdf4',
                            color: '#166534',
                            border: '1px solid #10b981',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                        style: {
                            background: '#fef2f2',
                            color: '#991b1b',
                            border: '1px solid #ef4444',
                        },
                    },
                }}
            />
            <div className="flex min-h-screen bg-gray-50">
                {/* Collapsible Sidebar */}
                <div className={`fixed left-0 top-0 h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white shadow-2xl z-50 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-[70px]' : 'w-60'}`}>
                    <div className="flex justify-between items-center p-5 border-b border-white border-opacity-20">
                        {!sidebarCollapsed && (
                            <h2 className="m-0 text-2xl flex items-center gap-2.5">
                                <FaUserShield /> Admin
                            </h2>
                        )}
                        <button
                            className="hover:bg-white hover:bg-opacity-10 border-none text-white w-9 h-9 rounded-lg cursor-pointer flex items-center justify-center text-xl transition-all duration-300"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                        >
                            {sidebarCollapsed ? <FaBars /> : <FaTimes />}
                        </button>
                    </div>

                    <nav className="flex-1 py-5 overflow-y-auto">
                        <button
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${activeTab === 'dashboard' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                            title="Dashboard"
                        >
                            <FaChartBar className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Dashboard</span>}
                        </button>
                        <button
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${activeTab === 'verifications' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            onClick={() => setActiveTab('verifications')}
                            title="Verifications"
                        >
                            <FaClipboardList className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Verifications</span>}
                        </button>
                        <button
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${activeTab === 'users' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            onClick={() => setActiveTab('users')}
                            title="Users"
                        >
                            <FaUsers className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Users</span>}
                        </button>
                        <button
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${activeTab === 'treatmentdatabase' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            onClick={() => setActiveTab('treatmentdatabase')}
                            title="Treatment DB"
                        >
                            <IoMedkit className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Treatment DB</span>}
                        </button>
                        {/* <button
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${activeTab === 'emailTemplates' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            onClick={() => setActiveTab('emailTemplates')}
                            title="Email Templates"
                        >
                            <MdEmail className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Email Templates</span>}
                        </button>
                        <button
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${activeTab === 'mlmodel' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            onClick={() => setActiveTab('mlmodel')}
                            title="ML Model"
                        >
                            <LuBrainCircuit className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>ML Model</span>}
                        </button> */}
                        <button
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10 ${activeTab === 'activityLog' ? 'bg-white bg-opacity-20 border-l-4 border-white' : ''}`}
                            onClick={() => setActiveTab('activityLog')}
                            title="Activity Log"
                        >
                            <RxActivityLog className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Activity Log</span>}
                        </button>
                    </nav>

                    <div className="py-5 border-t border-white border-opacity-20">
                        <button
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10`}
                            onClick={() => setShowPasswordModal(true)}
                            title="Change Password"
                        >
                            <FaKey className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Change Password</span>}
                        </button>
                        <button
                            className={`w-full px-5 py-4 border-none bg-transparent text-white text-base font-medium cursor-pointer transition-all duration-300 flex items-center text-left ${sidebarCollapsed ? 'justify-center gap-0' : 'gap-4'} hover:bg-white hover:bg-opacity-10`}
                            onClick={() => setShowLogoutModal(true)}
                            title="Logout"
                        >
                            <FaSignOutAlt className={`text-xl ${sidebarCollapsed ? '' : 'min-w-[20px]'}`} />
                            {!sidebarCollapsed && <span>Logout</span>}
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[70px] w-[calc(100%-70px)]' : 'ml-64 w-[calc(100%-256px)]'}`}>
                    {/* Header */}
                    <div className="p-4 md:p-4 bg-white border-b border-gray-200 mb-8 flex justify-between items-center">
                        <h1 className="m-0 text-xl md:text-2xl text-gray-800">
                            {getGreeting()}, Admin!
                        </h1>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">{formatDate()}</p>
                            <p className="text-sm text-gray-600">{formatTime(currentTime)}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative mx-6 md:mx-8 mb-8 bg-green-50  rounded-xl p-6 md:p-8 shadow-lg min-h-[80vh]">
                        {loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl z-50">
                                <FaSpinner className="text-5xl text-purple-600 animate-spin" />
                            </div>
                        )}

                        {/* Dashboard Tab */}
                        {activeTab === 'dashboard' && stats && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                <StatCard
                                    icon={FaUsers}
                                    title="Total Users"
                                    value={stats.totalUsers}
                                    color="primary"
                                />
                                <StatCard
                                    icon={FaUserInjured}
                                    title="Patients"
                                    value={stats.totalPatients}
                                    color="info"
                                />
                                <StatCard
                                    icon={FaUserMd}
                                    title="Dermatologists"
                                    value={stats.totalDermatologists}
                                    color="success"
                                />
                                <StatCard
                                    icon={FaClipboardList}
                                    title="Pending Verifications"
                                    value={stats.pendingVerifications}
                                    color="warning"
                                />
                                <StatCard
                                    icon={FaChartBar}
                                    title="Total Predictions"
                                    value={stats.totalPredictions}
                                    color="secondary"
                                />
                                <StatCard
                                    icon={FaClipboardList}
                                    title="Review Requests"
                                    value={stats.totalReviewRequests}
                                    color="danger"
                                />
                            </div>
                        )}

                        {/* Verifications Tab */}
                        {activeTab === 'verifications' && (
                            <div>
                                <h2 className="mb-6 text-gray-800 text-xl md:text-2xl">Dermatologist Verifications</h2>
                                {/* Pending Verifications */}
                                {pendingVerifications.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="mb-4 text-gray-700 text-lg font-semibold">Pending Verifications</h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                            {pendingVerifications.map(verification => (
                                                <VerificationCard
                                                    key={verification.id}
                                                    verification={verification}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Rejected Dermatologists */}
                                {unverifiedDermatologists.length > 0 && (
                                    <div>
                                        <h3 className="mb-4 text-gray-700 text-lg font-semibold">Rejected Dermatologists</h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                            {unverifiedDermatologists.map(verification => (
                                                <VerificationCard
                                                    key={verification.id}
                                                    verification={verification}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {pendingVerifications.length === 0 && unverifiedDermatologists.length === 0 && (
                                    <p className="text-center py-16 text-gray-400 text-xl">No verifications</p>
                                )}
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <h2 className="m-0 text-gray-800 text-xl md:text-2xl">All Users</h2>
                                    <div className="flex gap-2.5">
                                        <DropDown
                                            value={filters.role}
                                            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                                            placeholder="All Roles"
                                            options={[
                                                { value: "", label: "All Roles" },
                                                { value: "patient", label: "Patients" },
                                                { value: "dermatologist", label: "Dermatologists" },
                                                { value: "admin", label: "Admins" },
                                            ]}
                                            widthClass="w-[150px]"
                                            borderClass="border-gray-300"
                                            selectedClass="bg-purple-500 text-gray-950"
                                            highlightClass="bg-purple-200 text-purple-900"
                                            ringClass="ring-purple-500"
                                            placeholderClass="text-gray-500"
                                            triggerPadding="py-0.5 px-2"
                                            triggerFontSize="text-sm"
                                        />


                                    </div>
                                </div>
                                {allUsers.length === 0 ? (
                                    <p className="text-center py-16 text-gray-400 text-xl">No users found</p>
                                ) : (
                                    <>
                                        {/* Active Users (Non-Admin, Non-Suspended) */}
                                        {allUsers.filter(user => user.role !== 'admin' && !user.isSuspended).length > 0 && (
                                            <div className="mb-12">
                                                <h3 className="mb-4 text-gray-700 text-lg font-semibold flex items-center gap-2">
                                                    <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                                                    Active Users ({allUsers.filter(user => user.role !== 'admin' && !user.isSuspended).length})
                                                </h3>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                                    {allUsers
                                                        .filter(user => user.role !== 'admin' && !user.isSuspended)
                                                        .map(user => (
                                                            <UserCard key={user.id} user={user} />
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Suspended Users */}
                                        {allUsers.filter(user => user.isSuspended && user.role !== 'admin').length > 0 && (
                                            <div className="mb-12">
                                                <h3 className="mb-4 text-gray-700 text-lg font-semibold flex items-center gap-2">
                                                    <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                                                    Suspended Users ({allUsers.filter(user => user.isSuspended && user.role !== 'admin').length})
                                                </h3>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                                    {allUsers
                                                        .filter(user => user.isSuspended && user.role !== 'admin')
                                                        .map(user => (
                                                            <UserCard key={user.id} user={user} />
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Admin Users */}
                                        {allUsers.filter(user => user.role === 'admin').length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="mb-4 text-gray-700 text-lg font-semibold flex items-center gap-2">
                                                    <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                                    Administrators ({allUsers.filter(user => user.role === 'admin').length})
                                                </h3>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                                    {allUsers
                                                        .filter(user => user.role === 'admin')
                                                        .map(user => (
                                                            <UserCard key={user.id} user={user} />
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Activity Log Tab */}
                        {activeTab === 'activityLog' && (
                            <ActivityLog activityLogs={activityLogs} />
                        )}

                        {/* Treatment Database Tab */}
                        {activeTab === 'treatmentdatabase' && (
                            <TreatmentManagement />
                        )}

                        
                    </div>

                    {/* Password Change Modal */}
                    {showPasswordModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[2000] animate-[fadeIn_0.3s_ease]" onClick={() => setShowPasswordModal(false)}>
                            <div className="bg-white rounded-xl p-8 max-w-lg w-[90%] shadow-2xl animate-[slideUp_0.3s_ease] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                <h2 className="m-0 mb-5 text-gray-800 text-2xl">Change Admin Password</h2>
                                <form onSubmit={handleChangePassword}>
                                    <div className="mb-5">
                                        <label className="block mb-2 text-gray-800 font-semibold text-sm">Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({
                                                ...passwordData,
                                                currentPassword: e.target.value
                                            })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-purple-600"
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label className="block mb-2 text-gray-800 font-semibold text-sm">New Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({
                                                ...passwordData,
                                                newPassword: e.target.value
                                            })}
                                            required
                                            minLength={8}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-purple-600"
                                        />
                                    </div>
                                    <div className="flex gap-2.5 justify-end mt-6">
                                        <button
                                            type="button"
                                            className="px-5 py-2.5 rounded-lg font-semibold bg-gray-600 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                                            onClick={() => setShowPasswordModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-br from-purple-500 to-purple-700 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                            disabled={loading}
                                        >
                                            {loading ? 'Changing...' : 'Change Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Logout Confirmation Modal */}
                    {showLogoutModal && (
                        <ConfirmSignOut
                            onConfirm={handleLogout}
                            onCancel={() => setShowLogoutModal(false)}
                        />
                    )}

                    {/* Suspend User Confirmation Modal */}
                    {showSuspendModal && userToSuspend && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-[fadeIn_0.2s_ease-out]">
                            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[scaleIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                                {/* Decorative Top Bar */}
                                <div className={`h-2 ${userToSuspend.isSuspended ? 'bg-gradient-to-r from-green-400 via-teal-400 to-green-500' : 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400'}`}></div>

                                {/* Close Button */}
                                <button
                                    onClick={() => {
                                        setShowSuspendModal(false);
                                        setUserToSuspend(null);
                                    }}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                                    aria-label="Close"
                                >
                                    <MdClose className="text-xl" />
                                </button>

                                {/* Content */}
                                <div className="p-8 text-center">
                                    {/* Icon with Animation */}
                                    <div className="relative inline-block mb-6">
                                        <div className={`absolute inset-0 ${userToSuspend.isSuspended ? 'bg-green-100' : 'bg-yellow-100'} rounded-full animate-ping opacity-75`}></div>
                                        <div className={`relative w-20 h-20 bg-gradient-to-br ${userToSuspend.isSuspended ? 'from-green-100 to-teal-100' : 'from-yellow-100 to-orange-100'} rounded-full flex items-center justify-center`}>
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                                                <PiWarningCircleLight className={`${userToSuspend.isSuspended ? 'text-green-500' : 'text-yellow-500'} text-5xl`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Heading */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        {userToSuspend.isSuspended ? 'Unsuspend' : 'Suspend'} User Confirmation
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-2">
                                        Are you sure you want to {userToSuspend.isSuspended ? 'unsuspend' : 'suspend'} <strong>{userToSuspend.name || userToSuspend.username}</strong>?
                                    </p>
                                    <p className="text-gray-500 text-xs mb-8 flex items-center justify-center gap-1.5">
                                        <BsShieldExclamation className="text-base" />
                                        {userToSuspend.isSuspended
                                            ? 'The user will regain access to their account'
                                            : 'The user will be unable to access their account until unsuspended'
                                        }
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleSuspendUser}
                                            disabled={loading}
                                            className={`flex-1 group relative ${userToSuspend.isSuspended ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 ' : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'} text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none`}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <FaBan className="text-lg" />
                                                {loading
                                                    ? (userToSuspend.isSuspended ? 'Processing...' : 'Processing...')
                                                    : (userToSuspend.isSuspended ? 'Unsuspend' : 'Suspend')
                                                }
                                            </span>
                                            <div className={`absolute inset-0 ${userToSuspend.isSuspended ? 'bg-teal-600' : 'bg-orange-600'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setShowSuspendModal(false);
                                                setUserToSuspend(null);
                                            }}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    {/* Additional Info */}
                                    <p className="text-xs text-gray-400 mt-4">
                                        User: {userToSuspend.email} ({userToSuspend.role})
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete User Confirmation Modal */}
                    {showDeleteModal && userToDelete && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-[fadeIn_0.2s_ease-out]">
                            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[scaleIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                                {/* Decorative Top Bar */}
                                <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>

                                {/* Close Button */}
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setUserToDelete(null);
                                    }}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                                    aria-label="Close"
                                >
                                    <MdClose className="text-xl" />
                                </button>

                                {/* Content */}
                                <div className="p-8 text-center">
                                    {/* Icon with Animation */}
                                    <div className="relative inline-block mb-6">
                                        <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                                        <div className="relative w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                                                <PiWarningCircleLight className="text-red-500 text-5xl" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Heading */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        Delete User Confirmation
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-2">
                                        Are you sure you want to delete <strong>{userToDelete.name || userToDelete.username}</strong>?
                                    </p>
                                    <p className="text-gray-500 text-xs mb-8 flex items-center justify-center gap-1.5">
                                        <BsShieldExclamation className="text-base" />
                                        This action cannot be undone and all user data will be permanently removed
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleDeleteUser}
                                            disabled={loading}
                                            className="flex-1 group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <FaTrash className="text-lg" />
                                                {loading ? 'Deleting...' : 'Yes, Delete'}
                                            </span>
                                            <div className="absolute inset-0 bg-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setShowDeleteModal(false);
                                                setUserToDelete(null);
                                            }}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    {/* Additional Info */}
                                    <p className="text-xs text-gray-400 mt-4">
                                        User: {userToDelete.email} ({userToDelete.role})
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Detail Modal */}
                    {showUserModal && selectedUser && (
                        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[2000] animate-[fadeIn_0.3s_ease] p-4" onClick={() => setShowUserModal(false)}>
                            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-3xl w-full shadow-2xl animate-[slideUp_0.3s_ease] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
                                    <h2 className="m-0 text-gray-800 text-2xl">User Details</h2>
                                    <button
                                        className="bg-transparent border-none text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer p-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 text-4xl"
                                        onClick={() => setShowUserModal(false)}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="mb-5">
                                    {/* Basic Information */}
                                    <div className="mb-8">
                                        <h3 className="m-0 mb-4 text-purple-600 text-xl pb-2.5 border-b-2 border-gray-100">Basic Information</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Full Name:</span>
                                                <span className="text-gray-800 text-base">{selectedUser.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Username:</span>
                                                <span className="text-gray-800 text-base">@{selectedUser.username}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Email:</span>
                                                <span className="text-gray-800 text-base">{selectedUser.email}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Role:</span>
                                                <span className={`text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold uppercase inline-block ${selectedUser.role === 'patient' ? 'bg-cyan-100 text-cyan-800' :
                                                    selectedUser.role === 'dermatologist' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {selectedUser.role}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">User ID:</span>
                                                <span className="text-gray-800 text-base">{selectedUser.id}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Account Created:</span>
                                                <span className="text-gray-800 text-base">
                                                    {new Date(selectedUser.createdAt).toLocaleString('en-GB')}
                                                </span>
                                            </div>
                                            {selectedUser.updatedAt && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Last Updated:</span>
                                                    <span className="text-gray-800 text-base">
                                                        {new Date(selectedUser.updatedAt).toLocaleString('en-GB')}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Email Verified:</span>
                                                <span className={`text-base ${selectedUser.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                                                    {selectedUser.isVerified ? 'Yes ✓' : 'No ✗'}
                                                </span>
                                            </div>
                                            {selectedUser.isSuspended && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Status:</span>
                                                    <span className="text-base text-red-600">Suspended</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Patient-specific Information */}
                                    {selectedUser.role === 'patient' && (
                                        <div className="mb-8">
                                            <h3 className="m-0 mb-4 text-purple-600 text-xl pb-2.5 border-b-2 border-gray-100">Patient Information</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {selectedUser.gender && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Gender:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.gender}</span>
                                                    </div>
                                                )}
                                                {selectedUser.age && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Age:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.age} years</span>
                                                    </div>
                                                )}
                                                {selectedUser.height && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Height:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.height}</span>
                                                    </div>
                                                )}
                                                {selectedUser.weight && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Weight:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.weight}</span>
                                                    </div>
                                                )}
                                                {selectedUser.bloodGroup && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Blood Group:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.bloodGroup}</span>
                                                    </div>
                                                )}
                                                {selectedUser.phone && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Phone:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.phone}</span>
                                                    </div>
                                                )}
                                                {selectedUser.emergencyContact && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Emergency Contact:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.emergencyContact}</span>
                                                    </div>
                                                )}
                                                {selectedUser.address && (
                                                    <div className="flex flex-col gap-1 col-span-full">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Address:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.address}</span>
                                                    </div>
                                                )}
                                                {selectedUser.allergies && (
                                                    <div className="flex flex-col gap-1 col-span-full">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Allergies:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.allergies}</span>
                                                    </div>
                                                )}
                                                {selectedUser.medicalHistory && selectedUser.medicalHistory.length > 0 && (
                                                    <div className="flex flex-col gap-1 col-span-full">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Medical History:</span>
                                                        <span className="text-gray-800 text-base">
                                                            {selectedUser.medicalHistory.join(', ')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Dermatologist-specific Information */}
                                    {selectedUser.role === 'dermatologist' && (
                                        <>
                                            <div className="mb-8">
                                                <h3 className="m-0 mb-4 text-purple-600 text-xl pb-2.5 border-b-2 border-gray-100">Professional Information</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">License No:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.license || 'Not provided'}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Specialization:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.specialization || 'Not provided'}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Clinic:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.clinic || 'Not provided'}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Experience:</span>
                                                        <span className="text-gray-800 text-base">
                                                            {selectedUser.experience ? `${selectedUser.experience} years` : 'Not provided'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Consultation Fees:</span>
                                                        <span className="text-gray-800 text-base">
                                                            {selectedUser.fees ? `$${selectedUser.fees}` : 'Not provided'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dermatologist Contact & Bio */}
                                            <div className="mb-8">
                                                <h3 className="m-0 mb-4 text-purple-600 text-xl pb-2.5 border-b-2 border-gray-100">Contact & Bio</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Phone Number:</span>
                                                        <span className="text-gray-800 text-base">
                                                            {selectedUser.phone ? (
                                                                <a href={`tel:${selectedUser.phone}`} className="text-purple-600 no-underline hover:text-purple-800 hover:underline transition-colors duration-300">{selectedUser.phone}</a>
                                                            ) : (
                                                                'Not provided'
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1 col-span-full">
                                                        <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Bio:</span>
                                                        <span className="text-gray-800 text-base">{selectedUser.bio || 'Not provided'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Profile Image */}
                                    {selectedUser.profileImage && (
                                        <div className="mb-8">
                                            <h3 className="m-0 mb-4 text-purple-600 text-xl pb-2.5 border-b-2 border-gray-100">Profile Image</h3>
                                            <div className="flex justify-center py-5">
                                                <img
                                                    src={selectedUser.profileImage}
                                                    alt={selectedUser.name || selectedUser.username}
                                                    className="max-w-[200px] max-h-[200px] rounded-xl shadow-lg object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2.5 justify-end mt-6">
                                    <button
                                        className="px-5 py-2.5 rounded-lg font-semibold bg-gray-600 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                                        onClick={() => setShowUserModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rejection Reason Modal */}
                    {showRejectModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-scale-in">
                                {/* Decorative top bar */}
                                <div className="h-2 bg-gradient-to-r from-red-500 to-red-700"></div>

                                <div className="p-8">
                                    {/* Icon */}
                                    <div className="flex justify-center mb-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                                            <FaTimesCircle className="text-4xl text-red-600" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
                                        Reject Verification
                                    </h3>

                                    {/* Dermatologist Info */}
                                    <div className="mb-4 text-center">
                                        <p className="text-gray-600 text-sm">
                                            <strong>{verificationToReject?.name || verificationToReject?.username}</strong>
                                        </p>
                                        <p className="text-gray-500 text-xs">{verificationToReject?.email}</p>
                                    </div>

                                    {/* Rejection Reason Input */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Rejection Reason <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Please provide a reason for rejection..."
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                                            rows="4"
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setShowRejectModal(false);
                                                setVerificationToReject(null);
                                                setRejectionReason('');
                                            }}
                                            className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200"
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (rejectionReason.trim()) {
                                                    handleVerifyDermatologist(
                                                        verificationToReject.dermatologistId,
                                                        'rejected',
                                                        rejectionReason
                                                    );
                                                    setShowRejectModal(false);
                                                    setVerificationToReject(null);
                                                    setRejectionReason('');
                                                } else {
                                                    toast.error('Please provide a rejection reason');
                                                }
                                            }}
                                            className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                                            disabled={loading || !rejectionReason.trim()}
                                        >
                                            {loading ? 'Rejecting...' : 'Confirm'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Admin;
