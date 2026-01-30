const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 100, // 1 minute
  max: 100, // limit each IP to 1000 requests per windowMs
});

// Middleware
app.use(cors({
  origin: ['https://www.colpy.online', 'https://colpy-a67pftqh3-abdulmuheez-qazeem-s-projects.vercel.app'],
  credentials: true
}));

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use(helmet());
app.use(limiter);
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/learn', require('./routes/submissionRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// New Routes
const { getCourseProgress, markUnitComplete } = require('./controllers/progressController');
const { getAllStudents } = require('./controllers/adminController');
const { enrollInCourse, checkEnrollment, getMyEnrollments } = require('./controllers/enrollmentController');
const { protect, admin } = require('./middleware/authMiddleware');
const { getPendingSubmissions, getSubmissionById, gradeWork } = require('./controllers/submissionController');

app.get('/api/progress/:courseId', protect, getCourseProgress);
app.post('/api/progress', protect, markUnitComplete);
app.get('/api/admin/students', protect, admin, getAllStudents);
app.get('/api/enrollments/my', protect, getMyEnrollments);
app.post('/api/enrollments', protect, enrollInCourse);
app.get('/api/enrollments/:courseId/check', protect, checkEnrollment);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.send('Cybersecurity SaaS API is running securely.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
