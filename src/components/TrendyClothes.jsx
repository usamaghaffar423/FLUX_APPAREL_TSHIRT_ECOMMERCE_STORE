import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { IMAGES } from '../constants';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';

// Editorial hero card — first product gets this treatment
const HeroCard = ({ product }) => {
    const { addToCart } = useCart();
    const price = parseFloat(product?.price ?? 0);

    return (
        <div className="relative rounded-[28px] overflow-hidden aspect-[3/4] group cursor-pointer">
            <img
                src={product?.image_url || IMAGES.hero}
                alt={product?.title || 'Hot Arrival'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                onError={(e) => { e.target.onerror = null; e.target.src = IMAGES.hero; }}
            />
            {/* Dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Trending badge */}
            <div className="absolute top-4 left-4">
                <span className="bg-[#EB3461] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    🔥 Trending
                </span>
            </div>

            {/* Quick add button */}
            <button
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-[#EB3461] transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
            >
                <ShoppingBag size={15} />
            </button>

            {/* Bottom info */}
            <Link to={`/product/${product?.id}`} className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/50 mb-1">
                    {product?.category || 'Hot Arrivals'}
                </p>
                <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tight line-clamp-2 mb-2">
                    {product?.title}
                </h3>
                {price > 0 && (
                    <p className="text-white/70 text-sm font-bold mb-3">
                        Rs. {price.toLocaleString()}
                    </p>
                )}
                <span className="inline-flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#EB3461] hover:text-white transition-all">
                    Shop Now <ArrowRight size={10} />
                </span>
            </Link>
        </div>
    );
};

const TrendyClothes = () => {
    const [products, setProducts] = useState([]);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res  = await fetch(`${API_BASE_URL}/get_products.php?trending=1&limit=8`);
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                if (Array.isArray(data)) setProducts(data);
            } catch (err) {
                console.error('TrendyClothes fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    return (
        <section className="py-24 px-6 md:px-12 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto">

                {/* ── Section Header ──────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-[#EB3461] text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">
                            Hot Arrivals 🔥
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[0.9] tracking-tighter uppercase">
                            Naye Dor Ki <br />
                            <span className="text-[#EB3461]">Collections</span>
                        </h2>
                    </div>
                    <Link
                        to="/shop"
                        className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-900 hover:text-[#EB3461] transition-all self-start sm:self-auto"
                    >
                        Sab Dekho
                        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#EB3461] group-hover:bg-[#EB3461] group-hover:text-white transition-all">
                            <ChevronRight size={16} />
                        </div>
                    </Link>
                </div>

                {/* ── Pinterest Masonry Grid ───────────────────────────── */}
                {loading ? (
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-5">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="break-inside-avoid mb-5 animate-pulse">
                                <div
                                    className="bg-gray-100 rounded-[28px] w-full"
                                    style={{ aspectRatio: i % 3 === 0 ? '3/4' : '3/4' }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-5">
                        {products.map((p, i) => (
                            <motion.div
                                key={p.id}
                                className="break-inside-avoid mb-5"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                            >
                                {i === 0
                                    ? <HeroCard product={p} />
                                    : <ProductCard product={p} />
                                }
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
};

export default TrendyClothes;
