const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUserProfile, getFacilitator } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateUserProfile);
router.get('/facilitator', protect, getFacilitator);

router.use(protect);
router.use(admin);

router.route('/').get(getUsers);
router.route('/:id').get(getUserById);

module.exports = router;
