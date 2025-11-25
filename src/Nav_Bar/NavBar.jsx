import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBars, FaTimes, FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import { IoMdHome, IoMdInformationCircle, IoMdAnalytics } from "react-icons/io";
import { MdLogin } from "react-icons/md";
import Notifications from "../components/Notifications";
import ReviewPreviewModal from "../components/ReviewPreviewModal";
import PatientReviewModal from "../components/PatientReviewModal";
import ConfirmSignOut from "../components/ConfirmSignout";
import Logo from "../Assets/logo.png";
import { apiGetNotifications, apiGetReviewRequest, apiSubmitReview, apiRejectReview, apiMarkNotificationRead } from "../api/api";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showConfirmSignOut, setShowConfirmSignOut] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [userRole, setUserRole] = useState(null);
    const [showReviewPreview, setShowReviewPreview] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState("");
    const [previewPrediction, setPreviewPrediction] = useState(null);
    const [currentRequestId, setCurrentRequestId] = useState(null);
    const [showPatientReview, setShowPatientReview] = useState(false);
    const [patientReviewData, setPatientReviewData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("user"));
        if (data) {
            setIsLoggedIn(true);
            setUserRole(data.role);
        }
    }, []);


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleNotifications = async () => {
        const next = !showNotifications;
        setShowNotifications(next);
        setMenuOpen(false);

        if (next) {
            try {
                const res = await apiGetNotifications(false); // Get all notifications
                console.log('Fetched notifications:', res.data);
                const notifs = res.data?.notifications || [];

                // Filter out deleted notifications from localStorage
                const deletedIds = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');
                const filteredNotifs = notifs.filter(n => !deletedIds.includes(n.id || n._id));

                const unreadCount = filteredNotifs.filter(n => !n.isRead && !n.read).length;
                setNotifications(filteredNotifs);
                setNotificationCount(unreadCount);
                console.log('Unread count:', unreadCount);
            } catch (err) {
                console.error('Error fetching notifications:', err);
                setNotifications([]);
                setNotificationCount(0);
            }
        }
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setIsLoggedIn(!!userData);
        setUserRole(userData?.role || null);

        // Fetch initial notification count if logged in
        if (userData) {
            apiGetNotifications(false)
                .then(res => {
                    console.log('Initial notifications fetch:', res.data);
                    const notifs = res.data?.notifications || [];

                    // Filter out deleted notifications from localStorage
                    const deletedIds = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');
                    const filteredNotifs = notifs.filter(n => !deletedIds.includes(n.id || n._id));

                    const unreadCount = filteredNotifs.filter(n => !n.isRead && !n.read).length;
                    setNotificationCount(unreadCount);
                    console.log('Initial unread count:', unreadCount);
                })
                .catch(err => {
                    console.error('Error fetching initial notifications:', err);
                    setNotificationCount(0);
                });
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/home');
    };

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    const confirmLogout = () => {
        handleLogout();
        setShowConfirmSignOut(false);
        setMenuOpen(false);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-sm'
                }`}>
                <div className="max-w-7xl mx-auto px-1 sm:px-1 lg:px-1">
                    <div className="flex justify-between items-center h-14 px-3 md:h-16">

                        {/* Logo/Brand */}
                        <div className="flex items-center gap-2 group">
                            <NavLink
                                to="/"
                                className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105"
                                onClick={closeMenu}
                            >
                                {/* Logo Icon Background: Charcoal Gradient */}
                                <div className="w-12 h-12 flex items-center justify-center">
                                    <img
                                        src={Logo}
                                        alt="FacialDerma Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="hidden sm:block">
                                    {/* Logo Text: Charcoal Gradient */}
                                    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                                        FacialDerma
                                    </h1>
                                    <p className="text-xs text-gray-500 font-medium -mt-1">AI-Powered</p>
                                </div>
                            </NavLink>
                        </div>

                        {/* Desktop Navigation */}
                        <ul className="hidden md:flex items-center gap-2 lg:gap-2">
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm lg:text-base transition-all duration-300 ${isActive
                                            ? 'bg-gray-900 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    {/* <IoMdHome className="text-lg" /> */}
                                    <span>Home</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/About"
                                    className={({ isActive }) =>
                                        `flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm lg:text-base transition-all duration-300 ${isActive
                                            ? 'bg-gray-900 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    {/* <IoMdInformationCircle className="text-lg" /> */}
                                    <span>About</span>
                                </NavLink>
                            </li>

                            {isLoggedIn ? (
                                <>

                                    {userRole === "patient" && (
                                        <li>
                                            <NavLink
                                                to="/Analysis"
                                                className={({ isActive }) =>
                                                    `flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm lg:text-base transition-all duration-200 ${isActive
                                                        ? 'bg-gray-900 text-white shadow-md'
                                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                    }`
                                                }
                                            >
                                                {/* <IoMdAnalytics className="text-lg" /> */}
                                                <span>Analysis</span>
                                            </NavLink>
                                        </li>
                                    )}


                                    {/* Notifications Button */}
                                    <li className="relative">
                                        <button
                                            onClick={toggleNotifications}
                                            className="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
                                        >
                                            <FaBell className="text-lg" />
                                            {notificationCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                                    {notificationCount}
                                                </span>
                                            )}
                                        </button>
                                        {showNotifications && (
                                            <Notifications
                                                notifications={notifications}
                                                onClose={() => setShowNotifications(false)}
                                                onClearAll={() => {
                                                    const allIds = notifications.map(n => n.id || n._id);
                                                    const deletedIds = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');
                                                    const updatedDeletedIds = [...new Set([...deletedIds, ...allIds])];
                                                    localStorage.setItem('deletedNotifications', JSON.stringify(updatedDeletedIds));
                                                    setNotifications([]);
                                                    setNotificationCount(0);
                                                }}
                                                onDeleteNotification={(notificationId) => {
                                                    const deletedIds = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');
                                                    deletedIds.push(notificationId);
                                                    localStorage.setItem('deletedNotifications', JSON.stringify(deletedIds));

                                                    setNotifications(prev => {
                                                        const updated = prev.filter(n => (n.id || n._id) !== notificationId);
                                                        const unreadCount = updated.filter(n => !n.isRead && !n.read).length;
                                                        setNotificationCount(unreadCount);
                                                        return updated;
                                                    });
                                                }}
                                                onItemClick={async (n) => {
                                                    // Mark notification as read
                                                    if (n?.id || n?._id) {
                                                        const notifId = n.id || n._id;
                                                        try {
                                                            await apiMarkNotificationRead(notifId);
                                                            // Update local state to reflect read status
                                                            setNotifications(prev => {
                                                                const updated = prev.map(notif =>
                                                                    (notif.id || notif._id) === notifId
                                                                        ? { ...notif, isRead: true, read: true }
                                                                        : notif
                                                                );
                                                                const unreadCount = updated.filter(n => !n.isRead && !n.read).length;
                                                                setNotificationCount(unreadCount);
                                                                return updated;
                                                            });
                                                        } catch (err) {
                                                            console.error('Failed to mark notification as read:', err);
                                                        }
                                                    }

                                                    const requestId = n?.ref?.requestId || n?.ref?.requestID || n?.ref?.id;
                                                    if (!requestId) return;

                                                    // Dermatologists see preview for review_requested
                                                    if (userRole === 'dermatologist' && n?.type === 'review_requested') {
                                                        setCurrentRequestId(requestId);
                                                        setPreviewError("");
                                                        setPreviewPrediction(null);
                                                        setPreviewLoading(true);
                                                        setShowReviewPreview(true);
                                                        try {
                                                            const res = await apiGetReviewRequest(requestId);
                                                            setPreviewPrediction(res.data);
                                                        } catch (err) {
                                                            const msg = err?.response?.data?.error || 'Failed to load prediction details';
                                                            setPreviewError(msg);
                                                        } finally {
                                                            setPreviewLoading(false);
                                                        }
                                                    }
                                                    // Patients see review for review_submitted
                                                    else if (userRole === 'patient' && n?.type === 'review_submitted') {
                                                        setPreviewError("");
                                                        setPatientReviewData(null);
                                                        setPreviewLoading(true);
                                                        setShowPatientReview(true);
                                                        try {
                                                            const res = await apiGetReviewRequest(requestId);
                                                            setPatientReviewData(res.data);
                                                        } catch (err) {
                                                            const msg = err?.response?.data?.error || 'Failed to load review details';
                                                            setPreviewError(msg);
                                                        } finally {
                                                            setPreviewLoading(false);
                                                        }
                                                    }
                                                    // Patients see rejection reason for review_rejected
                                                    else if (userRole === 'patient' && n?.type === 'review_rejected') {
                                                        setPreviewError("");
                                                        setPatientReviewData(null);
                                                        setPreviewLoading(true);
                                                        setShowPatientReview(true);
                                                        try {
                                                            const res = await apiGetReviewRequest(requestId);
                                                            setPatientReviewData(res.data);
                                                        } catch (err) {
                                                            const msg = err?.response?.data?.error || 'Failed to load rejection details';
                                                            setPreviewError(msg);
                                                        } finally {
                                                            setPreviewLoading(false);
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                    </li>

                                    <li>
                                        <NavLink
                                            to={userRole === 'dermatologist' ? "/DProfile" : "/Profile"}
                                            className={({ isActive }) =>
                                                `flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm lg:text-base transition-all duration-300 ${isActive
                                                    ? 'bg-gray-900 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                }`
                                            }
                                        >
                                            {/* <FaUser className="text-sm" /> */}
                                            <span>Profile</span>
                                        </NavLink>
                                    </li>

                                    <li>
                                        <button
                                            onClick={() => setShowConfirmSignOut(true)}
                                            className="flex items-center gap-1 px-2 py-1.5 rounded-lg font-medium text-sm lg:text-base text-red-600 hover:bg-red-50 transition-all duration-300"
                                        >
                                            <FaSignOutAlt className="text-sm" />
                                            <span>Logout</span>
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <NavLink
                                        to="/Login"

                                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg font-semibold text-sm lg:text-base bg-blue-900 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                                    >
                                        <MdLogin className="text-lg" />
                                        <span>Login</span>
                                    </NavLink>
                                </li>
                            )}
                        </ul>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden relative w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? (
                                <FaTimes className="text-xl" />
                            ) : (
                                <FaBars className="text-xl" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div
                    className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={closeMenu}
                >
                    <div
                        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Mobile Menu Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                {/* Logo Icon Background: Charcoal Gradient */}
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                                    <img
                                        src={Logo}  // or {Logo} if imported from src
                                        alt="FacialDerma Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    {/* Logo Text: Charcoal Gradient */}
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                                        FacialDerma
                                    </h2>
                                    <p className="text-xs text-gray-500 -mt-1">AI-Powered</p>
                                </div>
                            </div>
                            <button
                                onClick={closeMenu}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        {/* Mobile Menu Items */}
                        <ul className="p-4 bg-white space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]">
                            <li>
                                <NavLink
                                    to="/"
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all duration-300 ${isActive
                                            ? 'bg-gray-900 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <IoMdHome className="text-xl" />
                                    <span>Home</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/About"
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all duration-300 ${isActive
                                            ? 'bg-gray-900 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <IoMdInformationCircle className="text-xl" />
                                    <span>About</span>
                                </NavLink>
                            </li>

                            {isLoggedIn ? (
                                <>
                                    {userRole === "patient" && (
                                        <li>
                                            <NavLink
                                                to="/Analysis"
                                                onClick={closeMenu}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all duration-200 ${isActive
                                                        ? 'bg-gray-900 text-white shadow-sm'
                                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                    }`
                                                }
                                            >
                                                <IoMdAnalytics className="text-lg" />
                                                <span>Analysis</span>
                                            </NavLink>
                                        </li>
                                    )}


                                    <li>
                                        <button
                                            onClick={toggleNotifications}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
                                        >
                                            <div className="relative">
                                                <FaBell className="text-lg" />
                                                {notificationCount > 0 && (
                                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                        {notificationCount}
                                                    </span>
                                                )}
                                            </div>
                                            <span>Notifications</span>
                                        </button>
                                        {showNotifications && (
                                            <div className="mt-2">
                                                <Notifications
                                                    notifications={notifications}
                                                    onClose={() => setShowNotifications(false)}
                                                    onClearAll={() => {
                                                        const allIds = notifications.map(n => n.id || n._id);
                                                        const deletedIds = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');
                                                        const updatedDeletedIds = [...new Set([...deletedIds, ...allIds])];
                                                        localStorage.setItem('deletedNotifications', JSON.stringify(updatedDeletedIds));
                                                        setNotifications([]);
                                                        setNotificationCount(0);
                                                    }}
                                                    onDeleteNotification={(notificationId) => {
                                                        const deletedIds = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');
                                                        deletedIds.push(notificationId);
                                                        localStorage.setItem('deletedNotifications', JSON.stringify(deletedIds));

                                                        setNotifications(prev => {
                                                            const updated = prev.filter(n => (n.id || n._id) !== notificationId);
                                                            const unreadCount = updated.filter(n => !n.isRead && !n.read).length;
                                                            setNotificationCount(unreadCount);
                                                            return updated;
                                                        });
                                                    }}
                                                    onItemClick={async (n) => {
                                                        // Mark notification as read
                                                        if (n?.id || n?._id) {
                                                            const notifId = n.id || n._id;
                                                            try {
                                                                await apiMarkNotificationRead(notifId);
                                                                // Update local state to reflect read status
                                                                setNotifications(prev => {
                                                                    const updated = prev.map(notif =>
                                                                        (notif.id || notif._id) === notifId
                                                                            ? { ...notif, isRead: true, read: true }
                                                                            : notif
                                                                    );
                                                                    const unreadCount = updated.filter(n => !n.isRead && !n.read).length;
                                                                    setNotificationCount(unreadCount);
                                                                    return updated;
                                                                });
                                                            } catch (err) {
                                                                console.error('Failed to mark notification as read:', err);
                                                            }
                                                        }

                                                        const requestId = n?.ref?.requestId || n?.ref?.requestID || n?.ref?.id;
                                                        if (!requestId) return;

                                                        // Dermatologists see preview for review_requested
                                                        if (userRole === 'dermatologist' && n?.type === 'review_requested') {
                                                            setCurrentRequestId(requestId);
                                                            setPreviewError("");
                                                            setPreviewPrediction(null);
                                                            setPreviewLoading(true);
                                                            setShowReviewPreview(true);
                                                            try {
                                                                const res = await apiGetReviewRequest(requestId);
                                                                setPreviewPrediction(res.data);
                                                            } catch (err) {
                                                                const msg = err?.response?.data?.error || 'Failed to load prediction details';
                                                                setPreviewError(msg);
                                                            } finally {
                                                                setPreviewLoading(false);
                                                            }
                                                        }
                                                        // Patients see review for review_submitted
                                                        else if (userRole === 'patient' && n?.type === 'review_submitted') {
                                                            setPreviewError("");
                                                            setPatientReviewData(null);
                                                            setPreviewLoading(true);
                                                            setShowPatientReview(true);
                                                            try {
                                                                const res = await apiGetReviewRequest(requestId);
                                                                setPatientReviewData(res.data);
                                                            } catch (err) {
                                                                const msg = err?.response?.data?.error || 'Failed to load review details';
                                                                setPreviewError(msg);
                                                            } finally {
                                                                setPreviewLoading(false);
                                                            }
                                                        }
                                                        // Patients see rejection reason for review_rejected
                                                        else if (userRole === 'patient' && n?.type === 'review_rejected') {
                                                            setPreviewError("");
                                                            setPatientReviewData(null);
                                                            setPreviewLoading(true);
                                                            setShowPatientReview(true);
                                                            try {
                                                                const res = await apiGetReviewRequest(requestId);
                                                                setPatientReviewData(res.data);
                                                            } catch (err) {
                                                                const msg = err?.response?.data?.error || 'Failed to load rejection details';
                                                                setPreviewError(msg);
                                                            } finally {
                                                                setPreviewLoading(false);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </li>

                                    <li>
                                        <NavLink
                                            to="/Profile"
                                            onClick={closeMenu}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all duration-300 ${isActive
                                                    ? 'bg-gray-900 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                }`
                                            }
                                        >
                                            <FaUser className="text-lg" />
                                            <span>Profile</span>
                                        </NavLink>
                                    </li>

                                    <li className="pt-4 border-t border-gray-200 mt-4">
                                        <button
                                            onClick={() => {
                                                setShowConfirmSignOut(true);
                                                closeMenu();
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base text-red-600 hover:bg-red-50 transition-all duration-300"
                                        >
                                            <FaSignOutAlt className="text-lg" />
                                            <span>Logout</span>
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <NavLink
                                        to="/Login"
                                        onClick={closeMenu}

                                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base bg-gray-900 text-white hover:shadow-lg transition-all duration-300"
                                    >
                                        <MdLogin className="text-xl" />
                                        <span>Login</span>
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content from hiding under fixed navbar */}
            <div className="h-16 md:h-20"></div>

            {/* Confirm Sign Out Modal */}
            {showConfirmSignOut && (
                <ConfirmSignOut
                    onConfirm={confirmLogout}
                    onCancel={() => setShowConfirmSignOut(false)}
                />
            )}

            {/* Review Preview Modal for Dermatologists */}
            <ReviewPreviewModal
                open={showReviewPreview}
                onClose={() => {
                    setShowReviewPreview(false);
                    setPreviewError("");
                    setPreviewPrediction(null);
                    setCurrentRequestId(null);
                }}
                loading={previewLoading}
                error={previewError}
                prediction={previewPrediction}
                onSubmitComment={async (comment) => {
                    if (!currentRequestId) throw new Error('No request ID');
                    await apiSubmitReview(currentRequestId, comment);
                    // Refresh notifications after submission
                    const res = await apiGetNotifications(false);
                    const notifs = res.data?.notifications || [];
                    const unreadCount = typeof res.data?.unreadCount === 'number'
                        ? res.data.unreadCount
                        : notifs.filter(n => !n.isRead && !n.read).length;
                    setNotifications(notifs);
                    setNotificationCount(unreadCount);
                }}
                onRejectRequest={async (comment) => {
                    if (!currentRequestId) throw new Error('No request ID');
                    await apiRejectReview(currentRequestId, comment);
                    // Refresh notifications after rejection
                    const res = await apiGetNotifications(false);
                    const notifs = res.data?.notifications || [];
                    const unreadCount = typeof res.data?.unreadCount === 'number'
                        ? res.data.unreadCount
                        : notifs.filter(n => !n.isRead && !n.read).length;
                    setNotifications(notifs);
                    setNotificationCount(unreadCount);
                }}
            />

            {/* Patient Review Modal */}
            <PatientReviewModal
                open={showPatientReview}
                onClose={() => {
                    setShowPatientReview(false);
                    setPreviewError("");
                    setPatientReviewData(null);
                }}
                loading={previewLoading}
                error={previewError}
                reviewData={patientReviewData}
                currentUser={JSON.parse(localStorage.getItem("user"))}
            />
        </>
    );
};

export default Navbar;
