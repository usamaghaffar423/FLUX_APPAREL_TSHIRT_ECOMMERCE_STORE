import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, Package, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Shared input component ────────────────────────────────────────────────────
const Field = ({ icon: Icon, type, value, onChange, placeholder, label, required, action }) => (
    <div className="space-y-1.5">
        <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{label}</label>
        <div className="relative group">
            <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#EB3461] transition-colors pointer-events-none" />
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full pl-11 pr-12 py-4 rounded-2xl border-2 border-gray-100 bg-white text-sm font-semibold text-gray-900 placeholder:text-gray-300 outline-none focus:border-[#EB3461] transition-all"
            />
            {action && (
                <button type="button" onClick={action.fn}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#EB3461] transition-colors">
                    {action.icon}
                </button>
            )}
        </div>
    </div>
);

// ── Login Form ────────────────────────────────────────────────────────────────
const LoginForm = ({ onSwitch }) => {
    const { login } = useAuth();
    const [username, setUsername]     = useState('');
    const [password, setPassword]     = useState('');
    const [showPass, setShowPass]     = useState(false);
    const [error, setError]           = useState('');
    const [loading, setLoading]       = useState(false);
    const [shake, setShake]           = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(username, password);
        if (result.success) {
            window.location.href = result.role === 'admin' ? '/admin' : '/';
        } else {
            setLoading(false);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setError(result.error || 'Invalid username or password.');
        }
    };

    return (
        <motion.div animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field icon={User} type="text" value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="Username or email" label="Username" required />
                <Field icon={Lock} type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" label="Password" required
                    action={{ fn: () => setShowPass(!showPass), icon: showPass ? <EyeOff size={17} /> : <Eye size={17} /> }} />

                <AnimatePresence>
                    {error && (
                        <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl">
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                <button type="submit" disabled={loading}
                    className="w-full bg-[#EB3461] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#d42d57] active:scale-[0.98] transition-all shadow-lg shadow-pink-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                    {loading
                        ? <><div className="w-4 h-4 border-2 border-pink-200 border-t-white rounded-full animate-spin" /> Signing in…</>
                        : <><span>Sign In</span><ChevronRight size={16} /></>
                    }
                </button>
            </form>

            <p className="text-center text-[11px] text-gray-400 font-semibold mt-6">
                New here?{' '}
                <button onClick={onSwitch} className="text-[#EB3461] font-black hover:underline">Create account</button>
            </p>

            {/* Admin hint */}
            <div className="mt-6 border border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={14} className="text-[#EB3461]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Admin Access</span>
                </div>
                <p className="text-[11px] text-gray-500 font-semibold">
                    Username: <span className="font-black text-gray-700">admin</span>
                    &nbsp;&nbsp;·&nbsp;&nbsp;
                    Password: <span className="font-black text-gray-700">admin123</span>
                </p>
            </div>
        </motion.div>
    );
};

// ── Register Form ─────────────────────────────────────────────────────────────
const RegisterForm = ({ onSwitch }) => {
    const { register } = useAuth();
    const [username, setUsername]     = useState('');
    const [email, setEmail]           = useState('');
    const [password, setPassword]     = useState('');
    const [confirm, setConfirm]       = useState('');
    const [showPass, setShowPass]     = useState(false);
    const [error, setError]           = useState('');
    const [success, setSuccess]       = useState(false);
    const [loading, setLoading]       = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) { setError('Passwords do not match.'); return; }
        if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
        setLoading(true);
        setError('');
        const result = await register(username, email, password);
        if (result.success) {
            setSuccess(true);
            setTimeout(() => { window.location.href = '/'; }, 1500);
        } else {
            setLoading(false);
            setError(result.error || 'Registration failed. Please try again.');
        }
    };

    if (success) return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Account Created!</h3>
            <p className="text-gray-400 text-sm mt-2">Redirecting you to the store…</p>
        </motion.div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Field icon={User} type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Choose a username" label="Username" required />
            <Field icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" label="Email Address" required />
            <Field icon={Lock} type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters" label="Password" required
                action={{ fn: () => setShowPass(!showPass), icon: showPass ? <EyeOff size={17} /> : <Eye size={17} /> }} />
            <Field icon={Lock} type={showPass ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat your password" label="Confirm Password" required />

            <AnimatePresence>
                {error && (
                    <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl">
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>

            <button type="submit" disabled={loading}
                className="w-full bg-[#EB3461] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#d42d57] active:scale-[0.98] transition-all shadow-lg shadow-pink-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                {loading
                    ? <><div className="w-4 h-4 border-2 border-pink-200 border-t-white rounded-full animate-spin" /> Creating Account…</>
                    : <><span>Create Account</span><ChevronRight size={16} /></>
                }
            </button>

            <p className="text-center text-[11px] text-gray-400 font-semibold mt-4">
                Already have an account?{' '}
                <button type="button" onClick={onSwitch} className="text-[#EB3461] font-black hover:underline">Sign in</button>
            </p>
        </form>
    );
};

// ── Main Auth Page ────────────────────────────────────────────────────────────
const AuthPage = ({ defaultTab = 'login' }) => {
    const [tab, setTab] = useState(defaultTab);

    const switchToLogin    = () => setTab('login');
    const switchToRegister = () => setTab('register');

    const features = [
        { icon: Package,    text: 'Over 100 premium products' },
        { icon: Truck,      text: 'Fast delivery across Pakistan' },
        { icon: RotateCcw,  text: 'Easy 7-day returns' },
        { icon: Sparkles,   text: 'New arrivals every week' },
    ];

    return (
        <div className="min-h-screen flex font-['Outfit']">

            {/* ── Left Brand Panel ── */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="hidden lg:flex lg:w-[45%] bg-[#EB3461] flex-col justify-between p-12 relative overflow-hidden"
            >
                {/* Background decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
                    <div className="absolute top-1/3 -left-16 w-64 h-64 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 -right-8 w-96 h-96 rounded-full bg-white/5" />
                    <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full bg-white/5" />
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tight leading-none">
                        Classy<span className="opacity-70">fitters</span>
                    </h1>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-[0.3em] mt-2">Pakistan's Fashion Store</p>
                </div>

                {/* Center content */}
                <div className="relative z-10">
                    <h2 className="text-5xl font-black text-white leading-tight mb-6">
                        Style That<br />
                        <span className="opacity-70">Speaks For</span><br />
                        Itself.
                    </h2>
                    <div className="space-y-4">
                        {features.map(({ icon: Icon, text }, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Icon size={16} className="text-white" />
                                </div>
                                <span className="text-white/80 text-sm font-semibold">{text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom tagline */}
                <div className="relative z-10">
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">© 2026 Classyfitters</p>
                </div>
            </motion.div>

            {/* ── Right Form Panel ── */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gray-50"
            >
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                            Classy<span className="text-[#EB3461]">fitters</span>
                        </h1>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Pakistan's Fashion Store</p>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 overflow-hidden">

                        {/* Tab switcher */}
                        <div className="flex bg-gray-50 border-b border-gray-100">
                            {[['login', 'Sign In'], ['register', 'Register']].map(([key, label]) => (
                                <button key={key} onClick={() => setTab(key)}
                                    className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                                        tab === key ? 'text-gray-900 bg-white' : 'text-gray-400 hover:text-gray-600'
                                    }`}>
                                    {label}
                                    {tab === key && (
                                        <motion.div layoutId="tab-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EB3461]"
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Form area */}
                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {tab === 'login' ? (
                                    <motion.div key="login"
                                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Welcome Back</h2>
                                            <p className="text-gray-400 text-sm font-medium mt-1">Sign in to your account to continue</p>
                                        </div>
                                        <LoginForm onSwitch={switchToRegister} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="register"
                                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Create Account</h2>
                                            <p className="text-gray-400 text-sm font-medium mt-1">Join Classyfitters today — it's free</p>
                                        </div>
                                        <RegisterForm onSwitch={switchToLogin} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-6">
                        Your data is safe & secure with us
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
