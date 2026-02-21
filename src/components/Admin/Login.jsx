import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Droplets, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Redirect only if logged in AND has admin role
    React.useEffect(() => {
        if (!authLoading && user && isAdmin) {
            navigate('/admin');
        }
    }, [user, isAdmin, authLoading, navigate]);

    if (authLoading) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-600">Loading...</div>;
    }

    // Logged in but no admin role (e.g. users table missing or user not in it)
    const noAdminAccess = user && !isAdmin;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/admin');
        } catch (err) {
            console.error('Appwrite login error:', err);
            // If session already exists, just navigate
            if (err.message?.includes('prohibited when a session is active')) {
                navigate('/admin');
            } else {
                setError(err.message || 'Invalid email or password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 sm:mb-6 shadow-lg shadow-blue-500/20">
                        <Droplets className="text-white" size={28} />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-semibold text-gray-900 mb-2">Manager Access</h1>
                    <p className="text-sm sm:text-base text-gray-600">Please sign in to manage the shop</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all touch-target text-base"
                                    placeholder="manager@example.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all touch-target text-base"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        {noAdminAccess && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-800 text-sm">
                                <AlertCircle size={18} />
                                You're logged in but don't have manager access. Add your user to the &quot;users&quot; table in Appwrite with role=&quot;admin&quot; and your Auth User ID as the document ID.
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
