import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import { isAuthenticated, getCurrentUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const TeacherDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is a teacher
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
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
          <p>Teacher Dashboard</p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h2>My Classes</h2>
            <p>Manage your classes and students</p>
            <button className="dashboard-button" onClick={() => navigate('/teacher/classes')}>
              View Classes
            </button>
          </div>

          <div className="dashboard-card">
            <h2>Create New Class</h2>
            <p>Start a new class for your students</p>
            <button className="dashboard-button" onClick={() => navigate('/teacher/classes/new')}>
              Create Class
            </button>
          </div>

          <div className="dashboard-card">
            <h2>Student Management</h2>
            <p>Add and manage students in your classes</p>
            <button className="dashboard-button" onClick={() => navigate('/teacher/students')}>
              Manage Students
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;