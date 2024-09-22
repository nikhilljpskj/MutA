import React, { useState } from 'react';
import axios from 'axios';
import './TopNavbar.scss';
import { useNavigate } from 'react-router-dom';

const TopNavbar = ({ user: initialUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser); // Fix: Correct usage of useState

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {});
      localStorage.removeItem('user'); // Clear user data from localStorage
      setUser(null); // Reset user state
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="top-navbar">
      <div className="navbar-left">Admin Dashboard</div>
      <div className="navbar-right">
        <div className="username">
          {user && user.name} {/* Display username if user exists */}
          <div className="dropdown-menu">
            <a href="/profile">Profile</a>
            <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
