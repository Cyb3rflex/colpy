import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, Loader, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link.');
                return;
            }

            try {
                const { data } = await api.get(`/auth/verify/${token}`);
                setStatus('success');
                setMessage(data.message);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-2xl text-center"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-cyan-900/30 rounded-full border border-cyan-500/30">
                        <Shield className="text-cyan-400" size={32} />
                    </div>
                </div>

                {status === 'loading' && (
                    <div className="space-y-4">
                        <Loader className="animate-spin mx-auto text-cyan-400" size={48} />
                        <h2 className="text-2xl font-bold text-white">Verifying your account...</h2>
                        <p className="text-gray-400">Please wait while we secure your access.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <CheckCircle className="mx-auto text-green-500" size={64} />
                        <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
                        <p className="text-gray-400">{message}</p>
                        <div className="pt-6">
                            <Link to="/login" className="inline-block w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg shadow-cyan-900/20">
                                Proceed to Login
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <XCircle className="mx-auto text-red-500" size={64} />
                        <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
                        <p className="text-gray-400">{message}</p>
                        <div className="pt-6 space-y-3">
                            <Link to="/register" className="inline-block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition duration-200">
                                Try Registering Again
                            </Link>
                            <Link to="/login" className="block text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
