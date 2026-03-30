import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';

// ── Marquee text strip ────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
    'CLASSYFITTERS',  '✦',  'KPK KA STYLE',  '✦',
    'PESHAWAR SWAG',  '✦',  'APNI GAME UP KAR',  '✦',
    'NEW ARRIVALS',   '✦',  'DESI DRIP',     '✦',
    'FRESH FITS ONLY','✦',  'MARDAN TO MINGORA', '✦',
];

const Marquee = ({ reverse = false }) => {
    const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
    return (
        <div className="overflow-hidden whitespace-nowrap py-3">
            <motion.div
                className="inline-flex gap-8"
                animate={{ x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
                transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
            >
                {items.map((item, i) => (
                    <span key={i} className={`text-[11px] font-black uppercase tracking-[0.3em] ${
                        item === '✦' ? 'text-[#EB3461]' : 'text-white/60'
                    }`}>
                        {item}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

// ── Floating word pill ────────────────────────────────────────────────────────
const Pill = ({ children, className = '', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        className={`absolute backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/80 ${className}`}
    >
        {children}
    </motion.div>
);

// ── Main Banner ───────────────────────────────────────────────────────────────
const LeadCollection = () => {
    const navigate = useNavigate();
    const ref      = useRef(null);

    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const bgY   = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

    return (
        <section ref={ref} className="relative overflow-hidden bg-[#0A0A0A] py-0">

            {/* ── Top marquee strip ── */}
            <div className="bg-[#EB3461] py-0.5">
                <Marquee />
            </div>

            {/* ── Main content ── */}
            <div className="relative min-h-[620px] md:min-h-[680px] flex items-center overflow-hidden">

                {/* Background image with parallax */}
                <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
                    <img
                        src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&q=80&w=1600"
                        alt=""
                        className="w-full h-full object-cover opacity-25"
                    />
                </motion.div>

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Pink glow blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EB3461]/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Floating pills */}
                <Pill className="hidden lg:block bg-white/5 top-16 right-[20%]" delay={0.4}>🔥 Trending Now</Pill>
                <Pill className="hidden lg:block bg-white/5 top-32 right-[10%]" delay={0.6}>KPK Exclusive</Pill>
                <Pill className="hidden lg:block bg-[#EB3461]/20 bottom-24 right-[18%]" delay={0.8}>Free Delivery</Pill>
                <Pill className="hidden lg:block bg-white/5 bottom-16 right-[32%]" delay={1.0}>New Drop ✦</Pill>

                {/* Main copy */}
                <motion.div
                    style={{ y: textY }}
                    className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full"
                >
                    {/* Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="w-8 h-0.5 bg-[#EB3461]" />
                        <span className="text-[#EB3461] text-[10px] font-black uppercase tracking-[0.4em]">
                            Classyfitters · KPK Edition
                        </span>
                    </motion.div>

                    {/* Headline — Hinglish */}
                    <div className="space-y-2 mb-8 max-w-4xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]"
                        >
                            Yaar, Ab
                        </motion.h2>
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9]"
                        >
                            <span className="text-[#EB3461]">Style Mein</span>
                        </motion.h2>
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]"
                        >
                            Peeche Mat Reh!
                        </motion.h2>
                    </div>

                    {/* Sub copy */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className="text-white/60 text-base md:text-lg font-medium leading-relaxed max-w-xl mb-4"
                    >
                        Dost puchenge{' '}
                        <span className="text-white font-black italic">"Yaar yeh outfit kahan se liya?"</span>
                        {' '}— Bas unhe Classyfitters ka naam bata dena.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                        className="text-white/40 text-sm font-medium mb-10"
                    >
                        Peshawar se Mardan, Mingora se Batkhela —
                        <span className="text-[#EB3461] font-black"> Poore KPK ka favourite store. 🫡</span>
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.65 }}
                        className="flex flex-wrap gap-4"
                    >
                        <motion.button
                            onClick={() => navigate('/shop')}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="group flex items-center gap-3 bg-[#EB3461] text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-[#EB3461]/30 hover:bg-white hover:text-black transition-all"
                        >
                            <Zap size={15} className="group-hover:text-[#EB3461] transition-colors" />
                            Apna Look Dhundho
                            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        <motion.button
                            onClick={() => navigate('/shop')}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-3 border border-white/20 text-white/80 px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:border-white hover:text-white transition-all backdrop-blur-sm"
                        >
                            New Arrivals Dekho
                        </motion.button>
                    </motion.div>

                    {/* Social proof row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.85 }}
                        className="flex flex-wrap items-center gap-8 mt-14 pt-8 border-t border-white/10"
                    >
                        {[
                            { number: '2,000+', label: 'Happy Customers' },
                            { number: '100+',   label: 'Premium Products' },
                            { number: '5★',     label: 'Avg. Rating' },
                            { number: '3 Days', label: 'KPK Delivery' },
                        ].map(({ number, label }) => (
                            <div key={label} className="text-center">
                                <p className="text-xl md:text-2xl font-black text-white tracking-tighter leading-none">{number}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-1">{label}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* ── Bottom marquee strip ── */}
            <div className="bg-[#111] border-t border-white/5">
                <Marquee reverse />
            </div>
        </section>
    );
};

export default LeadCollection;
