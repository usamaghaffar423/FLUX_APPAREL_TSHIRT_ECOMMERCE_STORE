import React from 'react';
import { IMAGES } from '../constants';

const articles = [
    {
        id: 1,
        title: "Fashion Inspiration for Your Everyday Lifestyle",
        date: "Jan 12, 2026",
        img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 2,
        title: "10 Style Hack Tips Every Women Should Know",
        date: "Feb 05, 2026",
        img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 3,
        title: "The Ultimate Guide to Modern Winter Outfits",
        date: "Feb 09, 2026",
        img: "https://images.unsplash.com/photo-1539109132271-3498177501e7?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 4,
        title: "Best Accessories to Match Your Summer Look",
        date: "Feb 10, 2026",
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600"
    }
];

const BlogArticles = () => {
    return (
        <section className="py-20 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Our Article</h2>
                    <p className="text-gray-500">Read our latest news and blog posts</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {articles.map((article) => (
                        <div key={article.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-2xl aspect-[16/10] mb-6">
                                <img
                                    src={article.img}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                            </div>
                            <p className="text-xs text-pink-500 font-bold mb-2 uppercase tracking-widest">{article.date}</p>
                            <h3 className="font-bold text-xl text-gray-800 group-hover:text-pink-600 transition-colors leading-tight">
                                {article.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogArticles;
