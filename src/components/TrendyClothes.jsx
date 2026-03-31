import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { IMAGES } from '../constants';
import ProductCard from './ProductCard';

const TrendyClothes = () => {
    const [products,       setProducts]       = useState([]);
    const [featuredProduct,setFeaturedProduct] = useState(null);
    const [loading,        setLoading]         = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res  = await fetch(`${API_BASE_URL}/get_products.php?trending=1&limit=9`);
                if (!res.ok) throw new Error('Failed');
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setFeaturedProduct(data[0]);
                    setProducts(data.slice(1));
                }
            } catch (err) {
                console.error('TrendyClothes fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    // Products 0-3 fill the 2×2 bento beside the hero
    const gridProducts   = products.slice(0, 4);
    // Remaining products go into the bottom row (auto-col count)
    const bottomProducts = products.slice(4);

    const FeaturedSkeleton = () => (
        <div className="rounded-[40px] overflow-hidden min-h-[560px] bg-gray-100 animate-pulse" />
    );

    const CardSkeleton = () => (
        <div className="animate-pulse">
            <div className="aspect-[4/5] bg-gray-100 rounded-[28px] mb-3" />
            <div className="space-y-2">
                <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3.5 bg-gray-100 rounded w-1/4" />
            </div>
        </div>
    );

    // Bottom row col-count based on how many products exist
    const bottomCols =
        bottomProducts.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' :
        bottomProducts.length === 3 ? 'sm:grid-cols-3' :
        bottomProducts.length === 2 ? 'sm:grid-cols-2' : '';

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

                {/* ── Main Bento Grid ─────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">

                    {/* LEFT — Tall editorial hero card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5"
                    >
                        {loading ? <FeaturedSkeleton /> : (
                            <div className="relative rounded-[40px] overflow-hidden h-full min-h-[560px] group">
                                <img
                                    src={featuredProduct?.image_url || IMAGES.hero}
                                    alt={featuredProduct?.title || 'Hot Arrival'}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    onError={(e) => { e.target.onerror = null; e.target.src = IMAGES.hero; }}
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                {/* Top badge */}
                                <div className="absolute top-6 left-6">
                                    <span className="bg-[#EB3461] text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                                        🔥 Trending
                                    </span>
                                </div>

                                {/* Bottom content */}
                                <div className="absolute bottom-8 left-8 right-8 z-10">
                                    <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/50 mb-2">
                                        {featuredProduct?.category || 'Hot Arrivals'}
                                    </p>
                                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight uppercase tracking-tight line-clamp-2">
                                        {featuredProduct?.title || 'Classyfitters Latest Drop'}
                                    </h3>
                                    {featuredProduct?.price && (
                                        <p className="text-white/70 text-sm font-bold mb-5">
                                            Rs. {parseFloat(featuredProduct.price).toLocaleString()}
                                        </p>
                                    )}
                                    <Link
                                        to={featuredProduct ? `/product/${featuredProduct.id}` : '/shop'}
                                        className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#EB3461] hover:text-white transition-all shadow-xl"
                                    >
                                        Shop Now <ArrowRight size={12} />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* RIGHT — 2×2 product card grid */}
                    <div className="lg:col-span-7 grid grid-cols-2 gap-5 content-start">
                        {loading
                            ? [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
                            : gridProducts.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.07 }}
                                >
                                    <ProductCard product={p} variant="featured" />
                                </motion.div>
                            ))
                        }
                    </div>
                </div>

                {/* ── Bottom overflow row ─────────────────────────────── */}
                {!loading && bottomProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className={`grid grid-cols-2 gap-5 ${bottomCols}`}
                    >
                        {bottomProducts.map((p, i) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                            >
                                <ProductCard product={p} variant="featured" />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

            </div>
        </section>
    );
};

export default TrendyClothes;
