import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Mail,
  Terminal,
  ArrowRight,
  Eye,
  EyeOff,
  Loader,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
      toast.success("System Access Granted");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

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
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-600/10 blur-[80px] rounded-full animate-pulse-slow"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center mb-12"
        >
          <motion.div
            className="mb-6 relative"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-cyan-600 to-blue-600 p-4 rounded-2xl shadow-xl shadow-cyan-900/40">
              <Shield size={40} className="text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-white text-center mb-2">
            CYBER
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SEC
            </span>
          </h1>
          <p className="text-gray-400 text-center font-medium">
            Access your training terminal
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-8 rounded-3xl shadow-premium-lg hover:border-cyan-500/30 transition-all duration-300"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 mb-6 rounded-xl text-sm font-medium flex items-start gap-3"
            >
              <Lock size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1 block">
                Email Address
              </label>
              <div className="relative group flex items-center">
                <Mail
                  className="absolute left-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors duration-300 pointer-events-none"
                  size={20}
                />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  className="w-full bg-gray-950/50 border border-gray-800/50 focus:border-cyan-500/60 focus:bg-gray-950 h-14 pl-12 rounded-xl outline-none text-white transition-all duration-300 placeholder:text-gray-600 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group flex items-center">
                <Lock
                  className="absolute left-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors duration-300 pointer-events-none"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-950/50 border border-gray-800/50 focus:border-cyan-500/60 focus:bg-gray-950 h-14 pl-12 pr-12 rounded-xl outline-none text-white transition-all duration-300 placeholder:text-gray-600 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500 hover:text-cyan-400 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg shadow-cyan-900/30 hover:shadow-cyan-900/50 flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" /> Initializing...
                </>
              ) : (
                <>
                  <Terminal size={20} /> Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-900/50 text-gray-500 font-medium">
                or
              </span>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-400 text-sm font-medium"
          >
            New to CyberSec?{" "}
            <Link
              to="/signup"
              className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-300 inline-flex items-center gap-1.5 ml-1 group"
            >
              Create Account{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.p>

          {/* Legal Links Addition */}
          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-800/50 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">Legal Terminal</p>
            <div className="flex justify-center gap-6">
              <Link to="/terms" className="text-xs text-gray-500 hover:text-cyan-400 transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="text-xs text-gray-500 hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-gray-600 text-xs font-medium"
        >
          <p>
            Protected by enterprise-grade security • We never share your data
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
