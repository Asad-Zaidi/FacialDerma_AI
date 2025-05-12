import { Link, useNavigate } from "react-router-dom";
import {  useState } from "react";
import '../Styles/Navbar.css';
import { FaBars, FaTimes, FaUser, FaInfoCircle, FaChartLine, FaHome, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
    const {user , logout }= useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();


    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
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
                        <FaHome className="nav-icon" />
                        <span>Home</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/About" onClick={toggleMenu} className="nav-link">
                        <FaInfoCircle className="nav-icon" />
                        <span>About</span>
                    </Link>
                </li>

                {user ? (
                    <>
                        <li className="nav-item">
                            <Link to="/Profile" onClick={toggleMenu} className="nav-link">
                                <FaUser className="nav-icon" />
                                <span>Profile</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/Analysis" onClick={toggleMenu} className="nav-link">
                                <FaChartLine className="nav-icon" />
                                <span>Analysis</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button onClick={() => { handleLogout(); toggleMenu(); }} className="nav-link logout-button">
                                <FaSignOutAlt className="nav-icon" />
                                <span>Logout</span>
                            </button>
                        </li>
                    </>
                ) : (
                    <li className="nav-item">
                        <Link to="/Login" className="nav-link login-button" onClick={toggleMenu}>
                            <FaUser className="nav-icon" />
                            <span>Login</span>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
