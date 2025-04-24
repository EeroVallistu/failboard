import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import { isAuthenticated, getCurrentUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is a student
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'student') {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {user.fullName}</h1>
          <p>Student Dashboard</p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h2>My Classes</h2>
            <p>View your enrolled classes</p>
            <button className="dashboard-button" onClick={() => navigate('/student/classes')}>
              View Classes
            </button>
          </div>

          <div className="dashboard-card">
            <h2>Assignments</h2>
            <p>Check your pending assignments</p>
            <button className="dashboard-button" onClick={() => navigate('/student/assignments')}>
              View Assignments
            </button>
          </div>

          <div className="dashboard-card">
            <h2>Grades</h2>
            <p>Check your grades and feedback</p>
            <button className="dashboard-button" onClick={() => navigate('/student/grades')}>
              View Grades
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;