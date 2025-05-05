// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import '../Styles/Navbar.css';

// const Navbar = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
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

//     return (
//         <nav className="navbar">
//             <h1 className="navbar-title">
//                 <Link to="/">FacialDerma AI</Link>
//             </h1>
//             <ul className="nav-list">
//                 <li className="nav-item"><Link to="/">Home</Link></li>
//                 <li className="nav-item"><Link to="/About">About</Link></li>

//                 {isLoggedIn ? (
//                     <>
//                         <li className="nav-item"><Link to="/Profile">Profile</Link></li>
//                         <li className="nav-item"><Link to="/Analysis">Analysis</Link></li>
//                         <li className="nav-item"><button onClick={handleLogout} className="logout-button">Logout</button></li>
//                     </>
//                 ) : (
//                     <li className="nav-item">
//                         <Link to="/Login" className="login-button">Login</Link>
//                     </li>
//                 )}
//             </ul>
//         </nav>
//     );
// };

// export default Navbar;

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import '../Styles/Navbar.css';
import { FaBars, FaTimes } from "react-icons/fa"; // Install react-icons if not already

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
                <Link to="/">FacialDerma AI</Link>
            </h1>

            <button className="menu-toggle" onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <ul className={`nav-list ${menuOpen ? 'active' : ''}`}>
                <li className="nav-item"><Link to="/" onClick={toggleMenu}>Home</Link></li>
                <li className="nav-item"><Link to="/About" onClick={toggleMenu}>About</Link></li>

                {isLoggedIn ? (
                    <>
                        <li className="nav-item"><Link to="/Profile" onClick={toggleMenu}>Profile</Link></li>
                        <li className="nav-item"><Link to="/Analysis" onClick={toggleMenu}>Analysis</Link></li>
                        <li className="nav-item"><button onClick={() => { handleLogout(); toggleMenu(); }} className="logout-button">Logout</button></li>
                    </>
                ) : (
                    <li className="nav-item">
                        <Link to="/Login" className="login-button" onClick={toggleMenu}>Login</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
