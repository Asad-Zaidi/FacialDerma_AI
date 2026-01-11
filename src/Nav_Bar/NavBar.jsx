import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaBars, FaTimes, FaBell, FaUser, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { IoMdHome, IoMdInformationCircle, IoMdAnalytics } from "react-icons/io";
import { MdLogin, MdOutlineSupportAgent, MdContactMail, MdHelpOutline } from "react-icons/md";
import { useAuth } from '../contexts/AuthContext';
import Notifications from "../components/Notifications";
import ReviewPreviewModal from "../components/ReviewPreviewModal";
import PatientReviewModal from "../components/PatientReviewModal";
import Logo from "../Assets/logo.png";
import { apiGetNotifications, apiGetReviewRequest, apiSubmitReview, apiRejectReview, apiMarkNotificationRead, apiGetFullProfile } from "../api/api";
import DropDown from "../components/ui/DropDown";

const SUPPORT_OPTIONS_DESKTOP = [
    { value: "/faq", label: "FAQ" },
    { value: "/contact-support", label: "Contact" },
];

const SUPPORT_OPTIONS_MOBILE = [
    {
        value: "/faq",
        label: (
            <span className="flex items-center gap-2">
                <MdHelpOutline className="text-lg" />
                <span>FAQ</span>
            </span>
        ),
    },
    {
        value: "/contact-support",
        label: (
            <span className="flex items-center gap-2">
                <MdContactMail className="text-lg" />
                <span>Contact</span>
            </span>
        ),
    },
];

const Navbar = () => {

    const getInitialAuthState = () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            return {
                isLoggedIn: !!userData,
                userRole: userData?.role || null
            };
        } catch (error) {
            return {
                isLoggedIn: false,
                userRole: null
            };
        }
    };

    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const initialAuth = getInitialAuthState();
    const [isLoggedIn] = useState(initialAuth.isLoggedIn);
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [userRole] = useState(initialAuth.userRole);
    const [userName, setUserName] = useState(initialAuth.isLoggedIn ? JSON.parse(localStorage.getItem("user"))?.name || "User" : "");
    const [profileImage, setProfileImage] = useState(initialAuth.isLoggedIn ? JSON.parse(localStorage.getItem("user"))?.profileImage : null);
    const [showReviewPreview, setShowReviewPreview] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState("");
    const [previewPrediction, setPreviewPrediction] = useState(null);
    const [currentRequestId, setCurrentRequestId] = useState(null);
    const [showPatientReview, setShowPatientReview] = useState(false);
    const [patientReviewData, setPatientReviewData] = useState(null);
    const [supportSelection, setSupportSelection] = useState("");
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);

    useEffect(() => {
        if (SUPPORT_OPTIONS_DESKTOP.some(opt => opt.value === location.pathname)) {
            setSupportSelection(location.pathname);
        } else {
            setSupportSelection("");
        }
    }, [location.pathname]);

    // Fetch user profile from database
    useEffect(() => {
        if (isLoggedIn) {
            apiGetFullProfile()
                .then(response => {
                    const userData = response.data;
                    setUserName(userData.name || "User");
                    setProfileImage(userData.profileImage || null);
                    // Update localStorage to keep it in sync
                    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                    localStorage.setItem("user", JSON.stringify({ ...storedUser, ...userData }));
                })
                .catch(err => {
                    console.error('Error fetching user profile:', err);
                    // Fall back to localStorage if API fails
                    const userData = JSON.parse(localStorage.getItem("user") || "{}");
                    setUserName(userData.name || "User");
                    setProfileImage(userData.profileImage || null);
                });
        }
    }, [isLoggedIn]);

    const toggleNotifications = async () => {
        const next = !showNotifications;
        setShowNotifications(next);
        setMenuOpen(false);

        if (next) {
            try {
                const res = await apiGetNotifications(false);
                console.log('Fetched notifications:', res.data);
                const notifs = res.data?.notifications || [];


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

    const handleSupportChange = (input) => {
        const val = typeof input === 'string' ? input : input?.target?.value;
        if (!val) return;
        setSupportSelection(val);
        navigate(val);
        setMenuOpen(false);
    };

    useEffect(() => {

        if (isLoggedIn) {
            apiGetNotifications(false)
                .then(res => {
                    console.log('Initial notifications fetch:', res.data);
                    const notifs = res.data?.notifications || [];


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
    }, [isLoggedIn]);

    // Close user dropdown on outside click or Escape key
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userDropdownOpen && userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setUserDropdownOpen(false);
            }
        };
        const handleEscape = (e) => {
            if (userDropdownOpen && e.key === 'Escape') {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [userDropdownOpen]);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setUserDropdownOpen(false);
        setMenuOpen(false);
        setUserName("");
        setProfileImage(null);
        navigate('/');
    };

    const handleProfileClick = () => {
        const profilePath = userRole === 'dermatologist' ? "/DProfile" : "/Profile";
        navigate(profilePath);
        setUserDropdownOpen(false);
        setMenuOpen(false);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300">
                <div className="max-w-auto mx-auto px-1 sm:px-1 lg:px-10">
                    <div className="flex justify-between items-center h-16 px-3">

                        {/* Logo/Brand */}
                        <div className="flex items-center gap-2 group">
                            <NavLink
                                to="/"
                                className="flex items-center gap-2 transition-transform duration-300"
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

                        {/* Desktop Navigation - Centered (>=769px) */}
                        <div className="hidden min-[769px]:flex flex-1 justify-center">
                            <ul className="flex items-center gap-2 lg:gap-2">
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
                                {isLoggedIn && userRole === "patient" && (
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

                                <li className="w-26">
                                    <DropDown
                                        name="support"
                                        value={supportSelection}
                                        onChange={handleSupportChange}
                                        options={SUPPORT_OPTIONS_DESKTOP}
                                        placeholder="Support"
                                        widthClass="w-full"
                                        borderClass="border-none"
                                        selectedClass="bg-gray-300 text-gray-700"
                                        highlightClass="bg-gray-200 text-gray-900"
                                        ringClass="ring-gray-300"
                                        triggerPadding="py-2.5 px-3"
                                        triggerFontSize="text-sm font-medium"
                                    />
                                </li>
                            </ul>
                        </div>

                        {/* Right Side - Notifications & Profile/Login (>=769px) */}
                        <div className="hidden min-[769px]:flex items-center gap-2">
                            {isLoggedIn && (
                                <div className="relative">
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

                                                if (n?.id || n?._id) {
                                                    const notifId = n.id || n._id;
                                                    try {
                                                        await apiMarkNotificationRead(notifId);

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
                                </div>
                            )}
                            {isLoggedIn ? (
                                <div className="relative" ref={userDropdownRef}>
                                    <button
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm lg:text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center overflow-hidden">
                                            {profileImage ? (
                                                <img 
                                                    src={profileImage} 
                                                    alt={userName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <FaUser className="text-white text-sm" />
                                            )}
                                        </div>
                                        <span className="max-w-auto truncate">{userName}</span>
                                        <FaChevronDown className={`text-xs transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {userDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                            <button
                                                onClick={handleProfileClick}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                                            >
                                                <FaUser className="text-gray-600" />
                                                <span>Profile</span>
                                            </button>
                                            <div className="border-t border-gray-200 my-1"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <FaSignOutAlt className="text-red-600" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <NavLink
                                    to="/Login"
                                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg font-semibold text-sm lg:text-base bg-blue-900 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                                >
                                    <MdLogin className="text-lg" />
                                    <span>Login</span>
                                </NavLink>
                            )}
                        </div>

                        {/* Mobile Menu Button (<=768px) */}
                        <button
                            onClick={toggleMenu}
                            className="min-[769px]:hidden relative w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300"
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

                {/* Mobile Navigation Menu (<=768px) */}
                <div
                    className={`min-[769px]:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
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
                                        src={Logo}
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
                            <li className="w-full">
                                <DropDown
                                    name="support"
                                    value={supportSelection}
                                    onChange={handleSupportChange}
                                    options={SUPPORT_OPTIONS_MOBILE}
                                    placeholder={(
                                        <span className="flex items-center gap-2">
                                            <MdOutlineSupportAgent className="text-xl" />
                                            <span>Support</span>
                                        </span>
                                    )}
                                    widthClass="w-full"
                                    borderClass="border-none"
                                    selectedClass="bg-gray-300 text-gray-700"
                                    highlightClass="bg-gray-200 text-gray-900"
                                    ringClass="ring-gray-300"
                                    triggerPadding="py-3 px-4"
                                    triggerFontSize="text-base font-medium"
                                />
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

                                                        if (n?.id || n?._id) {
                                                            const notifId = n.id || n._id;
                                                            try {
                                                                await apiMarkNotificationRead(notifId);

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

                                    <li className="border-t border-gray-200 mt-2 pt-2">
                                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Account
                                        </div>
                                        <div className="flex items-center gap-3 px-4 py-2 mb-2">
                                            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center overflow-hidden">
                                                {profileImage ? (
                                                    <img 
                                                        src={profileImage} 
                                                        alt={userName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FaUser className="text-white text-lg" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                                                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
                                        >
                                            <FaUser className="text-lg" />
                                            <span>Profile</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
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
            <div className="h-16"></div>

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
