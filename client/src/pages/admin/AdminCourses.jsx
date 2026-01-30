import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure? This will permanently delete the course and all associated data.')) {
            try {
                await api.delete(`/courses/${id}`);
                setCourses(courses.filter(c => c.id !== id));
                toast.success('Course deleted successfully');
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete course');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Course Management</h2>
                <Link to="/admin/courses/new" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded flex items-center gap-2 transition">
                    <Plus size={18} />
                    New Course
                </Link>
            </div>

            {loading ? <p className="text-gray-400">Loading courses...</p> : (
                <div className="grid grid-cols-1 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-3xl border border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-cyan-500/50 transition-all shadow-xl group hover:bg-gray-800/80">
                            <div className="space-y-3 flex-1 w-full">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{course.title}</h3>
                                    <span className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${course.isPublished ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'}`}>
                                        {course.isPublished ? 'Live' : 'Draft'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                        <Plus size={12} className="text-cyan-400" />
                                        {course.level}
                                    </span>
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                        <Plus size={12} className="text-purple-400" />
                                        ₦{course.price}
                                    </span>
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                        <Plus size={12} className="text-gray-400" />
                                        ID: {course.id.slice(0, 8)}...
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 border-gray-700/50 pt-4 sm:pt-0 justify-end">
                                <button
                                    onClick={async () => {
                                        try {
                                            await api.put(`/courses/${course.id}`, { isPublished: !course.isPublished });
                                            setCourses(courses.map(c => c.id === course.id ? { ...c, isPublished: !c.isPublished } : c));
                                            toast.success(course.isPublished ? 'Unpublished' : 'Published');
                                        } catch (_e) { toast.error('Update failed'); }
                                    }}
                                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all border ${course.isPublished
                                        ? 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-orange-500/50 hover:text-orange-400'
                                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                                        }`}
                                >
                                    {course.isPublished ? 'Unpublish' : 'Go Live'}
                                </button>
                                <div className="flex items-center gap-1 ml-auto sm:ml-0 bg-gray-900/50 p-1 rounded-xl border border-gray-700/50">
                                    <Link to={`/student/course/${course.id}`} target="_blank" className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all" title="Preview">
                                        <Eye size={18} />
                                    </Link>
                                    <Link to={`/admin/courses/${course.id}`} className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all" title="Edit">
                                        <Edit size={18} />
                                    </Link>
                                    <button onClick={() => handleDelete(course.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && (
                        <div className="text-center py-20 bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-700/50">
                            <Plus size={48} className="mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest">No courses found</p>
                            <Link to="/admin/courses/new" className="text-cyan-400 text-xs font-black mt-2 inline-block hover:underline">Create your first course</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
