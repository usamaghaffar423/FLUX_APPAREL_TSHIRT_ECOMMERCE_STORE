import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { IMAGES } from '../constants';
import { IMAGE_BASE_URL } from '../config';
import { ArrowRight, ShoppingBag, Heart, Star, ChevronRight, Package } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useCart } from '../context/CartContext';

// Static fallback metadata keyed by DB slug (lowercase)
const CATEGORY_META = {
    'all': {
        id: 'all', slug: 'all', label: 'All Products',
        description: 'Explore our full premium collection — fragrances, watches, handbags, and more.',
        image: IMAGES.hero_secondary, accent: '#EB3461',
        bg: 'from-rose-900 to-black', icon: '✦',
    },
    'perfumes': {
        id: 'perfumes', slug: 'perfumes', label: 'Perfumes & Fragrances',
        description: 'Luxury Edenrobe & imported scents crafted for the modern Pakistani.',
        image: IMAGES.category_yellow, accent: '#d97706',
        bg: 'from-amber-800 to-black', icon: '🌸',
    },
    'watches': {
        id: 'watches', slug: 'watches', label: 'Luxury Watches',
        description: 'Premium Tissot, Rizen, and fashion timepieces — delivered across Pakistan.',
        image: IMAGES.category_blue, accent: '#2563eb',
        bg: 'from-blue-900 to-black', icon: '⌚',
    },
    'handbags': {
        id: 'handbags', slug: 'handbags', label: 'Designer Handbags',
        description: 'Coach, Givenchy, Miu Miu, Valentino — statement bags for every occasion.',
        image: IMAGES.hero_secondary, accent: '#EB3461',
        bg: 'from-rose-800 to-black', icon: '👜',
    },
    'wallets': {
        id: 'wallets', slug: 'wallets', label: 'Premium Wallets',
        description: 'Slim bifold and cardholder wallets for the modern professional.',
        image: IMAGES.category_red, accent: '#EB3461',
        bg: 'from-rose-900 to-black', icon: '💼',
    },
    'stitched': {
        id: 'stitched', slug: 'stitched', label: 'Stitched Clothing',
        description: 'Premium stitched collections crafted for Pakistani women.',
        image: IMAGES.category_black, accent: '#111',
        bg: 'from-gray-900 to-black', icon: '👗',
    },
    'jewellery': {
        id: 'jewellery', slug: 'jewellery', label: 'Gold Jewellery',
        description: 'Elegant gold bangles, jhumkas and statement pieces for every occasion.',
        image: IMAGES.hero_tertiary, accent: '#d97706',
        bg: 'from-yellow-800 to-black', icon: '💍',
    },
};

// Merge a DB category with static fallback metadata
function buildCategory(dbCat) {
    const slug = (dbCat.slug || '').toLowerCase();
    const meta = CATEGORY_META[slug] || {
        id: `cat_${dbCat.id}`,
        slug,
        label: dbCat.name,
        description: dbCat.description || `Explore our ${dbCat.name} collection.`,
        image: IMAGES.hero_secondary,
        accent: '#EB3461',
        bg: 'from-gray-900 to-black',
        icon: '🏷️',
    };
    return {
        ...meta,
        dbId: dbCat.id,
        image: dbCat.image_url || meta.image,
    };
}

// Default CATEGORIES used as initial/fallback state
const DEFAULT_CATEGORIES = Object.values(CATEGORY_META);

/* ─── Product Card ─────────────────────────────────────────────────── */
const ProductCard = ({ product, index }) => {
    const { addToCart } = useCart();
    const [wishlisted, setWishlisted] = useState(false);

    const imageUrl = product.image_url
        ? (product.image_url.startsWith('http') ? product.image_url : IMAGE_BASE_URL + product.image_url)
        : IMAGES.hero_secondary;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, type: 'spring', damping: 20 }}
            className="group flex flex-col bg-white rounded-[28px] overflow-hidden border border-gray-100 hover:border-[#EB3461]/20 transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(235,52,97,0.12)]"
        >
            {/* Image */}
            <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50 block">
                <img
                    src={imageUrl}
                    alt={product.title}
                    onError={e => { e.target.src = IMAGES.hero_secondary; }}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    {product.discount_pct > 0 && (
                        <span className="bg-[#EB3461] text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm">
                            -{product.discount_pct}%
                        </span>
                    )}
                    <button
                        onClick={e => { e.preventDefault(); setWishlisted(v => !v); }}
                        className={`ml-auto p-2.5 rounded-xl shadow-lg transition-all transform hover:-rotate-12 ${wishlisted ? 'bg-[#EB3461] text-white' : 'bg-white hover:bg-[#EB3461] hover:text-white'}`}
                    >
                        <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="#FBBF24" className="text-yellow-400" />)}
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest ml-1">5.0</span>
                </div>
                <Link to={`/product/${product.id}`}>
                    <h3 className="font-black text-gray-900 text-sm tracking-tight mb-2 uppercase leading-tight line-clamp-2 group-hover:text-[#EB3461] transition-colors text-center min-h-[38px]">
                        {product.title}
                    </h3>
                </Link>
                <div className="flex items-baseline justify-center space-x-2 mb-4">
                    <span className="text-gray-900 font-black text-lg tracking-tighter">
                        Rs. {parseFloat(product.price || product.final_price || 0).toLocaleString()}
                    </span>
                    {product.retail_price && parseFloat(product.retail_price) > parseFloat(product.price || product.final_price || 0) && (
                        <span className="text-gray-300 text-xs font-bold line-through">
                            Rs. {parseFloat(product.retail_price).toLocaleString()}
                        </span>
                    )}
                </div>
                <button
                    onClick={() => addToCart(product)}
                    className="mt-auto w-full bg-gray-900 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#EB3461] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                    <ShoppingBag size={12} />
                    Add To Cart
                </button>
            </div>
        </motion.div>
    );
};

/* ─── Main Page ─────────────────────────────────────────────────────── */
const Categories = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlSlug = searchParams.get('category');

    const [CATEGORIES, setCategories] = useState(DEFAULT_CATEGORIES);
    const [activeCat, setActiveCat] = useState(
        DEFAULT_CATEGORIES.find(c => c.slug === (urlSlug || 'all')) || DEFAULT_CATEGORIES[0]
    );
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(8);

    // Fetch category list from DB and merge with static metadata
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/get_categories.php`);
                if (!res.ok) return;
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    // Only use top-level categories (no parent) for the sidebar
                    const topLevel = data.filter(c => !c.parent_id || c.parent_id === null || c.parent_id === '0');
                    const built = topLevel.map(buildCategory);
                    const allCat = CATEGORY_META['all'];
                    setCategories([allCat, ...built]);
                }
            } catch {
                // keep DEFAULT_CATEGORIES on error
            }
        };
        fetchCategories();
    }, []);

    // Sync URL → state whenever CATEGORIES updates
    useEffect(() => {
        const slug = urlSlug || 'all';
        const found = CATEGORIES.find(c => c.slug === slug);
        if (found) setActiveCat(found);
        else setActiveCat(CATEGORIES[0]);
        setDisplayCount(8);
    }, [urlSlug, CATEGORIES]);

    // Fetch products whenever active category changes
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = activeCat.slug === 'all'
                    ? `${API_BASE_URL}/get_products.php`
                    : `${API_BASE_URL}/get_products.php?category_slug=${encodeURIComponent(activeCat.slug)}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [activeCat]);

    const selectCategory = (cat) => {
        setActiveCat(cat);
        setSearchParams({ category: cat.slug });
        setDisplayCount(8);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Hero Banner ────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                <motion.section
                    key={activeCat.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative h-[340px] md:h-[440px] overflow-hidden"
                >
                    <img
                        src={activeCat.image}
                        alt={activeCat.label}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${activeCat.bg} opacity-80`} />
                    <div className="absolute inset-0 flex items-end px-6 md:px-16 pb-14">
                        <div>
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-white/50 text-[10px] font-black uppercase tracking-[0.4em] block mb-3"
                            >
                                classyfitters — Collection
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08 }}
                                className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase mb-4"
                            >
                                {activeCat.label}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-white/60 text-base max-w-md font-medium"
                            >
                                {activeCat.description}
                            </motion.p>
                        </div>
                    </div>
                    {/* Breadcrumb */}
                    <div className="absolute top-6 left-6 md:left-16 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white/50">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span className="text-white/80">Categories</span>
                        {activeCat.slug !== 'all' && (
                            <>
                                <ChevronRight size={12} />
                                <span className="text-white">{activeCat.label}</span>
                            </>
                        )}
                    </div>
                </motion.section>
            </AnimatePresence>

            {/* ── Body: Sidebar + Grid ────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-10">

                {/* ── Sidebar ── */}
                <aside className="lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden sticky top-28">
                        <div className="p-6 border-b border-gray-50">
                            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-gray-400">Browse By</p>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mt-1">Category</h2>
                        </div>
                        <nav className="p-3">
                            {CATEGORIES.map((cat) => {
                                const isActive = activeCat.slug === cat.slug;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => selectCategory(cat)}
                                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl mb-1 text-left transition-all group ${isActive
                                            ? 'bg-[#EB3461] text-white shadow-lg shadow-pink-200/50'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg leading-none">{cat.icon}</span>
                                            <span className={`text-[11px] font-black uppercase tracking-wide ${isActive ? 'text-white' : 'text-gray-800 group-hover:text-[#EB3461]'}`}>
                                                {cat.label}
                                            </span>
                                        </div>
                                        <ChevronRight
                                            size={14}
                                            className={`transition-transform ${isActive ? 'text-white translate-x-0.5' : 'text-gray-300 group-hover:text-[#EB3461] group-hover:translate-x-0.5'}`}
                                        />
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Quick CTA */}
                        <div className="p-4 border-t border-gray-50 m-3 bg-gray-50 rounded-3xl text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Need Help?</p>
                            <Link
                                to="/#contact"
                                className="text-[10px] font-black text-[#EB3461] uppercase tracking-wider hover:underline"
                            >
                                Contact Us →
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* ── Product Grid ── */}
                <main className="flex-1 min-w-0">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                {activeCat.label}
                            </h2>
                            {!loading && (
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    {products.length} Product{products.length !== 1 ? 's' : ''} Found
                                </p>
                            )}
                        </div>
                        <Link
                            to="/shop"
                            className="hidden md:flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#EB3461] transition-colors"
                        >
                            <span>View All Shop</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* States */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 space-y-5">
                            <div className="w-12 h-12 border-4 border-pink-50 border-t-[#EB3461] rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Curating Collection…</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[40px] border border-gray-100 text-center">
                            <Package size={56} className="text-gray-200 mb-4" />
                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs mb-6">No products in this category yet</p>
                            <button
                                onClick={() => selectCategory(CATEGORIES[0])}
                                className="text-[10px] font-black uppercase tracking-widest text-[#EB3461] hover:underline"
                            >
                                Browse All Products →
                            </button>
                        </div>
                    ) : (
                        <>
                            <motion.div
                                key={activeCat.slug}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
                            >
                                {products.slice(0, displayCount).map((product, i) => (
                                    <ProductCard key={product.id} product={product} index={i} />
                                ))}
                            </motion.div>

                            {/* Load More */}
                            {displayCount < products.length && (
                                <div className="flex flex-col items-center space-y-4 py-8 border-t border-gray-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        Showing {Math.min(displayCount, products.length)} of {products.length}
                                    </p>
                                    <button
                                        onClick={() => setDisplayCount(p => p + 8)}
                                        className="inline-flex items-center space-x-2 bg-black text-white px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-[#EB3461] transition-all shadow-lg"
                                    >
                                        <span>Load More</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#EB3461] animate-pulse" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* ── Bottom CTA ─────────────────────────────────────── */}
            <section className="pb-24 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-black rounded-[50px] p-10 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute top-0 left-1/4 w-1/2 h-full bg-[#EB3461] rounded-full blur-[150px] -translate-y-1/2" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
                                Still Looking For <br />
                                <span className="text-[#EB3461]">Something Else?</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                                Browse our full collection — fragrances, luxury watches, designer bags, and exclusive jewellery. Delivered anywhere in Pakistan.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center space-x-3 bg-[#EB3461] text-white px-12 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_20px_40px_-10px_rgba(235,52,97,0.4)]"
                            >
                                <span>View Full Shop</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Categories;
