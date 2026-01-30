const express = require('express');
const router = express.Router();
const {
    submitWork,
    gradeWork,
    getSubmissionsByUnit,
    getMySubmission,
    getPendingSubmissions,
    getSubmissionById
} = require('../controllers/submissionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/units/:unitId/submit', protect, submitWork);
router.get('/units/:unitId/my-submission', protect, getMySubmission);
router.get('/units/:unitId/submissions', protect, admin, getSubmissionsByUnit);

// Administrative Grading Routes
router.get('/submissions/pending', protect, admin, getPendingSubmissions);
router.get('/submissions/:id', protect, admin, getSubmissionById);
router.put('/submissions/:id/grade', protect, admin, gradeWork);

module.exports = router;
