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
import SuspensionCheck from '../components/SuspensionCheck';

const PrivateRoute = ({ children, roles }) => {
  const { user, accessToken, loading, loggingOut } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  // Don't redirect if we're in the middle of logging out
  if (loggingOut) return children;

  if (!accessToken || !user) return <Navigate to="/Login" replace />;

  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  // Wrap children with SuspensionCheck to block suspended users
  return <SuspensionCheck>{children}</SuspensionCheck>;
};

export default PrivateRoute;
