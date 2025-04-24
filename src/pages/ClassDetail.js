import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Modal from '../components/common/Modal.js';
import { isAuthenticated } from '../services/authService';
import { getClassById, getClassStudents, removeStudentFromClass } from '../services/classService';
import './ClassDetail.css';

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);

  // Define fetchClassData before it's used in useEffect
  const fetchClassData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getClassById(classId);
      
      if (response.success) {
        setClassData(response.class);
      } else {
        setError(response.message || 'Failed to fetch class data');
      }
      
      setLoading(false);
    } catch (err) {
      setError('Server error. Please try again later.');
      setLoading(false);
      console.error('Error fetching class data:', err);
    }
  }, [classId]);

  // Define fetchStudents before it's used in useEffect
  const fetchStudents = useCallback(async () => {
    try {
      const response = await getClassStudents(classId);
      
      if (response.success) {
        setStudents(response.students || []);
      } else {
        console.error('Failed to fetch students:', response.message);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  }, [classId]);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchClassData();
    fetchStudents();
  }, [classId, navigate, fetchClassData, fetchStudents]);

  const handleEditClass = () => {
    navigate(`/teacher/classes/${classId}/edit`);
  };

  const handleAddStudents = () => {
    navigate(`/teacher/classes/${classId}/add-students`);
  };

  const handleConfirmRemove = (student) => {
    setStudentToRemove(student);
    setIsConfirmModalOpen(true);
  };

  const handleCancelRemove = () => {
    setStudentToRemove(null);
    setIsConfirmModalOpen(false);
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;
    
    try {
      const response = await removeStudentFromClass(classId, studentToRemove.id);
      
      if (response.success) {
        setStudents(students.filter(s => s.id !== studentToRemove.id));
        setStudentToRemove(null);
        setIsConfirmModalOpen(false);
      } else {
        setError(response.message || 'Failed to remove student');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error('Error removing student:', err);
    }
  };

  if (loading) {
    return (
      <div className="class-detail-container">
        <Header />
        <div className="class-detail-content">
          <div className="loading">Loading class data...</div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="class-detail-container">
        <Header />
        <div className="class-detail-content">
          <div className="error-message">Class not found or you don't have access.</div>
          <button 
            className="back-button" 
            onClick={() => navigate('/teacher/classes')}
          >
            Back to Classes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="class-detail-container">
      <Header />
      <div className="class-detail-content">
        <div className="class-detail-header">
          <div className="class-title-section">
            <h1>{classData.name}</h1>
            <div className="class-actions">
              <button className="edit-button" onClick={handleEditClass}>
                Edit Class
              </button>
              <button className="back-button" onClick={() => navigate('/teacher/classes')}>
                Back to Classes
              </button>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="class-info">
            <p className="class-description">
              {classData.description || 'No description provided'}
            </p>
          </div>
        </div>

        <div className="students-section">
          <div className="students-header">
            <h2>Students</h2>
            <button className="add-button" onClick={handleAddStudents}>
              + Add Students
            </button>
          </div>

          {students.length === 0 ? (
            <div className="no-students">
              <p>No students enrolled in this class yet.</p>
              <button className="add-button" onClick={handleAddStudents}>
                Add Students
              </button>
            </div>
          ) : (
            <div className="students-list">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Enrollment Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.first_name} {student.last_name}</td>
                      <td>{student.email || 'N/A'}</td>
                      <td>{new Date(student.enrollment_date).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="remove-button"
                          onClick={() => handleConfirmRemove(student)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Confirmation modal for removing a student */}
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={handleCancelRemove}
          title="Confirm Removal"
        >
          <div className="confirm-remove">
            <p>
              Are you sure you want to remove <strong>{studentToRemove?.first_name} {studentToRemove?.last_name}</strong> from this class?
            </p>
            <div className="confirm-actions">
              <button 
                className="cancel-button"
                onClick={handleCancelRemove}
              >
                Cancel
              </button>
              <button 
                className="remove-button"
                onClick={handleRemoveStudent}
              >
                Remove
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ClassDetail;