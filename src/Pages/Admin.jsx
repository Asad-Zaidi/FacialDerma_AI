import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    apiGetDashboardStats,
    apiGetPendingVerifications,
    apiVerifyDermatologist,
    apiGetAllUsers,
    apiSuspendUser,
    apiDeleteUser,
    apiChangeAdminPassword
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
    FaKey
} from 'react-icons/fa';
import '../Styles/Admin.css';

const Admin = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

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
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [filters, setFilters] = useState({ role: '', skip: 0, limit: 50 });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: ''
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    // Fetch Dashboard Stats
    const fetchDashboardStats = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiGetDashboardStats();
            setStats(response.data);
        } catch (error) {
            showMessage('Failed to fetch dashboard stats', 'error');
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
            showMessage('Failed to fetch pending verifications', 'error');
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
            showMessage('Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Verify Dermatologist
    const handleVerifyDermatologist = async (dermatologistId, status, reviewComments = '') => {
        try {
            setLoading(true);
            await apiVerifyDermatologist(dermatologistId, { status, reviewComments });
            showMessage(`Dermatologist ${status} successfully`, 'success');
            fetchPendingVerifications();
            fetchDashboardStats();
        } catch (error) {
            showMessage(`Failed to ${status} dermatologist`, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Suspend User
    const handleSuspendUser = async (userId) => {
        if (!window.confirm('Are you sure you want to suspend this user?')) return;
        
        try {
            setLoading(true);
            await apiSuspendUser(userId);
            showMessage('User suspended successfully', 'success');
            fetchAllUsers();
        } catch (error) {
            showMessage('Failed to suspend user', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Delete User
    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        
        try {
            setLoading(true);
            await apiDeleteUser(userId);
            showMessage('User deleted successfully', 'success');
            fetchAllUsers();
        } catch (error) {
            showMessage('Failed to delete user', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Change Password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await apiChangeAdminPassword(passwordData);
            showMessage('Password changed successfully', 'success');
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (error) {
            showMessage(error.response?.data?.detail || 'Failed to change password', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Show Message
    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    // Initial Load
    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchDashboardStats();
        } else if (activeTab === 'verifications') {
            fetchPendingVerifications();
        } else if (activeTab === 'users') {
            fetchAllUsers();
        }
    }, [activeTab, filters, fetchDashboardStats, fetchPendingVerifications, fetchAllUsers]);

    // Stat Card Component
    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div className={`stat-card stat-${color}`}>
            <div className="stat-icon">
                <Icon />
            </div>
            <div className="stat-details">
                <h3>{title}</h3>
                <p className="stat-value">{value}</p>
            </div>
        </div>
    );

    // Verification Card Component
    const VerificationCard = ({ verification }) => (
        <div className="verification-card">
            <div className="verification-header">
                <div>
                    <h4>{verification.name || 'N/A'}</h4>
                    <p className="verification-email">{verification.email || 'N/A'}</p>
                    <p className="verification-username">@{verification.username || 'N/A'}</p>
                </div>
                <span className={`status-badge status-${verification.status}`}>
                    {verification.status}
                </span>
            </div>
            <div className="verification-details">
                <p><strong>License:</strong> {verification.license || 'N/A'}</p>
                <p><strong>Specialization:</strong> {verification.specialization || 'N/A'}</p>
                <p><strong>Clinic:</strong> {verification.clinic || 'N/A'}</p>
                <p><strong>Experience:</strong> {verification.experience || 'N/A'} years</p>
                <p><strong>Bio:</strong> {verification.bio || 'N/A'}</p>
                <p><strong>Submitted:</strong> {new Date(verification.submittedAt).toLocaleString()}</p>
            </div>
            <div className="verification-actions">
                <button 
                    className="btn btn-success"
                    onClick={() => handleVerifyDermatologist(verification.dermatologistId, 'approved')}
                    disabled={loading}
                >
                    <FaCheckCircle /> Approve
                </button>
                <button 
                    className="btn btn-danger"
                    onClick={() => {
                        const comment = prompt('Enter rejection reason:');
                        if (comment) {
                            handleVerifyDermatologist(verification.dermatologistId, 'rejected', comment);
                        }
                    }}
                    disabled={loading}
                >
                    <FaTimesCircle /> Reject
                </button>
            </div>
        </div>
    );

    // User Card Component
    const UserCard = ({ user }) => (
        <div className="user-card" onClick={() => {
            setSelectedUser(user);
            setShowUserModal(true);
        }} style={{ cursor: 'pointer' }}>
            <div className="user-header">
                <div className="user-info">
                    <h4>{user.name || user.username}</h4>
                    <p className="user-email">{user.email}</p>
                </div>
                <span className={`role-badge role-${user.role}`}>
                    {user.role}
                </span>
            </div>
            <div className="user-details">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                {user.isVerified !== undefined && (
                    <p><strong>Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</p>
                )}
                {user.isSuspended && (
                    <p className="text-danger"><strong>Status:</strong> Suspended</p>
                )}
            </div>
            <div className="user-actions">
                <button 
                    className="btn btn-warning btn-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSuspendUser(user.id);
                    }}
                    disabled={loading || user.isSuspended}
                >
                    <FaBan /> Suspend
                </button>
                <button 
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.id);
                    }}
                    disabled={loading}
                >
                    <FaTrash /> Delete
                </button>
            </div>
        </div>
    );

    return (
        <div className="admin-container">
            {/* Header */}
            <div className="admin-header">
                <h1><FaUserShield /> Admin Dashboard</h1>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowPasswordModal(true)}
                >
                    <FaKey /> Change Password
                </button>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="admin-tabs">
                <button 
                    className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    <FaChartBar /> Dashboard
                </button>
                <button 
                    className={`tab ${activeTab === 'verifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('verifications')}
                >
                    <FaClipboardList /> Verifications
                </button>
                <button 
                    className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <FaUsers /> Users
                </button>
            </div>

            {/* Content */}
            <div className="admin-content">
                {loading && (
                    <div className="loading-overlay">
                        <FaSpinner className="spinner" />
                    </div>
                )}

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && stats && (
                    <div className="dashboard-stats">
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
                    <div className="verifications-section">
                        <h2>Pending Dermatologist Verifications</h2>
                        {pendingVerifications.length === 0 ? (
                            <p className="no-data">No pending verifications</p>
                        ) : (
                            <div className="verifications-grid">
                                {pendingVerifications.map(verification => (
                                    <VerificationCard 
                                        key={verification.id} 
                                        verification={verification} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="users-section">
                        <div className="users-header">
                            <h2>All Users</h2>
                            <div className="users-filters">
                                <select 
                                    value={filters.role} 
                                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                                    className="filter-select"
                                >
                                    <option value="">All Roles</option>
                                    <option value="patient">Patients</option>
                                    <option value="dermatologist">Dermatologists</option>
                                    <option value="admin">Admins</option>
                                </select>
                            </div>
                        </div>
                        {allUsers.length === 0 ? (
                            <p className="no-data">No users found</p>
                        ) : (
                            <div className="users-grid">
                                {allUsers.map(user => (
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Change Admin Password</h2>
                        <form onSubmit={handleChangePassword}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input 
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ 
                                        ...passwordData, 
                                        currentPassword: e.target.value 
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input 
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ 
                                        ...passwordData, 
                                        newPassword: e.target.value 
                                    })}
                                    required
                                    minLength={8}
                                />
                            </div>
                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Detail Modal */}
            {showUserModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
                    <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>User Details</h2>
                            <button 
                                className="modal-close"
                                onClick={() => setShowUserModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="user-detail-content">
                            {/* Basic Information */}
                            <div className="detail-section">
                                <h3>Basic Information</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Full Name:</span>
                                        <span className="detail-value">{selectedUser.name || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Username:</span>
                                        <span className="detail-value">@{selectedUser.username}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Email:</span>
                                        <span className="detail-value">{selectedUser.email}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Role:</span>
                                        <span className={`detail-value role-badge role-${selectedUser.role}`}>
                                            {selectedUser.role}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">User ID:</span>
                                        <span className="detail-value">{selectedUser.id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Account Created:</span>
                                        <span className="detail-value">
                                            {new Date(selectedUser.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    {selectedUser.updatedAt && (
                                        <div className="detail-item">
                                            <span className="detail-label">Last Updated:</span>
                                            <span className="detail-value">
                                                {new Date(selectedUser.updatedAt).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="detail-item">
                                        <span className="detail-label">Email Verified:</span>
                                        <span className={`detail-value ${selectedUser.isVerified ? 'text-success' : 'text-danger'}`}>
                                            {selectedUser.isVerified ? 'Yes ✓' : 'No ✗'}
                                        </span>
                                    </div>
                                    {selectedUser.isSuspended && (
                                        <div className="detail-item">
                                            <span className="detail-label">Status:</span>
                                            <span className="detail-value text-danger">Suspended</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Patient-specific Information */}
                            {selectedUser.role === 'patient' && (
                                <div className="detail-section">
                                    <h3>Patient Information</h3>
                                    <div className="detail-grid">
                                        {selectedUser.gender && (
                                            <div className="detail-item">
                                                <span className="detail-label">Gender:</span>
                                                <span className="detail-value">{selectedUser.gender}</span>
                                            </div>
                                        )}
                                        {selectedUser.age && (
                                            <div className="detail-item">
                                                <span className="detail-label">Age:</span>
                                                <span className="detail-value">{selectedUser.age} years</span>
                                            </div>
                                        )}
                                        {selectedUser.height && (
                                            <div className="detail-item">
                                                <span className="detail-label">Height:</span>
                                                <span className="detail-value">{selectedUser.height}</span>
                                            </div>
                                        )}
                                        {selectedUser.weight && (
                                            <div className="detail-item">
                                                <span className="detail-label">Weight:</span>
                                                <span className="detail-value">{selectedUser.weight}</span>
                                            </div>
                                        )}
                                        {selectedUser.bloodGroup && (
                                            <div className="detail-item">
                                                <span className="detail-label">Blood Group:</span>
                                                <span className="detail-value">{selectedUser.bloodGroup}</span>
                                            </div>
                                        )}
                                        {selectedUser.phone && (
                                            <div className="detail-item">
                                                <span className="detail-label">Phone:</span>
                                                <span className="detail-value">{selectedUser.phone}</span>
                                            </div>
                                        )}
                                        {selectedUser.emergencyContact && (
                                            <div className="detail-item">
                                                <span className="detail-label">Emergency Contact:</span>
                                                <span className="detail-value">{selectedUser.emergencyContact}</span>
                                            </div>
                                        )}
                                        {selectedUser.address && (
                                            <div className="detail-item full-width">
                                                <span className="detail-label">Address:</span>
                                                <span className="detail-value">{selectedUser.address}</span>
                                            </div>
                                        )}
                                        {selectedUser.allergies && (
                                            <div className="detail-item full-width">
                                                <span className="detail-label">Allergies:</span>
                                                <span className="detail-value">{selectedUser.allergies}</span>
                                            </div>
                                        )}
                                        {selectedUser.medicalHistory && selectedUser.medicalHistory.length > 0 && (
                                            <div className="detail-item full-width">
                                                <span className="detail-label">Medical History:</span>
                                                <span className="detail-value">
                                                    {selectedUser.medicalHistory.join(', ')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Patient Contact Information */}
                            {selectedUser.role === 'patient' && (
                                <div className="detail-section">
                                    <h3>Contact Information</h3>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Phone Number:</span>
                                            <span className="detail-value">
                                                {selectedUser.phone ? (
                                                    <a href={`tel:${selectedUser.phone}`}>{selectedUser.phone}</a>
                                                ) : (
                                                    'Not provided'
                                                )}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Emergency Contact:</span>
                                            <span className="detail-value">
                                                {selectedUser.emergencyContact ? (
                                                    <a href={`tel:${selectedUser.emergencyContact}`}>{selectedUser.emergencyContact}</a>
                                                ) : (
                                                    'Not provided'
                                                )}
                                            </span>
                                        </div>
                                        <div className="detail-item full-width">
                                            <span className="detail-label">Address:</span>
                                            <span className="detail-value">{selectedUser.address || 'Not provided'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Dermatologist-specific Information */}
                            {selectedUser.role === 'dermatologist' && (
                                <>
                                    <div className="detail-section">
                                        <h3>Professional Information</h3>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <span className="detail-label">License No:</span>
                                                <span className="detail-value">{selectedUser.license || 'Not provided'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Specialization:</span>
                                                <span className="detail-value">{selectedUser.specialization || 'Not provided'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Clinic:</span>
                                                <span className="detail-value">{selectedUser.clinic || 'Not provided'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Experience:</span>
                                                <span className="detail-value">
                                                    {selectedUser.experience ? `${selectedUser.experience} years` : 'Not provided'}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Consultation Fees:</span>
                                                <span className="detail-value">
                                                    {selectedUser.fees ? `$${selectedUser.fees}` : 'Not provided'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dermatologist Contact & Bio */}
                                    <div className="detail-section">
                                        <h3>Contact & Bio</h3>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <span className="detail-label">Phone Number:</span>
                                                <span className="detail-value">
                                                    {selectedUser.phone ? (
                                                        <a href={`tel:${selectedUser.phone}`}>{selectedUser.phone}</a>
                                                    ) : (
                                                        'Not provided'
                                                    )}
                                                </span>
                                            </div>
                                            <div className="detail-item full-width">
                                                <span className="detail-label">Bio:</span>
                                                <span className="detail-value">{selectedUser.bio || 'Not provided'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Profile Image */}
                            {selectedUser.profileImage && (
                                <div className="detail-section">
                                    <h3>Profile Image</h3>
                                    <div className="profile-image-container">
                                        <img 
                                            src={selectedUser.profileImage} 
                                            alt={selectedUser.name || selectedUser.username}
                                            className="user-profile-image"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setShowUserModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
