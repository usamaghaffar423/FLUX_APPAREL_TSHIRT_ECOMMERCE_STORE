import React from 'react';
import { motion } from 'framer-motion';
import { IMAGES } from '../constants';
import { Link } from 'react-router-dom';

const PromoCard = ({ title, desc, img, bgColor, textColor, btnColor, btnTextColor, isSmall = false, imgClass }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`relative ${bgColor} rounded-[32px] overflow-hidden ${isSmall ? 'h-[285px]' : 'h-[600px]'} p-8 md:p-10 flex flex-col group transition-all duration-500 hover:shadow-2xl hover:shadow-black/10`}
    >
        <div className={`z-10 ${textColor} relative`}>
            <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight leading-tight">{title}</h3>
            <p className="text-[13px] font-medium opacity-80 leading-relaxed mb-8 max-w-[220px]">{desc}</p>
            <Link to="/shop" className={`${btnColor} ${btnTextColor} px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg shadow-black/5`}>
                SHOP NOW
            </Link>
        </div>
        <img
            src={img}
            alt={title}
            className={`absolute pointer-events-none transition-all duration-1000 ease-out group-hover:scale-110 ${imgClass}`}
        />
    </motion.div>
);

const PromoCards = () => {
    return (
        <section className="py-24 px-6 md:px-12 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Card: Pink (Tall) */}
                <div className="lg:col-span-4">
                    <PromoCard
                        title="Free-Spirited Fashion"
                        desc="Get Street Style Savvy with our edgy and trendy clothing."
                        img={IMAGES.hero_secondary} // Man in white shirt
                        bgColor="bg-[#BD3558]"
                        textColor="text-white"
                        btnColor="bg-white"
                        btnTextColor="text-[#BD3558]"
                        imgClass="bottom-0 right-[-10%] w-[100%] h-[75%] object-contain object-bottom"
                    />
                </div>

                {/* Middle Column: Two Small Cards (Blue & Black) */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <PromoCard
                        title="Statement Pieces"
                        desc="Get Street Style Savvy with our edgy and trendy clothing."
                        img={IMAGES.category_blue} // Woman in black
                        bgColor="bg-[#5680BC]"
                        textColor="text-white"
                        btnColor="bg-white"
                        btnTextColor="text-[#5680BC]"
                        isSmall={true}
                        imgClass="bottom-0 right-[-5%] w-[70%] h-[85%] object-contain object-bottom"
                    />
                    <PromoCard
                        title="Statement Pieces"
                        desc="Get Street Style Savvy with our edgy and trendy clothing."
                        img={IMAGES.category_black} // Watch - Matches Step 411 Exactly
                        bgColor="bg-[#111111]"
                        textColor="text-white"
                        btnColor="bg-[#FCB92F]"
                        btnTextColor="text-black"
                        isSmall={true}
                        imgClass="bottom-4 right-4 w-[50%] h-auto object-contain"
                    />
                </div>

                {/* Right Card: Yellow (Tall) */}
                <div className="lg:col-span-4">
                    <PromoCard
                        title="Free-Spirited Fashion"
                        desc="Get Street Style Savvy with our edgy and trendy clothing."
                        img={IMAGES.promo_lady} // Woman in beige coat
                        bgColor="bg-[#F6BC3E]"
                        textColor="text-black"
                        btnColor="bg-black"
                        btnTextColor="text-white"
                        imgClass="bottom-0 right-[-15%] w-[110%] h-[95%] object-contain object-bottom"
                    />
                </div>

            </div>
        </section>
    );
};

export default PromoCards;
