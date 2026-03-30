import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <span className="p-2 bg-pink-50 rounded-xl text-[#EB3461]">
                                    <ShoppingBag size={20} />
                                </span>
                                <h2 className="text-xl font-black tracking-tight text-gray-900">YOUR CART ({cartCount})</h2>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 text-gray-400 hover:text-[#EB3461] hover:bg-pink-50 rounded-xl transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6 scrollbar-hide">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">Your cart is empty</p>
                                        <p className="text-gray-400 text-sm">Add some trendy pieces to get started!</p>
                                    </div>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="bg-[#EB3461] text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-pink-100"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id} className="flex space-x-4 group">
                                        <div className="w-24 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 relative group-hover:shadow-md transition-all">
                                            <img src={item.image_url || item.img} alt={item.title || item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-[#EB3461] transition-colors">
                                                        {item.title || item.name}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors ml-2"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-pink-600 font-black text-sm mt-1">
                                                    Rs. {parseFloat(item.price).toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-[#EB3461] transition-all"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-[#EB3461] transition-all"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-gray-900 font-bold text-sm">
                                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-8 border-t border-gray-100 bg-gray-50/50 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-500 text-sm font-medium">
                                        <span>Subtotal</span>
                                        <span>Rs. {cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 text-sm font-medium">
                                        <span>Shipping</span>
                                        <span className="text-green-500 font-bold">FREE</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <span className="text-lg font-black text-gray-900 uppercase tracking-tight">Total</span>
                                        <span className="text-2xl font-black text-[#EB3461] tracking-tighter">Rs. {cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <Link
                                    to="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full bg-[#EB3461] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-pink-100/50 hover:bg-black transition-all transform hover:-translate-y-1 active:translate-y-0 text-center block"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
