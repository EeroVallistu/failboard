const { db } = require('../config/db');

/**
 * Find a user by username
 * @param {string} username - Username to search for
 * @returns {Promise<Object|null>} - User object or null if not found
 */
exports.findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE username = ?`;
    
    db.get(query, [username], (err, row) => {
      if (err) {
        console.error('Error finding user by username:', err);
        return reject(err);
      }
      resolve(row || null);
    });
  });
};

/**
 * Find a user by email
 * @param {string} email - Email to search for
 * @returns {Promise<Object|null>} - User object or null if not found
 */
exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    
    db.get(query, [email], (err, row) => {
      if (err) {
        console.error('Error finding user by email:', err);
        return reject(err);
      }
      resolve(row || null);
    });
  });
};

/**
 * Find a user by ID
 * @param {number} id - User ID to search for
 * @returns {Promise<Object|null>} - User object or null if not found
 */
exports.findUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?`;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error('Error finding user by ID:', err);
        return reject(err);
      }
      resolve(row || null);
    });
  });
};

/**
 * Create a new user
 * @param {Object} userData - User data (username, password, email, full_name, role)
 * @returns {Promise<number>} - ID of the created user
 */
exports.createUser = (userData) => {
  return new Promise((resolve, reject) => {
    const { username, password, email, full_name, role } = userData;
    
    const query = `
      INSERT INTO users (username, password, email, full_name, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(query, [username, password, email, full_name, role], function(err) {
      if (err) {
        console.error('Error creating user:', err);
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
};

/**
 * Update a user
 * @param {number} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<boolean>} - True if successful
 */
exports.updateUser = (id, userData) => {
  return new Promise((resolve, reject) => {
    // Create SET part of query dynamically based on provided fields
    const fields = Object.keys(userData)
      .filter(key => userData[key] !== undefined)
      .map(key => `${key} = ?`);
    
    if (fields.length === 0) {
      return resolve(false);
    }
    
    const values = Object.keys(userData)
      .filter(key => userData[key] !== undefined)
      .map(key => userData[key]);
    
    // Add id to values
    values.push(id);
    
    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = ?
    `;
    
    db.run(query, values, function(err) {
      if (err) {
        console.error('Error updating user:', err);
        return reject(err);
      }
      resolve(this.changes > 0);
    });
  });
};

/**
 * Create a student record
 * @param {Object} studentData - Student data (first_name, last_name, email, user_id)
 * @returns {Promise<number>} - ID of the created student
 */
exports.createStudent = (studentData) => {
  return new Promise((resolve, reject) => {
    const { first_name, last_name, email, user_id } = studentData;
    
    const query = `
      INSERT INTO students (first_name, last_name, email, user_id)
      VALUES (?, ?, ?, ?)
    `;
    
    db.run(query, [first_name, last_name, email, user_id], function(err) {
      if (err) {
        console.error('Error creating student:', err);
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
};

/**
 * Find a student by ID
 * @param {number} id - Student ID
 * @returns {Promise<Object|null>} - Student object or null if not found
 */
exports.findStudentById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM students WHERE id = ?`;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error('Error finding student by ID:', err);
        return reject(err);
      }
      resolve(row || null);
    });
  });
};