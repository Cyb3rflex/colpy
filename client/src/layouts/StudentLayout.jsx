import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  BookOpen,
  LogOut,
  LayoutDashboard,
  User,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function StudentLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/student", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/student/browse", icon: Compass, label: "Browse Courses" },
    { path: "/student/facilitator", icon: Shield, label: "Facilitator" },
    { path: "/student/profile", icon: User, label: "Profile" },
  ];

  const closeMobileMenu = () => {
    // Only close menu on mobile screens
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false);
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-700/50 flex items-center space-x-3">
        <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-2.5 rounded-xl text-white">
          <Shield size={24} />
        </div>
        <div className="flex-1">
          <span className="text-xl font-black tracking-tight">
            CYBER<span className="text-cyan-400">SEC</span>
          </span>
          <p className="text-xs text-gray-500 font-medium">Learning Hub</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <motion.div key={item.path} whileHover={{ x: 4 }}>
              <Link
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-300 group ${active
                  ? "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-300"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent"
                  }`}
              >
                <Icon
                  className={`${active ? "text-cyan-400" : "group-hover:text-cyan-400"} transition-colors`}
                  size={20}
                />
                <span className="font-semibold flex-1">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-700/50 space-y-4">
        <div className="px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
            Student
          </p>
          <Link
            to="/student/profile"
            onClick={closeMobileMenu}
            className="font-bold text-cyan-300 hover:text-cyan-200 transition-colors truncate block text-sm"
          >
            {user?.name || "Student"}
          </Link>
        </div>
        <button
          onClick={() => {
            handleLogout();
            closeMobileMenu();
          }}
          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/30 font-semibold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {/* Mobile Sidebar (Animated) */}
      <div className="md:hidden">
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />
        )}
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: mobileMenuOpen ? 0 : "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 w-72 h-full bg-gray-900 z-50 flex flex-col border-r border-gray-800 shadow-2xl"
        >
          <div className="absolute top-6 right-6">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          {/* Sidebar Content */}
          <>
            {/* Logo */}
            <div className="p-6 border-b border-gray-700/50 flex items-center space-x-3">
              <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-2.5 rounded-xl text-white">
                <Shield size={24} />
              </div>
              <div className="flex-1">
                <span className="text-xl font-black tracking-tight">
                  CYBER<span className="text-cyan-400">SEC</span>
                </span>
                <p className="text-xs text-gray-500 font-medium">Student Portal</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <div key={item.path}>
                    <Link
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-300 group ${active
                        ? "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-300"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent"
                        }`}
                    >
                      <Icon
                        className={`${active ? "text-cyan-400" : "group-hover:text-cyan-400"} transition-colors`}
                        size={20}
                      />
                      <span className="font-semibold flex-1">{item.label}</span>
                      {active && (
                        <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-gray-700/50 space-y-4">
              <div className="px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                  Logged in as
                </p>
                <Link
                  to="/student/profile"
                  onClick={closeMobileMenu}
                  className="font-bold text-cyan-300 hover:text-cyan-200 transition-colors truncate block text-sm"
                >
                  {user?.name || "Student"}
                </Link>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/30 font-semibold"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </>
        </motion.aside>
      </div>

      {/* Desktop Sidebar (Static) */}
      <aside className="hidden md:flex w-64 h-full bg-gray-950/50 flex-col border-r border-gray-800/50 backdrop-blur-xl relative z-10">
        {/* Sidebar Content */}
        <>
          {/* Logo */}
          <div className="p-6 border-b border-gray-700/50 flex items-center space-x-3">
            <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-2.5 rounded-xl text-white">
              <Shield size={24} />
            </div>
            <div className="flex-1">
              <span className="text-xl font-black tracking-tight">
                CYBER<span className="text-cyan-400">SEC</span>
              </span>
              <p className="text-xs text-gray-500 font-medium">Student Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-300 group ${active
                      ? "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-cyan-300"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent"
                      }`}
                  >
                    <Icon
                      className={`${active ? "text-cyan-400" : "group-hover:text-cyan-400"} transition-colors`}
                      size={20}
                    />
                    <span className="font-semibold flex-1">{item.label}</span>
                    {active && (
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-700/50 space-y-4">
            <div className="px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                Logged in as
              </p>
              <Link
                to="/student/profile"
                onClick={closeMobileMenu}
                className="font-bold text-cyan-300 hover:text-cyan-200 transition-colors truncate block text-sm"
              >
                {user?.name || "Student"}
              </Link>
            </div>
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/30 font-semibold"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-gray-900 border-b border-gray-800 flex items-center px-4 sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-gray-800 text-cyan-400 hover:bg-gray-700 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="ml-4 flex items-center gap-2">
            <Shield className="text-cyan-400" size={20} />
            <span className="font-bold tracking-tight">CYBERSEC</span>
          </div>
        </div>

        {/* Header/Top Bar */}
        <div className="h-16 bg-gray-800/50 border-b border-gray-700/50 flex items-center px-6 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white flex-1">
            {navItems.find((item) => isActive(item.path))?.label ||
              "Learning Hub"}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-white">
                {user?.name || "Student"}
              </p>
              <p className="text-xs text-gray-500">Active Learner</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "S"}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
