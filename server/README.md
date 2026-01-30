# CyberSec Learning Platform - Backend API

This is the backend server for the CyberSec Learning Platform, built with Node.js, Express, and Prisma.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **Security**: JWT Authentication, Bcrypt password hashing, Helmet.js, Express Rate Limit
- **File Storage**: Local filesystem (Express Static)

## 🛠️ Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Database Setup
1. Create a `.env` file based on your environment:
   ```env
   PORT=5000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET=your_super_secret_key_here
   ```
2. Push the schema to your local database:
   ```bash
   npx prisma db push
   ```

### Running the Server
- **Development**:
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm start
  ```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account (First user becomes ADMIN)
- `POST /api/auth/login` - Authenticated access
- `GET /api/auth/me` - Get current user info

### Courses
- `GET /api/courses` - List all published courses (plus drafts for Admins)
- `GET /api/courses/:id` - Detailed course info
- `POST /api/courses` (Admin) - Create new course
- `PUT /api/courses/:id` (Admin) - Update course details/publish status

### Learning & Progress
- `POST /api/enrollments` - Enroll in a course (Handles Free/Paid logic)
- `GET /api/enrollments/:id/check` - Verification of access
- `GET /api/progress/:courseId` - Get completed unit IDs
- `POST /api/progress` - Mark unit as complete

### Student Management (Admin)
- `GET /api/admin/students` - Detailed breakdown of students and their course progress

## 📁 Project Structure

```text
server/
├── prisma/             # Database schema and migrations
├── src/
│   ├── controllers/    # Request handlers/Business logic
│   ├── middleware/     # Auth and validation guards
│   ├── routes/         # API Route definitions
│   ├── services/       # External integrations (Email, etc.)
│   └── index.js        # Main entry point
└── uploads/            # Avatar and asset storage
```

## 🛡️ Security Features
- **JWT Auth**: Secured routes requiring `Bearer` tokens.
- **Role-Based Access**: Strict division between `STUDENT` and `ADMIN` functionality.
- **Rate Limiting**: Protected against brute-force attacks.
- **Helmet**: Secure HTTP headers enabled.
