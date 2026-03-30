import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useCart } from '../context/CartContext';
import { IMAGES } from '../constants';
import ProductCard from './ProductCard';

const TrendyClothes = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [featuredProduct, setFeaturedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wishlisted, setWishlisted] = useState({});

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get_products.php?trending=1&limit=5`);
                if (!response.ok) throw new Error('Failed');
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setFeaturedProduct(data[0]);
                    setProducts(data.slice(1, 5)); // up to 4 grid cards
                }
            } catch (err) {
                console.error('TrendyClothes fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    const toggleWishlist = (id) => {
        setWishlisted(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Skeleton grid card
    const SkeletonCard = () => (
        <div className="bg-gray-50 rounded-3xl p-6 flex flex-col animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-2xl mb-4" />
            <div className="space-y-2">
                <div className="h-2.5 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3.5 bg-gray-200 rounded w-1/4" />
            </div>
        </div>
    );

    return (
        <section className="py-24 px-6 md:px-12 bg-gray-50/30">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-[#EB3461] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">New Arrivals</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[0.9] tracking-tighter uppercase">
                            Trendy <br />
                            <span className="text-[#EB3461]">Collections</span>
                        </h2>
                    </div>
                    <Link to="/shop" className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-900 hover:text-[#EB3461] transition-all">
                        View All Collections
                        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#EB3461] group-hover:bg-[#EB3461] group-hover:text-white transition-all">
                            <ChevronRight size={16} />
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Featured Large Card - Now part of the flow but still prominent */}
                    <div className="md:col-span-2 lg:col-span-2 relative rounded-[40px] overflow-hidden group min-h-[450px] shadow-2xl">
                        <img
                            src={featuredProduct?.image_url || IMAGES.hero}
                            alt={featuredProduct?.title || 'Trendy Feature'}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            onError={(e) => { e.target.onerror = null; e.target.src = IMAGES.hero; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-10 left-10 right-10 z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-3">
                                {featuredProduct?.category || 'Trending'}
                            </p>
                            <h3 className="text-3xl font-black text-white mb-6 leading-tight uppercase tracking-tighter">
                                {featuredProduct?.title || 'Everyday Fashion For Effortless Style'}
                            </h3>
                            <Link
                                to="/shop"
                                className="inline-block bg-[#EB3461] text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-pink-900/20"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>

                    {/* Compact Product Cards */}
                    {loading
                        ? [...Array(2)].map((_, i) => <SkeletonCard key={i} />)
                        : products.slice(0, 2).map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))
                    }

                    {/* Remaining Products if any on next row or LG grid */}
                    {products.slice(2, 4).map((p) => (
                        <div key={p.id} className="lg:col-span-1">
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendyClothes;
