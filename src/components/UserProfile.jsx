import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, LogOut, Package, Settings, ArrowRight, Clock, Truck, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const STATUS_STYLES = {
    Pending:    { bg: 'bg-yellow-50',  text: 'text-yellow-600',  border: 'border-yellow-200', icon: Clock },
    Processing: { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',   icon: RefreshCw },
    Shipped:    { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200', icon: Truck },
    Delivered:  { bg: 'bg-green-50',   text: 'text-green-600',   border: 'border-green-200',  icon: CheckCircle },
    Cancelled:  { bg: 'bg-red-50',     text: 'text-red-500',     border: 'border-red-200',    icon: XCircle },
};

const UserProfile = () => {
    const { user, logout, isAdmin, authFetch } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchOrders = async () => {
            try {
                const response = await authFetch(`${API_BASE_URL}/get_user_orders.php?username=${encodeURIComponent(user.username)}`);
                const data = await response.json();
                if (data.success) {
                    setOrders(data.orders);
                }
            } catch (err) {
                console.error("Failed to fetch user orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (!user) {
        navigate('/login');
        return null;
    }

    const stats = [
        { label: 'Total Orders', value: orders.length.toString(), icon: Package, color: 'blue' },
        { label: 'Account Type', value: user.role.toUpperCase(), icon: Shield, color: 'purple' },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-['Outfit']">
            {/* Header / Profile Info */}
            <div className="bg-white border-b border-gray-100 pt-32 pb-16 px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-32 h-32 rounded-[48px] bg-[#EB3461]/10 flex items-center justify-center relative group"
                    >
                        <User size={48} className="text-[#EB3461]" />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center border-4 border-white">
                            <Settings size={16} />
                        </div>
                    </motion.div>

                    <div className="flex-1 text-center md:text-left">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2"
                        >
                            {user.username}
                        </motion.h1>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center justify-center md:justify-start space-x-2 text-gray-400 font-bold text-sm tracking-wide"
                        >
                            <Mail size={16} />
                            <span>{user.email}</span>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start"
                        >
                            {isAdmin && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="bg-black text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#EB3461] transition-all"
                                >
                                    Admin Dashboard
                                </button>
                            )}
                            <button
                                onClick={logout}
                                className="border border-gray-200 text-gray-900 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#EB3461] hover:text-[#EB3461] transition-all flex items-center space-x-2"
                            >
                                <LogOut size={14} />
                                <span>Logout</span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="max-w-4xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm"
                        >
                            <div className={`w-12 h-12 bg-[#EB3461]/5 rounded-2xl flex items-center justify-center mb-4`}>
                                <stat.icon size={24} className="text-[#EB3461]" />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Orders Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm md:col-span-2"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Recent Orders</h3>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 border-4 border-gray-100 border-t-[#EB3461] rounded-full animate-spin"></div>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                                    <div>
                                        <p className="font-black text-gray-900 text-sm uppercase">Order #{order.id}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-[#EB3461]">Rs. {Number(order.total).toLocaleString()}</p>
                                        {(() => {
                                            const s = order.status || 'Pending';
                                            const style = STATUS_STYLES[s] || STATUS_STYLES.Pending;
                                            const Icon = style.icon;
                                            return (
                                                <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border ${style.bg} ${style.border}`}>
                                                    <Icon size={10} className={style.text} />
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${style.text}`}>{s}</span>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
                            <Package size={48} className="text-gray-200 mb-4" />
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">No order history found</p>
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/shop')}
                        className="w-full mt-8 bg-black text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#EB3461] transition-all flex items-center justify-center space-x-3 group"
                    >
                        <span>Start Shopping</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfile;
