import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Modal from '../components/common/Modal.js';
import CreateClassForm from '../components/class/CreateClassForm';
import { isAuthenticated } from '../services/authService';
import { getTeacherClasses, createClass, deleteClass } from '../services/classService';
import './ClassesList.css';

const ClassesList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchClasses();
  }, [navigate]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await getTeacherClasses();
      
      if (response.success) {
        setClasses(response.classes);
      } else {
        setError(response.message || 'Failed to fetch classes');
      }
      
      setLoading(false);
    } catch (err) {
      setError('Server error. Please try again later.');
      setLoading(false);
      console.error('Error fetching classes:', err);
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateClass = async (classData) => {
    try {
      const response = await createClass(classData);
      
      if (response.success) {
        setIsCreateModalOpen(false);
        // Refresh the classes list
        fetchClasses();
      } else {
        setError(response.message || 'Failed to create class');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error('Error creating class:', err);
    }
  };

  const handleEditClass = (classId) => {
    navigate(`/teacher/classes/${classId}/edit`);
  };

  const handleConfirmDelete = (classItem) => {
    setClassToDelete(classItem);
    setIsConfirmModalOpen(true);
  };

  const handleCancelDelete = () => {
    setClassToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleDeleteClass = async () => {
    if (!classToDelete) return;
    
    try {
      const response = await deleteClass(classToDelete.id);
      
      if (response.success) {
        // Remove the deleted class from the list
        setClasses(classes.filter(c => c.id !== classToDelete.id));
        setClassToDelete(null);
        setIsConfirmModalOpen(false);
      } else {
        setError(response.message || 'Failed to delete class');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error('Error deleting class:', err);
    }
  };

  if (loading) {
    return (
      <div className="classes-container">
        <Header />
        <div className="classes-content">
          <div className="loading">Loading classes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="classes-container">
      <Header />
      <div className="classes-content">
        <div className="classes-header">
          <h1>My Classes</h1>
          <button className="add-class-button" onClick={handleOpenCreateModal}>
            + Add New Class
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {classes.length === 0 ? (
          <div className="no-classes">
            <p>You don't have any classes yet.</p>
            <button className="dashboard-button" onClick={handleOpenCreateModal}>
              Create Your First Class
            </button>
          </div>
        ) : (
          <div className="classes-grid">
            {classes.map((classItem) => (
              <div key={classItem.id} className="class-card">
                <div className="class-card-header">
                  <h3>{classItem.name}</h3>
                  <div className="student-count">
                    <span>{classItem.student_count || 0} Students</span>
                  </div>
                </div>
                <div className="class-card-body">
                  <p>{classItem.description || 'No description provided'}</p>
                </div>
                <div className="class-card-footer">
                  <button 
                    className="view-class-button"
                    onClick={() => navigate(`/teacher/classes/${classItem.id}`)}
                  >
                    View Details
                  </button>
                  <div className="class-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleEditClass(classItem.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleConfirmDelete(classItem)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for creating a new class */}
        <Modal 
          isOpen={isCreateModalOpen} 
          onClose={handleCloseCreateModal}
          title="Create New Class"
        >
          <CreateClassForm 
            onSubmit={handleCreateClass}
            onCancel={handleCloseCreateModal}
          />
        </Modal>

        {/* Confirmation modal for deleting a class */}
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={handleCancelDelete}
          title="Confirm Deletion"
        >
          <div className="confirm-delete">
            <p>
              Are you sure you want to delete the class "{classToDelete?.name}"?
            </p>
            <p className="delete-warning">
              This action cannot be undone. All associated data will be permanently deleted.
            </p>
            <div className="confirm-actions">
              <button 
                className="cancel-button"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button 
                className="delete-button"
                onClick={handleDeleteClass}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ClassesList;