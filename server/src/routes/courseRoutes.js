const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    addModule,
    addUnit,
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCourses) // Allow students to see list, admins see drafts
    .post(protect, admin, createCourse);

router.route('/:id')
    .get(protect, getCourse)
    .put(protect, admin, updateCourse)
    .delete(protect, admin, deleteCourse);

router.post('/:courseId/modules', protect, admin, addModule);
router.post('/modules/:moduleId/units', protect, admin, addUnit);

module.exports = router;
