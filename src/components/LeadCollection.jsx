import React from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

const LeadCollection = () => {
    return (
        <section className="py-24 px-6 md:px-12 bg-[#F9F9F9]">
            <div className="max-w-6xl mx-auto">
                <div className="relative overflow-hidden bg-white rounded-[50px] shadow-2xl flex flex-col lg:flex-row items-stretch min-h-[500px]">

                    {/* Left: Content & Form */}
                    <div className="flex-1 p-10 md:p-16 flex flex-col justify-center relative z-10">
                        <div className="mb-10">
                            <span className="text-[#EB3461] text-xs font-black uppercase tracking-[0.3em] mb-4 block">Exclusive Access</span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6 tracking-tighter">
                                Join The <br />
                                <span className="text-[#EB3461]">Elite Fashion</span> Circle
                            </h2>
                            <p className="text-gray-500 text-lg leading-relaxed max-w-md">
                                Sign up to receive early access to new drops, exclusive discounts, and personalized style inspiration.
                            </p>
                        </div>

                        <form className="space-y-4 max-w-md" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-pink-100 outline-none transition-all font-medium"
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-pink-100 outline-none transition-all font-medium"
                                />
                            </div>
                            <button className="w-full bg-[#EB3461] text-white rounded-2xl py-5 px-8 flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-pink-100 hover:-translate-y-1 active:translate-y-0">
                                Get Early Access
                                <Send size={16} />
                            </button>
                        </form>

                        <div className="mt-8 flex items-center gap-6 opacity-60">
                            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                <CheckCircle size={14} className="text-green-500" />
                                No Spam
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                <CheckCircle size={14} className="text-green-500" />
                                Secure Data
                            </div>
                        </div>
                    </div>

                    {/* Right: Premium Visual */}
                    <div className="flex-1 relative min-h-[300px] lg:min-h-full">
                        <img
                            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200"
                            alt="Lead Visual"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent lg:hidden" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            whileInView={{ scale: 1, rotate: 10 }}
                            className="absolute top-10 right-10 bg-white p-6 rounded-3xl shadow-2xl z-20 text-center"
                        >
                            <span className="block text-4xl font-black text-gray-900 leading-none mb-1">2k+</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Members</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeadCollection;
