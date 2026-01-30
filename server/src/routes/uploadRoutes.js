const express = require('express');
const router = express.Router();
const { uploadFile, handleUpload } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, uploadFile, handleUpload);

module.exports = router;
