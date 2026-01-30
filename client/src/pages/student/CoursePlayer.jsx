import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
    Lock, CheckCircle, FileText, Video as VideoIcon,
    HelpCircle, Trophy, ChevronRight, ShoppingCart,
    Loader, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function CoursePlayer() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeUnit, setActiveUnit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [_verifyingPayment, setVerifyingPayment] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [completedUnits, setCompletedUnits] = useState(new Set());
    const [progress, setProgress] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Rich Quiz State (Updated for Sections)
    const [quizState, setQuizState] = useState({
        isActive: false,
        currentSection: 'section_a', // section_a, section_b, section_c
        quizData: null,
        answers: {
            section_a: {}, // { qId: optionIndex }
            section_b: {}, // { qId: boolean }
            section_c: {}  // { qId: text }
        },
        showResults: false,
        pendingReview: false,
        score: null,
        attemptCount: 0,
        hasPassed: false,
        maxAttempts: 2,
        passThreshold: 70,
        timeLeft: null
    });

    useEffect(() => {
        const fetchCourseAndAccess = async () => {
            try {
                // 1. Fetch Course Data
                const { data: courseData } = await api.get(`/api/courses/${id}`);
                setCourse(courseData);
                if (courseData.modules?.[0]?.units?.[0]) {
                    setActiveUnit(courseData.modules[0].units[0]);
                }

                // 2. Check Enrollment (Access)
                let hasAccess = false;
                if (user) {
                    if (user.role === 'ADMIN') {
                        hasAccess = true;
                    } else {
                        try {
                            const { data: { enrolled } } = await api.get(`/api/enrollments/${id}/check`);
                            hasAccess = enrolled;

                            if (!enrolled && courseData.price === 0) {
                                await api.post('/api/enrollments', { courseId: id });
                                hasAccess = true;
                                toast.success('Joined Free Course');
                            }
                        } catch (_e) { console.error('Enrollment check failed', e); }
                    }
                }
                setIsEnrolled(hasAccess);

                if (hasAccess && user) {
                    const progressRes = await api.get(`/api/progress/${id}`);
                    setCompletedUnits(new Set(progressRes.data));
                }

            } catch (_err) {
                console.error(err);
                toast.error("Failed to load course");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseAndAccess();
    }, [id, user]);

    // Check for existing submission when active unit changes
    useEffect(() => {
        if (activeUnit?.type === 'QUIZ' && user && isEnrolled) {
            const checkSubmission = async () => {
                try {
                    const { data } = await api.get(`/api/learn/units/${activeUnit.id}/my-submission`);
                    if (data) {
                        setQuizState(prev => ({
                            ...prev,
                            showResults: true,
                            pendingReview: data.status === 'PENDING',
                            score: data.score,
                            attemptCount: data.attemptCount,
                            hasPassed: data.hasPassed,
                            maxAttempts: data.maxAttempts || 2,
                            passThreshold: data.passThreshold || 70
                        }));
                    }
                } catch (_e) {
                    // Silent fail for non-existent submissions
                }
            };
            checkSubmission();
        }
    }, [activeUnit, user, isEnrolled]);

    useEffect(() => {
        if (!course) return;
        let total = 0;
        course.modules.forEach(m => total += (m.units?.length || 0));
        if (total === 0) return;
        setProgress(Math.round((completedUnits.size / total) * 100));
    }, [completedUnits, course]);

    useEffect(() => {
        setQuizState({
            isActive: false, currentSection: 'section_a', quizData: null,
            answers: { section_a: {}, section_b: {}, section_c: {} },
            showResults: false, pendingReview: false, score: null
        });
    }, [activeUnit]);

    const handleMarkComplete = async () => {
        if (!activeUnit) return;
        try {
            const newSet = new Set(completedUnits);
            newSet.add(activeUnit.id);
            setCompletedUnits(newSet);
            await api.post('/api/progress', { unitId: activeUnit.id });
            toast.success(progress === 100 ? 'Course Completed!' : 'Progress Saved!');
        } catch (_err) {
            toast.error('Failed to sync progress');
        }
    };

    const startQuiz = () => {
        try {
            const quizData = JSON.parse(activeUnit.content);
            setQuizState({
                ...quizState,
                isActive: true,
                quizData,
                timeLeft: quizData.duration ? quizData.duration * 60 : null,
                currentSection: quizData.section_a?.questions?.length > 0 ? 'section_a' :
                    quizData.section_b?.questions?.length > 0 ? 'section_b' : 'section_c',
                showResults: false
            });
        } catch (_e) { toast.error("Invalid Quiz Data"); }
    };

    const handleQuizAnswer = (section, qId, answer) => {
        setQuizState(prev => ({
            ...prev,
            answers: {
                ...prev.answers,
                [section]: { ...prev.answers[section], [qId]: answer }
            }
        }));
    };

    const submitQuiz = async () => {
        try {
            const { data } = await api.post(`/api/learn/units/${activeUnit.id}/submit`, {
                content: quizState.answers
            });

            if (data.status === 'PENDING') {
                setQuizState(prev => ({
                    ...prev,
                    showResults: true,
                    pendingReview: true,
                    attemptCount: (prev.attemptCount || 0) + 1,
                    timeLeft: null
                }));
                toast.success(data.message);
            } else {
                setQuizState(prev => ({
                    ...prev,
                    showResults: true,
                    score: data.score || 0,
                    attemptCount: (prev.attemptCount || 0) + 1,
                    hasPassed: (data.score || 0) >= (prev.passThreshold || 70),
                    timeLeft: null
                }));
                if ((data.score || 0) >= (quizState.passThreshold || 70)) {
                    handleMarkComplete();
                }
                toast.success(data.message || 'Assessment Submitted Successfully!');
            }
        } catch (_err) {
            toast.error(err.response?.data?.message || 'Failed to submit quiz');
        }
    };

    // Timer countdown effect
    useEffect(() => {
        let timer;
        if (quizState.isActive && quizState.timeLeft !== null && quizState.timeLeft > 0) {
            timer = setInterval(() => {
                setQuizState(prev => {
                    if (prev.timeLeft <= 1) {
                        clearInterval(timer);
                        toast.error("Time's up! Auto-submitting...");
                        submitQuiz();
                        return { ...prev, timeLeft: 0 };
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 };
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [quizState.isActive, quizState.timeLeft]);

    // Strict Mode for EXAM (anti-cheat)
    useEffect(() => {
        if (!quizState.isActive || activeUnit?.type !== 'EXAM') return;

        const handleViolation = () => {
            toast.error("⚠️ Strict Mode: Do not leave the exam window!", { duration: 5000 });
        };

        const preventRightClick = (e) => e.preventDefault();

        window.addEventListener('blur', handleViolation);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) handleViolation();
        });
        document.addEventListener('contextmenu', preventRightClick);

        return () => {
            window.removeEventListener('blur', handleViolation);
            document.removeEventListener('visibilitychange', handleViolation);
            document.removeEventListener('contextmenu', preventRightClick);
        };
    }, [quizState.isActive, activeUnit]);

    const formatTime = (seconds) => {
        if (seconds === null) return "";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const isExamLocked = activeUnit?.type === 'EXAM' && progress < 100;

    const handlePurchase = async () => {
        if (course.price === 0) {
            try {
                await api.post('/api/enrollments', { courseId: id });
                setIsEnrolled(true);
                toast.success('Enrolled for Free!');
                return;
            } catch (_err) {
                toast.error('Enrollment failed');
                return;
            }
        }

        try {
            const { data } = await api.post('/api/payments/initialize', { courseId: id });
            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                toast.error('Failed to initialize Paystack');
            }
        } catch (_err) {
            toast.error(err.response?.data?.message || 'Transaction failed');
        }
    };

    useEffect(() => {
        const reference = searchParams.get('reference');
        const verify = async () => {
            if (reference && !isEnrolled) {
                setVerifyingPayment(true);
                try {
                    const { data } = await api.post('/api/payments/verify', { reference, courseId: id });
                    if (data.status === 'success') {
                        setIsEnrolled(true);
                        toast.success('Course Access Unlocked!');
                        navigate(`/api/student/course/${id}`, { replace: true });
                    }
                } catch (_err) {
                    toast.error('Payment Verification Failed');
                } finally {
                    setVerifyingPayment(false);
                }
            }
        };
        verify();
    }, [searchParams, isEnrolled, id, navigate]);

    const renderQuizContent = () => {
        const { quizData, currentSection, answers, showResults, score, pendingReview, attemptCount, hasPassed, maxAttempts, passThreshold, timeLeft } = quizState;
        const assessmentType = activeUnit?.type === 'EXAM' ? 'Final Exam' : activeUnit?.type === 'TEST' ? 'Test' : 'Quiz';

        if (!quizState.isActive && !showResults) return (
            <div className="text-center py-10 md:py-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl md:rounded-3xl border border-gray-700 shadow-2xl px-6">
                {isExamLocked ? (
                    <>
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                            <Lock size={32} className="text-red-400" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">🔒 Exam Locked</h2>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto font-medium text-sm md:text-base">
                            You must complete <strong className="text-cyan-400">100% of the course</strong> before accessing the Final Exam.
                        </p>
                        <div className="inline-block px-6 py-2 bg-cyan-500/10 text-cyan-400 rounded-full text-sm font-bold border border-cyan-500/20">
                            Current Progress: {progress}%
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                            <HelpCircle size={32} className="text-cyan-400" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">{assessmentType}: {activeUnit.title}</h2>
                        <p className="text-gray-400 mb-6 md:mb-8 max-w-md mx-auto font-medium text-sm md:text-base">
                            {activeUnit?.type === 'EXAM' ? '⚠️ Strict Mode Enabled: Right-click disabled, tab switching monitored.' : 'Test your knowledge across Multiple Choice, True/False, and Short Answer sections.'}
                        </p>

                        <div className="flex flex-col items-center gap-4 mb-8">
                            {quizData?.duration > 0 && (
                                <span className="px-4 py-1.5 rounded-full text-xs font-bold border bg-orange-500/10 text-orange-400 border-orange-500/20">
                                    ⏱️ Time Limit: {quizData.duration} minutes
                                </span>
                            )}
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${attemptCount >= maxAttempts ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-gray-700/50 text-gray-300 border-gray-600'}`}>
                                Attempts Used: {attemptCount} / {maxAttempts}
                            </span>
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold border bg-purple-500/10 text-purple-400 border-purple-500/20">
                                Passing Score: {passThreshold}%
                            </span>
                            {(attemptCount >= maxAttempts && !hasPassed) && (
                                <p className="text-red-400 text-sm font-semibold italic">Maximum attempts reached. Contact facilitator if you need a reset.</p>
                            )}
                        </div>

                        <button
                            disabled={attemptCount >= maxAttempts || hasPassed}
                            onClick={startQuiz}
                            className="w-full md:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 py-4 rounded-full font-black text-lg transition-all shadow-xl shadow-cyan-900/40 hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {hasPassed ? "Assessment Cleared" : `Start ${assessmentType}`}
                        </button>
                    </>
                )}
            </div>
        );

        if (showResults) return (
            <div className="text-center py-10 md:py-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl md:rounded-3xl border border-gray-700 shadow-2xl px-6">
                {pendingReview ? (
                    <div className="space-y-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-600/20 rounded-2xl flex items-center justify-center mx-auto border border-yellow-500/30">
                            <Loader size={32} className="text-yellow-400 animate-spin" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Review Pending</h2>
                        <p className="text-gray-400 max-w-md mx-auto font-medium text-sm md:text-base">Your short-answer responses are being reviewed by the facilitator. You'll see your final grade once marked.</p>
                        <div className="inline-block px-6 py-2 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-bold border border-yellow-500/20">Status: Sent for Grading</div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {score >= 70 ? (
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto border border-green-500/30">
                                <Trophy size={32} className="text-green-400" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto border border-red-500/30">
                                <Lock size={32} className="text-red-400" />
                            </div>
                        )}
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Grade: {score}%</h2>
                        <p className="text-gray-400 max-w-md mx-auto font-medium text-sm md:text-base">
                            {score >= passThreshold
                                ? "Fantastic! You've successfully passed this assessment."
                                : attemptCount >= maxAttempts
                                    ? `Maximum attempts reached. You did not meet the ${passThreshold}% passing threshold.`
                                    : `You need ${passThreshold}% to pass. Review the material and try again.`}
                        </p>
                        <div className="text-xs font-bold text-gray-500 uppercase">Attempts: {attemptCount} / {maxAttempts}</div>

                        {!hasPassed && attemptCount < maxAttempts && (
                            <button onClick={startQuiz} className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-white px-10 py-3 rounded-xl font-bold transition-all border border-gray-600">Retake {assessmentType}</button>
                        )}

                        {hasPassed && (
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20">
                                Assessment Successfully Completed
                            </div>
                        )}
                    </div>
                )}
            </div>
        );

        const sectionData = quizData[currentSection];
        const sections = ['section_a', 'section_b', 'section_c'].filter(s => quizData[s]?.questions?.length > 0);

        return (
            <div className="max-w-3xl mx-auto px-1">
                {timeLeft !== null && (
                    <div className={`mb-6 text-center py-3 px-6 rounded-xl border font-black text-lg ${timeLeft < 300 ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' : 'bg-gray-800 border-gray-700 text-white'}`}>
                        ⏱️ Time Remaining: {formatTime(timeLeft)}
                    </div>
                )}
                <div className="flex gap-1 md:gap-2 mb-6 md:mb-8 bg-gray-950/50 p-1.5 md:p-2 rounded-xl md:rounded-2xl border border-gray-800">
                    {sections.map(s => (
                        <button
                            key={s}
                            disabled={currentSection === s}
                            onClick={() => setQuizState(prev => ({ ...prev, currentSection: s }))}
                            className={`flex-1 py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${currentSection === s ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}
                        >
                            {s.split('_')[1].toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="space-y-6 md:space-y-8 min-h-[400px]">
                    <div className="space-y-1">
                        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">{sectionData.title}</h3>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">Complete all questions in this section to continue.</p>
                    </div>

                    <div className="space-y-6 md:space-y-10">
                        {sectionData.questions.map((q, idx) => (
                            <div key={q.id} className="bg-gray-800/50 p-5 md:p-6 rounded-2xl border border-gray-700/50 hover:border-gray-600 transition-colors">
                                <h4 className="text-base md:text-lg font-bold text-gray-200 mb-4 md:mb-6 flex gap-3 md:gap-4">
                                    <span className="text-cyan-500 font-mono text-sm md:text-base">{idx + 1}.</span>
                                    {q.question}
                                </h4>

                                <div className="space-y-3">
                                    {q.type === 'mcq' && q.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleQuizAnswer(currentSection, q.id, i)}
                                            className={`w-full text-left p-3 md:p-4 rounded-xl border transition-all flex items-center gap-3 md:gap-4 ${answers[currentSection][q.id] === i ? 'bg-cyan-600/10 border-cyan-500 text-cyan-100 ring-1 ring-cyan-500' : 'bg-gray-900/30 border-gray-700 hover:border-gray-600 text-gray-400'}`}
                                        >
                                            <span className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg font-bold text-xs md:text-sm ${answers[currentSection][q.id] === i ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-500'}`}>{String.fromCharCode(65 + i)}</span>
                                            <span className="font-semibold text-sm md:text-base">{opt}</span>
                                        </button>
                                    ))}

                                    {q.type === 'tf' && (
                                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                                            {[true, false].map((val) => (
                                                <button
                                                    key={val.toString()}
                                                    onClick={() => handleQuizAnswer(currentSection, q.id, val)}
                                                    className={`p-3 md:p-4 rounded-xl border font-bold transition-all text-center text-sm md:text-base ${answers[currentSection][q.id] === val ? 'bg-cyan-600/10 border-cyan-500 text-cyan-100 ring-1 ring-cyan-500' : 'bg-gray-900/30 border-gray-700 hover:border-gray-600 text-gray-400'}`}
                                                >
                                                    {val ? 'TRUE' : 'FALSE'}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === 'short_answer' && (
                                        <textarea
                                            placeholder="Write your answer here..."
                                            className="w-full p-4 md:p-5 rounded-xl bg-gray-950 border border-gray-700 outline-none focus:border-orange-500 text-white min-h-[100px] md:min-h-[120px] transition-all text-sm md:text-base"
                                            value={answers[currentSection][q.id] || ''}
                                            onChange={(e) => handleQuizAnswer(currentSection, q.id, e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mt-10 md:mt-12 pt-6 md:pt-8 border-t border-gray-800 gap-4">
                    <div className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest">
                        Section {sections.indexOf(currentSection) + 1} of {sections.length}
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        {sections.indexOf(currentSection) < sections.length - 1 ? (
                            <button
                                onClick={() => setQuizState(prev => ({ ...prev, currentSection: sections[sections.indexOf(currentSection) + 1] }))}
                                className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-gray-700 transition-all"
                            >
                                Next Section <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={submitQuiz}
                                className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-10 py-3 rounded-xl font-black shadow-lg shadow-emerald-900/20 active:scale-95 transition-all text-center"
                            >
                                Submit Assessment
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-950">
            <div className="flex flex-col items-center gap-4">
                <Loader className="w-10 h-10 text-cyan-500 animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Lab Environment...</p>
            </div>
        </div>
    );

    if (!course) return <div className="text-white p-8">Course not found</div>;

    const Sidebar = ({ mobile = false, onClose = () => { } }) => (
        <div className={`h-full bg-gray-800 border-r border-gray-700 flex flex-col ${mobile ? 'w-full' : 'w-80'}`}>
            <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-lg text-white truncate pr-2" title={course.title}>{course.title}</h2>
                    {mobile && <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"><X size={20} /></button>}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-1 overflow-hidden">
                    <div className="bg-cyan-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-[10px] text-right text-cyan-400 font-bold uppercase">{progress}% Completed</p>
            </div>
            <div className="flex-1 overflow-y-auto">
                {course.modules?.map((module, idx) => (
                    <div key={module.id} className="border-b border-gray-700/50">
                        <div className="p-3 bg-gray-800/50 text-gray-400 font-black text-[10px] uppercase tracking-widest">Module {idx + 1}: {module.title}</div>
                        <div>
                            {module.units?.map(unit => (
                                <button
                                    key={unit.id}
                                    disabled={!isEnrolled}
                                    onClick={() => {
                                        setActiveUnit(unit);
                                        if (mobile) onClose();
                                    }}
                                    className={`w-full text-left p-4 pl-6 text-sm flex items-center justify-between gap-3 hover:bg-gray-700/50 transition-all border-l-4 ${activeUnit?.id === unit.id ? 'bg-cyan-900/20 text-cyan-400 border-cyan-500' : 'text-gray-400 border-transparent'} ${!isEnrolled && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        {unit.type === 'VIDEO' && <VideoIcon size={16} className={activeUnit?.id === unit.id ? 'text-cyan-400' : 'text-gray-500'} />}
                                        {unit.type === 'TEXT' && <FileText size={16} className={activeUnit?.id === unit.id ? 'text-cyan-400' : 'text-gray-500'} />}
                                        {unit.type === 'QUIZ' && <HelpCircle size={16} className={activeUnit?.id === unit.id ? 'text-cyan-400' : 'text-gray-500'} />}
                                        <span className="truncate font-medium">{unit.title}</span>
                                    </div>
                                    {completedUnits.has(unit.id) && <CheckCircle size={16} className="text-emerald-500 shrink-0" />}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            {/* Mobile Header Toggle */}
            <div className="md:hidden bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between z-40">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-3 text-white font-bold text-sm"
                >
                    <Menu size={20} className="text-cyan-400" />
                    <span>Curriculum</span>
                </button>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Progress</span>
                    <span className="text-xs text-cyan-400 font-black">{progress}%</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block">
                    <Sidebar />
                </aside>

                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSidebarOpen(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
                            />
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-gray-800 z-50 md:hidden shadow-2xl"
                            >
                                <Sidebar mobile onClose={() => setIsSidebarOpen(false)} />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <main className="flex-1 bg-gray-900 overflow-y-auto p-4 md:p-8 relative">
                    {!isEnrolled ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6 max-w-lg mx-auto px-4">
                            <div className="p-6 md:p-8 bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700 shadow-2xl w-full">
                                <div className="w-16 h-16 bg-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                                    <Lock size={32} className="text-cyan-400" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{course.price === 0 ? 'Start Learning Now' : 'Unlock Full Access'}</h2>
                                <p className="text-sm md:text-base text-gray-400 mb-6">{course.price === 0 ? 'Join this course for free and start mastering cybersecurity.' : 'Invest in your skills to master cybersecurity.'}</p>
                                <div className="text-3xl md:text-4xl font-black text-white mb-8 bg-gray-950/50 py-4 rounded-2xl border border-gray-700/50">{course.price === 0 ? 'FREE' : `₦${course.price}`}</div>
                                <button onClick={handlePurchase} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-cyan-900/40 transition hover:scale-[1.02] active:scale-95">
                                    {course.price === 0 ? <CheckCircle size={24} /> : <ShoppingCart size={24} />}
                                    {course.price === 0 ? 'Enroll for Free' : 'Secure Checkout'}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        activeUnit ? (
                            <motion.div key={activeUnit.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-cyan-500 font-bold text-[10px] uppercase tracking-widest">
                                        {activeUnit.type} UNIT
                                    </div>
                                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">{activeUnit.title}</h1>
                                </div>

                                {activeUnit.type === 'VIDEO' && (
                                    <div className="space-y-4">
                                        <div className="aspect-video bg-black rounded-2xl md:rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
                                            <iframe
                                                src={(() => {
                                                    const url = activeUnit.content || activeUnit.assetUrl || '';
                                                    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
                                                        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1];
                                                        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
                                                    }
                                                    return url;
                                                })()}
                                                className="w-full h-full"
                                                frameBorder="0"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                {activeUnit.type === 'TEXT' && (
                                    <div className="bg-gray-800/30 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-gray-700/50 shadow-inner">
                                        <div className="prose prose-invert max-w-none">
                                            <p className="whitespace-pre-wrap leading-relaxed text-gray-300 text-base md:text-lg font-medium">{activeUnit.content}</p>
                                        </div>
                                    </div>
                                )}

                                {activeUnit.type === 'QUIZ' && renderQuizContent()}

                                {activeUnit.type !== 'QUIZ' && (
                                    <div className="flex justify-between items-center pt-8 border-t border-gray-800">
                                        <div className="hidden md:block text-gray-500 text-sm font-bold uppercase tracking-widest">End of unit</div>
                                        <button
                                            onClick={handleMarkComplete}
                                            className={`w-full md:w-auto px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 border-2 ${completedUnits.has(activeUnit.id)
                                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 cursor-default'
                                                : 'bg-gray-800 border-gray-700 text-white hover:border-emerald-500/50 hover:bg-gray-700'}`}
                                        >
                                            <CheckCircle size={20} />
                                            {completedUnits.has(activeUnit.id) ? 'Completed' : 'Mark as Complete'}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ) : <div className="text-center text-gray-500 mt-20 font-bold uppercase tracking-widest h-full flex items-center justify-center">Select a unit to begin learning</div>
                    )}
                </main>
            </div>
        </div>
    );
}
