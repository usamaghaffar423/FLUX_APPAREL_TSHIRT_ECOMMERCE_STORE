import React from 'react';
import { IMAGES } from '../constants';

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-white min-h-[850px] flex items-center">
            {/* Background Shapes */}
            <div className="absolute top-0 right-0 w-[60%] h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute inset-0 border-l-[1px] border-gray-100 transform -skew-x-[25deg] translate-x-1/2"></div>
                <div className="absolute inset-0 border-l-[100px] border-gray-50 transform -skew-x-[25deg] translate-x-[60%]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 items-center relative z-10 w-full">
                <div className="max-w-xl">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-1 h-12 bg-[#EB3461]"></div>
                        <div>
                            <p className="text-gray-600 text-[13px] font-medium leading-tight">Timeless Fashion for</p>
                            <p className="text-gray-600 text-[13px] font-medium leading-tight">the Modern Era</p>
                        </div>
                    </div>

                    <h1 className="text-[85px] font-black text-[#1A1A1A] leading-[0.9] mb-8 tracking-tighter">
                        MODERN<br />
                        TRENDSETTER
                    </h1>

                    <p className="text-gray-500 mb-10 text-lg max-w-md leading-relaxed">
                        Get Street Style Savvy with our edgy and trendy clothing. Shop the latest streetwear and urban fashion.
                    </p>

                    <div className="flex gap-8 items-center">
                        <button className="text-[13px] font-bold uppercase tracking-widest text-gray-900 border-b-2 border-black pb-1 hover:text-[#EB3461] hover:border-[#EB3461] transition-all">
                            More Explore
                        </button>
                        <button className="bg-[#EB3461] hover:bg-black text-white px-10 py-4 rounded-full text-[13px] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-pink-100">
                            Shop Now
                        </button>
                    </div>
                </div>

                <div className="relative h-[850px] hidden md:block">
                    {/* Models Container */}
                    <div className="absolute bottom-[-50px] right-0 flex items-end">
                        <img
                            src={IMAGES.hero}
                            alt="Fashion Model 1"
                            className="w-[600px] h-auto object-contain z-10 -mr-48 drop-shadow-2xl mix-blend-multiply"
                        />
                        <img
                            src={IMAGES.hero_secondary}
                            alt="Fashion Model 2"
                            className="w-[700px] h-auto object-contain z-0 drop-shadow-xl saturate-[1.1]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
