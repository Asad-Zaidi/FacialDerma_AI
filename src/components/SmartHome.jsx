// Create: src/Pages/SmartHome.jsx
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Home from '../Pages/Home';

const SmartHome = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'dermatologist') {
            navigate('/Dermatologist', { replace: true });
        }
    }, [user, navigate]);

    // Show regular home for patients and non-logged users
    return <Home />;
};

export default SmartHome;