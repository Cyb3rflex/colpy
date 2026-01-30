import { motion } from "framer-motion";
import { Shield, Eye, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacy() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#030712] text-gray-300 py-12 px-6 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full"></div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-max-w-4xl mx-auto relative z-10"
            >
                <motion.div variants={itemVariants} className="flex flex-col items-center mb-12">
                    <Link to="/login" className="self-start mb-8 flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors font-bold text-sm">
                        <ArrowLeft size={16} /> Back to Terminal
                    </Link>
                    <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-4 rounded-2xl shadow-xl mb-6">
                        <Shield size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight text-center">
                        PRIVACY <span className="text-cyan-400">POLICY</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Last Updated: January 30, 2026</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-8 md:p-12 rounded-3xl shadow-premium-lg space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 bg-cyan-600/10 rounded-lg flex items-center justify-center text-cyan-400 text-sm">01</span>
                            Data Collection
                        </h2>
                        <p className="leading-relaxed">
                            We collect personal information that you provide to us when you register on the domain, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 bg-cyan-600/10 rounded-lg flex items-center justify-center text-cyan-400 text-sm">02</span>
                            How We Use Information
                        </h2>
                        <p className="leading-relaxed">
                            We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent. Specifically, we use your data to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 text-sm text-gray-400">
                            <li>Facilitate account creation and logon process;</li>
                            <li>Send administrative information to you;</li>
                            <li>Protect our services from security threats;</li>
                            <li>Personalize your learning experience.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 bg-cyan-600/10 rounded-lg flex items-center justify-center text-cyan-400 text-sm">03</span>
                            Data Security
                        </h2>
                        <p className="leading-relaxed">
                            We aim to protect your personal information through a system of organizational and technical security measures. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 bg-cyan-600/10 rounded-lg flex items-center justify-center text-cyan-400 text-sm">04</span>
                            Your Rights
                        </h2>
                        <p className="leading-relaxed">
                            In some regions, you have certain rights under applicable data protection laws. These may include the right to request access and obtain a copy of your personal information, to request rectification or erasure, and to restrict the processing of your personal information.
                        </p>
                    </section>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-12 text-center">
                    <p className="text-gray-600 text-sm">© 2026 CyberSec Platform. All rights reserved.</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
