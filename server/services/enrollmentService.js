const { db } = require('../config/db');

/**
 * Enroll a student in a class
 * @param {number} studentId - Student ID 
 * @param {number} classId - Class ID
 * @returns {Promise<number>} - ID of the enrollment record
 */
exports.enrollStudent = (studentId, classId) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO class_enrollments (student_id, class_id)
      VALUES (?, ?)
    `;
    
    db.run(query, [studentId, classId], function(err) {
      if (err) {
        console.error('Error enrolling student:', err);
        return reject(err);
      }
      resolve(this.lastID);
    });
  });
};

/**
 * Unenroll a student from a class
 * @param {number} studentId - Student ID
 * @param {number} classId - Class ID
 * @returns {Promise<boolean>} - True if successful
 */
exports.unenrollStudent = (studentId, classId) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM class_enrollments
      WHERE student_id = ? AND class_id = ?
    `;
    
    db.run(query, [studentId, classId], function(err) {
      if (err) {
        console.error('Error unenrolling student:', err);
        return reject(err);
      }
      resolve(this.changes > 0);
    });
  });
};

/**
 * Get all classes a student is enrolled in
 * @param {number} studentId - Student ID
 * @returns {Promise<Array>} - Array of class objects
 */
exports.getStudentClasses = (studentId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT c.id, c.name, c.description, c.teacher_id, u.full_name as teacher_name, ce.enrollment_date
      FROM classes c
      JOIN class_enrollments ce ON c.id = ce.class_id
      JOIN users u ON c.teacher_id = u.id
      WHERE ce.student_id = ?
    `;
    
    db.all(query, [studentId], (err, rows) => {
      if (err) {
        console.error('Error getting student classes:', err);
        return reject(err);
      }
      resolve(rows || []);
    });
  });
};

/**
 * Get all students enrolled in a class
 * @param {number} classId - Class ID
 * @returns {Promise<Array>} - Array of student objects
 */
exports.getClassStudents = (classId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT s.id, s.first_name, s.last_name, s.email, ce.enrollment_date
      FROM students s
      JOIN class_enrollments ce ON s.id = ce.student_id
      WHERE ce.class_id = ?
    `;
    
    db.all(query, [classId], (err, rows) => {
      if (err) {
        console.error('Error getting class students:', err);
        return reject(err);
      }
      resolve(rows || []);
    });
  });
};