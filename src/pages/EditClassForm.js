import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { isAuthenticated } from '../services/authService';
import { getClassById, updateClass } from '../services/classService';
import './EditClassForm.css';

const EditClassForm = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { name, description } = formData;

  // Define fetchClassData before using it in useEffect
  const fetchClassData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getClassById(classId);
      
      if (response.success) {
        setFormData({
          name: response.class.name || '',
          description: response.class.description || ''
        });
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

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchClassData();
  }, [classId, navigate, fetchClassData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Class name is required');
      return;
    }
    
    try {
      setLoading(true);
      const response = await updateClass(classId, formData);
      
      if (response.success) {
        setSuccess('Class updated successfully');
        // Clear any previous errors
        setError('');
      } else {
        setError(response.message || 'Failed to update class');
        // Clear any previous success messages
        setSuccess('');
      }
      
      setLoading(false);
    } catch (err) {
      setError('Server error. Please try again later.');
      setSuccess('');
      setLoading(false);
      console.error('Error updating class:', err);
    }
  };

  if (loading && formData.name === '') {
    return (
      <div className="edit-class-container">
        <Header />
        <div className="edit-class-content">
          <div className="loading">Loading class data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-class-container">
      <Header />
      <div className="edit-class-content">
        <div className="edit-class-header">
          <h1>Edit Class</h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="edit-class-form-container">
          <form className="edit-class-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Class Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Enter class name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={handleChange}
                placeholder="Enter class description"
                rows="5"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => navigate('/teacher/classes')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditClassForm;