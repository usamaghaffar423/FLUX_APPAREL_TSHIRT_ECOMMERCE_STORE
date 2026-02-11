import React from 'react';
import { IMAGES } from '../constants';
import { Heart, ShoppingBag } from 'lucide-react';

const products = [
    {
        id: 1,
        name: "Premium Cotton T-Shirt",
        price: "$29.00",
        image: IMAGES.product_1,
        category: "Clothing"
    },
    {
        id: 2,
        name: "Casual Denim Jacket",
        price: "$89.00",
        image: IMAGES.product_2,
        category: "Outerwear"
    },
    {
        id: 3,
        name: "Summer Floral Dress",
        price: "$45.00",
        image: IMAGES.product_3,
        category: "Women"
    },
    {
        id: 4,
        name: "Classic Beige Fedora",
        price: "$35.00",
        image: IMAGES.product_4,
        category: "Accessories"
    }
];

const BestSellers = () => {
    return (
        <section className="py-20 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Best Selling Clothes</h2>
                    <p className="text-gray-500">Explore the newest collections of our store</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4]">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-black hover:text-white transition-colors">
                                        <Heart size={18} />
                                    </button>
                                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-black hover:text-white transition-colors">
                                        <ShoppingBag size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
                                <h3 className="font-bold text-gray-900 group-hover:text-pink-500 transition-colors text-lg">{product.name}</h3>
                                <p className="text-pink-600 font-bold mt-1">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSellers;
