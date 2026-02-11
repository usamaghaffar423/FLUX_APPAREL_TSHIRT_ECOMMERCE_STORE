import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ category, rating, title, price, oldPrice, img }) => (
    <div className="flex flex-col group cursor-pointer">
        <div className="relative aspect-[4/5] bg-[#F7F7F7] rounded-[30px] overflow-hidden mb-4">
            <img
                src={img}
                className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                alt={title}
            />
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white p-2 rounded-full shadow-sm hover:bg-[#EB3461] hover:text-white transition-colors">
                    <Heart size={16} />
                </button>
                <button className="bg-white p-2 rounded-full shadow-sm hover:bg-[#EB3461] hover:text-white transition-colors">
                    <ShoppingCart size={16} />
                </button>
            </div>
        </div>
        <div className="flex justify-between items-start mb-1 text-[10px] font-bold uppercase tracking-widest">
            <span className="text-gray-400">{category}</span>
            <div className="flex items-center gap-1 text-gray-400">
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                </div>
                <span>0 Reviews</span>
            </div>
        </div>
        <h4 className="text-sm font-bold text-gray-800 leading-snug mb-2 group-hover:text-[#EB3461] transition-colors">
            {title}
        </h4>
        <div className="flex gap-2 items-center">
            <span className="text-[#EB3461] font-bold text-sm">{price}</span>
            {oldPrice && <span className="text-gray-300 line-through text-xs">{oldPrice}</span>}
        </div>
    </div>
);

const FeaturedCollection = () => {
    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                {/* Left Large Promo Card */}
                <div className="relative rounded-[40px] overflow-hidden min-h-[600px] group">
                    <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200"
                        alt="Featured Collection"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-12 left-12 right-12 z-10">
                        <h3 className="text-4xl font-bold text-white mb-4 leading-tight">
                            Everyday Fashion For <br /> Effortless Style
                        </h3>
                        <p className="text-gray-200 text-sm mb-8 max-w-sm leading-relaxed opacity-90">
                            Step into Vintage Vogue for timeless fashion with a modern twist. Explore our curated collections of vintage-inspired clothing.
                        </p>
                        <button className="bg-white text-black px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#EB3461] hover:text-white transition-all">
                            SHOP NOW
                        </button>
                    </div>
                </div>

                {/* Right Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
                    <ProductCard
                        category="Bag"
                        title="Runway-Ready Outfits For Stylish Living"
                        price="$410.00"
                        oldPrice="$450.00"
                        img="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400"
                    />
                    <ProductCard
                        category="Man T-Shirt"
                        title="Elegant Wardrobe Essentials For Every Occasion"
                        price="$410.00"
                        oldPrice="$450.00"
                        img="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400"
                    />
                    <ProductCard
                        category="Cole Dress"
                        title="Luxury Fashion At Affordable Prices"
                        price="$410.00"
                        oldPrice="$450.00"
                        img="https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=400"
                    />
                    <ProductCard
                        category="Cap"
                        title="The Ultimate Destination For Fashion Lovers"
                        price="$410.00"
                        oldPrice="$450.00"
                        img="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=400"
                    />
                </div>

            </div>
        </section>
    );
};

export default FeaturedCollection;
