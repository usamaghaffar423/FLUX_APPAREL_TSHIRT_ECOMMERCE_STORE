import React from 'react';
import { ChevronUp } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#111111] text-white pt-20 pb-10 px-6 md:px-12 relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                {/* Brand Column */}
                <div>
                    <span className="text-2xl font-black italic tracking-tighter text-[#EB3461] mb-6 block">
                        FLUX <span className="text-white not-italic">APPAREL</span>
                    </span>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Experience the pinnacle of fashion with Flux Apparel. We bring you the latest trends with premium quality and effortless style.
                    </p>
                    <div className="flex space-x-4">
                        {['fb', 'tw', 'ig', 'yt'].map((s) => (
                            <div key={s} className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-[#EB3461] hover:text-[#EB3461] cursor-pointer transition-all">
                                <span className="uppercase text-[10px] font-bold">{s}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-bold text-lg mb-8 uppercase tracking-widest">Quick Links</h4>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        {['About Us', 'Latest News', 'My Account', 'Contact Us'].map((l) => (
                            <li key={l} className="hover:text-white cursor-pointer transition-colors">{l}</li>
                        ))}
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h4 className="font-bold text-lg mb-8 uppercase tracking-widest">Categories</h4>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        {['Men Collection', 'Women Collection', 'Accessories', 'New Arrivals'].map((l) => (
                            <li key={l} className="hover:text-white cursor-pointer transition-colors">{l}</li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-bold text-lg mb-8 uppercase tracking-widest">Contact Info</h4>
                    <p className="text-gray-400 text-sm mb-4">Batkhela, Malakand, Pakistan</p>
                    <p className="text-gray-400 text-sm mb-4">+92 345 6789100</p>
                    <p className="text-gray-400 text-sm">support@fluxapparel.com</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-10 border-t border-gray-800 text-center flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
                <p>Copyright © 2026 All right reserved | Flux Apparel Brand</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <span>Privacy Policy</span>
                    <span>Terms & Conditions</span>
                </div>
            </div>

            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 bg-[#EB3461] text-white p-3 rounded-full shadow-2xl hover:bg-black transition-all hover:-translate-y-2 z-50"
            >
                <ChevronUp size={24} />
            </button>
        </footer>
    );
};

export default Footer;
