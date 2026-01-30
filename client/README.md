# CyberSec Learning Platform - Frontend Client

This is the frontend application for the CyberSec Learning Platform, built with React and Vite. It features a high-performance, dark-themed UI designed for cybersecurity students and instructors.

## 🚀 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Cyberpunk/Dark Aesthetic)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Routing**: React Router DOM v6
- **API Client**: Axios
- **Notifications**: React Hot Toast

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
- **Development**:
  ```bash
  npm run dev
  ```
- **Production Build**:
  ```bash
  npm run build
  ```

## ✨ Core Features

### 👤 Student Experience
- **Cyber Deck (Dashboard)**: View enrolled and available courses with clear pricing.
- **Course Player**: Immersive learning environment with video, text, and rich quiz support.
- **Enrollment System**: Seamless access to free courses and mock-payment flow for premium content.
- **Profile Management**: Customize avatar, bio, and tracking professional goals.

### 🛡️ Admin Experience
- **Course Builder**: Drag-and-drop style module and unit creation.
- **Quiz Engine**: Create multi-question quizzes (MCQ, True/False, Short Answer).
- **Student Management**: Track completion rates and enrollment stats for all users.
- **Draft/Publish System**: Manage course visibility with a single toggle.

## 📁 Project Structure

```text
client/
├── src/
│   ├── components/    # Reusable UI elements
│   ├── context/       # Auth and Global State
│   ├── layouts/       # Admin and Student navigation wrappers
│   ├── pages/         # Page components (Admin/Student split)
│   ├── services/      # Axios API configuration
│   └── App.jsx        # Routing and Layout orchestration
└── public/            # Static assets
```

## ⚙️ Configuration
The client connects to the backend API via `src/services/api.js`.
Default: `http://localhost:5000/api`
