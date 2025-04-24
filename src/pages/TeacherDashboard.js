import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Modal from '../components/common/Modal.js';
import CreateClassForm from '../components/class/CreateClassForm';
import { isAuthenticated, getCurrentUser } from '../services/authService';
import { createClass } from '../services/classService';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const TeacherDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateClass = async (classData) => {
    try {
      const response = await createClass(classData);
      
      if (response.success) {
        setIsModalOpen(false);
        // Show a success message or redirect
        alert('Class created successfully!');
      } else {
        setError(response.message || 'Failed to create class');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error('Error creating class:', err);
    }
  };

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

        {error && <div className="error-message">{error}</div>}

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
            <button className="dashboard-button" onClick={handleOpenModal}>
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

        {/* Modal for creating a new class */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          title="Create New Class"
        >
          <CreateClassForm 
            onSubmit={handleCreateClass}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>
    </div>
  );
};

export default TeacherDashboard;