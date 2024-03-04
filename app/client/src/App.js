import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './App.css';

axios.defaults.withCredentials = true; // Ensure credentials are sent with each request

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = () => {
    axios.get('http://localhost:4000/api/auth/status')
      .then(response => {
        if (response.data.authenticated) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      })
      .catch(error => {
        console.error("Authentication check failed", error);
        setAuthenticated(false);
      });
  };

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    axios.post('http://localhost:4000/api/auth/logout')
      .then(() => {
        setAuthenticated(false);
      })
      .catch(error => {
        console.error("Logout failed", error);
      });
  };

  return (
    <Router>
      <div className="App">
        <h1>Todo App</h1>
        {authenticated && <button onClick={handleLogout}>Logout</button>}
        <Routes>
          <Route path="/login" element={!authenticated ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate replace to="/home" />} />
          <Route path="/register" element={!authenticated ? <Register /> : <Navigate replace to="/home" />} />
          <Route path="/home" element={authenticated ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="*" element={<Navigate replace to={authenticated ? "/home" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;