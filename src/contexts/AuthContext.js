
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

import React, { useContext, createContext, useState, useEffect } from 'react';
// 1. Import setAuthToken from your API file
import { setAuthToken } from '../api/api'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
      // 2. CRITICAL: Set the token on the Axios instance when loading from localStorage
      setAuthToken(storedToken); 
    } else {
      // 3. IMPORTANT: Clear the token if none is found, ensuring a clean state
      setAuthToken(null);
    }

    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
    // 4. CRITICAL: Set the token on the Axios instance immediately after successful login
    setAuthToken(token); 
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
    // 5. CRITICAL: Clear the token from the Axios instance on logout
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};