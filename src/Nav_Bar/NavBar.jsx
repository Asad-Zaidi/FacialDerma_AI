// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import '../Styles/Navbar.css';
// import { FaBars, FaTimes } from "react-icons/fa";

// const Navbar = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [menuOpen, setMenuOpen] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const user = localStorage.getItem('user');
//         setIsLoggedIn(!!user);
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//         setIsLoggedIn(false);
//         navigate('/login');
//     };

//     const toggleMenu = () => {
//         setMenuOpen(prev => !prev);
//     };

//     return (
//         <nav className="navbar">
//             <h1 className="navbar-title">
//                 <Link to="/">FacialDerma AI</Link>
//             </h1>

//             <button className="menu-toggle" onClick={toggleMenu}>
//                 {menuOpen ? <FaTimes /> : <FaBars />}
//             </button>

//             <ul className={`nav-list ${menuOpen ? 'active' : ''}`}>
//                 <li className="nav-item">
//                     <Link to="/" onClick={toggleMenu} className="nav-link">
//                         Home
//                     </Link>
//                 </li>
//                 <li className="nav-item">
//                     <Link to="/About" onClick={toggleMenu} className="nav-link">
//                         About
//                     </Link>
//                 </li>

//                 {isLoggedIn ? (
//                     <>
//                         <li className="nav-item">
//                             <Link to="/Analysis" onClick={toggleMenu} className="nav-link">
//                                 Analysis
//                             </Link>
//                         </li>
//                         <li className="nav-item">
//                             <Link to="/Notification" onClick={toggleMenu} className="nav-link">
//                                 Notifications
//                             </Link>
//                         </li>
//                         <li className="nav-item">
//                             <Link to="/Profile" onClick={toggleMenu} className="nav-link">
//                                 Profile
//                             </Link>
//                         </li>
//                         <li className="nav-item">
//                             <button onClick={() => { handleLogout(); toggleMenu(); }} className="nav-link logout-button">
//                                 Logout
//                             </button>
//                         </li>
//                     </>
//                 ) : (
//                     <li className="nav-item">
//                         <Link to="/Login" className="nav-link login-button" onClick={toggleMenu}>
//                             Login
//                         </Link>
//                     </li>
//                 )}
//             </ul>
//         </nav>
//     );
// };

// export default Navbar;

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import '../Styles/Navbar.css';
import { FaBars, FaTimes, FaBell, FaUserCircle } from "react-icons/fa";


const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications] = useState([
        "Your dermatologist commented on the analysis report.",
        "New analysis results are ready.",
        "Your profile was updated."
    ]);

    const notificationRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user);
    }, []);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
    };

    return (
        <nav className="navbar">
            <h1 className="navbar-title">
                <Link to="/">FacialDerma AI</Link>
            </h1>

            <button className="menu-toggle" onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <ul className={`nav-list ${menuOpen ? 'active' : ''}`}>
                <li className="nav-item">
                    <Link to="/" onClick={toggleMenu} className="nav-link">
                        Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/About" onClick={toggleMenu} className="nav-link">
                        About
                    </Link>
                </li>

                {isLoggedIn && (
                    <>
                        <li className="nav-item">
                            <Link to="/Analysis" onClick={toggleMenu} className="nav-link">
                                Analysis
                            </Link>
                        </li>
                        <li className="nav-item notification-icon" ref={notificationRef}>
                            <button className="nav-link" onClick={toggleNotifications} style={{ background: "none", border: "none", position: "relative" }}>
                                <FaBell />
                                {notifications.length > 0 && <span className="notification-badge"></span>}
                            </button>
                            {showNotifications && (
                                <div className="notification-dropdown">
                                    {notifications.length > 0 ? (
                                        notifications.map((note, index) => (
                                            <p key={index} className="notification-item">{note}</p>
                                        ))
                                    ) : (
                                        <p className="notification-item">No notifications</p>
                                    )}
                                </div>
                            )}
                        </li>
                        {/* <li className="nav-item">
                            <Link to="/Profile" onClick={toggleMenu} className="nav-link">
                                Profile
                            </Link>
                        </li> */}
                        <li className="nav-item">
                            <Link to="/Profile" onClick={toggleMenu} className="nav-link " title="Profile">
                                <FaUserCircle size={22} />
                            </Link>
                        </li>

                        <li className="nav-item">
                            <button onClick={() => { handleLogout(); toggleMenu(); }} className="nav-link logout-button">
                                Logout
                            </button>
                        </li>
                    </>
                )}

                {!isLoggedIn && (
                    <li className="nav-item">
                        <Link to="/Login" className="nav-link login-button" onClick={toggleMenu}>
                            Login
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
