
// import React, { useContext, createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [accessToken, setAccessToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const storedToken = localStorage.getItem('accessToken');

//     if (storedUser && storedToken) {
//       setUser(JSON.parse(storedUser));
//       setAccessToken(storedToken);
//     }

//     setLoading(false);
//   }, []);

//   const login = (token, userData) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('accessToken', token);
//     localStorage.setItem('user', JSON.stringify(userData));
//     setAccessToken(token);
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user');
//     setAccessToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };



import React, { useContext, createContext, useState, useEffect, useCallback } from 'react';
import { setAuthToken } from '../api/api'; 
import api from '../api/api';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Logout function defined before checkUserStatus
  const logout = useCallback(() => {
    setLoggingOut(true);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
    // Clear the token from the Axios instance on logout
    setAuthToken(null);
    // Reset loggingOut after a brief delay to allow navigation to complete
    setTimeout(() => setLoggingOut(false), 100);
  }, []);

  // Function to check user status from backend
  const checkUserStatus = useCallback(async () => {
    try {
      const response = await api.get('/users/me');
      const updatedUser = response.data;
      
      // Update user in state and localStorage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // If user is suspended, don't logout - let SuspensionCheck component handle display
      // The user data with isSuspended flag will be used by SuspensionCheck
    } catch (error) {
      // Only logout on 401 (unauthorized/invalid token)
      // Don't logout on 403 as it might be suspension-related
      if (error.response?.status === 401) {
        // Token invalid or expired, logout
        logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setAccessToken(storedToken);
      // 2. CRITICAL: Set the token on the Axios instance when loading from localStorage
      setAuthToken(storedToken);
      
      // Check user status immediately on load
      checkUserStatus();
    } else {
      // 3. IMPORTANT: Clear the token if none is found, ensuring a clean state
      setAuthToken(null);
    }

    setLoading(false);
  }, [checkUserStatus]);

  // Periodically check user status every 30 seconds
  useEffect(() => {
    if (!accessToken || !user) return;

    const interval = setInterval(() => {
      checkUserStatus();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [accessToken, user, checkUserStatus]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
    // 4. CRITICAL: Set the token on the Axios instance immediately after successful login
    setAuthToken(token); 
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading, loggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};