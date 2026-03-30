import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ShieldCheck, Truck, ArrowLeft, ArrowRight, Heart, Plus, Minus, Flame, Share2, Tag, AlertTriangle } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct]           = useState(null);
    const [images, setImages]             = useState([]);
    const [loading, setLoading]           = useState(true);
    const [quantity, setQuantity]         = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeImage, setActiveImage]   = useState(0);
    const [wishlisted, setWishlisted]     = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            setActiveImage(0);
            try {
                const [productRes, imagesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/get_products.php?id=${id}`),
                    fetch(`${API_BASE_URL}/get_product_images.php?product_id=${id}`),
                ]);

                const productData = await productRes.json();
                const imagesData  = await imagesRes.json();

                const p = Array.isArray(productData) ? productData[0] : productData;
                if (!p || p.error) {
                    navigate('/shop');
                    return;
                }
                setProduct(p);

                // Build gallery: prefer multi-image table; fall back to product.image_url
                const gallery = Array.isArray(imagesData) && imagesData.length > 0
                    ? imagesData.map(img => ({ url: img.image_url || FALLBACK_IMAGE, alt: img.alt_text || p.title }))
                    : [{ url: p.image_url || FALLBACK_IMAGE, alt: p.title }];
                setImages(gallery);

                // Related products
                if (p.category) {
                    const relRes  = await fetch(`${API_BASE_URL}/get_products.php?category=${encodeURIComponent(p.category)}&limit=5`);
                    const relData = await relRes.json();
                    setRelatedProducts(Array.isArray(relData) ? relData.filter(r => r.id !== p.id).slice(0, 4) : []);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
        window.scrollTo(0, 0);
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-pink-100 border-t-[#EB3461] rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Masterpiece...</p>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const price       = parseFloat(product.price ?? 0);
    const oldPrice    = parseFloat(product.retail_price ?? 0);
    const discount    = parseFloat(product.discount_pct ?? 0);
    const hasDiscount = discount > 0 && oldPrice > price;
    const isOutOfStock = product.stock_status === 'out_of_stock';
    const isLowStock   = product.stock_status === 'low_stock';
    const currentImage = images[activeImage]?.url || FALLBACK_IMAGE;

    return (
        <div className="min-h-screen bg-white pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-3 text-gray-400 hover:text-[#EB3461] transition-all mb-12 group uppercase font-black text-[10px] tracking-widest"
                >
                    <div className="w-10 h-10 border border-gray-100 rounded-2xl flex items-center justify-center group-hover:border-[#EB3461]/20 transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    <span>Back to Collection</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Left: Image Gallery */}
                    <div className="space-y-6">
                        <motion.div
                            key={activeImage}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="relative aspect-[4/5] rounded-[40px] overflow-hidden bg-gray-50 shadow-2xl shadow-gray-200/50"
                        >
                            <img
                                src={currentImage}
                                alt={images[activeImage]?.alt || product.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                            />

                            {/* Badges */}
                            <div className="absolute top-8 left-8 flex flex-col gap-2 z-10">
                                {product.is_trending && (
                                    <div className="bg-[#EB3461] text-white px-4 py-2 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-200">
                                        <Flame size={12} />
                                        Hot Pick
                                    </div>
                                )}
                                {hasDiscount && (
                                    <div className="bg-black text-white px-4 py-2 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                        <Tag size={10} />
                                        -{discount.toFixed(0)}% OFF
                                    </div>
                                )}
                                {isOutOfStock && (
                                    <div className="bg-gray-800 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                        Sold Out
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Thumbnails — only shown if more than 1 image */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                                            activeImage === i
                                                ? 'border-[#EB3461] shadow-lg scale-95'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.alt}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            {/* Category + Rating */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-black text-[#EB3461] uppercase tracking-[0.3em] bg-pink-50 px-4 py-1.5 rounded-full">
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">(5.0)</span>
                                </div>
                            </div>

                            {/* Brand */}
                            {product.brand_name && (
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{product.brand_name}</p>
                            )}

                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-6">
                                {product.title}
                            </h1>

                            {/* Pricing */}
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-4xl font-black text-gray-900 tracking-tighter">
                                    Rs. {price.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                    <span className="text-xl text-gray-300 font-bold line-through tracking-tighter">
                                        Rs. {oldPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            {product.free_shipping && (
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Free Shipping Included</p>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-500 text-base leading-relaxed mb-6 font-medium">
                            {product.description
                                ? product.description
                                : `Experience ultimate comfort and style with our premium ${product.title}. Crafted from high-quality materials and designed for the modern fashion enthusiast.`}
                        </p>

                        {/* Color / Size / Stock */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            {product.color && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Color:</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-700">{product.color}</span>
                                </div>
                            )}
                            {product.size && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Size:</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-700">{product.size}</span>
                                </div>
                            )}
                            {isLowStock && (
                                <div className="flex items-center gap-1.5 text-amber-500">
                                    <AlertTriangle size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Low Stock — Order Soon</span>
                                </div>
                            )}
                        </div>

                        {/* Quantity + Add to Cart */}
                        <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100 mb-10">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Quantity</p>
                                    <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-2 w-full md:w-36 justify-between">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={isOutOfStock}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 hover:text-black transition-all disabled:opacity-40"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="text-lg font-black text-gray-900">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            disabled={isOutOfStock}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 hover:text-black transition-all disabled:opacity-40"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-end flex-1">
                                    <button
                                        onClick={() => { if (!isOutOfStock) addToCart({ ...product, quantity }); }}
                                        disabled={isOutOfStock}
                                        className={`flex-1 py-4 px-8 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl group ${
                                            isOutOfStock
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                                : 'bg-[#EB3461] text-white hover:bg-black shadow-pink-100'
                                        }`}
                                    >
                                        <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                                        <span>{isOutOfStock ? 'Out of Stock' : 'Add To Cart'}</span>
                                    </button>
                                    <button
                                        onClick={() => setWishlisted(!wishlisted)}
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group ${
                                            wishlisted ? 'bg-[#EB3461] text-white' : 'border border-gray-100 text-gray-400 hover:text-[#EB3461] hover:border-[#EB3461]/20'
                                        }`}
                                    >
                                        <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} className="group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* USP Grid */}
                        <div className="grid grid-cols-3 gap-6 pt-10 border-t border-gray-100">
                            {[
                                { icon: ShieldCheck, label: 'Quality Guarantee' },
                                { icon: Truck, label: 'Fast Delivery' },
                                { icon: Share2, label: 'Exclusive Design' },
                            ].map((usp, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#EB3461]">
                                        <usp.icon size={20} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-tight">
                                        {usp.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-40">
                        <div className="flex items-center justify-between mb-16">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">
                                    Related <span className="text-[#EB3461]">Masterpieces</span>
                                </h2>
                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">Similar vibes you might love</p>
                            </div>
                            <button
                                onClick={() => navigate('/shop')}
                                className="text-[10px] font-black uppercase tracking-widest text-gray-900 hover:text-[#EB3461] flex items-center gap-3 transition-colors group"
                            >
                                View Full Collection
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
