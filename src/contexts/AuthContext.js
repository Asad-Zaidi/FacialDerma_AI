

import React, {useContext, createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Load token from localStorage when app starts
  /* useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    }
  }, []); */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }
  }, []);

/*   // Call this on login
  const login = (token) => {
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
  };
 */
const login = (token, userData) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData); // ← This is what your PrivateRoute needs
  };
  /* // Call this on logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
  }; */
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};