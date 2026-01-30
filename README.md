# 🛡️ COLPY - Cybersecurity Online Learning Platform

<div align="center">

![COLPY Banner](https://img.shields.io/badge/COLPY-Cybersecurity%20Learning-cyan?style=for-the-badge&logo=shield)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)

**A modern, full-stack e-learning platform designed specifically for cybersecurity education**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Deployment](#-deployment) • [Documentation](#-documentation)

</div>

---

## 📖 About COLPY

**COLPY** (Cybersecurity Online Learning Platform for You) is a comprehensive Learning Management System (LMS) built to deliver professional cybersecurity training with enterprise-grade features. The platform combines interactive learning, rigorous assessments, and seamless payment integration to create a complete educational ecosystem.

### 🎯 Project Goals

- **Democratize Cybersecurity Education**: Make high-quality cybersecurity training accessible to everyone
- **Professional Certification**: Provide industry-recognized certificates upon course completion
- **Secure & Scalable**: Built with security best practices and designed to scale
- **Modern Learning Experience**: Engaging UI/UX with interactive quizzes, timed exams, and progress tracking
- **Revenue-Ready**: Integrated payment processing for monetizing courses

---

## ✨ Features

### 👨‍🎓 Student Features
- **📚 Interactive Course Player**
  - Video lessons (YouTube/Vimeo integration)
  - Text-based content with rich formatting
  - Progress tracking with real-time percentage updates
  - Resume learning from where you left off

- **📝 Advanced Assessment System**
  - **Quizzes**: 2 attempts, 70% passing threshold, auto-graded
  - **Tests**: 2 attempts, 75% passing threshold, optional timer
  - **Final Exams**: 1 attempt only, 80% passing threshold, mandatory timer
  - **Strict Mode**: Anti-cheat measures (right-click disabled, tab monitoring)
  - **Prerequisite Locking**: Exams unlock only after 100% course completion

- **💳 Seamless Enrollment**
  - Free and paid courses
  - Paystack payment integration (Nigerian Naira)
  - Instant course access after payment
  - Transaction history tracking

- **🏆 Achievements**
  - Certificate generation upon passing final exam
  - Downloadable PDF certificates
  - Progress badges and completion stats

### 👨‍💼 Admin/Facilitator Features
- **🎨 Course Builder**
  - Drag-and-drop module organization
  - Multiple unit types: Text, Video, Quiz, Test, Exam, Assignment
  - Rich text editor for content creation
  - Quiz builder with MCQ, True/False, and Short Answer questions
  - Timer configuration for high-stakes assessments

- **👥 Student Management**
  - View all enrolled students
  - Real-time progress monitoring
  - Completion percentage tracking
  - Transaction history per student

- **✅ Grading Dashboard**
  - Manual grading for short-answer questions and assignments
  - Bulk grading capabilities
  - Feedback system
  - Auto-grading for objective questions

- **📊 Analytics Dashboard**
  - Total revenue tracking
  - Student enrollment statistics
  - Course performance metrics
  - Recent activity feed

### 🔐 Security & Authentication
- JWT-based authentication
- Email verification (Resend integration)
- Password reset functionality
- Role-based access control (Admin/Student)
- Secure payment processing

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications
- **Axios** - HTTP client

### Backend
- **Node.js & Express** - Server framework
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### Integrations
- **Resend** - Email delivery service
- **Paystack** - Payment gateway (Nigeria)
- **YouTube/Vimeo** - Video hosting

### Development Tools
- **Vite** - Lightning-fast build tool
- **ESLint** - Code linting
- **Nodemon** - Auto-restart server
- **Prisma Studio** - Database GUI

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm or yarn
- Resend API key (for emails)
- Paystack API keys (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/colpy.git
   cd colpy
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**

   **Backend** (`server/.env`):
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/colpy

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters

   # Email (Resend)
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=noreply@yourdomain.com

   # Payment (Paystack)
   PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

   # Server
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```

   **Frontend** (`client/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Set up the database**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Seed the database (optional)**
   ```bash
   # Create an admin user
   npx prisma studio
   # Manually create a user and set role to "ADMIN"
   ```

6. **Run the application**

   **Development mode** (run both concurrently):
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

   The app will be available at:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

---

## 📁 Project Structure

```
colpy/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth)
│   │   ├── layouts/       # Admin & Student layouts
│   │   ├── pages/         # Page components
│   │   │   ├── admin/    # Admin dashboard pages
│   │   │   └── student/  # Student portal pages
│   │   ├── services/      # API client
│   │   └── App.jsx        # Main app component
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Express backend
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth & validation
│   │   ├── routes/       # API routes
│   │   ├── services/     # Email service
│   │   └── index.js      # Server entry point
│   └── package.json
│
└── README.md             # This file
```

---

## 🌐 Deployment

For detailed deployment instructions, see:
- [📘 Full Deployment Guide](./docs/deployment_guide.md)
- [⚡ Quick Deploy Checklist](./docs/quick_deploy_checklist.md)

### Quick Deploy Summary

**Recommended Stack:**
- **Frontend**: Vercel (free tier)
- **Backend**: Railway (free tier)
- **Database**: Neon PostgreSQL (free tier)
- **Domain**: Namecheap/GoDaddy (~$12/year)

**Estimated Setup Time**: 1-2 hours

---

## 📚 Documentation

- [Implementation Plan](./docs/implementation_plan.md) - Technical architecture
- [Walkthrough](./docs/walkthrough.md) - Feature showcase
- [Deployment Guide](./docs/deployment_guide.md) - Production deployment
- [API Documentation](#) - Coming soon

---

## 🎓 Usage Examples

### Creating a Course (Admin)
1. Login as admin
2. Navigate to **Courses** → **Create Course**
3. Add course details (title, description, price)
4. Build curriculum with modules and units
5. Add quizzes, tests, and final exam
6. Publish course

### Taking a Course (Student)
1. Browse available courses
2. Enroll (free) or purchase (paid)
3. Complete lessons in order
4. Pass quizzes and tests (70-75% threshold)
5. Unlock final exam at 100% completion
6. Pass exam (80% threshold) to earn certificate

---

## 🔒 Security Features

- ✅ JWT authentication with HTTP-only cookies
- ✅ Password hashing with bcrypt
- ✅ Email verification required
- ✅ CORS protection
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection
- ✅ Rate limiting (production)
- ✅ Secure payment processing (Paystack)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Built with ❤️ for the cybersecurity community
- Inspired by modern LMS platforms like Udemy and Coursera
- Special thanks to all contributors and testers

---

## 📞 Support

For support, email support@colpy.com or join our [Discord community](#).

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with 🛡️ by the COLPY Team

</div>
