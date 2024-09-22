import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Hook to navigate to other routes

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                // Save user data to local storage
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Conditional redirection based on is_admin value
                if (response.data.user.is_admin === 1) {
                    navigate('/dashboard', { state: { message: 'Login successful' } });
                } else if (response.data.user.is_admin === 2) {
                    navigate('/home', { state: { message: 'Login successful' } });
                }
            }
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <>
            <Header />

            <div className="login-reg-form-container">
                <div className="container">
                    <input type="checkbox" id="check" />
                    <div className="login form">
                        <header>Login</header>
                        <form onSubmit={handleLogin}>
                            <input
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                            <input
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                            <input 
                                type="submit" 
                                className="button" 
                                value="Login" 
                            />
                        </form>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div className="signup">
                            <span className="signup">
                                Don't have an account? 
                                <a href='/register' className="button"> Register</a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
