import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants';

const getTimeLeft = () => {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - new Date();
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
        { label: 'Days',    val: time.days },
        { label: 'Hours',   val: time.hrs  },
        { label: 'Minutes', val: time.min  },
        { label: 'Seconds', val: time.sec  },
    ];

    return (
        /*
         * Outer wrapper adds top spacing equal to the image overflow amount
         * so the lady image can bleed above the pink band without
         * overlapping the previous section.
         */
        <div className="relative mt-0 sm:mt-20 md:mt-28">
            <section className="relative bg-[#EB3461] overflow-visible">

                <div className="max-w-7xl mx-auto px-6 md:px-16">
                    {/* ── Inner row ── fixed height on desktop, auto on mobile */}
                    <div className="relative flex flex-col items-center gap-8
                                    md:flex-row md:items-stretch md:h-[290px]">

                        {/* ── Lady image ──────────────────────────────────
                            Mobile  : normal flow, centered, capped height
                            Desktop : absolute, bottom-anchored, bleeds above  */}
                        <div className="w-full flex justify-center pt-8
                                        md:w-auto md:absolute md:bottom-0 md:left-0 md:pt-0 md:h-[420px] z-10">
                            <img
                                src={IMAGES.promo_lady}
                                alt="Classyfitters Sale – Ladies Fashion KPK Pakistan"
                                className="h-52 w-auto object-contain object-bottom drop-shadow-2xl
                                           md:h-full"
                            />
                        </div>

                        {/* ── Text + timer ────────────────────────────────
                            Mobile  : below image, centered
                            Desktop : right half, vertically centered         */}
                        <div className="w-full text-white text-center pb-10
                                        md:ml-auto md:w-[55%] md:flex md:flex-col md:justify-center md:text-left md:py-0">

                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-tight mb-1">
                                FLAT 30% OFF!
                            </h2>
                            <p className="text-lg md:text-xl font-light uppercase tracking-widest mb-7 opacity-90">
                                Sirf Aaj Tak Ka Mauqaa!
                            </p>

                            {/* Timer boxes — white border style like the reference */}
                            <div className="flex gap-3 mb-8 justify-center md:justify-start">
                                {units.map((unit, i) => (
                                    <div
                                        key={i}
                                        className="border-2 border-white/60 rounded-xl
                                                   px-3 py-2.5 min-w-[62px]
                                                   sm:px-5 sm:py-3 sm:min-w-[78px]
                                                   text-center"
                                    >
                                        <p className="text-2xl sm:text-3xl font-bold tabular-nums leading-none">
                                            {unit.val}
                                        </p>
                                        <p className="text-[8px] sm:text-[10px] uppercase tracking-widest opacity-70 font-bold mt-1">
                                            {unit.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <Link
                                    to="/shop"
                                    className="inline-block bg-white text-[#EB3461] px-10 py-3.5 rounded-full
                                               font-black uppercase tracking-widest text-sm
                                               hover:bg-gray-100 transition-all shadow-xl
                                               active:scale-95"
                                >
                                    Ab Shop Karo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Faint background text */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[18vw] font-black
                                text-white opacity-[0.04] whitespace-nowrap pointer-events-none select-none">
                    MEGA CHHOOT 2026
                </div>

            </section>
        </div>
    );
};

export default SaleBanner;
