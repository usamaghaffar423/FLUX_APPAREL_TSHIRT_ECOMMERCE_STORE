import React, { useState, useEffect } from 'react';
import { IMAGES } from '../constants';

const getTimeLeft = () => {
    const now = new Date();
    // Count down to midnight tonight — resets every day so it's always running
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;

    return {
        days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hrs:  String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        min:  String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0'),
        sec:  String(Math.floor((diff / 1000) % 60)).padStart(2, '0'),
    };
};

const SaleBanner = () => {
    const [time, setTime] = useState(getTimeLeft);

    useEffect(() => {
        const interval = setInterval(() => setTime(getTimeLeft()), 1000);
        return () => clearInterval(interval);
    }, []);

    const units = [
        { label: 'DAYS', val: time.days },
        { label: 'HRS',  val: time.hrs  },
        { label: 'MIN',  val: time.min  },
        { label: 'SEC',  val: time.sec  },
    ];

    return (
        <section className="relative bg-[#EB3461] py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between relative z-10">
                <div className="md:w-1/2 mb-12 md:mb-0">
                    <div className="relative w-[400px] h-[400px]">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                        <img
                            src={IMAGES.promo_lady}
                            alt="Classyfitters Sale – Ladies Fashion KPK Pakistan"
                            className="relative z-10 w-full h-full object-cover rounded-3xl"
                        />
                    </div>
                </div>

                <div className="md:w-1/2 text-white text-center md:text-left">
                    <h2 className="text-6xl font-black mb-6 leading-tight">
                        FLAT 30%<br />CHHOOT!
                        <br /><span className="text-4xl font-light">Sirf Aaj Tak Ka Mauqa!</span>
                    </h2>

                    <div className="flex gap-4 mb-10 justify-center md:justify-start">
                        {units.map((unit, i) => (
                            <div key={i} className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl min-w-[80px] text-center border border-white/30">
                                <p className="text-2xl font-bold tabular-nums">{unit.val}</p>
                                <p className="text-[10px] uppercase font-bold tracking-widest">{unit.label}</p>
                            </div>
                        ))}
                    </div>

                    <button className="bg-white text-pink-600 px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl">
                        Ab Shop Karo
                    </button>
                </div>
            </div>

            {/* Background Text */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-black text-white opacity-5 whitespace-nowrap pointer-events-none select-none">
                MEGA CHHOOT 2026
            </div>
        </section>
    );
};

export default SaleBanner;
