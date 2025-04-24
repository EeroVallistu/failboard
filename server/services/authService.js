// API base URL
const API_URL = 'http://localhost:5000/api';

/**
 * Register a new user
 * @param {Object} userData - User data (username, password, email, fullName, role)
 * @returns {Promise<Object>} - Response from the server
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Store the token and user data for auto-login if they are present
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return { success: true, ...data };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Login a user
 * @param {Object} credentials - User credentials (username, password)
 * @returns {Promise<Object>} - Response from the server
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return { success: true, ...data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Logout the current user
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get the current user from localStorage
 * @returns {Object|null} - Current user or null if not logged in
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Check if the user is authenticated
 * @returns {boolean} - True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};