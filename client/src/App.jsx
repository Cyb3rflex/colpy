import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import CourseBuilder from "./pages/admin/CourseBuilder";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminGrading from "./pages/admin/AdminGrading";
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
// import StudentCourses from "./pages/student/StudentCourses";
import CoursePlayer from "./pages/student/CoursePlayer";
import StudentProfile from "./pages/student/StudentProfile";
import FacilitatorProfile from "./pages/student/FacilitatorProfile";
import VerifyEmail from "./pages/VerifyEmail";
import Landing from "./pages/Landing";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "ADMIN") return <Navigate to="/dashboard" />;
  return children;
};

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return user.role === "ADMIN" ? (
    <Navigate to="/admin" />
  ) : (
    <Navigate to="/student" />
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1f2937",
              color: "#fff",
              border: "1px solid #374151",
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Navigate to="/login" />} />{" "}
          {/* Simplified for now or use Register */}
          <Route path="/signup" element={<Register />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/new" element={<CourseBuilder />} />
            <Route path="courses/:id" element={<CourseBuilder />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="grading" element={<AdminGrading />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <PrivateRoute>
                <StudentLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="browse" element={<StudentDashboard />} />
            <Route path="course/:id" element={<CoursePlayer />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="facilitator" element={<FacilitatorProfile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
