import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoutes = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
PrivateRoutes.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoutes;
