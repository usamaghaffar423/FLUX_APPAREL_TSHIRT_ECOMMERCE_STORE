import { IMAGES } from '../constants';
import { ChevronUp, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#111111] text-white pt-20 pb-10 px-6 md:px-12 relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                {/* Brand Column */}
                <div>
                    <span className="text-2xl font-black italic tracking-tighter mb-6 block">
                        <span className="text-white">Classy</span>
                        <span className="text-[#EB3461]">fitters</span>
                    </span>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Experience the pinnacle of fashion with classyfitters. We bring you the latest trends with premium quality and effortless style.
                    </p>
                    <div className="flex space-x-4">
                        {[
                            { Icon: Facebook, href: '#' },
                            { Icon: Twitter, href: '#' },
                            { Icon: Instagram, href: '#' },
                            { Icon: Youtube, href: '#' }
                        ].map((social, idx) => (
                            <a
                                key={idx}
                                href={social.href}
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#EB3461] hover:bg-[#EB3461] hover:text-white transition-all duration-300"
                            >
                                <social.Icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#EB3461]">Quick Links</h4>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        {[
                            { label: 'Shop Home', href: '/' },
                            { label: 'Browse Products', href: '/shop' },
                            { label: 'All Categories', href: '/category' },
                            { label: 'Admin Panel', href: '/admin' }
                        ].map((link) => (
                            <li key={link.label}>
                                <Link to={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#EB3461]">Shop By Type</h4>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        {[
                            { label: 'Clothing', href: '/category?category=Clothing' },
                            { label: 'Fragrance', href: '/category?category=Fragrance' },
                            { label: 'Wrist Watches', href: '/category?category=Wrist%20Watches' },
                            { label: 'New Arrivals', href: '/shop' }
                        ].map((link) => (
                            <li key={link.label}>
                                <Link to={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-[#EB3461]">Contact Info</h4>
                    <div className="space-y-4 text-gray-400 text-sm">
                        <p>Batkhela, Malakand, Pakistan</p>
                        <p>+92 345 6789100</p>
                        <p className="hover:text-white cursor-pointer transition-colors">support@classyfitters.com</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                <p>Copyright © 2026 | Classyfitters — Pakistan's Premium Fashion Store</p>
                <div className="flex space-x-8 mt-4 md:mt-0">
                    <Link to="/" className="hover:text-white transition-colors text-[#EB3461]">Privacy Policy</Link>
                    <Link to="/" className="hover:text-white transition-colors">Terms & Conditions</Link>
                </div>
            </div>

            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 bg-[#EB3461] text-white p-3 rounded-full shadow-2xl hover:bg-black transition-all hover:-translate-y-2 z-50 border-4 border-white/10"
            >
                <ChevronUp size={24} />
            </button>
        </footer>
    );
};

export default Footer;
