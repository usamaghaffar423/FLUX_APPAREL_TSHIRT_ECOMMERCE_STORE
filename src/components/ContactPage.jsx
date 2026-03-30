import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ChevronRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const INFO_ITEMS = [
    {
        icon: Mail,
        title: 'Email Us',
        detail: 'info@classyfitters.com',
        sub: 'We reply within 24 hours',
        href: 'mailto:info@classyfitters.com',
    },
    {
        icon: Phone,
        title: 'Call Us',
        detail: '+92 345 6789100',
        sub: 'Mon–Sat, 9 AM – 6 PM PKT',
        href: 'tel:+923456789100',
    },
    {
        icon: MapPin,
        title: 'Visit Us',
        detail: 'Batkhela, Malakand',
        sub: 'Khyber Pakhtunkhwa, Pakistan',
        href: '#',
    },
];

const ContactPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production this would POST to your PHP endpoint
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Hero ─────────────────────────────────────────── */}
            <section className="relative bg-white pt-16 pb-20 px-6 md:px-12 overflow-hidden border-b border-gray-100">
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
                    <div className="absolute inset-0 bg-[#EB3461] rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Breadcrumb */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8"
                    >
                        <Link to="/" className="hover:text-[#EB3461] transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span className="text-[#EB3461]">Contact</span>
                    </motion.div>

                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#EB3461] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block"
                    >
                        Get In Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter mb-6 uppercase"
                    >
                        Let's Talk About <br />
                        <span className="text-[#EB3461]">Your Style</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-gray-500 text-lg max-w-2xl font-medium leading-relaxed"
                    >
                        Have questions about our collections or need help with an order? Our team
                        is here to give you the ultimate fashion experience.
                    </motion.p>
                </div>
            </section>

            {/* ── Info Cards ────────────────────────────────────── */}
            <section className="py-16 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {INFO_ITEMS.map((item, i) => (
                        <motion.a
                            key={i}
                            href={item.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/60 p-8 flex items-start gap-5 hover:border-[#EB3461]/30 hover:shadow-pink-100/40 transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center shrink-0 group-hover:bg-[#EB3461] transition-colors">
                                <item.icon size={22} className="text-[#EB3461] group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.title}</p>
                                <p className="font-black text-gray-900 text-base">{item.detail}</p>
                                <p className="text-xs font-medium text-gray-400 mt-0.5">{item.sub}</p>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* ── Main Content: Form + Map ────────────────────── */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-100/60 p-8 md:p-12"
                    >
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 12 }}
                                >
                                    <CheckCircle size={64} className="text-[#EB3461] mb-6" />
                                </motion.div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-3">Message Sent!</h3>
                                <p className="text-gray-400 font-medium max-w-xs">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                                <button
                                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                                    className="mt-8 text-[10px] font-black uppercase tracking-widest text-[#EB3461] hover:underline"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Send a Message</h2>
                                <p className="text-gray-400 text-sm font-medium mb-8">Fill in the form below and we'll respond shortly.</p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                                            <input
                                                name="name" type="text" value={form.name} onChange={handleChange}
                                                placeholder="John Doe" required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#EB3461] focus:bg-white transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                                            <input
                                                name="email" type="email" value={form.email} onChange={handleChange}
                                                placeholder="john@example.com" required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#EB3461] focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                                        <input
                                            name="phone" type="tel" value={form.phone} onChange={handleChange}
                                            placeholder="+92 345 6789100"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#EB3461] focus:bg-white transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Message</label>
                                        <textarea
                                            name="message" rows="5" value={form.message} onChange={handleChange}
                                            placeholder="How can we help you today?" required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#EB3461] focus:bg-white transition-all resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#EB3461] hover:bg-black text-white rounded-2xl py-5 flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-pink-100 hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        Send Message
                                        <Send size={15} />
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>

                    {/* Map + FAQ side */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-8"
                    >
                        {/* Google Map embed */}
                        <div className="rounded-[40px] overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/60 h-72 lg:h-auto flex-1 min-h-[280px]">
                            <iframe
                                title="classyfitters Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13064.98407698014!2d71.97558!3d34.62117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38de6e8abf00c0ab%3A0x5d2b0ee1bdac53d0!2sBatkhela%2C%20Malakand%2C%20Khyber%20Pakhtunkhwa!5e0!3m2!1sen!2spk!4v1700000000000"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '280px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        {/* Quick FAQs */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/60 p-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-5">Quick FAQs</h3>
                            {[
                                { q: 'What are your delivery times?', a: '3–5 working days within Pakistan.' },
                                { q: 'Do you accept returns?', a: '7-day hassle-free return policy on all products.' },
                                { q: 'How can I track my order?', a: 'You\'ll receive a tracking link via email after dispatch.' },
                            ].map((faq, i) => (
                                <div key={i} className={`py-4 ${i !== 2 ? 'border-b border-gray-50' : ''}`}>
                                    <p className="text-xs font-black text-gray-900 uppercase tracking-wide mb-1">{faq.q}</p>
                                    <p className="text-sm text-gray-400 font-medium">{faq.a}</p>
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
