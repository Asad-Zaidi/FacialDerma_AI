// import { Navigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../contexts/AuthContext';

// const PrivateRoute = ({ children, roles }) => {
//   const { user, accessToken } = useContext(AuthContext);

//   if (!accessToken || !user) return <Navigate to="/login" replace />;
//   if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

//   return children;
// };

// export default PrivateRoute;

import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user, accessToken, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!accessToken || !user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

export default PrivateRoute;
