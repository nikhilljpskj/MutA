import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {});
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <header className="header">
            <div className="header__logo">
                <Link to="/">utaEngineRental</Link>
            </div>
            <nav className="header__nav">
                <Link to="/product">Products</Link>
                <Link to="/about">About</Link>
                <Link to="/cart" className="cart-icon">🛒</Link>
                {user ? (
                    <div className="user-menu">
                        <Avatar alt={user.name} src="/path/to/default-avatar.png" />
                        <span className="user-name">{user.name}</span>
                        <div className="dropdown">
                            <button className="dropbtn">▼</button>
                            <div className="dropdown-content">
                                <Link to="/profile">Profile</Link>
                                <Link to="/orderdetails">My Orders</Link>
                                <Link onClick={handleLogout}>Logout</Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>
        </header>
    );
};

export default Header;