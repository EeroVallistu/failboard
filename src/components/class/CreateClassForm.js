import React, { useState, useEffect } from 'react';
import './CreateClassForm.css';

const CreateClassForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { name, description } = formData;

  useEffect(() => {
    // Fetch available students that can be added to the class
    const fetchStudents = async () => {
      try {
        setLoading(true);
        // In a real application, this would be an API call
        // For now, we'll use mock data
        const mockStudents = [
          { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
          { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
          { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
          { id: 4, firstName: 'Alice', lastName: 'Williams', email: 'alice@example.com' },
          { id: 5, firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com' }
        ];
        
        setStudents(mockStudents);
        setLoading(false);
      } catch (err) {
        setError('Failed to load students');
        setLoading(false);
        console.error('Error fetching students:', err);
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStudentSelect = (e) => {
    const studentId = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Class name is required');
      return;
    }
    
    onSubmit({
      ...formData,
      studentIds: selectedStudents
    });
  };

  return (
    <form className="create-class-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      
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
          rows="3"
        ></textarea>
      </div>
      
      <div className="form-group">
        <label>Add Students (Optional)</label>
        {loading ? (
          <p>Loading students...</p>
        ) : students.length > 0 ? (
          <div className="students-list">
            {students.map(student => (
              <div key={student.id} className="student-item">
                <input
                  type="checkbox"
                  id={`student-${student.id}`}
                  value={student.id}
                  onChange={handleStudentSelect}
                  checked={selectedStudents.includes(student.id)}
                />
                <label htmlFor={`student-${student.id}`}>
                  {student.firstName} {student.lastName} ({student.email})
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p>No students available</p>
        )}
      </div>
      
      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-button">
          Create Class
        </button>
      </div>
    </form>
  );
};

export default CreateClassForm;