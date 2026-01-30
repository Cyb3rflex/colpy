import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Zap,
  BookOpen,
  Users,
  Terminal,
  ChevronRight,
  CheckCircle,
  Sparkles,
  Cpu,
  TrendingUp,
} from "lucide-react";

export default function Landing() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.25, 0.25, 0.75] },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -15,
      transition: { duration: 0.3 },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="bg-[#030712] text-white min-h-screen font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-600/5 blur-[150px] rounded-full animate-pulse-slow"></div>
        <div
          className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[100px] rounded-full animate-pulse-slow"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/70 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-cyan-900/30 hover:shadow-cyan-900/50 transition-all duration-300">
              <Shield size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              CYBER<span className="text-cyan-400">SEC</span>
            </span>
          </motion.div>

          <motion.div
            className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a
              href="#features"
              className="hover:text-cyan-400 transition-colors duration-300 relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#stats"
              className="hover:text-cyan-400 transition-colors duration-300 relative group"
            >
              Impact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#cta"
              className="hover:text-cyan-400 transition-colors duration-300 relative group"
            >
              Get Started
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </motion.div>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors duration-300 font-semibold"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-lg shadow-cyan-900/30 hover:shadow-cyan-900/50 hover:scale-105 transform"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="mb-8">
              <motion.span
                className="inline-block py-2 px-4 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-widest backdrop-blur-sm"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)",
                }}
              >
                <Sparkles size={14} className="inline mr-2" />
                Premium Learning Platform
              </motion.span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-10 leading-[1.1] tracking-tight"
            >
              Master the Art of <br />
              <motion.span
                className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent inline-block animate-gradient-shift"
                style={{ backgroundSize: "200% 200%" }}
              >
                Cyber Defense
              </motion.span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              The ultimate platform for security professionals and enthusiasts.
              Master real-world techniques through hands-on labs,
              industry-standard certifications, and a thriving community of
              practitioners.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/signup"
                className="group relative w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-xl shadow-cyan-900/40 hover:shadow-cyan-900/60 hover:scale-105 transform inline-flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Journey{" "}
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </Link>

              <Link
                to="/login"
                className="group w-full sm:w-auto px-10 py-4 bg-gray-800/50 border-2 border-cyan-500/30 hover:border-cyan-500/60 hover:bg-gray-800 text-white rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Terminal size={20} className="text-cyan-400" />
                Explore Demo
              </Link>
            </motion.div>

            {/* Stats under hero */}
            <motion.div
              variants={item}
              className="mt-16 pt-12 border-t border-gray-800/50 flex flex-wrap justify-center gap-8"
            >
              <div className="text-center">
                <div className="text-3xl font-black text-cyan-400 mb-1">
                  10,000+
                </div>
                <div className="text-sm text-gray-500 font-semibold">
                  Active Learners
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-blue-400 mb-1">
                  50+
                </div>
                <div className="text-sm text-gray-500 font-semibold">
                  Expert Courses
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-400 mb-1">
                  99.9%
                </div>
                <div className="text-sm text-gray-500 font-semibold">
                  Platform Uptime
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Your Tactical Arsenal
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to excel from beginner to expert operator
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div
              variants={featureVariants}
              whileHover="hover"
              className="group p-8 bg-gray-900/50 border border-gray-800/50 hover:border-cyan-500/50 rounded-2xl transition-all duration-500 backdrop-blur-sm hover:bg-gray-900/70 card-premium"
            >
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-cyan-600/20 to-cyan-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:from-cyan-600/40 group-hover:to-cyan-900/40 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Zap className="text-cyan-400" size={28} />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors">
                Instant Lab Access
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Deploy fully-functional virtual environments in seconds. No
                complex setup required, just pure hands-on learning.
              </p>
            </motion.div>

            <motion.div
              variants={featureVariants}
              whileHover="hover"
              className="group p-8 bg-gray-900/50 border border-gray-800/50 hover:border-purple-500/50 rounded-2xl transition-all duration-500 backdrop-blur-sm hover:bg-gray-900/70 card-premium"
            >
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-purple-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:from-purple-600/40 group-hover:to-purple-900/40 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <Lock className="text-purple-400" size={28} />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                Red vs Blue Operations
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Understand both offensive and defensive techniques. Build
                impenetrable defenses by mastering attack methodologies.
              </p>
            </motion.div>

            <motion.div
              variants={featureVariants}
              whileHover="hover"
              className="group p-8 bg-gray-900/50 border border-gray-800/50 hover:border-blue-500/50 rounded-2xl transition-all duration-500 backdrop-blur-sm hover:bg-gray-900/70 card-premium"
            >
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-blue-600/20 to-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:from-blue-600/40 group-hover:to-blue-900/40 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <BookOpen className="text-blue-400" size={28} />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
                Structured Learning Paths
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Progress from Analyst to Architect. Follow industry-vetted
                curricula designed by seasoned security veterans.
              </p>
            </motion.div>

            <motion.div
              variants={featureVariants}
              whileHover="hover"
              className="group p-8 bg-gray-900/50 border border-gray-800/50 hover:border-emerald-500/50 rounded-2xl transition-all duration-500 backdrop-blur-sm hover:bg-gray-900/70 card-premium"
            >
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:from-emerald-600/40 group-hover:to-emerald-900/40 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <Cpu className="text-emerald-400" size={28} />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-300 transition-colors">
                Advanced Tooling
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Industry-standard tools and frameworks pre-configured. Focus on
                learning, not setup.
              </p>
            </motion.div>

            <motion.div
              variants={featureVariants}
              whileHover="hover"
              className="group p-8 bg-gray-900/50 border border-gray-800/50 hover:border-rose-500/50 rounded-2xl transition-all duration-500 backdrop-blur-sm hover:bg-gray-900/70 card-premium"
            >
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-rose-600/20 to-rose-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:from-rose-600/40 group-hover:to-rose-900/40 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Users className="text-rose-400" size={28} />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-rose-300 transition-colors">
                Thriving Community
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Connect with thousands of security professionals. Share
                knowledge, collaborate, and grow together.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        className="py-20 border-y border-gray-800/50 bg-gray-900/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={statVariants} className="text-center group">
              <motion.div
                className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text mb-3 group-hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1 }}
              >
                10K+
              </motion.div>
              <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                Certified Professionals
              </div>
            </motion.div>

            <motion.div variants={statVariants} className="text-center group">
              <motion.div
                className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text mb-3 group-hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1 }}
              >
                500+
              </motion.div>
              <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                Hours of Content
              </div>
            </motion.div>

            <motion.div variants={statVariants} className="text-center group">
              <motion.div
                className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text mb-3 group-hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1 }}
              >
                99.9%
              </motion.div>
              <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                Uptime SLA
              </div>
            </motion.div>

            <motion.div variants={statVariants} className="text-center group">
              <motion.div
                className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-rose-400 to-orange-500 bg-clip-text mb-3 group-hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1 }}
              >
                24/7
              </motion.div>
              <div className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                Expert Support
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-600 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Ready to Dominate Your Field?
            </h2>
            <p className="text-gray-300 mb-12 text-lg leading-relaxed">
              Join thousands of security professionals who have transformed
              their careers. Your journey to mastery starts here.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Link
                to="/signup"
                className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-xl shadow-cyan-900/40 hover:shadow-cyan-900/60 hover:scale-105 transform"
              >
                Start Free Today
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-12 py-5 bg-gray-800/50 border-2 border-gray-700/50 hover:border-cyan-500/50 hover:bg-gray-800 text-white rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-sm"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.p
              className="text-gray-500 text-sm mt-8 font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              No credit card required • Premium labs included • Lifetime access
              to free tier
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield size={24} className="text-cyan-400" />
                <span className="text-xl font-black tracking-tight">
                  CYBERSEC
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                Premium security training for the modern defender.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Labs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Certifications
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-sm">
            <p>© 2026 CyberSec Labs. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
