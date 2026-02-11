import React from 'react';
import { Truck, HeadphoneOff, BadgeCheck, ShieldCheck } from 'lucide-react';

const features = [
    {
        icon: <Truck className="text-gray-700" size={32} />,
        title: "Free Shipping",
        desc: "Free Shipping On All Orders."
    },
    {
        icon: <HeadphoneOff className="text-gray-700" size={32} />, // Headset icon substitute
        title: "Online Support",
        desc: "Contact us 24 hr, 7 days"
    },
    {
        icon: <BadgeCheck className="text-gray-700" size={32} />,
        title: "Money Guarantee",
        desc: "30 Day Money Back Guarantee"
    },
    {
        icon: <ShieldCheck className="text-gray-700" size={32} />,
        title: "Secure Payment",
        desc: "We ensure secure payment"
    }
];

const Features = () => {
    return (
        <section className="py-16 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((f, i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <div className="flex-shrink-0">{f.icon}</div>
                        <div>
                            <h3 className="font-bold text-gray-800">{f.title}</h3>
                            <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
