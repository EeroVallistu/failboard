import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, logoutUser } from '../../services/authService';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = authenticated ? getCurrentUser() : null;

  const handleLogout = () => {
    logoutUser();
    // Navigatsioon toimub logoutUser funktsioonis
  };

  return (
    <header className="header">
      <div className="logo">
      </div>
      <nav className="nav">
        <ul>
          {authenticated ? (
            <>
              <li>
                <Link to={user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}>
                  Dashboard
                </Link>
              </li>
              <li className="user-info">
                <span>Hello, {user?.fullName}</span>
              </li>
              <li className="logout-btn">
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;