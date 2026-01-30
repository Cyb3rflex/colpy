import { motion } from "framer-motion";
import { Shield, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
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
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full"></div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-4xl mx-auto relative z-10"
            >
                <motion.div variants={itemVariants} className="flex flex-col items-center mb-12">
                    <Link to="/login" className="self-start mb-8 flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors font-bold text-sm">
                        <ArrowLeft size={16} /> Back to Terminal
                    </Link>
                    <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-4 rounded-2xl shadow-xl mb-6">
                        <FileText size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight text-center">
                        TERMS OF <span className="text-cyan-400">SERVICE</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Last Updated: January 30, 2026</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-8 md:p-12 rounded-3xl shadow-premium-lg space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 bg-cyan-600/10 rounded-lg flex items-center justify-center text-cyan-400 text-sm">01</span>
                            Agreement to Terms
                        </h2>
                        <p className="leading-relaxed">
                            By accessing the CyberSec Platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 bg-cyan-600/10 rounded-lg flex items-center justify-center text-cyan-400 text-sm">02</span>
                            Use License
                        </h2>
                        <p className="leading-relaxed">
                            Permission is granted to temporarily access the materials (information or software) on CyberSec Platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 text-sm text-gray-400">
                            <li>Modify or copy the materials;</li>
                            <li>Use the materials for any commercial purpose;</li>
                            <li>Attempt to decompile or reverse engineer any software;</li>
                            <li>Remove any copyright or other proprietary notations.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 bg-cyan-600/10 rounded-lg flex items-center justify-center text-cyan-400 text-sm">03</span>
                            Disclaimer
                        </h2>
                        <p className="leading-relaxed">
                            The materials on CyberSec Platform are provided on an 'as is' basis. CyberSec Platform makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 bg-cyan-600/10 rounded-lg flex items-center justify-center text-cyan-400 text-sm">04</span>
                            Ethical Conduct
                        </h2>
                        <p className="leading-relaxed">
                            As a cybersecurity training platform, we maintain strict ethical standards. Any use of the knowledge gained on this platform for illegal activities, unauthorized access, or malicious intent is strictly prohibited and will result in immediate termination of access without refund.
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
