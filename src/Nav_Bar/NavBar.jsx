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
//                             <Link to="" onClick={toggleMenu} className="nav-link">
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

import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import '../Styles/Navbar.css';
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user);
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
                        <li className="nav-item">
                            <NavLink
                                to="/Notifications"
                                onClick={toggleMenu}
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            >
                                Notifications
                            </NavLink>
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
                                onClick={() => { handleLogout(); toggleMenu(); }}
                                className="nav-link logout-button"
                            >
                                Logout
                            </button>
                        </li>
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
