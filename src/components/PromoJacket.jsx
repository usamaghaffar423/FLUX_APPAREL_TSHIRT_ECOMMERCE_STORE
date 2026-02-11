import React from 'react';
import { IMAGES } from '../constants';
import { Play } from 'lucide-react';

const PromoJacket = () => {
    return (
        <section className="py-20 px-6 md:px-12 bg-white flex flex-col items-center">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight uppercase">Jackets</h2>
                    <p className="text-gray-500">Pick the best jacket for your style</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-stretch mb-20">
                {/* Left Side: Model Image with Content */}
                <div className="relative rounded-[40px] overflow-hidden min-h-[500px] flex items-center md:px-12 p-8">
                    <img
                        src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200"
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Jacket Promo"
                    />
                    <div className="absolute inset-0 bg-white/20"></div>
                    <div className="relative z-10 max-w-sm">
                        <h3 className="text-3xl font-black text-gray-900 mb-4">Timeless Fashion for Every Wardrobe</h3>
                        <p className="text-gray-700 mb-8">Elevate your style with our curated collection of premium leather and cotton jackets.</p>
                        <button className="bg-[#EB3461] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
                            Shop Now
                        </button>
                    </div>
                </div>

                {/* Right Side: Sale Content with Model Overlay */}
                <div className="relative rounded-[40px] overflow-hidden bg-[#EB3461] min-h-[500px]">
                    <img
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
                        className="absolute right-0 bottom-0 h-full w-2/3 object-cover mix-blend-overlay opacity-30"
                        alt="Promo Overlay"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center">
                        <p className="text-lg font-bold mb-2 uppercase tracking-tighter">Up To</p>
                        <h4 className="text-[120px] font-black leading-none mb-4">35%</h4>
                        <p className="text-2xl font-light mb-8">OFF</p>
                        <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-pink-600 hover:scale-110 transition-transform">
                            <Play fill="currentColor" size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoJacket;
