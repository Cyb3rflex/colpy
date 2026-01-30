const express = require('express');
const router = express.Router();
const { initializePayment, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/initialize', protect, initializePayment);
router.post('/verify', protect, verifyPayment);

module.exports = router;
