import { useState, useEffect } from 'react';
import { IMAGES } from '../constants';
import { Search, User, ShoppingBag, Facebook, Twitter, Instagram, Mail, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
    { label: 'Home', href: '#', active: true },
    { label: 'Pages', href: '#', hasDropdown: true },
    { label: 'Shop', href: '#', hasDropdown: true },
    { label: 'Blog', href: '#', hasDropdown: false },
    { label: 'Contact', href: '#', hasDropdown: false },
];

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Disable scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    return (
        <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-50">
            {/* Top Bar */}
            <div className="bg-[#f8f8f8] py-2 px-6 md:px-12 border-b border-gray-100 hidden sm:block">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] text-gray-600 font-medium">
                    <div className="flex items-center space-x-4">
                        <Facebook size={14} className="cursor-pointer hover:text-black transition-colors" />
                        <Twitter size={14} className="cursor-pointer hover:text-black transition-colors" />
                        <Instagram size={14} className="cursor-pointer hover:text-black transition-colors" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Mail size={14} />
                        <span>info@fluxapparel.com</span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="py-4 md:py-5 px-6 md:px-12">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Left: Hamburger (Mobile Only) */}
                    <div className="flex lg:hidden flex-1">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-gray-900 hover:text-[#EB3461] transition-colors"
                        >
                            <Menu size={24} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Center: Brand */}
                    <div className="flex items-center group cursor-pointer lg:flex-none">
                        <span className="text-xl md:text-2xl font-black italic tracking-tighter text-[#EB3461]">
                            FLUX <span className="text-gray-900 not-italic ml-1">APPAREL</span>
                        </span>
                    </div>

                    {/* Navigation (Desktop) */}
                    <nav className="hidden lg:flex items-center space-x-10 flex-1 justify-center">
                        {NAV_ITEMS.map((item) => (
                            <div key={item.label} className="flex items-center space-x-1 cursor-pointer group">
                                <a
                                    href={item.href}
                                    className={`font-bold text-sm transition-colors ${item.active ? 'text-[#EB3461]' : 'text-gray-800 group-hover:text-[#EB3461]'}`}
                                >
                                    {item.label}
                                </a>
                                {item.hasDropdown && (
                                    <ChevronDown size={14} className="text-gray-400 group-hover:text-[#EB3461]" />
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right: Icons */}
                    <div className="flex items-center space-x-3 md:space-x-5 flex-1 justify-end">
                        <button className="text-gray-900 hover:text-[#EB3461] transition-all p-2 rounded-full hover:bg-gray-50 hidden md:block">
                            <Search size={20} />
                        </button>
                        <button className="text-gray-900 hover:text-[#EB3461] transition-all p-2 rounded-full hover:bg-gray-50 relative">
                            <ShoppingBag size={20} />
                            <span className="absolute top-1 right-1 bg-[#EB3461] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                        </button>
                        <button className="text-gray-900 hover:text-[#EB3461] transition-all p-2 rounded-full hover:bg-gray-50">
                            <User size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
                        />

                        {/* Sidebar Content */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[90%] max-w-[400px] bg-white z-[70] lg:hidden shadow-2xl flex flex-col"
                        >
                            {/* Sidebar Header */}
                            <div className="p-6 flex items-center justify-between border-b border-gray-50">
                                <span className="text-xl font-black italic tracking-tighter text-[#EB3461]">
                                    FLUX <span className="text-gray-900 not-italic ml-1">APPAREL</span>
                                </span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-gray-500 hover:text-[#EB3461] transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Sidebar Menu Items */}
                            <div className="flex-1 overflow-y-auto py-8 px-6">
                                {/* Mobile Search */}
                                <div className="mb-8 relative">
                                    <input
                                        type="text"
                                        placeholder="Search for products..."
                                        className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#EB3461]/20 outline-none transition-all"
                                    />
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>

                                <div className="space-y-6">
                                    {NAV_ITEMS.map((item, idx) => (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + idx * 0.05 }}
                                        >
                                            <a
                                                href={item.href}
                                                className="group flex items-center justify-between py-2 border-b border-gray-50"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <span className={`text-lg font-bold ${item.active ? 'text-[#EB3461]' : 'text-gray-900 group-hover:text-[#EB3461]'}`}>
                                                    {item.label}
                                                </span>
                                                {item.hasDropdown ? (
                                                    <ChevronDown size={18} className="text-gray-400" />
                                                ) : (
                                                    <ArrowRight size={18} className="text-gray-100 group-hover:text-[#EB3461] group-hover:translate-x-1 transition-all" />
                                                )}
                                            </a>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Extra Mobile Info */}
                                <div className="mt-12 space-y-8">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Support</p>
                                        <div className="flex items-center space-x-3 text-gray-700">
                                            <Mail size={16} className="text-[#EB3461]" />
                                            <span className="text-sm font-medium">info@fluxapparel.com</span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Follow Us</p>
                                        <div className="flex items-center space-x-6">
                                            <Facebook size={20} className="text-gray-400 hover:text-[#EB3461] transition-colors" />
                                            <Twitter size={20} className="text-gray-400 hover:text-[#EB3461] transition-colors" />
                                            <Instagram size={20} className="text-gray-400 hover:text-[#EB3461] transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Footer */}
                            <div className="p-6 border-t border-gray-50 bg-[#f8f8f8]">
                                <button className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 active:scale-[0.98] transition-all shadow-lg shadow-black/10">
                                    <User size={18} />
                                    <span>My Account</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;

