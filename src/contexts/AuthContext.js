/* import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            setAccessToken(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};
 */

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  // Load token from localStorage when app starts
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  // Call this on login
  const login = (token) => {
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
  };

  // Call this on logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
