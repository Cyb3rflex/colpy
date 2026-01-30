import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { User, Save } from 'lucide-react';

export default function StudentProfile() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
        title: user?.title || '',
        bio: user?.bio || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/api/users/profile', formData);
            toast.success('Profile updated successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <User size={32} className="text-cyan-400" />
                Student Profile
            </h1>

            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-lg space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Full Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 outline-none focus:border-cyan-500 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Email (Read Only)</label>
                        <input
                            name="email"
                            value={formData.email}
                            disabled
                            className="w-full p-3 rounded bg-gray-700/50 border border-gray-600 text-gray-400 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Professional Title / Goal</label>
                        <input
                            name="title"
                            placeholder="e.g. Aspiring Pentester"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 outline-none focus:border-cyan-500 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Avatar URL</label>
                        <input
                            name="avatar"
                            placeholder="https://..."
                            value={formData.avatar}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-700 border border-gray-600 outline-none focus:border-cyan-500 text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Bio</label>
                    <textarea
                        name="bio"
                        rows="4"
                        placeholder="Tell us about your learning journey..."
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-700 border border-gray-600 outline-none focus:border-cyan-500 text-white"
                    />
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-700">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded font-bold transition shadow-lg shadow-cyan-500/20"
                    >
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
