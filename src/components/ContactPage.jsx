import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ChevronRight, CheckCircle, Clock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONTACT_INFO = [
    {
        icon: Phone,
        label: 'Call / WhatsApp',
        primary: '+92 348 1099433',
        secondary: 'Mon – Sat · 9 AM to 9 PM PKT',
        href: 'tel:+923481099433',
        bg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-100 group-hover:bg-emerald-500',
    },
    {
        icon: Mail,
        label: 'Email Us',
        primary: 'support@classyfitters.shop',
        secondary: 'We reply within 24 hours',
        href: 'mailto:support@classyfitters.shop',
        bg: 'bg-pink-50',
        iconColor: 'text-[#EB3461]',
        iconBg: 'bg-pink-100 group-hover:bg-[#EB3461]',
    },
    {
        icon: MapPin,
        label: 'Visit Our Shop',
        primary: 'Main GT Road Amandara',
        secondary: 'Near Popular CNG, KPK, Pakistan',
        href: 'https://maps.google.com/?q=Amandara+GT+Road+KPK+Pakistan',
        bg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100 group-hover:bg-blue-500',
    },
    {
        icon: MessageCircle,
        label: 'WhatsApp Chat',
        primary: 'Chat With Us Directly',
        secondary: 'Quick replies on WhatsApp',
        href: 'https://wa.me/923481099433',
        bg: 'bg-green-50',
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100 group-hover:bg-green-500',
    },
];

const FAQS = [
    { q: 'KPK mein delivery kitne din mein hoti hai?', a: 'Amandara, Peshawar, Mardan, Mingora — 2 se 3 working days mein delivery.' },
    { q: 'Returns ka kya policy hai?', a: '7-din hassle-free return — product original condition mein hona chahiye.' },
    { q: 'Cash on Delivery available hai?', a: 'Haan! Poore Pakistan mein COD available hai.' },
    { q: 'Order track karna ho to?', a: 'My Orders section mein jao ya WhatsApp par order ID bhejo.' },
];

const ContactPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Hero Banner ──────────────────────────────────── */}
            <section className="relative bg-white border-b border-gray-100 overflow-hidden pt-16 pb-20 px-6 md:px-12">
                {/* Pink glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#EB3461] opacity-5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EB3461] opacity-5 rounded-full blur-[80px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8"
                    >
                        <Link to="/" className="hover:text-[#EB3461] transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span className="text-[#EB3461]">Contact</span>
                    </motion.div>

                    <motion.span
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-[#EB3461] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block"
                    >
                        Hum Se Baat Karo
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                        className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter mb-6 uppercase"
                    >
                        Apna Style<br />
                        <span className="text-[#EB3461]">Hum Dhundh Dete Hain</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        className="text-gray-500 text-lg max-w-2xl font-medium leading-relaxed"
                    >
                        Order, returns, ya koi bhi sawaal — humari team hamesha ready hai. WhatsApp, call, ya email — jahan comfortable ho.
                    </motion.p>
                </div>
            </section>

            {/* ── Contact Info Cards ────────────────────────────── */}
            <section className="py-16 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {CONTACT_INFO.map((item, i) => (
                            <motion.a
                                key={i}
                                href={item.href}
                                target={item.href.startsWith('http') ? '_blank' : undefined}
                                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className={`group ${item.bg} rounded-[28px] p-7 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${item.iconBg}`}>
                                    <item.icon size={24} className={`${item.iconColor} group-hover:text-white transition-colors duration-300`} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                                    <p className="font-black text-gray-900 text-[15px] leading-snug">{item.primary}</p>
                                    <p className="text-xs text-gray-500 font-medium mt-1">{item.secondary}</p>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    {/* ── Form + Map ───────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
                            className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-100/60 p-8 md:p-12"
                        >
                            {submitted ? (
                                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                                        <CheckCircle size={64} className="text-[#EB3461] mb-6" />
                                    </motion.div>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-3">Message Bhej Diya!</h3>
                                    <p className="text-gray-400 font-medium max-w-xs">Shukriya! Hum 24 ghante mein reply karenge.</p>
                                    <button
                                        onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                                        className="mt-8 text-[10px] font-black uppercase tracking-widest text-[#EB3461] hover:underline"
                                    >
                                        Dobara Message Bhejo
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-1">Message Bhejo</h2>
                                    <p className="text-gray-400 text-sm font-medium mb-8">Form bhar do — hum jald reply karenge.</p>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Apna Naam</label>
                                                <input name="name" type="text" value={form.name} onChange={handleChange}
                                                    placeholder="Ali Khan" required
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#EB3461] focus:bg-white transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                                                <input name="email" type="email" value={form.email} onChange={handleChange}
                                                    placeholder="ali@example.com" required
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#EB3461] focus:bg-white transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone / WhatsApp</label>
                                            <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                                                placeholder="+92 348 1099433"
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#EB3461] focus:bg-white transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Apna Sawaal</label>
                                            <textarea name="message" rows="5" value={form.message} onChange={handleChange}
                                                placeholder="Kya poochna chahte ho?" required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#EB3461] focus:bg-white transition-all resize-none"
                                            />
                                        </div>
                                        <button type="submit"
                                            className="w-full bg-[#EB3461] hover:bg-black text-white rounded-2xl py-5 flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-pink-100 hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            Message Bhejo <Send size={15} />
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>

                        {/* Map + Hours */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
                            className="flex flex-col gap-6"
                        >
                            {/* Map embed */}
                            <div className="rounded-[32px] overflow-hidden border border-gray-100 shadow-xl flex-1 min-h-[300px]">
                                <iframe
                                    title="Classyfitters – Main GT Road Amandara"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.0!2d72.0503!3d34.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38de6c3e4f9db491%3A0x5a2e2e0f3c8c2b6a!2sAmandara%2C+Khyber+Pakhtunkhwa%2C+Pakistan!5e0!3m2!1sen!2spk!4v1700000000000"
                                    width="100%" height="100%"
                                    style={{ border: 0, minHeight: '300px' }}
                                    allowFullScreen="" loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>

                            {/* Business Hours */}
                            <div className="bg-white rounded-[28px] border border-gray-100 shadow-xl p-7">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                                        <Clock size={18} className="text-[#EB3461]" />
                                    </div>
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900">Business Hours</h3>
                                </div>
                                {[
                                    { day: 'Monday – Friday', time: '9:00 AM – 9:00 PM' },
                                    { day: 'Saturday',        time: '10:00 AM – 8:00 PM' },
                                    { day: 'Sunday',          time: '11:00 AM – 6:00 PM' },
                                ].map((row, i) => (
                                    <div key={i} className={`flex justify-between items-center py-3 ${i < 2 ? 'border-b border-gray-50' : ''}`}>
                                        <span className="text-sm font-bold text-gray-600">{row.day}</span>
                                        <span className="text-sm font-black text-gray-900">{row.time}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* ── FAQ Section ──────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="bg-white rounded-[40px] border border-gray-100 shadow-xl p-8 md:p-12"
                    >
                        <div className="text-center mb-10">
                            <span className="text-[#EB3461] text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">FAQ</span>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter">
                                Aksar Pooche Gaye <span className="text-[#EB3461]">Sawaal</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {FAQS.map((faq, i) => (
                                <div key={i} className="bg-gray-50 rounded-2xl p-6">
                                    <p className="text-sm font-black text-gray-900 mb-2">{faq.q}</p>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </section>
        </div>
    );
};

export default ContactPage;
