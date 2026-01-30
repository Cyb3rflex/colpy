import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { CheckCircle, Clock, User, Book, ChevronRight, X, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminGrading() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradingData, setGradingData] = useState({ score: '', feedback: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/learn/submissions/pending');
            setSubmissions(data);
        } catch (_err) {
            toast.error('Failed to load pending submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSubmission = async (id) => {
        try {
            const { data } = await api.get(`/api/learn/submissions/${id}`);
            setSelectedSubmission(data);
            setGradingData({ score: data.score || '', feedback: data.feedback || '' });
        } catch (_err) {
            toast.error('Failed to load submission details');
        }
    };

    const handleSubmitGrade = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/api/learn/submissions/${selectedSubmission.id}/grade`, {
                score: parseInt(gradingData.score),
                feedback: gradingData.feedback
            });
            toast.success('Submission graded successfully!');
            setSelectedSubmission(null);
            fetchSubmissions();
        } catch (_err) {
            toast.error('Failed to submit grade');
        } finally {
            setSubmitting(false);
        }
    };

    const renderSubmissionContent = (content) => {
        try {
            const parsed = JSON.parse(content);
            if (parsed.section_c) {
                // Sectioned Quiz
                return (
                    <div className="space-y-6">
                        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mb-6">
                            <p className="text-orange-400 text-sm font-bold flex items-center gap-2">
                                <AlertCircle size={16} />
                                SHORT ANSWER SECTION REQUIRES REVIEW
                            </p>
                        </div>
                        {Object.entries(parsed.section_c).map(([qId, answer]) => (
                            <div key={qId} className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                                <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Question ID: {qId}</p>
                                <p className="text-white font-medium text-lg leading-relaxed">{answer || <span className="text-gray-600 italic">No answer provided</span>}</p>
                            </div>
                        ))}

                        {/* Summary of other sections if any */}
                        {(parsed.section_a || parsed.section_b) && (
                            <div className="pt-6 border-t border-gray-800">
                                <p className="text-gray-500 text-sm font-bold mb-4">Auto-graded Sections Summary:</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {parsed.section_a && (
                                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                            <p className="text-xs text-gray-400 font-bold uppercase">Section A (MCQ)</p>
                                            <p className="text-xl font-black text-cyan-400">{Object.keys(parsed.section_a).length} Questions Answered</p>
                                        </div>
                                    )}
                                    {parsed.section_b && (
                                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                            <p className="text-xs text-gray-400 font-bold uppercase">Section B (TF)</p>
                                            <p className="text-xl font-black text-cyan-400">{Object.keys(parsed.section_b).length} Questions Answered</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
            return <pre className="whitespace-pre-wrap text-gray-300 bg-gray-900 p-6 rounded-2xl border border-gray-800 font-mono text-sm">{JSON.stringify(parsed, null, 2)}</pre>;
        } catch (e) {
            return <div className="whitespace-pre-wrap text-gray-300 bg-gray-900 p-6 rounded-2xl border border-gray-800 leading-relaxed">{content}</div>;
        }
    };

    if (loading && submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-medium">Fetching pending submissions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Manual Grading</h2>
                    <p className="text-gray-500 font-medium">Review and grade student submissions that require manual intervention.</p>
                </div>
                <div className="bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700/50 flex items-center gap-2">
                    <Clock className="text-orange-400" size={18} />
                    <span className="text-white font-bold">{submissions.length} Pending</span>
                </div>
            </div>

            {submissions.length === 0 ? (
                <div className="bg-gray-800/20 border-2 border-dashed border-gray-700/50 rounded-3xl py-20 text-center">
                    <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                        <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Queue is Clear!</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">No pending submissions found. All short-answer questions and assignments are up to date.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {submissions.map((sub) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => handleSelectSubmission(sub.id)}
                            className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all cursor-pointer group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-cyan-400 transition-colors">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{sub.user.name}</h4>
                                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                        <Book size={14} /> {sub.unit.module.course.title} <ChevronRight size={12} /> {sub.unit.title}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-500 px-3 py-1 bg-gray-900/50 border border-gray-700 rounded-lg">
                                    {new Date(sub.createdAt).toLocaleDateString()}
                                </span>
                                <ChevronRight className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Grading Modal */}
            <AnimatePresence>
                {selectedSubmission && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSubmission(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-cyan-600/20 rounded-xl flex items-center justify-center text-cyan-400">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Review Submission</h3>
                                        <p className="text-sm text-gray-500 font-medium">Student: {selectedSubmission.user.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="p-2 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Submission Content</h4>
                                        {renderSubmissionContent(selectedSubmission.content)}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <form onSubmit={handleSubmitGrade} className="space-y-6 sticky top-0">
                                        <div>
                                            <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Assessment</h4>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Final Score (%)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        required
                                                        value={gradingData.score}
                                                        onChange={(e) => setGradingData({ ...gradingData, score: e.target.value })}
                                                        placeholder="e.g. 85"
                                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all text-2xl font-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Feedback to Student</label>
                                                    <textarea
                                                        value={gradingData.feedback}
                                                        onChange={(e) => setGradingData({ ...gradingData, feedback: e.target.value })}
                                                        placeholder="Provide guidance or recognition..."
                                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition-all min-h-[150px] font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white py-4 rounded-xl font-black shadow-xl shadow-cyan-900/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                                        >
                                            {submitting ? (
                                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <Save size={20} />
                                                    Submit Grade
                                                </>
                                            )}
                                        </button>

                                        <p className="text-xs text-gray-500 text-center">After submission, the student will be notified and the unit will be marked complete if they passed.</p>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
