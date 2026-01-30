import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  Zap,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (pwd) => {
    return pwd.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created successfully! Welcome aboard.");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
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

  const passwordStrength = password
    ? password.length >= 12
      ? "strong"
      : password.length >= 8
        ? "medium"
        : "weak"
    : "none";

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-purple-600/10 blur-[80px] rounded-full animate-pulse-slow"
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
            whileHover={{ scale: 1.05, rotate: -2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-4 rounded-2xl shadow-xl shadow-blue-900/40">
              <Zap size={40} className="text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-white text-center mb-2">
            JOIN{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              CYBERSEC
            </span>
          </h1>
          <p className="text-gray-400 text-center font-medium">
            Create your account and start learning
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
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1 block">
                Full Name
              </label>
              <div className="relative group flex items-center">
                <User
                  className="absolute left-4 text-gray-500 group-focus-within:text-blue-400 transition-colors duration-300 pointer-events-none"
                  size={20}
                />
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  className="w-full bg-gray-950/50 border border-gray-800/50 focus:border-blue-500/60 focus:bg-gray-950 h-14 pl-12 rounded-xl outline-none text-white transition-all duration-300 placeholder:text-gray-600 font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1 block">
                Email Address
              </label>
              <div className="relative group flex items-center">
                <Mail
                  className="absolute left-4 text-gray-500 group-focus-within:text-blue-400 transition-colors duration-300 pointer-events-none"
                  size={20}
                />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-gray-950/50 border border-gray-800/50 focus:border-blue-500/60 focus:bg-gray-950 h-14 pl-12 rounded-xl outline-none text-white transition-all duration-300 placeholder:text-gray-600 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1 block">
                Password
              </label>
              <div className="relative group flex items-center">
                <Lock
                  className="absolute left-4 text-gray-500 group-focus-within:text-blue-400 transition-colors duration-300 pointer-events-none"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-950/50 border border-gray-800/50 focus:border-blue-500/60 focus:bg-gray-950 h-14 pl-12 pr-12 rounded-xl outline-none text-white transition-all duration-300 placeholder:text-gray-600 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500 hover:text-blue-400 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <div className="flex items-center gap-2 mt-2 px-1">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-colors ${passwordStrength === "weak" ? "bg-red-500" : passwordStrength === "medium" ? "bg-yellow-500" : "bg-green-500"}`}
                  ></div>
                  <span
                    className={`text-xs font-semibold ${passwordStrength === "weak" ? "text-red-400" : passwordStrength === "medium" ? "text-yellow-400" : "text-green-400"}`}
                  >
                    {passwordStrength === "weak"
                      ? "Weak"
                      : passwordStrength === "medium"
                        ? "Medium"
                        : "Strong"}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1 block">
                Confirm Password
              </label>
              <div className="relative group flex items-center">
                <Lock
                  className="absolute left-4 text-gray-500 group-focus-within:text-blue-400 transition-colors duration-300 pointer-events-none"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-950/50 border border-gray-800/50 focus:border-blue-500/60 focus:bg-gray-950 h-14 pl-12 pr-12 rounded-xl outline-none text-white transition-all duration-300 placeholder:text-gray-600 font-medium"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-gray-500 hover:text-blue-400 transition-colors duration-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 mt-2 px-1 text-green-400 text-xs font-semibold"
                >
                  <CheckCircle size={16} /> Passwords match
                </motion.div>
              )}
            </motion.div>

            {/* Terms Checkbox */}
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-3 py-2"
            >
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-950 accent-blue-600 cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-xs text-gray-400 cursor-pointer font-medium leading-relaxed"
              >
                I acknowledge and agree to the{" "}
                <Link
                  to="/terms"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-bold"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-bold"
                >
                  Privacy Policy
                </Link>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" /> Creating
                  Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={20} />
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

          {/* Sign In Link */}
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-400 font-medium"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-bold transition-colors duration-300 inline-flex items-center gap-1.5 group"
            >
              Sign In{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.p>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-gray-600 text-xs font-medium"
        >
          <p>
            Secure registration • Your data is protected with enterprise-grade
            encryption
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
