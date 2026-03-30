import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wishlisted, setWishlisted] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get_products.php?limit=8`);
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching best sellers:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const toggleWishlist = (id) => {
        setWishlisted(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) {
        return (
            <section className="py-20 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Sabse Zyada Bikne Wale</h2>
                        <p className="text-gray-500">KPK ke logon ki favourite picks — watches, perfumes, handbags aur zyada</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="group relative animate-pulse">
                                <div className="bg-gray-100 rounded-2xl aspect-[3/4]" />
                                <div className="mt-4 text-center space-y-2">
                                    <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                                    <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto" />
                                    <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-red-500 font-medium">Unable to load products. Please ensure XAMPP MySQL is running.</p>
                    <p className="text-gray-400 text-sm mt-2">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Sabse Zyada Bikne Wale</h2>
                    <p className="text-gray-500">KPK ke logon ki favourite picks — watches, perfumes, handbags aur zyada</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSellers;
