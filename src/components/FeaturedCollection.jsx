import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import ProductCard from './ProductCard';

// Skeleton loader for product card
const SkeletonCard = () => (
    <div className="flex flex-col animate-pulse">
        <div className="aspect-[4/5] bg-gray-100 rounded-[30px] mb-4" />
        <div className="space-y-2">
            <div className="h-2.5 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3.5 bg-gray-100 rounded w-1/3" />
        </div>
    </div>
);

const FeaturedCollection = () => {
    const [products, setProducts] = useState([]);
    const [featuredImg, setFeaturedImg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get_products.php?limit=5`);
                if (!response.ok) throw new Error('Failed');
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    // Use first product image as the featured hero background
                    setFeaturedImg(data[0].image_url);
                    setProducts(data.slice(1, 5)); // Next 4 products for the grid
                }
            } catch (err) {
                console.error('FeaturedCollection fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                {/* Left Large Promo Card */}
                <div className="relative rounded-[40px] overflow-hidden min-h-[600px] group">
                    <img
                        src={featuredImg || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200'}
                        alt="Featured Collection"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-12 left-12 right-12 z-10">
                        <h3 className="text-4xl font-bold text-white mb-4 leading-tight">
                            Aaj Ka Look,<br />Kal Ki Yaad
                        </h3>
                        <p className="text-gray-200 text-sm mb-8 max-w-sm leading-relaxed opacity-90">
                            Watches se Perfumes tak, Handbags se Edenrobe Clothes tak — Classyfitters mein milega sab kuch. KPK ka apna fashion store.
                        </p>
                        <Link to="/shop" className="inline-block bg-white text-black px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#EB3461] hover:text-white transition-all">
                            ABHI DEKHO
                        </Link>
                    </div>
                </div>

                {/* Right Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
                    {loading
                        ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                        : products.map((product) => (
                            <ProductCard key={product.id} product={product} variant="featured" />
                        ))
                    }
                </div>

            </div>
        </section>
    );
};

export default FeaturedCollection;
