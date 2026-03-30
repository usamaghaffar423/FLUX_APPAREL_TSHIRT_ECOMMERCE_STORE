import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await register(username, email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 font-['Outfit']">
            {/* Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-pink-50/50 blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-pink-50/30 blur-3xl animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-lg"
            >
                {/* Back Link */}
                <Link to="/login" className="inline-flex items-center space-x-2 text-gray-400 hover:text-[#EB3461] transition-colors mb-8 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Sign In</span>
                </Link>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50 p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#EB3461]/5 rounded-bl-[100px] -mr-16 -mt-16" />

                    <div className="text-center mb-12 relative">
                        <div className="w-20 h-20 bg-[#EB3461]/10 rounded-[32px] flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                            <UserPlus size={36} className="text-[#EB3461]" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Join <span className="text-[#EB3461]">Classi</span>
                        </h1>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">
                            Create Your Identity
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Username</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#EB3461] transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                    placeholder="yourname"
                                    className="w-full pl-14 pr-6 py-5 rounded-[24px] border border-gray-100 bg-gray-50/50 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#EB3461] focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#EB3461] transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    placeholder="hello@example.com"
                                    className="w-full pl-14 pr-6 py-5 rounded-[24px] border border-gray-100 bg-gray-50/50 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#EB3461] focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Password</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#EB3461] transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-14 py-5 rounded-[24px] border border-gray-100 bg-gray-50/50 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#EB3461] focus:bg-white transition-all shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#EB3461] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[11px] font-bold text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#EB3461] text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-xl shadow-pink-100 hover:shadow-gray-200 disabled:opacity-50"
                        >
                            {loading ? "Creating Account..." : "Register Now"}
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Already have an account? <Link to="/login" className="text-[#EB3461] hover:underline">Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
