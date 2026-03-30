import React from 'react';
import { IMAGES } from '../constants';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Headset, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';

const FEATURES = [
    { icon: <Truck size={24} />, title: "Poore Pakistan Delivery", desc: "KPK se karachi tak ghar tak" },
    { icon: <Headset size={24} />, title: "Online Support", desc: "7 din, subah se raat tak" },
    { icon: <ShieldCheck size={24} />, title: "Easy Returns", desc: "7 din mein wapsi guaranteed" },
    { icon: <Wallet size={24} />, title: "Secure Payment", desc: "100% safe & protected" },
];

const Hero = () => {
    return (
        <section className="relative bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-24 grid lg:grid-cols-2 gap-8 items-center relative z-10 w-full">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xl"
                >
                    <div className="flex items-start space-x-4 mb-8">
                        <div className="w-[3px] h-14 bg-[#EB3461] rounded-full mt-1"></div>
                        <div>
                            <p className="text-gray-600 text-[14px] font-medium leading-relaxed tracking-wide">
                                KPK ka No.1 Fashion Store<br />Watches · Perfumes · Handbags · Clothes
                            </p>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-[88px] font-black text-[#1A1A1A] leading-[0.95] mb-8 tracking-tighter uppercase transition-all">
                        APKA STYLE,<br />
                        <span className="text-[#EB3461]">APKI</span> PEHCHAAN
                    </h1>

                    <p className="text-gray-500 mb-10 text-[15px] md:text-base max-w-lg leading-relaxed font-medium">
                        Wrist Watches, Perfumes, Ladies Handbags, Shorts aur Edenrobe Clothes — sab kuch ek jagah.
                        Peshawar se Mardan tak, <strong className="text-gray-700">fast delivery guaranteed.</strong>
                    </p>

                    <div className="flex flex-wrap gap-8 items-center">
                        <Link to="/shop" className="text-[13px] font-bold uppercase tracking-[0.15em] text-gray-900 border-none pb-1 hover:text-[#EB3461] transition-all flex items-center group">
                            <span>Sab Dekho</span>
                        </Link>
                        <Link to="/shop" className="bg-[#EB3461] hover:bg-black text-white px-10 py-4.5 rounded-full text-[13px] font-bold uppercase tracking-[0.15em] transition-all shadow-xl shadow-pink-100 active:scale-95 text-center">
                            Abhi Shop Karo
                        </Link>
                    </div>
                </motion.div>

                {/* Single Combined Image Composition */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex items-center justify-center lg:justify-end"
                >
                    <div className="relative z-10 w-full max-w-[850px]">
                        <img
                            src={IMAGES.hero}
                            alt="Classyfitters – Wrist Watches, Perfumes, Ladies Handbags & Edenrobe Clothes KPK Pakistan"
                            className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Features Bar - Refined for brand consistency and responsiveness */}
            <div className="bg-[#fcfcfc] border-y border-gray-100 py-12 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
                    {FEATURES.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex items-center space-x-5 group cursor-default"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#EB3461] transition-all duration-500 group-hover:scale-110 group-hover:shadow-md border border-gray-50">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="text-[14px] md:text-[15px] font-black uppercase tracking-wider text-gray-900 leading-tight">
                                    {item.title}
                                </h4>
                                <p className="text-[11px] md:text-[12px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 opacity-80">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
