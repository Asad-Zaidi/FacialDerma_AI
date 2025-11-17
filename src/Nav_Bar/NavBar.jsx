import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBars, FaTimes, FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import { IoMdHome, IoMdInformationCircle, IoMdAnalytics } from "react-icons/io";
import { MdLogin } from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";
import Notifications from "../components/Notifications";
import ConfirmSignOut from "../components/ConfirmSignout";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showConfirmSignOut, setShowConfirmSignOut] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [notificationCount] = useState(3);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) {
        setIsLoggedIn(true);
        setUserRole(data.role); // ← ADD THIS
    }
}, []);

    const dummyNotifications = [
        "Skin analysis completed successfully.",
        "New skin health tip available.",
        "Reminder: Analyze your skin weekly.",
    ];

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
        setMenuOpen(false);
    };

    // useEffect(() => {
    //     const user = localStorage.getItem('user');
    //     setIsLoggedIn(!!user);
    // }, []);
    useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!userData);
    setUserRole(userData?.role || null);
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
                    <div className="flex justify-between items-center h-16 md:h-20">

                        {/* Logo/Brand */}
                        <div className="flex items-center gap-2 group">
                            <NavLink
                                to="/"
                                className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105"
                                onClick={closeMenu}
                            >
                                {/* Logo Icon Background: Charcoal Gradient */}
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-black rounded-xl flex items-center justify-center shadow-lg">
                                    <BsShieldCheck className="text-white text-xl" />
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
                        <ul className="hidden md:flex items-center gap-2 lg:gap-1">
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `flex items-center gap-1 px-2 py-2 rounded-lg font-medium text-sm lg:text-base transition-all duration-300 ${isActive
                                            ? 'bg-gray-900 text-white shadow-md' // Active: Solid Charcoal
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Hover: Subtle Gray
                                        }`
                                    }
                                >
                                    <IoMdHome className="text-lg" />
                                    <span>Home</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/About"
                                    className={({ isActive }) =>
                                        `flex items-center gap-1 px-2 py-2 rounded-lg font-medium text-sm lg:text-base transition-all duration-300 ${isActive
                                            ? 'bg-gray-900 text-white shadow-md' // Active: Solid Charcoal
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Hover: Subtle Gray
                                        }`
                                    }
                                >
                                    <IoMdInformationCircle className="text-lg" />
                                    <span>About</span>
                                </NavLink>
                            </li>

                            {isLoggedIn ? (
                                <>
                                    {/* <li>
                                        <NavLink
                                            to="/Analysis"
                                            className={({ isActive }) =>
                                                `flex items-center gap-1 px-2 py-2 rounded-lg font-medium text-sm lg:text-base transition-all duration-300 ${isActive
                                                    ? 'bg-gray-900 text-white shadow-md' // Active: Solid Charcoal
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Hover: Subtle Gray
                                                }`
                                            }
                                        >
                                            <IoMdAnalytics className="text-lg" />
                                            <span>Analysis</span>
                                        </NavLink>
                                    </li> */}
                                    {userRole === "patient" && (
    <li>
        <NavLink
            to="/Analysis"
            className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
            }
        >
            <IoMdAnalytics className="text-base" />
            <span>Analysis</span>
        </NavLink>
    </li>
)}


                                    {/* Notifications Button */}
                                    <li className="relative">
                                        <button
                                            onClick={toggleNotifications}
                                            className="relative flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300" // Hover: Subtle Gray
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
                                                notifications={dummyNotifications}
                                                onClose={() => setShowNotifications(false)}
                                            />
                                        )}
                                    </li>

                                    <li>
                                        <NavLink
                                            to={userRole === 'dermatologist' ? "/DProfile" : "/Profile"}
                                            className={({ isActive }) =>
                                                `flex items-center gap-1 px-2 py-2 rounded-lg font-medium text-sm lg:text-base transition-all duration-300 ${isActive
                                                    ? 'bg-gray-900 text-white shadow-md' // Active: Solid Charcoal
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Hover: Subtle Gray
                                                }`
                                            }
                                        >
                                            <FaUser className="text-sm" />
                                            <span>Profile</span>
                                        </NavLink>
                                    </li>

                                    <li>
                                        <button
                                            onClick={() => setShowConfirmSignOut(true)}
                                            className="flex items-center gap-1 px-2 py-2 rounded-lg font-medium text-sm lg:text-base text-red-600 hover:bg-red-50 transition-all duration-300"
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
                                        // Login Button: Solid Charcoal
                                        className="flex items-center gap-1 px-2 py-2 rounded-lg font-semibold text-sm lg:text-base bg-blue-900 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
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
                            className="md:hidden relative w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300" // Hover: Subtle Gray
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
                        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Mobile Menu Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                {/* Logo Icon Background: Charcoal Gradient */}
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-black rounded-xl flex items-center justify-center shadow-lg">
                                    <BsShieldCheck className="text-white text-xl" />
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
                        <ul className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]">
                            <li>
                                <NavLink
                                    to="/"
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all duration-300 ${isActive
                                            ? 'bg-gray-900 text-white shadow-md' // Active: Solid Charcoal
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Hover: Subtle Gray
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
                                            ? 'bg-gray-900 text-white shadow-md' // Active: Solid Charcoal
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Hover: Subtle Gray
                                        }`
                                    }
                                >
                                    <IoMdInformationCircle className="text-xl" />
                                    <span>About</span>
                                </NavLink>
                            </li>

                            {isLoggedIn ? (
                                <>
                                    {/* <li>
                                        <NavLink
                                            to="/Analysis"
                                            onClick={closeMenu}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all duration-300 ${isActive
                                                    ? 'bg-gray-900 text-white shadow-md' // Active: Solid Charcoal
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Hover: Subtle Gray
                                                }`
                                            }
                                        >
                                            <IoMdAnalytics className="text-xl" />
                                            <span>Analysis</span>
                                        </NavLink>
                                    </li> */}
                                    {userRole === "patient" && (
    <li>
        <NavLink
            to="/Analysis"
            onClick={closeMenu}
            className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
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
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300" // Hover: Subtle Gray
                                        >
                                            <div className="relative">
                                                <FaBell className="text-xl" />
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
                                                    notifications={dummyNotifications}
                                                    onClose={() => setShowNotifications(false)}
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
                                                    ? 'bg-gray-900 text-white shadow-md' // Active: Solid Charcoal
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' // Hover: Subtle Gray
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
                                        // Login Button: Solid Charcoal
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
        </>
    );
};

export default Navbar;