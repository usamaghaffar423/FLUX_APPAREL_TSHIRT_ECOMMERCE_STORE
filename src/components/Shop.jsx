import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Filter, X } from 'lucide-react';
import ProductCard from './ProductCard';
import { Link, useSearchParams } from 'react-router-dom';

const Shop = () => {
    const { addToCart } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();
    const urlCategory = searchParams.get('category');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'All');
    const [displayCount, setDisplayCount] = useState(12);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get_categories.php`);
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                if (Array.isArray(data)) {
                    const catNames = data.map(c => c.name);
                    setCategories(['All', ...catNames]);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Sync selectedCategory with URL param
    useEffect(() => {
        if (urlCategory) {
            setSelectedCategory(urlCategory);
        } else {
            setSelectedCategory('All');
        }
        setDisplayCount(12);
    }, [urlCategory]);

    // Fetch products based on selectedCategory
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = selectedCategory === 'All'
                    ? `${API_BASE_URL}/get_products.php`
                    : `${API_BASE_URL}/get_products.php?category=${encodeURIComponent(selectedCategory)}`;

                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch products');

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Centered Page Header */}
            <div className="bg-white pt-16 pb-12 px-6 md:px-12 relative overflow-hidden border-b border-gray-100">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-5 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#EB3461] to-transparent rounded-full blur-[120px] -translate-y-1/2"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 text-[9px] font-black uppercase tracking-[0.3em] text-[#EB3461] mb-4 bg-pink-50 px-4 py-1.5 rounded-full"
                    >
                        <span>Premium Collection</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4 uppercase"
                    >
                        Explore The <span className="text-[#EB3461]">Collection</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center space-x-2 text-[10px] text-gray-400 font-black uppercase tracking-widest"
                    >
                        <Link to="/" className="hover:text-black transition-colors">Home</Link>
                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                        <span className="text-[#EB3461]">Shop Collection</span>
                    </motion.div>
                </div>
            </div>

            {/* Unified Shop Toolbar */}
            <div className="bg-white sticky top-[64px] md:top-[72px] z-30 border-b border-gray-100 px-4 md:px-12 shadow-sm">
                <div className="max-w-7xl mx-auto h-auto md:h-16 flex flex-col md:flex-row justify-between items-center py-4 md:py-0 gap-4">

                    {/* Categories */}
                    <div className="w-full md:w-auto overflow-x-auto scrollbar-hide">
                        <div className="flex items-center space-x-1 min-w-max pb-1 md:pb-0">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setSearchParams({ category: cat });
                                        setDisplayCount(12);
                                    }}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                                        ? 'bg-black text-white shadow-lg'
                                        : 'text-gray-400 hover:text-black hover:bg-gray-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Product Section */}
            <div className="py-12 md:py-16 px-4 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 space-y-6">
                            <div className="w-12 h-12 border-4 border-pink-50 border-t-[#EB3461] rounded-full animate-spin"></div>
                            <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Curating Collection...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-40 bg-white rounded-[40px] border border-gray-100">
                            <X size={40} className="text-red-500 mx-auto mb-6" />
                            <h2 className="text-xl font-black text-gray-900 mb-2">Connection Error</h2>
                            <p className="text-gray-500 text-sm">Failed to load masterpieces.</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-40 bg-white rounded-[40px] border border-gray-100">
                            <ShoppingBag size={60} className="text-gray-100 mx-auto mb-6" />
                            <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">No products in this category</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-20">
                                {products.slice(0, displayCount).map((product, i) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {displayCount < products.length && (
                                <div className="flex flex-col items-center justify-center space-y-6 pt-10 pb-20 border-t border-gray-100">
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                        Showing {Math.min(displayCount, products.length)} of {products.length} Items
                                    </p>
                                    <button
                                        onClick={() => setDisplayCount(prev => prev + 12)}
                                        className="group relative inline-flex items-center space-x-3 bg-black text-white px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-[#EB3461] transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_-10px_rgba(235,52,97,0.3)]"
                                    >
                                        <span>Load More Collection</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#EB3461] group-hover:bg-white animate-pulse"></div>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
