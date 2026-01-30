import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ courses: 0, students: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await api.get("/courses");
        const usersRes = await api.get("/users");
        setStats({
          courses: coursesRes.data.length,
          students: usersRes.data.length,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const StatCard = ({ icon: Icon, label, value, gradient, delay }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div
        className={`relative bg-gradient-to-br ${gradient} backdrop-blur-xl border border-gray-800/50 hover:border-cyan-500/30 p-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-premium-lg`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300">
            <Icon size={24} className="text-white" />
          </div>
          <TrendingUp
            size={18}
            className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
          {label}
        </h3>
        <p className="text-4xl md:text-5xl font-black text-white mb-2">
          {loading ? "..." : value}
        </p>
        <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-60"></div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-black text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-400 font-medium">
          Welcome back! Here's what's happening with your platform.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={stats.courses}
          gradient="from-blue-900/40 to-cyan-900/40"
          delay={0}
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats.students}
          gradient="from-purple-900/40 to-pink-900/40"
          delay={0.1}
        />
        <StatCard
          icon={Activity}
          label="System Status"
          value="Active"
          gradient="from-emerald-900/40 to-green-900/40"
          delay={0.2}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-800/50 hover:border-cyan-500/30 p-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-premium-lg group cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Clock size={24} className="text-cyan-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Pending Reviews</h3>
          <p className="text-gray-400 text-sm mb-4">
            Review and approve course submissions
          </p>
          <button className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors text-sm group/btn">
            View Pending{" "}
            <TrendingUp
              size={16}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-800/50 hover:border-purple-500/30 p-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-premium-lg group cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <CheckCircle size={24} className="text-purple-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Completion Rates
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Monitor student engagement and progress
          </p>
          <button className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors text-sm group/btn">
            View Analytics{" "}
            <TrendingUp
              size={16}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </button>
        </motion.div>
      </motion.div>

      {/* Performance Summary */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-800/50 p-8 rounded-2xl transition-all duration-300 shadow-lg"
      >
        <h3 className="text-xl font-bold text-white mb-6">
          Platform Performance
        </h3>
        <div className="space-y-4">
          {[
            { label: "API Response Time", value: "45ms", percentage: 95 },
            {
              label: "Database Query Performance",
              value: "120ms",
              percentage: 92,
            },
            { label: "Lab Deployment Success", value: "99.8%", percentage: 99 },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">
                  {metric.label}
                </span>
                <span className="text-cyan-400 font-bold">{metric.value}</span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden border border-gray-700/50">
                <motion.div
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.percentage}%` }}
                  transition={{
                    duration: 1,
                    delay: 0.5 + idx * 0.1,
                    ease: "easeOut",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
