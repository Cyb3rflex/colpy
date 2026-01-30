import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Shield,
    Mail,
    Terminal,
    ArrowLeft,
    Loader,
    CheckCircle
} from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post("/api/auth/forgot-password", { email });
            setIsSubmitted(true);
            toast.success("Security token dispatched to your email");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to send reset link";
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
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <motion.div variants={itemVariants} className="flex flex-col items-center mb-12">
                    <motion.div className="mb-6 relative" whileHover={{ scale: 1.05, rotate: 2 }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur-xl opacity-50"></div>
                        <div className="relative bg-gradient-to-br from-cyan-600 to-blue-600 p-4 rounded-2xl shadow-xl shadow-cyan-900/40">
                            <Shield size={40} className="text-white" />
                        </div>
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tight text-white text-center mb-2">
                        AUTH
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SEC</span>
                    </h1>
                    <p className="text-gray-400 text-center font-medium">Terminal Recovery Protocol</p>
                </motion.div>

                {/* Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-8 rounded-3xl shadow-premium-lg hover:border-cyan-500/30 transition-all duration-300"
                >
                    {!isSubmitted ? (
                        <>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
                                Enter your registered email address to receive a secure password reset link.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300 ml-1 block">Email Address</label>
                                    <div className="relative group flex items-center">
                                        <Mail className="absolute left-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors duration-300 pointer-events-none" size={20} />
                                        <input
                                            type="email"
                                            required
                                            placeholder="your.email@example.com"
                                            className="w-full bg-gray-950/50 border border-gray-800/50 focus:border-cyan-500/60 focus:bg-gray-950 h-14 pl-12 rounded-xl outline-none text-white transition-all duration-300 placeholder:text-gray-600 font-medium"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 mt-6"
                                >
                                    {isLoading ? <><Loader size={20} className="animate-spin" /> Transmitting...</> : <><Terminal size={20} /> Reset Password</>}
                                </motion.button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
                                <CheckCircle size={32} className="text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Email Dispatched</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                We've sent a secure reset link to <span className="text-cyan-400 font-bold">{email}</span>. Please check your inbox and follow the instructions.
                            </p>
                            <div className="pt-4">
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-gray-500 hover:text-cyan-400 text-xs font-bold transition-colors"
                                >
                                    Didn't receive it? Try again
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-800/50">
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold"
                        >
                            <ArrowLeft size={16} /> Back to Terminal Access
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
