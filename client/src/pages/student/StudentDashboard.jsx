import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link, useLocation } from "react-router-dom";
import {
  PlayCircle,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Zap,
  Star,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isBrowseMode = location.pathname.includes("/browse");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const endpoint = isBrowseMode ? "/courses" : "/enrollments/my";
        const { data } = await api.get(endpoint);
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [isBrowseMode]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: -12,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
          {isBrowseMode ? "Explore Courses" : "My Learning Dashboard"}
        </h1>
        <p className="text-gray-400 font-medium">
          {isBrowseMode
            ? "Discover new skills and advance your career"
            : "Continue your cybersecurity journey"}
        </p>
      </motion.div>

      {/* Quick Stats (Only on Dashboard) */}
      {!isBrowseMode && !loading && courses.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <motion.div
            variants={item}
            className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <BookOpen size={20} className="text-cyan-400" />
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full font-bold">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-1">Enrolled Courses</p>
            <p className="text-2xl font-black text-white">{courses.length}</p>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={20} className="text-purple-400" />
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full font-bold">
                {courses.length > 0 ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length) : 0}%
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-1">Average Progress</p>
            <p className="text-2xl font-black text-white">
              {courses.every(c => c.progress === 100) && courses.length > 0 ? "Completed" : "Learning"}
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <Award size={20} className="text-emerald-400" />
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full font-bold">
                Earned
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-1">Certificates</p>
            <p className="text-2xl font-black text-white">{courses.filter(c => c.progress === 100).length}</p>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock size={20} className="text-orange-400" />
              <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full font-bold">
                Live
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-1">Status</p>
            <p className="text-2xl font-black text-white">Operational</p>
          </motion.div>
        </motion.div>
      )}

      {/* Courses Section */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {isBrowseMode ? (
              <Search size={24} className="text-purple-400" />
            ) : (
              <Zap size={24} className="text-cyan-400" />
            )}
            {isBrowseMode ? "Available Courses" : "Contine Learning"}
          </h2>
          {!isBrowseMode && (
            <Link
              to="/student/browse"
              className="text-cyan-400 hover:text-cyan-300 font-bold text-sm flex items-center gap-1 transition-colors"
            >
              Browse All <TrendingUp size={16} />
            </Link>
          )}
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-cyan-600/20 border-t-cyan-600 rounded-full animate-spin"></div>
              <p className="text-gray-400 font-medium">Loading courses...</p>
            </div>
          </motion.div>
        ) : courses.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courses.map((course, _idx) => (
              <motion.div
                key={course.id}
                variants={item}
                whileHover="hover"
                className="group relative h-full"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 to-blue-600/0 group-hover:from-cyan-600/20 group-hover:to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                <div className="relative h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl overflow-hidden border border-gray-800/50 group-hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-premium-lg backdrop-blur-sm flex flex-col">
                  <div className="p-6 pb-4 border-b border-gray-800/30 bg-gradient-to-br from-gray-900/30 to-transparent">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-all duration-300 ${course.level === "BEGINNER"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : course.level === "INTERMEDIATE"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                            }`}
                        >
                          {course.level || "All Levels"}
                        </span>
                      </div>
                      <span className="text-cyan-400 font-bold text-sm">
                        {course.price === 0 ? "FREE" : `₦${course.price}`}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                      {course.description}
                    </p>

                    {!isBrowseMode && (
                      <div className="mb-6 space-y-2">
                        <div className="flex justify-between items-center text-xs text-gray-400 font-semibold font-mono">
                          <span>PROGRESS</span>
                          <span>{course.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-950/50 rounded-full h-1.5 overflow-hidden border border-gray-800">
                          <motion.div
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress || 0}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      <div className="bg-gray-800/30 rounded-lg p-2 text-center border border-gray-700/30 group-hover:border-cyan-500/20 transition-colors">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 font-bold">
                          Modules
                        </p>
                        <p className="text-sm font-bold text-cyan-400 font-mono">
                          {course._count?.modules || 0}
                        </p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-2 text-center border border-gray-700/30 group-hover:border-purple-500/20 transition-colors">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 font-bold">
                          Status
                        </p>
                        <p className="text-sm font-bold text-purple-400 font-mono">
                          {isBrowseMode ? "AVAILABLE" : "ENROLLED"}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/student/course/${course.id}`}
                      className={`group/btn w-full px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-lg transform group-hover/btn:scale-105 ${isBrowseMode
                        ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-cyan-500/50"
                        : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/30 hover:shadow-cyan-900/50"
                        }`}
                    >
                      {isBrowseMode ? (
                        <Search size={18} />
                      ) : course.progress === 100 ? (
                        <Award size={18} />
                      ) : (
                        <PlayCircle size={18} />
                      )}
                      {isBrowseMode ? "View Details" : (course.progress === 100 ? "Completed" : "Resume Course")}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-gray-950/30 rounded-3xl border border-gray-800/50 backdrop-blur-sm"
          >
            <div className="w-20 h-20 bg-gray-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800">
              <BookOpen size={40} className="text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {isBrowseMode ? "No courses found" : "Your learning list is empty"}
            </h3>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto">
              {isBrowseMode
                ? "Check back later for new content or adjust your filters."
                : "Start your professional cybersecurity journey today by exploring our hand-picked courses."}
            </p>
            {!isBrowseMode && (
              <Link
                to="/student/browse"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold transition-all duration-300 shadow-xl shadow-cyan-900/40 hover:shadow-cyan-900/60 hover:scale-105 transform"
              >
                Browse Catalog <TrendingUp size={20} />
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
