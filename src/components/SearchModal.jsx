import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, ShoppingBag, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Debounced search
    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/get_products.php?search=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const data = await response.json();
                    setResults(data);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-24 pb-12 px-6 md:px-12 bg-black/60 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col overflow-hidden max-h-[80vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-50 flex items-center space-x-6">
                            <div className="w-12 h-12 bg-[#EB3461]/10 rounded-2xl flex items-center justify-center">
                                <Search size={24} className="text-[#EB3461]" />
                            </div>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search by name or category (e.g. WATCH, T-SHIRT)..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 bg-transparent text-2xl font-black text-gray-900 placeholder:text-gray-200 outline-none uppercase tracking-tighter"
                            />
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                            {loading && (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                    <Loader2 size={32} className="text-[#EB3461] animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Searching classyfitters Collection...</p>
                                </div>
                            )}

                            {!loading && results.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {results.map((product, i) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group flex items-center space-x-6 p-4 rounded-3xl border border-gray-50 hover:border-[#EB3461]/20 hover:bg-gray-50/50 transition-all cursor-pointer"
                                            onClick={() => {
                                                navigate(`/shop?category=${product.category}`);
                                                onClose();
                                            }}
                                        >
                                            <div className="w-24 h-28 rounded-2xl overflow-hidden bg-gray-50 shrink-0 shadow-lg shadow-gray-200/40">
                                                <img
                                                    src={product.image_url}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-[#EB3461] mb-1 block">
                                                    {product.category}
                                                </span>
                                                <h4 className="font-black text-gray-900 uppercase tracking-tight text-lg leading-tight mb-2 truncate">
                                                    {product.title}
                                                </h4>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                                                        Rs. {parseFloat(product.price).toLocaleString()}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addToCart(product);
                                                        }}
                                                        className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center group-hover:bg-[#EB3461] transition-all"
                                                    >
                                                        <ShoppingBag size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {!loading && query.length >= 2 && results.length === 0 && (
                                <div className="text-center py-20 px-8">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search size={32} className="text-gray-200" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">No results for "{query}"</h3>
                                    <p className="text-gray-400 font-medium">Try searching for something else like "Wallets" or "T-Shirt".</p>
                                </div>
                            )}

                            {!query && !loading && (
                                <div>
                                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 px-2">
                                        <TrendingUp size={12} className="text-[#EB3461]" />
                                        <span>Popular Searches</span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {['T-SHIRT', 'WATCH', 'WALLETS', 'PURFUME'].map((term) => (
                                            <button
                                                key={term}
                                                onClick={() => setQuery(term)}
                                                className="px-8 py-4 bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-[#EB3461] hover:text-white transition-all shadow-sm border border-gray-100"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-6 flex items-center justify-between md:px-12">
                            <div className="flex items-center space-x-4">
                                <span className="bg-white px-3 py-1.5 rounded-lg text-[9px] font-black text-gray-400 border border-gray-100">ESC</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Close Search</span>
                            </div>
                            <Link
                                to="/shop"
                                onClick={onClose}
                                className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-gray-900 hover:text-[#EB3461] transition-colors"
                            >
                                <span>Browse All Masterpieces</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
