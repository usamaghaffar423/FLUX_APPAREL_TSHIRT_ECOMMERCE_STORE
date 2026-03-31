import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config';
import ProductCard from './ProductCard';

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
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/get_products.php?limit=8`)
            .then(r => r.ok ? r.json() : [])
            .then(data => setProducts(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-[#EB3461] text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">
                            Featured
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[0.9] tracking-tighter uppercase">
                            Aaj Ka Look,<br />
                            <span className="text-[#EB3461]">Kal Ki Yaad</span>
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

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                    {loading
                        ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
                        : products.map(p => (
                            <ProductCard key={p.id} product={p} variant="featured" />
                        ))
                    }
                </div>

            </div>
        </section>
    );
};

export default FeaturedCollection;
