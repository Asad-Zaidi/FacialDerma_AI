
import React, { createContext, useState, useEffect } from "react";
import api, { setAuthToken } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);




  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setAccessToken(storedToken);
      setAuthToken(storedToken);
    }

    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);




  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);


    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));


    setAuthToken(token);
  };




  const logout = () => {
    setAccessToken(null);
    setUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        isAuthenticated: !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
