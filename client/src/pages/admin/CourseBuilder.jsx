import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Sub-component for Unit Form to manage its own state
const UnitForm = ({ moduleId, onAddUnit }) => {
    const [unit, setUnit] = useState({ title: '', type: 'TEXT', content: '', duration: '' });
    const [quiz, setQuiz] = useState({ mcq: '', tf: '', sa: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!unit.title.trim()) {
            toast.error("Unit title is required");
            return;
        }

        setIsSubmitting(true);
        try {
            let finalContent = unit.content;

            if (['QUIZ', 'TEST', 'EXAM'].includes(unit.type)) {
                try {
                    const quizData = {
                        duration: parseInt(unit.duration) || 0,
                        section_a: {
                            title: "Section A: Multiple Choice Questions",
                            questions: quiz.mcq.split('\n').filter(l => l.trim()).map((l, i) => {
                                const parts = l.split('|');
                                if (parts.length < 3) throw new Error("Invalid MCQ format");
                                const q = parts[0].trim();
                                const answer = parseInt(parts.pop().trim());
                                const options = parts.slice(1).map(p => p.trim());
                                return { id: `mcq-${Date.now()}-${i}`, type: 'mcq', question: q, options, answer };
                            })
                        },
                        section_b: {
                            title: "Section B: True or False",
                            questions: quiz.tf.split('\n').filter(l => l.trim()).map((l, i) => {
                                const parts = l.split('|');
                                if (parts.length < 2) throw new Error("Invalid T/F format");
                                return { id: `tf-${Date.now()}-${i}`, type: 'tf', question: parts[0].trim(), answer: parts[1].trim().toLowerCase() === 'true' };
                            })
                        },
                        section_c: {
                            title: "Section C: Short Answer Questions",
                            questions: quiz.sa.split('\n').filter(l => l.trim()).map((l, i) => {
                                return { id: `sa-${Date.now()}-${i}`, type: 'short_answer', question: l.trim() };
                            })
                        }
                    };
                    finalContent = JSON.stringify(quizData);
                } catch (e) {
                    toast.error(`Quiz Parsing Error: ${e.message}`);
                    setIsSubmitting(false);
                    return;
                }
            }

            await onAddUnit(moduleId, { ...unit, content: finalContent });
            // Reset form
            setUnit({ title: '', type: 'TEXT', content: '' });
            setQuiz({ mcq: '', tf: '', sa: '' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-4 bg-gray-700/30 p-6 rounded-2xl border border-gray-600/50 mt-4 shadow-inner">
            <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Unit Title</label>
                    <input
                        value={unit.title}
                        onChange={e => setUnit({ ...unit, title: e.target.value })}
                        placeholder="e.g., Final Assessment"
                        className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 outline-none focus:border-cyan-500 text-white transition-all shadow-sm"
                    />
                </div>
                <div className="w-40 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Type</label>
                    <select
                        value={unit.type}
                        onChange={e => setUnit({ ...unit, type: e.target.value })}
                        className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 outline-none focus:border-cyan-500 text-white transition-all shadow-sm"
                    >
                        <option value="TEXT">Text</option>
                        <option value="VIDEO">Video</option>
                        <option value="QUIZ">Quiz</option>
                        <option value="TEST">Test (Timed)</option>
                        <option value="EXAM">Final Exam (Timed & Strict)</option>
                    </select>
                </div>
            </div>

            {['QUIZ', 'TEST', 'EXAM'].includes(unit.type) && (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Time Limit (Minutes)</label>
                    <input
                        type="number"
                        value={unit.duration}
                        onChange={e => setUnit({ ...unit, duration: e.target.value })}
                        placeholder="e.g., 30 (0 for no limit)"
                        className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 outline-none focus:border-cyan-500 text-white transition-all shadow-sm"
                    />
                </div>
            )}

            {!['QUIZ', 'TEST', 'EXAM'].includes(unit.type) ? (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Content / URL</label>
                    <textarea
                        value={unit.content}
                        onChange={e => setUnit({ ...unit, content: e.target.value })}
                        placeholder="Markdown text for articles or YouTube/Vimeo URL..."
                        className="w-full p-4 h-32 rounded-xl bg-gray-900/50 border border-gray-700 outline-none focus:border-cyan-500 text-white font-mono text-sm transition-all shadow-sm"
                    />
                </div>
            ) : (
                <div className="space-y-6 border-t border-gray-700/50 pt-6">
                    <div className="bg-cyan-900/10 border border-cyan-500/20 p-4 rounded-xl mb-4">
                        <p className="text-xs text-cyan-400 font-medium">
                            <span className="font-bold">Pro Tip:</span> Format: Question | Opt A | Opt B | CorrectIndex
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-sm">A</div>
                            <h4 className="font-bold text-white text-sm">Multiple Choice</h4>
                        </div>
                        <textarea
                            value={quiz.mcq}
                            onChange={e => setQuiz({ ...quiz, mcq: e.target.value })}
                            placeholder="Question | Opt A | Opt B | 0"
                            className="w-full p-3 h-20 rounded-xl bg-gray-900/30 border border-gray-700 text-sm text-gray-300 outline-none focus:border-cyan-500 transition-all font-mono"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-sm">B</div>
                            <h4 className="font-bold text-white text-sm">True or False</h4>
                        </div>
                        <textarea
                            value={quiz.tf}
                            onChange={e => setQuiz({ ...quiz, tf: e.target.value })}
                            placeholder="Question | true"
                            className="w-full p-3 h-20 rounded-xl bg-gray-900/30 border border-gray-700 text-sm text-gray-300 outline-none focus:border-purple-500 transition-all font-mono"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-sm">C</div>
                            <h4 className="font-bold text-white text-sm">Short Answer</h4>
                        </div>
                        <textarea
                            value={quiz.sa}
                            onChange={e => setQuiz({ ...quiz, sa: e.target.value })}
                            placeholder="One question per line"
                            className="w-full p-3 h-20 rounded-xl bg-gray-900/30 border border-gray-700 text-sm text-gray-300 outline-none focus:border-orange-500 transition-all font-mono"
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-2 border-t border-gray-700/30">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating...' : 'Create Unit'}
                </button>
            </div>
        </div>
    );
};

export default function CourseBuilder() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [step, setStep] = useState(1);
    const [courseData, setCourseData] = useState({
        title: '', description: '', price: '', level: 'BEGINNER'
    });
    const [courseId, setCourseId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchCourse = async () => {
                setLoading(true);
                try {
                    const { data } = await api.get(`/courses/${id}`);
                    setCourseData({
                        title: data.title,
                        description: data.description,
                        price: data.price,
                        level: data.level
                    });
                    setModules(data.modules || []);
                    setCourseId(data.id);
                    setIsEditing(true);
                } catch (_err) {
                    toast.error('Failed to load course details');
                } finally {
                    setLoading(false);
                }
            };
            fetchCourse();
        }
    }, [id]);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await api.put(`/courses/${id}`, courseData);
                setCourseId(id);
                setStep(2);
                toast.success('Course details updated');
            } else {
                const { data } = await api.post('/courses', courseData);
                setCourseId(data.id);
                setStep(2);
                toast.success('Course created');
            }
        } catch (_err) {
            toast.error('Failed to save course');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateModule = async (e) => {
        e.preventDefault();
        if (!newModuleTitle.trim()) return;

        setIsActionLoading(true);
        try {
            const { data } = await api.post(`/courses/${courseId}/modules`, {
                title: newModuleTitle,
                order: modules.length + 1
            });
            setModules(prev => [...prev, { ...data, units: [] }]);
            setNewModuleTitle('');
            toast.success('Module added');
        } catch (_err) {
            toast.error('Failed to add module');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleAddUnit = async (moduleId, unitData) => {
        try {
            // Guard against duplicate units locally if rapid clicks occurred
            const module = modules.find(m => m.id === moduleId);
            if (module?.units?.some(u => u.title === unitData.title && u.type === unitData.type)) {
                // Potential duplicate, but let's allow it if it's intentional.
                // However, the real issue is duplicate IDs in render.
            }

            const { data } = await api.post(`/courses/modules/${moduleId}/units`, unitData);

            setModules(prev => prev.map(m => {
                if (m.id === moduleId) {
                    // Check if unit already exists in state to avoid re-adding
                    if (m.units.some(u => u.id === data.id)) return m;
                    return { ...m, units: [...(m.units || []), data] };
                }
                return m;
            }));
            toast.success('Unit added');
        } catch (_err) {
            toast.error('Failed to add unit');
            throw err; // For UnitForm to handle state
        }
    };

    if (loading && !courseId && isEditing) return <div className="text-center py-20">Loading course...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 text-white">
            <h1 className="text-3xl font-bold">{isEditing ? 'Edit Course' : 'Create New Course'}</h1>

            {step === 1 && (
                <form onSubmit={handleCreateCourse} className="space-y-4 bg-gray-800 p-6 rounded border border-gray-700 shadow-xl">
                    <div>
                        <label className="block mb-1 text-gray-400">Title</label>
                        <input required className="w-full p-2 rounded bg-gray-700 border border-gray-600 outline-none focus:border-cyan-400 text-white"
                            value={courseData.title} onChange={e => setCourseData({ ...courseData, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-400">Description</label>
                        <textarea required className="w-full p-2 rounded bg-gray-700 border border-gray-600 outline-none focus:border-cyan-400 text-white h-32"
                            value={courseData.description} onChange={e => setCourseData({ ...courseData, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-gray-400 border-none">Course Type</label>
                            <div className="flex gap-4 mb-2">
                                <button type="button" onClick={() => setCourseData({ ...courseData, price: 0 })}
                                    className={`px-4 py-2 rounded border transition-all ${courseData.price === 0 ? 'bg-cyan-600 border-cyan-400' : 'bg-gray-700 border-gray-600 text-gray-400'}`}>
                                    Free
                                </button>
                                <button type="button" onClick={() => setCourseData({ ...courseData, price: courseData.price > 0 ? courseData.price : 9.99 })}
                                    className={`px-4 py-2 rounded border transition-all ${courseData.price > 0 ? 'bg-cyan-600 border-cyan-400' : 'bg-gray-700 border-gray-600 text-gray-400'}`}>
                                    Paid
                                </button>
                            </div>
                            {courseData.price > 0 && (
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 font-bold">₦</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        placeholder="Price in NGN"
                                        className="w-full p-2 pl-8 rounded bg-gray-700 border border-gray-600 outline-none focus:border-cyan-400 text-white"
                                        value={courseData.price}
                                        onChange={e => setCourseData({ ...courseData, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-400">Level</label>
                            <select className="w-full p-2 rounded bg-gray-700 border border-gray-600 outline-none focus:border-cyan-400 text-white"
                                value={courseData.level} onChange={e => setCourseData({ ...courseData, level: e.target.value })}>
                                <option value="BEGINNER">Beginner</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="ADVANCED">Advanced</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-cyan-900/20">
                        {loading ? 'Saving...' : 'Next: Modules & Content'}
                    </button>
                </form>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <div className="bg-gray-800 p-6 rounded border border-gray-700 shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Structure Content</h2>
                        <form onSubmit={handleCreateModule} className="flex gap-2">
                            <input
                                value={newModuleTitle}
                                onChange={e => setNewModuleTitle(e.target.value)}
                                placeholder="Module Title (e.g., Introduction to Malware)"
                                className="flex-1 p-3 rounded-xl bg-gray-700 border border-gray-600 outline-none focus:border-purple-400 text-white"
                            />
                            <button
                                type="submit"
                                disabled={isActionLoading || !newModuleTitle.trim()}
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all shadow-lg"
                            >
                                {isActionLoading ? 'Adding...' : 'Add Module'}
                            </button>
                        </form>
                    </div>

                    <div className="space-y-6">
                        {modules.map((module, idx) => (
                            <div key={module.id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-cyan-400 tracking-tight">Module {idx + 1}: {module.title}</h3>
                                </div>

                                <div className="space-y-3 mb-8 ml-2">
                                    {module.units && module.units.map(unit => (
                                        <div key={unit.id} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 border border-gray-700">{unit.type[0]}</div>
                                                <span className="font-bold text-gray-200">{unit.title}</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{unit.type}</span>
                                        </div>
                                    ))}
                                    {(!module.units || module.units.length === 0) && (
                                        <div className="text-gray-600 text-sm font-medium italic p-4 border-2 border-dashed border-gray-700/50 rounded-xl text-center">No units added yet.</div>
                                    )}
                                </div>

                                <UnitForm moduleId={module.id} onAddUnit={handleAddUnit} />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-gray-800">
                        <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white font-bold transition-colors">Back to Details</button>
                        <div className="flex gap-4">
                            <button onClick={() => navigate('/admin/courses')} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold border border-gray-700 transition-all">Save & Exit</button>
                            <button onClick={async () => {
                                try {
                                    await api.put(`/courses/${courseId}`, { isPublished: true });
                                    toast.success('Course Published Successfully!');
                                    navigate('/admin/courses');
                                } catch (e) { toast.error('Failed to publish'); }
                            }} className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-black shadow-xl shadow-green-900/20 active:scale-95 transition-all">
                                Finalize & Publish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

