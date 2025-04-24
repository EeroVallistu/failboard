const classService = require('../services/classService');
const enrollmentService = require('../services/enrollmentService');
const userService = require('../services/userService');

/**
 * Create a new class
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createClass = async (req, res) => {
  try {
    const { name, description } = req.body;
    const teacherId = req.user.id;
    
    // Validate input
    if (!name) {
      return res.status(400).json({ message: 'Class name is required' });
    }
    
    // Create class
    const classData = {
      name,
      description: description || '',
      teacher_id: teacherId
    };
    
    const classId = await classService.createClass(classData);
    
    res.status(201).json({
      message: 'Class created successfully',
      classId
    });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a class
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const teacherId = req.user.id;
    
    // Validate input
    if (!name) {
      return res.status(400).json({ message: 'Class name is required' });
    }
    
    // Check if class exists and belongs to the teacher
    const classObj = await classService.getClassById(id);
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    if (classObj.teacher_id !== teacherId) {
      return res.status(403).json({ message: 'You can only update your own classes' });
    }
    
    // Update class
    const classData = {
      name,
      description: description || classObj.description
    };
    
    const updated = await classService.updateClass(id, classData);
    
    if (updated) {
      res.json({ message: 'Class updated successfully' });
    } else {
      res.status(400).json({ message: 'Failed to update class' });
    }
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a class
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    
    // Check if class exists and belongs to the teacher
    const classObj = await classService.getClassById(id);
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    if (classObj.teacher_id !== teacherId) {
      return res.status(403).json({ message: 'You can only delete your own classes' });
    }
    
    // Delete class
    const deleted = await classService.deleteClass(id);
    
    if (deleted) {
      res.json({ message: 'Class deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete class' });
    }
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all classes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllClasses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let classes = [];
    
    if (userRole === 'teacher') {
      // Teachers see their own classes
      classes = await classService.getTeacherClasses(userId);
    } else if (userRole === 'student') {
      // Students see classes they're enrolled in
      const student = await userService.findStudentByUserId(userId);
      if (student) {
        classes = await enrollmentService.getStudentClasses(student.id);
      }
    }
    
    res.json({ classes });
  } catch (error) {
    console.error('Error getting classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a class by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Get class
    const classObj = await classService.getClassById(id);
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Check if user has access to the class
    if (userRole === 'teacher' && classObj.teacher_id !== userId) {
      return res.status(403).json({ message: 'You can only view your own classes' });
    } else if (userRole === 'student') {
      const student = await userService.findStudentByUserId(userId);
      if (!student) {
        return res.status(403).json({ message: 'Student record not found' });
      }
      
      const enrollments = await enrollmentService.getStudentClasses(student.id);
      const isEnrolled = enrollments.some(c => c.id === parseInt(id));
      
      if (!isEnrolled) {
        return res.status(403).json({ message: 'You are not enrolled in this class' });
      }
    }
    
    res.json({ class: classObj });
  } catch (error) {
    console.error('Error getting class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get students in a class
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getClassStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Get class
    const classObj = await classService.getClassById(id);
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Check if user has access to the class
    if (userRole === 'teacher' && classObj.teacher_id !== userId) {
      return res.status(403).json({ message: 'You can only view students in your own classes' });
    } else if (userRole === 'student') {
      const student = await userService.findStudentByUserId(userId);
      if (!student) {
        return res.status(403).json({ message: 'Student record not found' });
      }
      
      const enrollments = await enrollmentService.getStudentClasses(student.id);
      const isEnrolled = enrollments.some(c => c.id === parseInt(id));
      
      if (!isEnrolled) {
        return res.status(403).json({ message: 'You are not enrolled in this class' });
      }
    }
    
    // Get students
    const students = await enrollmentService.getClassStudents(id);
    
    res.json({ students });
  } catch (error) {
    console.error('Error getting class students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add a student to a class
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addStudentToClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;
    const teacherId = req.user.id;
    
    // Validate input
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }
    
    // Check if class exists and belongs to the teacher
    const classObj = await classService.getClassById(id);
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    if (classObj.teacher_id !== teacherId) {
      return res.status(403).json({ message: 'You can only add students to your own classes' });
    }
    
    // Check if student exists
    const student = await userService.findStudentById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Enroll student
    const enrollmentId = await enrollmentService.enrollStudent(studentId, id);
    
    res.status(201).json({
      message: 'Student added to class successfully',
      enrollmentId
    });
  } catch (error) {
    console.error('Error adding student to class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Remove a student from a class
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.removeStudentFromClass = async (req, res) => {
  try {
    const { classId, studentId } = req.params;
    const teacherId = req.user.id;
    
    // Check if class exists and belongs to the teacher
    const classObj = await classService.getClassById(classId);
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    if (classObj.teacher_id !== teacherId) {
      return res.status(403).json({ message: 'You can only remove students from your own classes' });
    }
    
    // Check if student exists
    const student = await userService.findStudentById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Unenroll student
    const removed = await enrollmentService.unenrollStudent(studentId, classId);
    
    if (removed) {
      res.json({ message: 'Student removed from class successfully' });
    } else {
      res.status(400).json({ message: 'Student was not enrolled in this class' });
    }
  } catch (error) {
    console.error('Error removing student from class:', error);
    res.status(500).json({ message: 'Server error' });
  }
};