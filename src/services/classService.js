/**
 * Remove a student from a class
 * @param {string|number} classId - The class ID
 * @param {string|number} studentId - The student ID
 * @returns {Promise<Object>} - Response from the server
 */
export const removeStudentFromClass = async (classId, studentId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${API_URL}/classes/${classId}/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove student from class');
      }
      
      return { success: true, ...data };
    } catch (error) {
      console.error(`Error removing student from class ${classId}:`, error);
      return { success: false, message: error.message };
    }
  };// API base URL
  const API_URL = 'http://localhost:5000/api';
  
  /**
   * Get the authentication token from local storage
   * @returns {string|null} - Auth token or null if not found
   */
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };
  
  /**
   * Create a new class
   * @param {Object} classData - Class data (name, description, studentIds)
   * @returns {Promise<Object>} - Response from the server
   */
  export const createClass = async (classData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${API_URL}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(classData),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create class');
      }
      
      return { success: true, ...data };
    } catch (error) {
      console.error('Error creating class:', error);
      return { success: false, message: error.message };
    }
  };
  
  /**
   * Get all classes for the logged-in teacher
   * @returns {Promise<Object>} - Response from the server
   */
  export const getTeacherClasses = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${API_URL}/classes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch classes');
      }
      
      return { success: true, classes: data.classes || [] };
    } catch (error) {
      console.error('Error fetching classes:', error);
      return { success: false, message: error.message, classes: [] };
    }
  };
  
  /**
   * Get a class by its ID
   * @param {string|number} classId - The ID of the class to fetch
   * @returns {Promise<Object>} - Response from the server
   */
  export const getClassById = async (classId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${API_URL}/classes/${classId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch class');
      }
      
      return { success: true, class: data.class };
    } catch (error) {
      console.error(`Error fetching class ${classId}:`, error);
      return { success: false, message: error.message };
    }
  };
  
  /**
   * Update an existing class
   * @param {string|number} classId - The ID of the class to update
   * @param {Object} classData - Updated class data
   * @returns {Promise<Object>} - Response from the server
   */
  export const updateClass = async (classId, classData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${API_URL}/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(classData),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update class');
      }
      
      return { success: true, ...data };
    } catch (error) {
      console.error(`Error updating class ${classId}:`, error);
      return { success: false, message: error.message };
    }
  };
  
  /**
   * Delete a class
   * @param {string|number} classId - The ID of the class to delete
   * @returns {Promise<Object>} - Response from the server
   */
  export const deleteClass = async (classId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${API_URL}/classes/${classId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete class');
      }
      
      return { success: true, ...data };
    } catch (error) {
      console.error(`Error deleting class ${classId}:`, error);
      return { success: false, message: error.message };
    }
  };
  
  /**
   * Add a student to a class
   * @param {string|number} classId - The class ID
   * @param {string|number} studentId - The student ID
   * @returns {Promise<Object>} - Response from the server
   */
  export const addStudentToClass = async (classId, studentId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${API_URL}/classes/${classId}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ studentId }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add student to class');
      }
      
      return { success: true, ...data };
    } catch (error) {
      console.error(`Error adding student to class ${classId}:`, error);
      return { success: false, message: error.message };
    }
  };
  
  /**
   * Get all students enrolled in a class
   * @param {string|number} classId - The ID of the class
   * @returns {Promise<Object>} - Response from the server
   */
  export const getClassStudents = async (classId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${API_URL}/classes/${classId}/students`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch students');
      }
      
      return { success: true, students: data.students || [] };
    } catch (error) {
      console.error(`Error fetching students for class ${classId}:`, error);
      return { success: false, message: error.message, students: [] };
    }
  };