import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuthentication = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      // Verify the token on the server (replace with your server's endpoint)
      const response = await axios.post('/api/auth/verify', { token: authToken });

      if (response.data.authenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };
  useEffect(() => {
    checkAuthentication();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.token) {
        // Store the authentication token in localStorage
        localStorage.setItem('authToken', response.data.token);
        // Call checkAuthentication to update the authentication state
        await checkAuthentication();
        return true; // Return true on successful login
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return false; // Return false on login failure
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const authContextValue = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

