import React from 'react';
import { IMAGES } from '../constants';

const PromoCard = ({ title, desc, img, bgColor, textColor, btnColor, btnTextColor, size = 'large', imgClass }) => (
    <div className={`relative ${bgColor} rounded-[40px] overflow-hidden ${size === 'large' ? 'h-[600px]' : 'h-[286px]'} p-10 flex flex-col group`}>
        <div className={`z-10 ${textColor} relative`}>
            <h3 className="text-2xl font-bold mb-3 tracking-tight leading-tight">{title}</h3>
            <p className="text-[13px] opacity-90 leading-relaxed mb-8 max-w-[200px]">{desc}</p>
            <button className={`${btnColor} ${btnTextColor} px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-transform`}>
                SHOP NOW
            </button>
        </div>
        <img
            src={img}
            alt={title}
            className={`absolute pointer-events-none transition-transform duration-700 group-hover:scale-110 ${imgClass}`}
        />
    </div>
);

const PromoCards = () => {
    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Red Card */}
                <PromoCard
                    title="Free-Spirited Fashion"
                    desc="Get Street Style Savvy with our edgy and trendy clothing."
                    img="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800"
                    bgColor="bg-[#D13A59]"
                    textColor="text-white"
                    btnColor="bg-white"
                    btnTextColor="text-[#D13A59]"
                    imgClass="bottom-0 right-[-15%] w-[100%] h-[80%] object-contain object-bottom"
                />

                {/* Middle Column */}
                <div className="flex flex-col gap-7 h-[600px]">
                    <PromoCard
                        title="Statement Pieces"
                        desc="Get Street Style Savvy with our edgy and trendy clothing."
                        img={IMAGES.category_blue}
                        bgColor="bg-[#3D78B9]"
                        textColor="text-white"
                        btnColor="bg-white"
                        btnTextColor="text-[#3D78B9]"
                        size="small"
                        imgClass="bottom-4 right-[-10px] w-[55%] h-auto object-contain rotate-[-15deg] group-hover:rotate-0"
                    />
                    <PromoCard
                        title="Statement Pieces"
                        desc="Get Street Style Savvy with our edgy and trendy clothing."
                        img={IMAGES.category_black}
                        bgColor="bg-[#141414]"
                        textColor="text-white"
                        btnColor="bg-[#F9B22D]"
                        btnTextColor="text-black"
                        size="small"
                        imgClass="bottom-4 right-4 w-1/2 h-auto object-contain"
                    />
                </div>

                {/* Yellow Card */}
                <PromoCard
                    title="Free-Spirited Fashion"
                    desc="Get Street Style Savvy with our edgy and trendy clothing."
                    img="https://images.unsplash.com/photo-1529139581774-823b52c04b5b?auto=format&fit=crop&q=80&w=800"
                    bgColor="bg-[#F9B22D]"
                    textColor="text-black"
                    btnColor="bg-[#141414]"
                    btnTextColor="text-white"
                    imgClass="bottom-0 right-[-15%] w-[100%] h-[75%] object-contain object-bottom"
                />

            </div>
        </section>
    );
};

export default PromoCards;
