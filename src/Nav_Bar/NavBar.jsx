// import { Link } from "react-router-dom";
// import './Header.css';

// const Navbar = () => {
//     return (
//         <nav className="navbar">
//             <h1 className="navbar-title">
//                 <Link to="/">FacialDerma AI</Link>
//             </h1>
//             <ul className="nav-list">
//                 <li className="nav-item"><Link to="/">Home</Link></li>
//                 <li className="nav-item"><Link to="/Analysis">Analysis</Link></li>
//                 <li className="nav-item"><Link to="/About">About</Link></li>
//                 <li className="nav-item"><Link to="/Profile">Profile</Link></li>
//                 <li className="nav-item"><Link to="/Login">Login</Link></li>
//             </ul>
//         </nav>
//     );
// };

// export default Navbar;


import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './Header.css';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user); // true if user exists
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <h1 className="navbar-title">
                <Link to="/">FacialDerma AI</Link>
            </h1>
            <ul className="nav-list">
                <li className="nav-item"><Link to="/">Home</Link></li>
                <li className="nav-item"><Link to="/Analysis">Analysis</Link></li>
                <li className="nav-item"><Link to="/About">About</Link></li>

                {isLoggedIn ? (
                    <>
                        <li className="nav-item"><Link to="/Profile">Profile</Link></li>
                        <li className="nav-item"><button onClick={handleLogout} className="logout-button">Logout</button></li>
                    </>
                ) : (
                    <li className="nav-item">
                        <Link to="/Login" className="login-button">Login</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
