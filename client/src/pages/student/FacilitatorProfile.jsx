import { useEffect, useState } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, FileText, Shield } from 'lucide-react';

export default function FacilitatorProfile() {
    const [facilitator, setFacilitator] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFacilitator = async () => {
            try {
                const { data } = await api.get('/api/users/facilitator');
                setFacilitator(data);
            } catch (err) {
                console.error('Failed to fetch facilitator:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFacilitator();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
    );

    if (!facilitator) return (
        <div className="text-center py-20">
            <Shield size={64} className="mx-auto text-gray-700 mb-4" />
            <h2 className="text-2xl font-bold text-gray-500">Facilitator details not found</h2>
        </div>
    );

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
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto space-y-8"
        >
            <motion.div variants={itemVariants} className="text-center">
                <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 rounded-full"></div>
                    <div className="relative w-32 h-32 bg-gray-800 rounded-full border-4 border-cyan-500/50 flex items-center justify-center overflow-hidden mx-auto">
                        {facilitator.avatar ? (
                            <img src={facilitator.avatar} alt={facilitator.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={64} className="text-cyan-400" />
                        )}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-cyan-600 text-white p-2 rounded-full border-4 border-gray-900 shadow-xl">
                        <Shield size={20} />
                    </div>
                </div>
                <h1 className="text-4xl font-black text-white mb-2">{facilitator.name}</h1>
                <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm">{facilitator.title || 'Platform Facilitator'}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div variants={itemVariants} className="md:col-span-1 space-y-6">
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Mail size={18} className="text-cyan-400" />
                            Contact Information
                        </h3>
                        <p className="text-gray-400 text-sm break-all">{facilitator.email}</p>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-500/20 p-6 rounded-2xl text-center">
                        <Shield size={32} className="mx-auto text-cyan-400 mb-2" />
                        <h4 className="text-white font-bold text-sm">Verified Instructor</h4>
                        <p className="text-xs text-gray-500 mt-1">Enterprise Security Certified</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-2 space-y-8">
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <FileText size={18} className="text-cyan-400" />
                            About the Facilitator
                        </h3>
                        <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed italic">
                            {facilitator.bio ? (
                                facilitator.bio.split('\n').map((para, i) => (
                                    <p key={i} className="mb-4">"{para}"</p>
                                ))
                            ) : (
                                <p>This facilitator hasn't shared a bio yet, but they are dedicated to providing elite cybersecurity training.</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
