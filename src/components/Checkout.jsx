import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { CreditCard, Truck, ShoppingBag, CheckCircle, ArrowLeft, ChevronRight, Lock, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user, authFetch } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [confirmedOrderId, setConfirmedOrderId] = useState(null);
    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await authFetch(`${API_BASE_URL}/place_order.php`, {
                method: 'POST',
                body: JSON.stringify({
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    paymentMethod: formData.paymentMethod,
                    total: cartTotal,
                    items: cartItems.map(item => ({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        quantity: item.quantity
                    }))
                }),
            });

            const result = await response.json();

            if (result.success) {
                setIsProcessing(false);
                setConfirmedOrderId(result.orderId);
                setIsSuccess(true);
                clearCart();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.error('Order Failure Details:', result);
                alert('Order Failed: ' + (result.message || result.error || 'Unknown error'));
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Checkout Network/Parsing Error:', error);
            alert('Connection Error: Could not reach the server. Please check your internet or run setup_db.php.');
            setIsProcessing(false);
        }
    };

    // Must be logged in to checkout
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white p-12 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200"
                >
                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#EB3461]">
                        <UserPlus size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight">Sign In Required</h2>
                    <p className="text-gray-500 mb-8 font-medium text-sm">
                        Create a free account or sign in to track your order and receive updates on your delivery status.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link to="/register" className="inline-flex items-center justify-center gap-3 bg-[#EB3461] text-white px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d42d57] transition-all">
                            <UserPlus size={15} />
                            <span>Create Free Account</span>
                        </Link>
                        <Link to="/login" className="inline-flex items-center justify-center gap-3 border border-gray-200 text-gray-900 px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:border-[#EB3461] hover:text-[#EB3461] transition-all">
                            <span>Already have an account? Sign In</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (cartItems.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white p-12 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200"
                >
                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#EB3461]">
                        <ShoppingBag size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8 font-medium">Looks like you haven't added any masterpieces to your collection yet.</p>
                    <Link to="/shop" className="inline-flex items-center space-x-3 bg-black text-white px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-[#EB3461] transition-all">
                        <span>Go To Shop</span>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="max-w-2xl w-full bg-white p-16 rounded-[50px] border border-gray-100 shadow-2xl shadow-gray-200 relative overflow-hidden text-center"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#EB3461] to-purple-600"></div>
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                        <CheckCircle size={56} />
                    </div>
                    <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase leading-[0.9]">Order <br /><span className="text-[#EB3461]">Confirmed!</span></h2>
                    <p className="text-gray-500 mb-10 text-lg font-medium max-w-sm mx-auto">Thank you for choosing classyfitters. Your stylish new look is being prepared for shipment.</p>

                    <div className="bg-gray-50 p-6 rounded-3xl mb-10 text-left border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Number</span>
                            <span className="text-sm font-black text-gray-900">#CLASS-{confirmedOrderId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Estimated Delivery</span>
                            <span className="text-sm font-black text-gray-900">3-5 Business Days</span>
                        </div>
                    </div>

                    <Link to="/" className="inline-flex items-center space-x-3 bg-black text-white px-12 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-[#EB3461] transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]">
                        <span>Continue Shopping</span>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white pt-16 pb-12 px-6 border-b border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <Link to="/shop" className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#EB3461] hover:text-black transition-colors mb-2">
                            <ArrowLeft size={14} />
                            <span>Return To Shop</span>
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase">Secure <span className="text-[#EB3461]">Checkout</span></h1>
                    </div>
                    <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span className="text-black">Information</span>
                        <ChevronRight size={14} />
                        <span>Shipping</span>
                        <ChevronRight size={14} />
                        <span>Payment</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-6 md:px-12">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Shipping Section */}
                        <section className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-3 bg-pink-50 rounded-2xl text-[#EB3461]">
                                    <Truck size={24} />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Shipping Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="alex@example.com"
                                        className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EB3461] transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">First Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="Alex"
                                        className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EB3461] transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Last Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Smith"
                                        className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EB3461] transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Delivery Address</label>
                                    <input
                                        required
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="123 Street Name"
                                        className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EB3461] transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">City</label>
                                    <input
                                        required
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Karachi, Lahore, Islamabad..."
                                        className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EB3461] transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Postal Code</label>
                                    <input
                                        required
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        placeholder="75500"
                                        className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-[#EB3461] transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Country</label>
                                    <input
                                        disabled
                                        type="text"
                                        value="Pakistan (Only Shipping Region)"
                                        className="w-full bg-gray-100 border-none p-4 rounded-2xl font-black text-gray-400 text-xs uppercase"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Payment Section */}
                        <section className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                    <CreditCard size={24} />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                                    { id: 'bank', label: 'Local Bank Transfer', icon: Lock },
                                    { id: 'easypaisa', label: 'EasyPaisa', icon: CheckCircle },
                                    { id: 'jazzcash', label: 'JazzCash', icon: CheckCircle }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                                        className={`flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all ${formData.paymentMethod === method.id
                                            ? 'border-[#EB3461] bg-pink-50'
                                            : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-xl ${formData.paymentMethod === method.id ? 'bg-[#EB3461] text-white' : 'bg-white text-gray-400'}`}>
                                            <method.icon size={18} />
                                        </div>
                                        <span className={`font-black uppercase text-[10px] tracking-widest ${formData.paymentMethod === method.id ? 'text-[#EB3461]' : 'text-gray-500'}`}>
                                            {method.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Method Instructions */}
                            <AnimatePresence mode="wait">
                                {formData.paymentMethod && formData.paymentMethod !== 'cod' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-8 p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#EB3461]">Transfer Instructions</p>
                                        <div className="space-y-3">
                                            {formData.paymentMethod === 'bank' && (
                                                <>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-400 font-bold uppercase">Bank Name</span>
                                                        <span className="font-black text-gray-900">Meezan Bank Ltd</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-400 font-bold uppercase">Account Title</span>
                                                        <span className="font-black text-gray-900 uppercase">classyfitters STORE</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-400 font-bold uppercase">Account No</span>
                                                        <span className="font-black text-gray-900">1234 5678 9012</span>
                                                    </div>
                                                </>
                                            )}
                                            {formData.paymentMethod === 'easypaisa' && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-400 font-bold uppercase">EasyPaisa Account</span>
                                                    <span className="font-black text-gray-900">03XX XXXXXXX</span>
                                                </div>
                                            )}
                                            {formData.paymentMethod === 'jazzcash' && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-400 font-bold uppercase">JazzCash Account</span>
                                                    <span className="font-black text-gray-900">03XX XXXXXXX</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[9px] font-medium text-gray-400">Please send a screenshot of the transaction on our WhatsApp for fast verification.</p>
                                    </motion.div>
                                )}
                                {formData.paymentMethod === 'cod' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-8 p-6 bg-green-50 rounded-3xl border border-green-100"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-widest text-green-600">COD Availability</p>
                                        <p className="text-[10px] font-medium text-green-700 mt-2">Cash on Delivery is available across Pakistan. You will pay the rider upon receiving your parcel.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 sticky top-32">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Order Summary</h2>

                            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-6 mb-8 scrollbar-hide">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex space-x-4">
                                        <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h3>
                                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">QTY: {item.quantity}</p>
                                            <p className="text-[#EB3461] font-black text-xs mt-1 font-['Space_Mono']">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-100">
                                <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-black">Rs. {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-black tracking-widest uppercase text-[10px]">Free Delivery</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 text-xl font-black text-gray-900 uppercase">
                                    <span>Total</span>
                                    <span className="text-2xl text-[#EB3461] tracking-tighter">Rs. {cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full mt-10 bg-black text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-[#EB3461] transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                            >
                                <AnimatePresence mode="wait">
                                    {isProcessing ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"
                                        />
                                    ) : (
                                        <motion.div
                                            key="text"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center space-x-3"
                                        >
                                            <span>Complete Masterpiece</span>
                                            <ArrowLeft size={16} className="rotate-180" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>

                            <div className="mt-8 flex items-center justify-center space-x-3 text-gray-300">
                                <Lock size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure SSL Encryption</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
