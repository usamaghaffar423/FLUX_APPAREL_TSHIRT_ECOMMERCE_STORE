import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Facebook, Instagram, Mail, ChevronDown, Menu, X, ArrowRight, LogOut, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import SearchModal from './SearchModal';

// Category icons for the mega menu
const CAT_ICONS = {
    perfumes:  '🌸',
    watches:   '⌚',
    handbags:  '👜',
    wallets:   '💼',
    stitched:  '👗',
    jewellery: '💍',
};

const CAT_DESC = {
    perfumes:  'Edenrobe & Imported',
    watches:   'Tissot, Rizen & More',
    handbags:  'Coach, Gucci & More',
    wallets:   'Leather & Slim',
    stitched:  'Ladies Collection',
    jewellery: 'Gold & Silver',
};

const NAV_ITEMS = [
    { label: 'Home',         href: '/'                                                       },
    { label: 'Shop',         href: '/shop'                                                   },
    { label: 'New Arrivals', href: '/shop?trending=1', badge: 'New',    badgeColor: 'bg-emerald-500' },
    { label: 'Sale',         href: '/shop',            badge: '30% Off',badgeColor: 'bg-[#EB3461]'   },
    { label: 'My Orders',    href: '/profile'                                                },
    { label: 'Contact',      href: '/contact'                                                },
];

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen]   = useState(false);
    const [isSearchOpen,     setIsSearchOpen]        = useState(false);
    const [isScrolled,       setIsScrolled]          = useState(false);
    const [isCatOpen,        setIsCatOpen]           = useState(false);
    const [isMobileCatOpen,  setIsMobileCatOpen]     = useState(false);
    const [categories,       setCategories]          = useState([]);
    const catTimeoutRef = useRef(null);

    const { cartCount, setIsCartOpen } = useCart();
    const { user, logout, isAdmin }    = useAuth();
    const navigate  = useNavigate();
    const location  = useLocation();

    // Fetch top-level categories for the mega menu
    useEffect(() => {
        fetch(`${API_BASE_URL}/get_categories.php`)
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                if (Array.isArray(data)) {
                    const topLevel = data.filter(c => !c.parent_id || c.parent_id === '0' || c.parent_id === null);
                    setCategories(topLevel);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    // Close mega menu when navigating
    useEffect(() => {
        setIsCatOpen(false);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const visibleNavItems = NAV_ITEMS;

    const openCat  = () => { clearTimeout(catTimeoutRef.current); setIsCatOpen(true); };
    const closeCat = () => { catTimeoutRef.current = setTimeout(() => setIsCatOpen(false), 150); };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${isScrolled ? 'translate-y-[-36px]' : 'translate-y-0'}`}>

                {/* ── Top Bar ─────────────────────────────────────── */}
                <div className={`bg-[#f8f8f8] h-[36px] hidden sm:flex items-center px-6 md:px-12 border-b border-gray-100 transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-[11px] text-gray-600 font-medium">
                        <div className="flex items-center space-x-4">
                            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                                <Instagram size={14} className="cursor-pointer hover:text-[#EB3461] transition-colors" />
                            </a>
                            <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                                <Facebook size={14} className="cursor-pointer hover:text-[#EB3461] transition-colors" />
                            </a>
                            <a href="https://www.tiktok.com/@classyfitters_edenrobe?_r=1&_t=ZS-957yO3Wc4pw" target="_blank" rel="noreferrer" className="cursor-pointer hover:text-[#EB3461] transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
                            </a>
                        </div>
                        <p className="text-[11px] font-bold text-gray-600 hidden md:block">
                            🇵🇰 KPK mein 3 din mein delivery · Rs. 2,500+ par free shipping poore Pakistan mein
                        </p>
                        <div className="flex items-center space-x-5">
                            <div className="flex items-center space-x-1.5">
                                <Mail size={13} />
                                <span>info@classyfitters.shop</span>
                            </div>
                            <a href="tel:+923481099433" className="flex items-center space-x-1.5 hover:text-[#EB3461] transition-colors">
                                <Phone size={13} />
                                <span>+92 348 1099433</span>
                            </a>
                            {user && (
                                <button onClick={logout} className="flex items-center space-x-1 hover:text-[#EB3461] transition-colors">
                                    <LogOut size={12} />
                                    <span>Logout ({user.username})</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Main Header ──────────────────────────────────── */}
                <div className={`transition-all duration-700 ease-in-out px-4 md:px-12 ${isScrolled ? 'bg-white/90 backdrop-blur-xl py-3 shadow-lg border-b border-gray-100/50' : 'bg-white py-4'}`}>
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                        {/* Mobile: Hamburger */}
                        <div className="flex lg:hidden">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-900 hover:text-[#EB3461] transition-colors">
                                <Menu size={24} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Brand */}
                        <Link to="/" className="flex items-center group">
                            <span className="text-xl md:text-2xl font-black italic tracking-tighter">
                                <span className="text-black">Classy</span>
                                <span className="text-[#EB3461]">fitters</span>
                            </span>
                        </Link>

                        {/* ── Desktop Nav ─────────────────────────── */}
                        <nav className="hidden lg:flex items-center space-x-7 flex-1 justify-center">
                            {visibleNavItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className="relative font-bold text-[12px] uppercase tracking-wider text-gray-800 hover:text-[#EB3461] transition-colors group"
                                >
                                    {item.label}
                                    {item.badge && (
                                        <span className={`absolute -top-3 -right-6 ${item.badgeColor} text-white text-[7px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full leading-none`}>
                                            {item.badge}
                                        </span>
                                    )}
                                    <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-[#EB3461] transition-all duration-300 origin-left group-hover:w-full" />
                                </Link>
                            ))}

                            {/* Categories Mega Menu Trigger */}
                            <div
                                className="relative"
                                onMouseEnter={openCat}
                                onMouseLeave={closeCat}
                            >
                                <button className={`relative flex items-center gap-1.5 font-bold text-[13px] uppercase tracking-wider transition-colors group ${isCatOpen ? 'text-[#EB3461]' : 'text-gray-800 hover:text-[#EB3461]'}`}>
                                    Categories
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`} />
                                    <span className={`absolute bottom-[-4px] left-0 h-[2px] bg-[#EB3461] transition-all duration-300 ${isCatOpen ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                </button>

                                <AnimatePresence>
                                    {isCatOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            transition={{ duration: 0.18 }}
                                            onMouseEnter={openCat}
                                            onMouseLeave={closeCat}
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[560px] bg-white rounded-[28px] shadow-2xl shadow-gray-300/30 border border-gray-100 overflow-hidden"
                                        >
                                            {/* Mega menu header */}
                                            <div className="px-8 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Shop By</p>
                                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Categories</h3>
                                                </div>
                                                <Link
                                                    to="/category"
                                                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#EB3461] hover:text-black transition-colors"
                                                >
                                                    View All <ArrowRight size={12} />
                                                </Link>
                                            </div>

                                            {/* Category grid */}
                                            <div className="p-6 grid grid-cols-3 gap-3">
                                                {categories.map(cat => {
                                                    const icon = CAT_ICONS[cat.slug] || '🏷️';
                                                    const desc = CAT_DESC[cat.slug] || cat.description || '';
                                                    return (
                                                        <Link
                                                            key={cat.id}
                                                            to={`/category?category=${cat.slug}`}
                                                            className="group flex flex-col items-center text-center p-4 rounded-2xl hover:bg-pink-50 transition-all hover:shadow-sm border border-transparent hover:border-pink-100"
                                                        >
                                                            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">{icon}</span>
                                                            <span className="text-[11px] font-black uppercase tracking-wide text-gray-900 group-hover:text-[#EB3461] transition-colors leading-tight mb-1">
                                                                {cat.name}
                                                            </span>
                                                            <span className="text-[9px] text-gray-400 font-medium leading-tight">{desc}</span>
                                                        </Link>
                                                    );
                                                })}
                                                {/* View all tile */}
                                                <Link
                                                    to="/category"
                                                    className="group flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 hover:bg-[#EB3461] transition-all border border-gray-100 hover:border-[#EB3461]"
                                                >
                                                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">✦</span>
                                                    <span className="text-[11px] font-black uppercase tracking-wide text-gray-900 group-hover:text-white transition-colors leading-tight mb-1">
                                                        All Products
                                                    </span>
                                                    <span className="text-[9px] text-gray-400 group-hover:text-white/70 font-medium leading-tight">Browse Everything</span>
                                                </Link>
                                            </div>

                                            {/* Bottom promo strip */}
                                            <div className="mx-6 mb-6 bg-gradient-to-r from-[#EB3461] to-rose-600 rounded-2xl p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-white text-[10px] font-black uppercase tracking-widest">🔥 Hot Arrivals</p>
                                                    <p className="text-white/80 text-[11px] font-medium mt-0.5">Har hafte naye styles — don't miss out!</p>
                                                </div>
                                                <Link
                                                    to="/shop?trending=1"
                                                    className="bg-white text-[#EB3461] px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all"
                                                >
                                                    Dekho Abhi
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </nav>

                        {/* ── Right: Icons ────────────────────────── */}
                        <div className="flex items-center space-x-1 md:space-x-2">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="text-gray-800 hover:text-[#EB3461] transition-all p-2.5 rounded-full hover:bg-gray-50 hidden md:block group"
                                title="Search"
                            >
                                <Search size={20} className="group-hover:scale-110 transition-transform duration-300" />
                            </button>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="text-gray-800 hover:text-[#EB3461] transition-all p-2.5 rounded-full hover:bg-gray-50 relative group"
                                title="Cart"
                            >
                                <ShoppingBag size={20} className="group-hover:scale-110 transition-transform duration-300" />
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-[#EB3461] text-white text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold border-2 border-white">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => navigate(isAdmin ? '/admin' : (user ? '/profile' : '/login'))}
                                className={`transition-all p-2.5 rounded-full hover:bg-gray-50 group ${user ? 'text-[#EB3461]' : 'text-gray-800 hover:text-[#EB3461]'}`}
                                title={user ? `Hi, ${user.username}` : 'Login / Register'}
                            >
                                <User size={20} className="group-hover:scale-110 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* ── Mobile Sidebar ─────────────────────────────────── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[360px] bg-white z-[110] lg:hidden shadow-2xl flex flex-col"
                        >
                            {/* Sidebar Header */}
                            <div className="p-5 flex items-center justify-between border-b border-gray-100">
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                                    <span className="text-xl font-black italic tracking-tighter">
                                        <span className="text-black">Classy</span>
                                        <span className="text-[#EB3461]">fitters</span>
                                    </span>
                                </Link>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-[#EB3461] transition-colors rounded-xl hover:bg-gray-50">
                                    <X size={22} />
                                </button>
                            </div>

                            {/* User greeting */}
                            {user && (
                                <div className="px-5 py-3 bg-pink-50 border-b border-pink-100 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#EB3461] flex items-center justify-center text-white text-xs font-black uppercase">
                                        {user.username?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-gray-900 uppercase tracking-wide">{user.username}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{user.email}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">
                                {/* Main Nav Items */}
                                <div className="space-y-1 mb-6">
                                    {visibleNavItems.map((item, idx) => (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 + idx * 0.04 }}
                                        >
                                            <Link
                                                to={item.href}
                                                className="group flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-gray-50 transition-all"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <span className="text-[15px] font-black text-gray-900 group-hover:text-[#EB3461] uppercase tracking-wide transition-colors">
                                                        {item.label}
                                                    </span>
                                                    {item.badge && (
                                                        <span className={`${item.badgeColor} text-white text-[7px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full leading-none`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </span>
                                                <ArrowRight size={16} className="text-gray-300 group-hover:text-[#EB3461] group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Categories Section */}
                                <div className="border-t border-gray-100 pt-5">
                                    <button
                                        onClick={() => setIsMobileCatOpen(v => !v)}
                                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-gray-50 transition-all mb-1"
                                    >
                                        <span className="text-[15px] font-black text-gray-900 uppercase tracking-wide">Categories</span>
                                        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isMobileCatOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isMobileCatOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-4 space-y-1 pb-3">
                                                    {categories.map(cat => (
                                                        <Link
                                                            key={cat.id}
                                                            to={`/category?category=${cat.slug}`}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 transition-all group"
                                                        >
                                                            <span className="text-xl">{CAT_ICONS[cat.slug] || '🏷️'}</span>
                                                            <span className="text-[12px] font-black text-gray-700 group-hover:text-[#EB3461] uppercase tracking-wide transition-colors">
                                                                {cat.name}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                    <Link
                                                        to="/category"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-[#EB3461] transition-all group mt-2"
                                                    >
                                                        <span className="text-xl">✦</span>
                                                        <span className="text-[12px] font-black text-gray-700 group-hover:text-white uppercase tracking-wide transition-colors">
                                                            All Products
                                                        </span>
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Search in mobile */}
                                <div className="border-t border-gray-100 pt-5 mt-2">
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all text-gray-500"
                                    >
                                        <Search size={18} />
                                        <span className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Products Dhundho</span>
                                    </button>
                                </div>
                            </div>

                            {/* Sidebar Footer */}
                            <div className="p-5 border-t border-gray-100 space-y-3">
                                <button
                                    onClick={() => { setIsMobileMenuOpen(false); navigate(user ? '/profile' : '/login'); }}
                                    className="w-full bg-[#EB3461] text-white py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg shadow-pink-100 hover:bg-black transition-all"
                                >
                                    <User size={16} />
                                    <span>{user ? `My Account` : 'Login / Register'}</span>
                                </button>
                                {user && (
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                                        className="w-full border border-gray-200 text-gray-600 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center space-x-2 hover:border-red-300 hover:text-red-500 transition-all"
                                    >
                                        <LogOut size={14} />
                                        <span>Sign Out</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
