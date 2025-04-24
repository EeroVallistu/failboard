const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticate, isTeacher } = require('../middleware/auth');

// Protect all routes
router.use(authenticate);

// Routes for teacher only
router.post('/', isTeacher, classController.createClass);
router.put('/:id', isTeacher, classController.updateClass);
router.delete('/:id', isTeacher, classController.deleteClass);
router.post('/:id/students', isTeacher, classController.addStudentToClass);
router.delete('/:classId/students/:studentId', isTeacher, classController.removeStudentFromClass);

// Routes for both teachers and students
router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
router.get('/:id/students', classController.getClassStudents);

module.exports = router;