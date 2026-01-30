import { useEffect, useState } from 'react';
import api from '../../services/api';
import { User, BookOpen, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await api.get('/api/admin/students');
                setStudents(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Student Management</h1>

            {loading ? <p className="text-gray-400">Loading student data...</p> : (
                <div className="grid grid-cols-1 gap-6">
                    {students.map(student => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 border border-cyan-800 overflow-hidden shrink-0">
                                        {student.avatar ? (
                                            <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={32} />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold text-white">{student.name || 'Unnamed User'}</h3>
                                            {student.title && (
                                                <span className="text-xs px-2 py-0.5 bg-cyan-900/30 text-cyan-400 border border-cyan-800 rounded-full font-medium">
                                                    {student.title}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-sm">{student.email}</p>
                                        <p className="text-xs text-gray-500 mt-1">Joined: {new Date(student.joinedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {student.bio && (
                                <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                    <p className="text-gray-400 text-sm italic leading-relaxed">
                                        "{student.bio}"
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                    <BookOpen size={16} /> Enrolled Courses
                                </h4>
                                {student.courses.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {student.courses.map(course => (
                                            <div key={course.id} className="bg-gray-700/30 p-4 rounded border border-gray-600/50">
                                                <div className="flex justify-between items-center mb-2 gap-4">
                                                    <span className="font-bold text-gray-200 truncate flex-1" title={course.title}>{course.title}</span>
                                                    <span className={`text-xs px-2 py-1 rounded border shrink-0 ${course.status === 'Completed' ? 'bg-green-900/30 text-green-400 border-green-800' :
                                                        course.status === 'In Progress' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                                                            'bg-gray-700 text-gray-400 border-gray-600'
                                                        }`}>
                                                        {course.status}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                                    <div className="bg-cyan-500 h-2 rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }}></div>
                                                </div>
                                                <div className="text-right text-xs text-cyan-400 mt-1">{course.progress}%</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No enrollments yet.</p>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {students.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No students found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
