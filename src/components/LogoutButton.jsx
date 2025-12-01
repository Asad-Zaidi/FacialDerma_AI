import { useAuth } from '../contexts/AuthContext'; // Adjust path if AuthContext is located elsewhere
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    return (
        <button onClick={handleLogout} className="btn-logout">
            Logout
        </button>
    );
};

export default LogoutButton;
