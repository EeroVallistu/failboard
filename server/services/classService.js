const { db } = require('../config/db');

/**
 * Create a new class
 * @param {Object} classData - Class data (name, description, teacher_id)
 * @returns {Promise<number>} - ID of the created class
 */
exports.createClass = (classData) => {
  return new Promise((resolve, reject) => {
    const { name, description, teacher_id } = classData;
    
    const query = `
      INSERT INTO classes (name, description, teacher_id)
      VALUES (?, ?, ?)
    `;
    
    db.run(query, [name, description, teacher_id], function(err) {
      if (err) {
        console.error('Error creating class:', err);
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
};

/**
 * Update a class
 * @param {number} id - Class ID
 * @param {Object} classData - Class data to update
 * @returns {Promise<boolean>} - True if successful
 */
exports.updateClass = (id, classData) => {
  return new Promise((resolve, reject) => {
    const { name, description } = classData;
    
    const query = `
      UPDATE classes
      SET name = ?, description = ?
      WHERE id = ?
    `;
    
    db.run(query, [name, description, id], function(err) {
      if (err) {
        console.error('Error updating class:', err);
        return reject(err);
      }
      resolve(this.changes > 0);
    });
  });
};

/**
 * Delete a class
 * @param {number} id - Class ID
 * @returns {Promise<boolean>} - True if successful
 */
exports.deleteClass = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM classes
      WHERE id = ?
    `;
    
    db.run(query, [id], function(err) {
      if (err) {
        console.error('Error deleting class:', err);
        return reject(err);
      }
      resolve(this.changes > 0);
    });
  });
};

/**
 * Get a class by ID
 * @param {number} id - Class ID
 * @returns {Promise<Object|null>} - Class object or null if not found
 */
exports.getClassById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT c.*, u.full_name as teacher_name
      FROM classes c
      JOIN users u ON c.teacher_id = u.id
      WHERE c.id = ?
    `;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error('Error getting class by ID:', err);
        return reject(err);
      }
      resolve(row || null);
    });
  });
};

/**
 * Get all classes taught by a teacher
 * @param {number} teacherId - Teacher ID
 * @returns {Promise<Array>} - Array of class objects
 */
exports.getTeacherClasses = (teacherId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT c.*, COUNT(ce.student_id) as student_count
      FROM classes c
      LEFT JOIN class_enrollments ce ON c.id = ce.class_id
      WHERE c.teacher_id = ?
      GROUP BY c.id
    `;
    
    db.all(query, [teacherId], (err, rows) => {
      if (err) {
        console.error('Error getting teacher classes:', err);
        return reject(err);
      }
      resolve(rows || []);
    });
  });
};

/**
 * Get all available classes
 * @returns {Promise<Array>} - Array of class objects
 */
exports.getAllClasses = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT c.*, u.full_name as teacher_name, COUNT(ce.student_id) as student_count
      FROM classes c
      JOIN users u ON c.teacher_id = u.id
      LEFT JOIN class_enrollments ce ON c.id = ce.class_id
      GROUP BY c.id
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Error getting all classes:', err);
        return reject(err);
      }
      resolve(rows || []);
    });
  });
};