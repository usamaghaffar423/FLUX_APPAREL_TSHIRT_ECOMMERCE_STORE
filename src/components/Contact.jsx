import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    // Load reCAPTCHA script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        return () => {
            const existingScript = document.querySelector('script[src="https://www.google.com/recaptcha/api.js"]');
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);

    return (
        <section id="contact" className="py-24 px-6 md:px-12 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#EB3461] text-xs font-black uppercase tracking-[0.3em] mb-4 block">Get In Touch</span>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-8 tracking-tighter">
                            Let's Talk About <br />
                            <span className="text-[#EB3461]">Your Style</span>
                        </h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-12 max-w-md">
                            Have questions about our collections or need help with an order? Our team is here to provide you with the ultimate fashion experience.
                        </p>

                        <div className="space-y-8">
                            {[
                                { icon: <Mail className="text-[#EB3461]" size={24} />, title: "Email Us", detail: "info@osamaghaffar.pro" },
                                { icon: <Phone className="text-[#EB3461]" size={24} />, title: "Call Us", detail: "+92 345 6789100" },
                                { icon: <MapPin className="text-[#EB3461]" size={24} />, title: "Visit Us", detail: "Batkhela, Malakand, Pakistan" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center space-x-6 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center group-hover:bg-[#EB3461] group-hover:text-white transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">{item.title}</h4>
                                        <p className="text-gray-500 font-medium">{item.detail}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60 z-0"></div>

                        <div className="relative z-10 bg-white border border-gray-100 p-8 md:p-12 rounded-[40px] shadow-2xl shadow-pink-100/20">
                            <form action="/api/contact.php" method="POST" className="space-y-6">
                                <input type="hidden" name="request" value="contactsform" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-pink-100 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            required
                                            className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-pink-100 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone Number</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="+92 345 6789100"
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-pink-100 outline-none transition-all font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Your Message</label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        placeholder="How can we help you today?"
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-pink-100 outline-none transition-all font-medium resize-none"
                                    ></textarea>
                                </div>

                                {/* reCAPTCHA */}
                                <div className="flex justify-center md:justify-start">
                                    <div className="g-recaptcha" data-sitekey="6LdRx4oqAAAAANP_YyvU4_Y88P88V8vY88_8Y8V"></div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#EB3461] text-white rounded-2xl py-5 px-8 flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-pink-100 hover:-translate-y-1 active:translate-y-0"
                                >
                                    Send Message
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
