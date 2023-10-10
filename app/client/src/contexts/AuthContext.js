import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the authentication context
export const AuthContext = createContext();

// Create the authentication context provider
export const AuthProvider = ({ children }) => {
  // State to store authentication status and user information
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check if the user is authenticated (you can implement your logic here)
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if the x-auth-token header is set in the request
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

    // Call the checkAuthentication function on component mount
    checkAuthentication();
  }, []);

  // Function to handle user login
  const login = async (email, password) => {
    try {
      // Perform the login logic here (e.g., send a POST request to your login endpoint)
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
      return false; // Return false on login failure
    }
  };

  // Function to handle user logout
  const logout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem('authToken');
    // Set isAuthenticated to false
    setIsAuthenticated(false);
    // Clear the user data
    setUser(null);
  };

  // Provide the authentication status and user data to child components
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
