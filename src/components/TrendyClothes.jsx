import React from 'react';
import { IMAGES } from '../constants';
import { ShoppingCart, Heart } from 'lucide-react';

const trendyProducts = [
    { id: 101, name: "Canvas Backpack", price: "$49", img: IMAGES.category_blue, cat: "Bags" },
    { id: 102, name: "Floral Summer Top", price: "$25", img: IMAGES.product_3, cat: "Women" },
    { id: 103, name: "Navy Polo Shirt", price: "$32", img: IMAGES.product_2, cat: "Men" },
    { id: 104, name: "Classic Grey Cap", price: "$18", img: IMAGES.product_4, cat: "Accessory" },
];

const TrendyClothes = () => {
    return (
        <section className="py-20 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Trendy Clothes</h2>
                    <p className="text-gray-500">Stay ahead of the curve with our latest arrivals</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Featured Large Card */}
                    <div className="relative rounded-[40px] overflow-hidden group h-[600px] lg:col-span-1 shadow-2xl">
                        <img
                            src={IMAGES.hero}
                            alt="Trendy Feature"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-10 left-10 text-white z-10">
                            <h3 className="text-3xl font-bold mb-4">Everyday Fashion For Effortless Style</h3>
                            <button className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all">
                                Shop Now
                            </button>
                        </div>
                    </div>

                    {/* Right Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {trendyProducts.map((p) => (
                            <div key={p.id} className="bg-gray-50 rounded-3xl p-6 flex flex-col group hover:shadow-lg transition-shadow">
                                <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 bg-white">
                                    <img
                                        src={p.img}
                                        alt={p.name}
                                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                                            <Heart size={20} />
                                        </button>
                                        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                                            <ShoppingCart size={20} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#EB3461] mb-1">{p.cat}</p>
                                    <h4 className="font-bold text-gray-800 mb-1 group-hover:text-pink-500 transition-colors uppercase">{p.name}</h4>
                                    <p className="text-gray-400 font-medium">{p.price}.00</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrendyClothes;
