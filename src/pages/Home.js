import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <h1>Welcome to ClassManager</h1>
        <p>A platform for teachers to manage classes and students</p>
        <div className="auth-buttons">
          <Link to="/signup" className="signup-button">Sign Up</Link>
          <Link to="/login" className="login-button">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;