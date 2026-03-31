import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ChevronRight, Clock, MessageCircle } from 'lucide-react';
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

                    {/* ── Map + Hours ──────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                        {/* Map — takes 2/3 width on desktop */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                            className="lg:col-span-2 rounded-[32px] overflow-hidden border border-gray-100 shadow-xl min-h-[420px]"
                        >
                            <iframe
                                title="Classyfitters – Main GT Road Amandara"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.0!2d72.0503!3d34.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38de6c3e4f9db491%3A0x5a2e2e0f3c8c2b6a!2sAmandara%2C+Khyber+Pakhtunkhwa%2C+Pakistan!5e0!3m2!1sen!2spk!4v1700000000000"
                                width="100%" height="100%"
                                style={{ border: 0, minHeight: '420px' }}
                                allowFullScreen="" loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </motion.div>

                        {/* Business Hours — takes 1/3 width */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
                            className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-11 h-11 rounded-xl bg-pink-50 flex items-center justify-center">
                                        <Clock size={20} className="text-[#EB3461]" />
                                    </div>
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900">Business Hours</h3>
                                </div>
                                {[
                                    { day: 'Monday – Friday', time: '9:00 AM – 9:00 PM' },
                                    { day: 'Saturday',        time: '10:00 AM – 8:00 PM' },
                                    { day: 'Sunday',          time: '11:00 AM – 6:00 PM' },
                                ].map((row, i) => (
                                    <div key={i} className={`flex justify-between items-center py-4 ${i < 2 ? 'border-b border-gray-50' : ''}`}>
                                        <span className="text-sm font-bold text-gray-500">{row.day}</span>
                                        <span className="text-sm font-black text-gray-900">{row.time}</span>
                                    </div>
                                ))}
                            </div>

                            <a
                                href="https://wa.me/923481099433"
                                target="_blank" rel="noreferrer"
                                className="mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 active:scale-95"
                                style={{ backgroundColor: '#25D366' }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                                WhatsApp Karo
                            </a>
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
