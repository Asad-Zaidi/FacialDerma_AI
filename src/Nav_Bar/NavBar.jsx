// import { NavLink, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import '../Styles/Navbar.css';
// import { FaBars, FaTimes } from "react-icons/fa";
// import Notifications from "../components/Notifications"

// const Navbar = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [menuOpen, setMenuOpen] = useState(false);
//     const navigate = useNavigate();
//     const [showNotifications, setShowNotifications] = useState(false);


//     const dummyNotifications = [
//         "Skin analysis completed successfully.",
//         "New skin health tip available.",
//         "Reminder: Analyze your skin weekly.",
//     ];

//     const toggleNotifications = () => {
//         setShowNotifications(prev => !prev);
//         setMenuOpen(false);
//     };

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
//                 <NavLink to="/" className="nav-link" onClick={toggleMenu}>
//                     FacialDerma AI
//                 </NavLink>
//             </h1>

//             <button className="menu-toggle" onClick={toggleMenu}>
//                 {menuOpen ? <FaTimes /> : <FaBars />}
//             </button>

//             <ul className={`nav-list ${menuOpen ? 'active' : ''}`}>
//                 <li className="nav-item">
//                     <NavLink
//                         to="/"
//                         onClick={toggleMenu}
//                         className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
//                     >
//                         Home
//                     </NavLink>
//                 </li>
//                 <li className="nav-item">
//                     <NavLink
//                         to="/About"
//                         onClick={toggleMenu}
//                         className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
//                     >
//                         About
//                     </NavLink>
//                 </li>

//                 {isLoggedIn ? (
//                     <>
//                         <li className="nav-item">
//                             <NavLink
//                                 to="/Analysis"
//                                 onClick={toggleMenu}
//                                 className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
//                             >
//                                 Analysis
//                             </NavLink>
//                         </li>
//                         <li className="nav-item notifications-link">
//                             <button className="nav-link" onClick={toggleNotifications}>
//                                 Notifications
//                             </button>
//                             {showNotifications && (
//                                 <Notifications
//                                     notifications={dummyNotifications}
//                                     onClose={() => setShowNotifications(false)}
//                                 />
//                             )}
//                         </li>

//                         <li className="nav-item">
//                             <NavLink
//                                 to="/Profile"
//                                 onClick={toggleMenu}
//                                 className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
//                             >
//                                 Profile
//                             </NavLink>
//                         </li>
//                         <li className="nav-item">
//                             <button
//                                 onClick={() => { handleLogout(); toggleMenu(); }}
//                                 className="nav-link logout-button"
//                             >
//                                 Logout
//                             </button>
//                         </li>
//                     </>
//                 ) : (
//                     <li className="nav-item">
//                         <NavLink
//                             to="/Login"
//                             onClick={toggleMenu}
//                             className={({ isActive }) => isActive ? "nav-link active login-button" : "nav-link login-button"}
//                         >
//                             Login
//                         </NavLink>
//                     </li>
//                 )}
//             </ul>
//         </nav>
//     );
// };

// export default Navbar;

import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import '../Styles/Navbar.css';
import { FaBars, FaTimes } from "react-icons/fa";
import Notifications from "../components/Notifications";
import ConfirmSignOut from "../components/ConfirmSignout";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showConfirmSignOut, setShowConfirmSignOut] = useState(false);

    const navigate = useNavigate();

    const dummyNotifications = [
        "Skin analysis completed successfully.",
        "New skin health tip available.",
        "Reminder: Analyze your skin weekly.",
    ];

    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
        setMenuOpen(false);
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user);
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

    return (
        <nav className="navbar">
            <h1 className="navbar-title">
                <NavLink to="/" className="nav-link" onClick={toggleMenu}>
                    FacialDerma AI
                </NavLink>
            </h1>

            <button className="menu-toggle" onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <ul className={`nav-list ${menuOpen ? 'active' : ''}`}>
                <li className="nav-item">
                    <NavLink
                        to="/"
                        onClick={toggleMenu}
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        Home
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/About"
                        onClick={toggleMenu}
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        About
                    </NavLink>
                </li>

                {isLoggedIn ? (
                    <>
                        <li className="nav-item">
                            <NavLink
                                to="/Analysis"
                                onClick={toggleMenu}
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            >
                                Analysis
                            </NavLink>
                        </li>
                        <li className="nav-item notifications-link">
                            <button className="nav-link" onClick={toggleNotifications}>
                                Notifications
                            </button>
                            {showNotifications && (
                                <Notifications
                                    notifications={dummyNotifications}
                                    onClose={() => setShowNotifications(false)}
                                />
                            )}
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/Profile"
                                onClick={toggleMenu}
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            >
                                Profile
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <button
                                onClick={() => setShowConfirmSignOut(true)}
                                className="nav-link logout-button"
                            >
                                Logout
                            </button>
                        </li>
                        {showConfirmSignOut && (
                            <ConfirmSignOut
                                onConfirm={confirmLogout}
                                onCancel={() => setShowConfirmSignOut(false)}
                            />
                        )}
                    </>
                ) : (
                    <li className="nav-item">
                        <NavLink
                            to="/Login"
                            onClick={toggleMenu}
                            className={({ isActive }) => isActive ? "nav-link active login-button" : "nav-link login-button"}
                        >
                            Login
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
