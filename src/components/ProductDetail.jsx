import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, Star, ShieldCheck, Truck, ArrowLeft, ArrowRight,
    Heart, Plus, Minus, Flame, Share2, RotateCcw, ChevronDown,
    ZoomIn, Check, Package
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';

const FALLBACK = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800';

// ── Colour name → CSS background ─────────────────────────────────────────────
const COLOR_MAP = {
    red: '#EF4444', pink: '#EC4899', rose: '#FB7185', orange: '#F97316',
    yellow: '#EAB308', green: '#22C55E', teal: '#14B8A6', blue: '#3B82F6',
    navy: '#1E3A5F', purple: '#A855F7', violet: '#7C3AED', brown: '#92400E',
    black: '#111111', white: '#F9FAFB', grey: '#9CA3AF', gray: '#9CA3AF',
    cream: '#FEF3C7', beige: '#D4A76A', maroon: '#7F1D1D', olive: '#713F12',
};

function colorToCss(name) {
    const key = name.toLowerCase().trim();
    if (COLOR_MAP[key]) return COLOR_MAP[key];
    // Try CSS named colour as fallback
    return name;
}

// ── Sticky add-to-cart bar (shows when main button scrolls out) ───────────────
const StickyBar = ({ product, selectedSize, selectedColor, quantity, onAdd, outOfStock }) => (
    <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-2xl shadow-black/10 px-6 py-4 flex items-center gap-4"
    >
        <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-900 uppercase tracking-tight line-clamp-1">{product.title}</p>
            <p className="text-[#EB3461] font-black text-sm">Rs. {parseFloat(product.price).toLocaleString()}</p>
        </div>
        {selectedSize && <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl">{selectedSize}</span>}
        <button
            onClick={onAdd}
            disabled={outOfStock}
            className="flex items-center gap-2 bg-[#EB3461] text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all disabled:opacity-40 flex-shrink-0"
        >
            <ShoppingBag size={15} />
            {outOfStock ? 'Sold Out' : 'Add to Cart'}
        </button>
    </motion.div>
);

// ── Accordion row ─────────────────────────────────────────────────────────────
const Accordion = ({ label, children }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-t border-gray-100">
            <button onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between py-5 text-left group">
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-700 group-hover:text-[#EB3461] transition-colors">{label}</span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-gray-400" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-5 text-sm text-gray-500 font-medium leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const ctaRef = useRef(null);

    const [product, setProduct]           = useState(null);
    const [images, setImages]             = useState([]);
    const [loading, setLoading]           = useState(true);
    const [quantity, setQuantity]         = useState(1);
    const [related, setRelated]           = useState([]);
    const [activeImg, setActiveImg]       = useState(0);
    const [wishlisted, setWishlisted]     = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [addedAnim, setAddedAnim]       = useState(false);
    const [zoomed, setZoomed]             = useState(false);
    const [zoomPos, setZoomPos]           = useState({ x: 50, y: 50 });
    const [showSticky, setShowSticky]     = useState(false);
    const [sizeError, setSizeError]       = useState(false);

    // ── Fetch ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setActiveImg(0);
            setSelectedSize('');
            setSelectedColor('');
            setQuantity(1);
            try {
                const res  = await fetch(`${API_BASE_URL}/get_products.php?id=${id}`);
                const data = await res.json();
                const p    = Array.isArray(data) ? data[0] : data;
                if (!p || p.error) { navigate('/shop'); return; }
                setProduct(p);

                // Gallery — use single image for now (multi-image via admin later)
                const gallery = [{ url: p.image_url || FALLBACK, alt: p.title }];
                setImages(gallery);

                // Default first color
                if (p.colors) {
                    const cols = p.colors.split(',').map(c => c.trim()).filter(Boolean);
                    if (cols.length === 1) setSelectedColor(cols[0]);
                }

                // Related
                if (p.category) {
                    const rRes  = await fetch(`${API_BASE_URL}/get_products.php?category=${encodeURIComponent(p.category)}&limit=8`);
                    const rData = await rRes.json();
                    setRelated(Array.isArray(rData) ? rData.filter(r => r.id !== p.id).slice(0, 4) : []);
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
        window.scrollTo(0, 0);
    }, [id, navigate]);

    // ── Sticky bar observer ───────────────────────────────────────────────
    useEffect(() => {
        if (!ctaRef.current) return;
        const obs = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting), { threshold: 0 });
        obs.observe(ctaRef.current);
        return () => obs.disconnect();
    }, [product]);

    // ── Image zoom on mouse move ──────────────────────────────────────────
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top)  / rect.height) * 100,
        });
    };

    const handleAddToCart = () => {
        if (!product) return;
        const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
        if (sizes.length > 0 && !selectedSize) {
            setSizeError(true);
            setTimeout(() => setSizeError(false), 2000);
            return;
        }
        addToCart({ ...product, selectedSize, selectedColor, quantity });
        setAddedAnim(true);
        setTimeout(() => setAddedAnim(false), 1800);
    };

    // ── Loading ───────────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-pink-100 border-t-[#EB3461] rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Loading...</p>
            </div>
        </div>
    );
    if (!product) return null;

    const price      = parseFloat(product.price ?? 0);
    const oldPrice   = parseFloat(product.retail_price ?? 0);
    const discount   = parseFloat(product.discount_pct ?? 0);
    const hasDiscount = discount > 0 && oldPrice > price;
    const outOfStock  = product.stock_status === 'out_of_stock';
    const stockQty    = product.stock_quantity ?? 0;
    const isLowStock  = !outOfStock && stockQty > 0 && stockQty <= 5;

    const sizes  = product.sizes  ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)  : [];
    const colors = product.colors ? product.colors.split(',').map(c => c.trim()).filter(Boolean) : [];

    const currentImg = images[activeImg]?.url || FALLBACK;

    return (
        <div className="min-h-screen bg-white pb-32 font-['Outfit']">

            {/* ── Breadcrumb ── */}
            <div className="border-b border-gray-50 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <button onClick={() => navigate('/')} className="hover:text-[#EB3461] transition-colors">Home</button>
                    <span>/</span>
                    <button onClick={() => navigate('/shop')} className="hover:text-[#EB3461] transition-colors">Shop</button>
                    <span>/</span>
                    <button onClick={() => navigate(`/shop?category=${product.category}`)} className="hover:text-[#EB3461] transition-colors">{product.category}</button>
                    <span>/</span>
                    <span className="text-gray-600 line-clamp-1 max-w-[200px]">{product.title}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

                    {/* ══ LEFT: Image Gallery ══════════════════════════════════ */}
                    <div className="lg:sticky lg:top-28 space-y-4">

                        {/* Main Image */}
                        <div className="relative group">
                            <motion.div
                                key={activeImg}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-50 shadow-2xl shadow-gray-200/40 cursor-zoom-in"
                                onMouseEnter={() => setZoomed(true)}
                                onMouseLeave={() => setZoomed(false)}
                                onMouseMove={handleMouseMove}
                            >
                                <img
                                    src={currentImg}
                                    alt={images[activeImg]?.alt || product.title}
                                    className="w-full h-full object-cover transition-transform duration-700"
                                    style={zoomed ? {
                                        transform: 'scale(1.6)',
                                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                    } : {}}
                                    onError={e => { e.target.src = FALLBACK; }}
                                />

                                {/* Zoom hint */}
                                <div className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <ZoomIn size={12} className="text-gray-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Hover to zoom</span>
                                </div>

                                {/* Badges */}
                                <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                                    {product.is_trending && (
                                        <div className="bg-[#EB3461] text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest shadow-lg shadow-pink-200">
                                            <Flame size={11} /> Hot
                                        </div>
                                    )}
                                    {hasDiscount && (
                                        <div className="bg-black text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                            -{discount.toFixed(0)}% OFF
                                        </div>
                                    )}
                                    {outOfStock && (
                                        <div className="bg-gray-700 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                            Sold Out
                                        </div>
                                    )}
                                </div>

                                {/* Wishlist + Share */}
                                <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
                                    <button
                                        onClick={() => setWishlisted(w => !w)}
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm transition-all ${
                                            wishlisted ? 'bg-[#EB3461] text-white' : 'bg-white/90 text-gray-400 hover:text-[#EB3461]'
                                        }`}
                                    >
                                        <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} />
                                    </button>
                                    <button
                                        onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}
                                        className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-[#EB3461] shadow-lg transition-colors"
                                    >
                                        <Share2 size={15} />
                                    </button>
                                </div>

                                {/* Prev / Next arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg text-gray-600 hover:text-[#EB3461] transition-colors z-10"
                                        >
                                            <ArrowLeft size={16} />
                                        </button>
                                        <button
                                            onClick={() => setActiveImg(i => (i + 1) % images.length)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg text-gray-600 hover:text-[#EB3461] transition-colors z-10"
                                        >
                                            <ArrowRight size={16} />
                                        </button>
                                        {/* Counter */}
                                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                            {activeImg + 1} / {images.length}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                                {images.map((img, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveImg(i)}
                                        className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                                            activeImg === i ? 'border-[#EB3461] shadow-lg shadow-pink-100' : 'border-gray-100 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover"
                                            onError={e => { e.target.src = FALLBACK; }} />
                                        {activeImg === i && (
                                            <div className="absolute inset-0 border-2 border-[#EB3461] rounded-2xl" />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ══ RIGHT: Product Info ══════════════════════════════════ */}
                    <div className="space-y-6">

                        {/* Category + Rating */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <span className="text-[10px] font-black text-[#EB3461] uppercase tracking-[0.3em] bg-pink-50 px-4 py-1.5 rounded-full">
                                {product.category}
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={13} fill="#FBBF24" className="text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">4.9 · 128 reviews</span>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-3xl md:text-4xl xl:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                                {product.title}
                            </h1>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-end gap-4 flex-wrap">
                            <span className="text-4xl font-black text-gray-900 tracking-tighter leading-none">
                                Rs. {price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <>
                                    <span className="text-xl text-gray-300 font-bold line-through tracking-tighter leading-none">
                                        Rs. {oldPrice.toLocaleString()}
                                    </span>
                                    <span className="bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                        Save Rs. {(oldPrice - price).toLocaleString()}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Stock indicator */}
                        {!outOfStock && (
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        {isLowStock ? `Only ${stockQty} left!` : 'In Stock'}
                                    </span>
                                    {isLowStock && (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1">
                                            <Flame size={10} /> Selling Fast
                                        </span>
                                    )}
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-48">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: isLowStock ? `${(stockQty / 10) * 100}%` : '75%' }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className={`h-full rounded-full ${isLowStock ? 'bg-amber-400' : 'bg-green-400'}`}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="w-full h-px bg-gray-100" />

                        {/* Color Swatches */}
                        {colors.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-700">
                                        Color
                                    </span>
                                    {selectedColor && (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            {selectedColor}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map(color => {
                                        const bg  = colorToCss(color);
                                        const isLight = ['white', 'cream', 'beige', 'yellow', '#F9FAFB', '#FEF3C7', '#D4A76A', '#EAB308'].includes(bg);
                                        const selected = selectedColor === color;
                                        return (
                                            <motion.button
                                                key={color}
                                                whileHover={{ scale: 1.12 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setSelectedColor(color)}
                                                title={color}
                                                className={`relative w-9 h-9 rounded-full transition-all flex items-center justify-center ${
                                                    selected ? 'ring-2 ring-offset-2 ring-[#EB3461]' : 'ring-1 ring-gray-200'
                                                }`}
                                                style={{ backgroundColor: bg }}
                                            >
                                                {selected && (
                                                    <Check size={14} className={isLight ? 'text-gray-800' : 'text-white'} strokeWidth={3} />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Size Selector */}
                        {sizes.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <motion.span
                                        animate={sizeError ? { color: ['#111', '#EF4444', '#111'] } : {}}
                                        transition={{ duration: 0.5 }}
                                        className="text-[11px] font-black uppercase tracking-widest text-gray-700"
                                    >
                                        Size {sizeError && <span className="text-red-500 normal-case tracking-normal font-bold text-xs ml-1">— Please select a size</span>}
                                    </motion.span>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-[#EB3461] hover:underline">
                                        Size Guide
                                    </button>
                                </div>
                                <motion.div
                                    animate={sizeError ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-wrap gap-2"
                                >
                                    {sizes.map(size => {
                                        const sel = selectedSize === size;
                                        return (
                                            <motion.button
                                                key={size}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => { setSelectedSize(size); setSizeError(false); }}
                                                className={`min-w-[52px] h-11 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                                                    sel
                                                        ? 'bg-[#EB3461] text-white border-[#EB3461] shadow-lg shadow-pink-200'
                                                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#EB3461] hover:text-[#EB3461]'
                                                }`}
                                            >
                                                {size}
                                            </motion.button>
                                        );
                                    })}
                                </motion.div>
                            </div>
                        )}

                        {/* Quantity + CTA */}
                        <div ref={ctaRef} className="space-y-4 pt-2">
                            <div className="flex items-center gap-4">
                                {/* Qty */}
                                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1.5 gap-1">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        disabled={outOfStock}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white text-gray-400 hover:text-black transition-all disabled:opacity-30"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-10 text-center text-base font-black text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        disabled={outOfStock}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white text-gray-400 hover:text-black transition-all disabled:opacity-30"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* Total */}
                                <div className="text-sm text-gray-400 font-bold">
                                    Total: <span className="text-gray-900 font-black">Rs. {(price * quantity).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <motion.button
                                onClick={handleAddToCart}
                                disabled={outOfStock}
                                whileTap={!outOfStock ? { scale: 0.98 } : {}}
                                className={`w-full py-5 rounded-[20px] font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition-all relative overflow-hidden ${
                                    outOfStock
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#EB3461] text-white hover:bg-black shadow-2xl shadow-pink-200/50'
                                }`}
                            >
                                <AnimatePresence mode="wait">
                                    {addedAnim ? (
                                        <motion.span key="added"
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2">
                                            <Check size={18} strokeWidth={3} /> Added to Cart!
                                        </motion.span>
                                    ) : (
                                        <motion.span key="add"
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-3">
                                            <ShoppingBag size={20} />
                                            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            {/* Wishlist secondary */}
                            <button
                                onClick={() => setWishlisted(w => !w)}
                                className={`w-full py-4 rounded-[20px] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 border-2 transition-all ${
                                    wishlisted
                                        ? 'border-[#EB3461] text-[#EB3461] bg-pink-50'
                                        : 'border-gray-200 text-gray-500 hover:border-[#EB3461] hover:text-[#EB3461]'
                                }`}
                            >
                                <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                                {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            {[
                                { icon: ShieldCheck, title: 'Authentic',    sub: '100% genuine' },
                                { icon: Truck,       title: 'Fast Delivery', sub: 'Across Pakistan' },
                                { icon: RotateCcw,   title: '7-Day Returns', sub: 'Easy & hassle-free' },
                            ].map(({ icon: Icon, title, sub }) => (
                                <div key={title} className="flex flex-col items-center text-center gap-2 bg-gray-50 rounded-2xl p-4">
                                    <Icon size={20} className="text-[#EB3461]" />
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">{title}</p>
                                        <p className="text-[9px] text-gray-400 font-medium mt-0.5">{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Accordions */}
                        <div className="pt-2">
                            <Accordion label="Product Description">
                                {product.description
                                    ? <p>{product.description}</p>
                                    : <p>Premium quality {product.category} from Classyfitters. Crafted for style and comfort, designed for Pakistan's fashion-forward generation.</p>
                                }
                            </Accordion>
                            <Accordion label="Size & Fit Guide">
                                <div className="space-y-2">
                                    <p className="mb-3">Refer to the chart below for the best fit:</p>
                                    <div className="grid grid-cols-4 gap-1 text-center text-[11px]">
                                        {[['Size','Chest','Length','Shoulder'],['S','36"','27"','15"'],['M','38"','28"','16"'],['L','40"','29"','17"'],['XL','42"','30"','18"'],['XXL','44"','31"','19"']].map((row, i) => (
                                            <React.Fragment key={i}>
                                                {row.map((cell, j) => (
                                                    <div key={j} className={`py-2 px-1 rounded ${i === 0 ? 'font-black text-gray-700 bg-gray-100' : 'text-gray-500 font-medium bg-gray-50'}`}>
                                                        {cell}
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </Accordion>
                            <Accordion label="Shipping & Returns">
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2"><Package size={14} className="text-[#EB3461] mt-0.5 flex-shrink-0" /> Free delivery on all orders across Pakistan</li>
                                    <li className="flex items-start gap-2"><Truck size={14} className="text-[#EB3461] mt-0.5 flex-shrink-0" /> Delivered within 3–5 business days</li>
                                    <li className="flex items-start gap-2"><RotateCcw size={14} className="text-[#EB3461] mt-0.5 flex-shrink-0" /> Easy 7-day returns — contact us on WhatsApp</li>
                                </ul>
                            </Accordion>
                        </div>

                    </div>
                </div>

                {/* ── Related Products ── */}
                {related.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7 }}
                        className="mt-32"
                    >
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EB3461] mb-2">You Might Also Like</p>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">
                                    Related <span className="text-[#EB3461]">Pieces</span>
                                </h2>
                            </div>
                            <button
                                onClick={() => navigate('/shop')}
                                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#EB3461] flex items-center gap-2 transition-colors group"
                            >
                                View All
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                >
                                    <ProductCard product={p} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* ── Sticky bottom bar ── */}
            <AnimatePresence>
                {showSticky && (
                    <StickyBar
                        product={product}
                        selectedSize={selectedSize}
                        selectedColor={selectedColor}
                        quantity={quantity}
                        onAdd={handleAddToCart}
                        outOfStock={outOfStock}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetail;
