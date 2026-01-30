import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  User,
  Save,
  Mail,
  Briefcase,
  FileText,
  Copy,
  Check,
} from "lucide-react";

export default function AdminProfile() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    title: user?.title || "",
    bio: user?.bio || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user?.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put("/users/profile", formData);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
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
        delayChildren: 0.1,
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
            <User size={28} className="text-white" />
          </div>
          Profile Settings
        </h1>
        <p className="text-gray-400 font-medium">
          Manage your administrator account and preferences
        </p>
      </motion.div>

      {/* User Info Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-800/50 hover:border-cyan-500/30 p-8 rounded-2xl transition-all duration-300 shadow-lg"
      >
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-cyan-900/40">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">
              {user?.name || "Administrator"}
            </h2>
            <p className="text-cyan-400 font-semibold mb-2">
              {user?.role || "ADMIN"}
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <Mail size={16} />
              <span className="text-sm">{user?.email}</span>
              <button
                onClick={handleCopyEmail}
                className="ml-2 p-1 hover:bg-gray-800/50 rounded transition-colors"
                title="Copy email"
              >
                {copied ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Copy
                    size={16}
                    className="text-gray-500 hover:text-cyan-400"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
      </motion.div>

      {/* Edit Form */}
      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-800/50 hover:border-cyan-500/30 p-8 rounded-2xl transition-all duration-300 shadow-lg space-y-6"
      >
        <h3 className="text-xl font-bold text-white mb-6">
          Edit Profile Information
        </h3>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300 ml-1 block">
              Full Name
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors duration-300"
                size={20}
              />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-950/50 border border-gray-800/50 focus:border-cyan-500/60 focus:bg-gray-950 p-4 pl-12 rounded-xl outline-none text-white transition-all duration-300 placeholder:text-gray-600 font-medium"
                placeholder="Your full name"
              />
            </div>
          </div>

          {/* Email (Read Only) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300 ml-1 block">
              Email Address (Read Only)
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                name="email"
                value={formData.email}
                disabled
                className="w-full bg-gray-950/30 border border-gray-800/50 p-4 pl-12 rounded-xl text-gray-500 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* Professional Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300 ml-1 block">
              Professional Title
            </label>
            <div className="relative group">
              <Briefcase
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors duration-300"
                size={20}
              />
              <input
                name="title"
                placeholder="e.g. Senior Security Analyst"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-gray-950/50 border border-gray-800/50 focus:border-cyan-500/60 focus:bg-gray-950 p-4 pl-12 rounded-xl outline-none text-white transition-all duration-300 placeholder:text-gray-600 font-medium"
              />
            </div>
          </div>

          {/* Avatar URL */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300 ml-1 block">
              Avatar URL
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors duration-300"
                size={20}
              />
              <input
                name="avatar"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full bg-gray-950/50 border border-gray-800/50 focus:border-cyan-500/60 focus:bg-gray-950 p-4 pl-12 rounded-xl outline-none text-white transition-all duration-300 placeholder:text-gray-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300 ml-1 block">
            Bio
          </label>
          <div className="relative group">
            <FileText
              className="absolute left-4 top-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors duration-300 pointer-events-none"
              size={20}
            />
            <textarea
              name="bio"
              rows="5"
              placeholder="Tell students and colleagues about yourself, your experience, and expertise..."
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-gray-950/50 border border-gray-800/50 focus:border-cyan-500/60 focus:bg-gray-950 p-4 pl-12 rounded-xl outline-none text-white transition-all duration-300 placeholder:text-gray-600 font-medium resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-800/50">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-cyan-900/30 hover:shadow-cyan-900/50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </motion.form>

      {/* Info Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-gray-800/50 rounded-2xl p-6">
          <h4 className="font-bold text-white mb-2">Account Security</h4>
          <p className="text-gray-400 text-sm mb-4">
            Keep your account secure by regularly updating your password and
            enabling two-factor authentication.
          </p>
          <button className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors">
            Manage Security →
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-gray-800/50 rounded-2xl p-6">
          <h4 className="font-bold text-white mb-2">Support & Documentation</h4>
          <p className="text-gray-400 text-sm mb-4">
            Access admin guides, documentation, and get help managing your
            platform.
          </p>
          <button className="text-purple-400 hover:text-purple-300 font-semibold text-sm transition-colors">
            View Guides →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
