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
                        Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/About" onClick={toggleMenu} className="nav-link">
                        About
                    </Link>
                </li>

                {user ? (
                    <>
                        <li className="nav-item">
                            <Link to="/Analysis" onClick={toggleMenu} className="nav-link">
                                Analysis
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/Profile" onClick={toggleMenu} className="nav-link">
                                Profile
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button onClick={() => { handleLogout(); toggleMenu(); }} className="nav-link logout-button">
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
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
