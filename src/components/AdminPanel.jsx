import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, TrendingUp, ShoppingCart, RefreshCw, ChevronDown, ChevronUp,
    Calendar, Mail, MapPin, LogOut, Plus, Edit2, Trash2, X, Upload,
    Star, AlertTriangle, Search, Image, Tag, Eye, EyeOff, CheckSquare, Square,
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

// ── Constants ────────────────────────────────────────────────────────────────

const SUGGESTED_CATEGORIES = [
    'Shorts', 'Kurta', 'Shalwar Kameez', 'Fragrance', 'Imported Fragrance',
    'Wrist Watches', 'Accessories', 'HandBags',
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];

const BLANK = {
    name: '', category: '', price: '', old_price: '',
    description: '', image: '', sizes: '', colors: '',
    stock: 0, featured: false, active: true, sort_order: 0,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const pad = n => String(n).padStart(2, '0');
const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#EB3461] focus:ring-1 focus:ring-pink-200 transition placeholder:text-gray-300';

// ── Product Form Modal ───────────────────────────────────────────────────────

const ProductModal = ({ product, categories, token, onSave, onClose }) => {
    const [form, setForm]           = useState(product ? { ...product, price: product.price ?? '', old_price: product.old_price ?? '' } : { ...BLANK });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving]       = useState(false);
    const [error, setError]         = useState('');
    const [preview, setPreview]     = useState(product?.image || '');
    const fileRef                   = useRef(null);

    // Gallery images: { url (relative path or full url), preview (full url), id? (db id for existing) }
    const [extraImages, setExtraImages]         = useState([]);
    const [removedIds, setRemovedIds]           = useState([]);
    const [extraUploading, setExtraUploading]   = useState(false);
    const extraFileRef                          = useRef(null);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const toggleSize = (s) => {
        const curr = form.sizes ? form.sizes.split(',').map(x => x.trim()).filter(Boolean) : [];
        const next = curr.includes(s) ? curr.filter(x => x !== s) : [...curr, s];
        set('sizes', next.join(', '));
    };
    const hasSize = (s) => form.sizes?.split(',').map(x => x.trim()).includes(s);

    // Load existing gallery images when editing
    useEffect(() => {
        if (!product?.id) return;
        fetch(`${API_BASE_URL}/admin_product_images.php?product_id=${product.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setExtraImages(data.map(img => ({
                        url: img.image_url,
                        preview: img.image_url,
                        id: img.id,
                    })));
                }
            })
            .catch(() => {});
    }, [product?.id]);

    const handleExtraUpload = async (file) => {
        try {
            const fd = new FormData();
            fd.append('image', file);
            const res  = await fetch(`${API_BASE_URL}/admin_upload_image.php`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (data.success) {
                const fullPreview = API_BASE_URL.replace('/api', '') + '/' + data.url;
                setExtraImages(arr => [...arr, { url: data.url, preview: fullPreview }]);
            } else {
                setError(data.error || 'Upload failed.');
            }
        } catch { setError('Upload failed. Check your connection.'); }
    };

    const handleUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('image', file);
            const res  = await fetch(`${API_BASE_URL}/admin_upload_image.php`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (data.success) {
                set('image', data.url);
                setPreview(API_BASE_URL.replace('/api', '') + '/' + data.url);
            } else {
                setError(data.error || 'Upload failed.');
            }
        } catch { setError('Upload failed. Check your connection.'); }
        finally { setUploading(false); }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) handleUpload(file);
    };

    const handleSave = async () => {
        if (!form.name.trim())   { setError('Product name is required.');     return; }
        if (!form.price || isNaN(+form.price)) { setError('Valid price required.'); return; }
        setSaving(true); setError('');
        try {
            const url    = product ? `${API_BASE_URL}/admin_products.php?id=${product.id}` : `${API_BASE_URL}/admin_products.php`;
            const method = product ? 'PUT' : 'POST';
            const res    = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, price: +form.price, old_price: form.old_price ? +form.old_price : null }),
            });
            const data = await res.json();
            if (!data.success) { setError(data.error || 'Save failed.'); return; }

            const productId = product ? product.id : data.id;

            // Delete removed gallery images
            await Promise.all(removedIds.map(id =>
                fetch(`${API_BASE_URL}/admin_product_images.php?id=${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                })
            ));

            // Upload new gallery images (those without a db id)
            const newImages = extraImages.filter(img => !img.id);
            for (let i = 0; i < newImages.length; i++) {
                await fetch(`${API_BASE_URL}/admin_product_images.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ product_id: productId, image_url: newImages[i].url, sort_order: i }),
                });
            }

            onSave();
        } catch { setError('Network error. Please try again.'); }
        finally { setSaving(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 overflow-y-auto"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}>
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30 }}
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl my-auto"
                onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {product ? `ID #${product.id}` : 'Fill in the details and upload an image'}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                <div className="px-8 py-6 space-y-5 font-['Outfit']">
                    {error && (
                        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold px-4 py-3 rounded-2xl">
                            <AlertTriangle size={16} className="flex-shrink-0" /> {error}
                        </div>
                    )}

                    {/* ── Image Upload ── */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={e => e.preventDefault()}
                        onClick={() => fileRef.current?.click()}
                        className="relative cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#EB3461] transition-colors overflow-hidden bg-gray-50"
                        style={{ minHeight: 180 }}>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden"
                            onChange={e => { const f = e.target.files[0]; if (f) handleUpload(f); e.target.value = ''; }} />
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="preview" className="w-full max-h-56 object-contain" />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition flex items-center justify-center opacity-0 hover:opacity-100">
                                    <span className="bg-white text-gray-900 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow">Change Image</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                {uploading
                                    ? <div className="w-10 h-10 border-4 border-pink-100 border-t-[#EB3461] rounded-full animate-spin mb-3" />
                                    : <Upload size={32} className="text-gray-300 mb-3" />
                                }
                                <p className="text-sm font-bold text-gray-400">{uploading ? 'Uploading…' : 'Click or drag & drop image here'}</p>
                                <p className="text-[11px] text-gray-300 mt-1">JPEG, PNG, WebP — max 5 MB</p>
                            </div>
                        )}
                        {uploading && preview && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-pink-100 border-t-[#EB3461] rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Or paste URL */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Or Paste Image URL</label>
                        <input type="text" value={form.image} onChange={e => { set('image', e.target.value); setPreview(e.target.value); }}
                            placeholder="https://..." className={inputCls} />
                    </div>

                    {/* ── Gallery Images ── */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">
                            Gallery Images <span className="text-gray-300 normal-case font-medium">— shown on product page (select multiple)</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {extraImages.map((img, i) => (
                                <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200 group shrink-0 bg-gray-50">
                                    <img src={img.preview} alt="" className="w-full h-full object-cover"
                                        onError={e => { e.target.style.display = 'none'; }} />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (img.id) setRemovedIds(r => [...r, img.id]);
                                            setExtraImages(arr => arr.filter((_, j) => j !== i));
                                        }}
                                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                            {/* Add slot */}
                            <button
                                type="button"
                                onClick={() => extraFileRef.current?.click()}
                                disabled={extraUploading}
                                className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#EB3461] transition-colors flex flex-col items-center justify-center text-gray-300 hover:text-[#EB3461] shrink-0 disabled:opacity-50"
                            >
                                {extraUploading
                                    ? <div className="w-5 h-5 border-2 border-pink-100 border-t-[#EB3461] rounded-full animate-spin" />
                                    : <><Plus size={18} /><span className="text-[9px] font-black mt-1 uppercase tracking-widest">Add</span></>
                                }
                            </button>
                            <input
                                ref={extraFileRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={async (e) => {
                                    const files = Array.from(e.target.files);
                                    e.target.value = '';
                                    if (!files.length) return;
                                    setExtraUploading(true);
                                    for (const file of files) await handleExtraUpload(file);
                                    setExtraUploading(false);
                                }}
                            />
                        </div>
                    </div>

                    {/* Name + Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Product Name <span className="text-[#EB3461]">*</span></label>
                            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Classic White Tee" className={inputCls} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Category</label>
                            <input type="text" list="cat-list" value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. T-Shirts" className={inputCls} />
                            <datalist id="cat-list">
                                {[...SUGGESTED_CATEGORIES, ...categories.filter(c => !SUGGESTED_CATEGORIES.includes(c))].map(c => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    {/* Price + Old Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Selling Price (Rs.) <span className="text-[#EB3461]">*</span></label>
                            <input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="1200" className={inputCls} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Original Price (Rs.) <span className="text-gray-300 normal-case font-medium">— for sale badge</span></label>
                            <input type="number" min="0" value={form.old_price} onChange={e => set('old_price', e.target.value)} placeholder="1800" className={inputCls} />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Description</label>
                        <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
                            placeholder="Describe the product — material, fit, occasion…" className={inputCls + ' resize-none'} />
                    </div>

                    {/* Sizes */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Available Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {SIZE_OPTIONS.map(s => (
                                <button key={s} type="button" onClick={() => toggleSize(s)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                                        hasSize(s)
                                            ? 'bg-[#EB3461] border-[#EB3461] text-white'
                                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400'
                                    }`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                        <input type="text" value={form.sizes} onChange={e => set('sizes', e.target.value)}
                            placeholder="or type custom sizes: 28, 30, 32…"
                            className={inputCls + ' mt-2 text-sm'} />
                    </div>

                    {/* Colors + Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Colors</label>
                            <input type="text" value={form.colors} onChange={e => set('colors', e.target.value)} placeholder="Red, Black, White" className={inputCls} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Stock Quantity</label>
                            <input type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} className={inputCls} />
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex gap-4">
                        {[
                            { key: 'featured', label: 'Featured', desc: 'Show on homepage', icon: Star },
                            { key: 'active',   label: 'Visible',  desc: 'Live on website',  icon: Eye  },
                        ].map(({ key, label, desc, icon: Icon }) => (
                            <button key={key} type="button" onClick={() => set(key, !form[key])}
                                className={`flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all ${
                                    form[key] ? 'border-[#EB3461] bg-pink-50' : 'border-gray-200 bg-gray-50'
                                }`}>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${form[key] ? 'bg-[#EB3461] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    <Icon size={14} />
                                </div>
                                <div className="text-left">
                                    <p className={`text-[11px] font-black uppercase tracking-widest ${form[key] ? 'text-[#EB3461]' : 'text-gray-500'}`}>{label}</p>
                                    <p className="text-[10px] text-gray-400">{desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-gray-100">
                    <button onClick={onClose} className="px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-[#EB3461] text-white hover:bg-[#d42d57] transition shadow-lg shadow-pink-200 disabled:opacity-60">
                        {saving && <div className="w-4 h-4 border-2 border-pink-200 border-t-white rounded-full animate-spin" />}
                        {saving ? 'Saving…' : product ? 'Save Changes' : 'Add Product'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ── Delete Confirm ────────────────────────────────────────────────────────────

const DeleteConfirm = ({ productName, onConfirm, onCancel, loading }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-[32px] shadow-2xl p-10 max-w-sm w-full text-center font-['Outfit']">
            <div className="w-16 h-16 bg-red-50 rounded-[24px] flex items-center justify-center mx-auto mb-5">
                <Trash2 size={28} className="text-red-400" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Remove Product?</h3>
            <p className="text-sm text-gray-400 font-medium mb-2"><span className="text-gray-700 font-bold">"{productName}"</span></p>
            <p className="text-xs text-gray-400 mb-8">It will be hidden from the store. You can restore it anytime from the admin panel.</p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
                <button onClick={onConfirm} disabled={loading}
                    className="flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-60">
                    {loading ? 'Removing…' : 'Yes, Remove'}
                </button>
            </div>
        </motion.div>
    </motion.div>
);

// ── Main AdminPanel ───────────────────────────────────────────────────────────

const AdminPanel = () => {
    const { logout, token, authFetch } = useAuth();
    const [tab, setTab] = useState('products');

    // Orders state
    const [orders, setOrders]         = useState([]);
    const [ordersLoading, setOL]      = useState(true);
    const [ordersError, setOE]        = useState(null);
    const [expanded, setExpanded]     = useState(null);
    const [updatingStatus, setUS]     = useState(null);
    const [hasNew, setHasNew]         = useState(false);
    const [deletingOrder, setDO]      = useState(null);   // order to confirm delete
    const [orderDeleting, setODing]   = useState(false);

    // Products state
    const [products, setProducts]     = useState([]);
    const [prodLoading, setPL]        = useState(false);
    const [search, setSearch]         = useState('');
    const [filterCat, setFilterCat]   = useState('');
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal]   = useState(false);
    const [editing, setEditing]       = useState(null);
    const [deleteTarget, setDT]       = useState(null);
    const [deleting, setDeleting]     = useState(false);

    // ── Orders fetch ─────────────────────────────────────────────────────────
    const fetchOrders = useCallback(async (poll = false) => {
        if (!poll) setOL(true);
        try {
            const res  = await authFetch(`${API_BASE_URL}/get_orders.php`);
            const data = await res.json();
            if (Array.isArray(data)) {
                if (poll && data.length > orders.length) setHasNew(true);
                setOrders(data);
            }
        } catch (e) { if (!poll) setOE(e.message); }
        finally { if (!poll) setOL(false); }
    }, [authFetch, orders.length]);

    useEffect(() => {
        fetchOrders();
        const iv = setInterval(() => fetchOrders(true), 10000);
        return () => clearInterval(iv);
    }, []);

    const handleStatus = async (id, status) => {
        setUS(id);
        try {
            const res  = await authFetch(`${API_BASE_URL}/update_order_status.php`, { method: 'POST', body: JSON.stringify({ order_id: id, status }) });
            const data = await res.json();
            if (data.success) setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
        } catch {}
        finally { setUS(null); }
    };

    const handleDeleteOrder = async () => {
        if (!deletingOrder) return;
        setODing(true);
        try {
            const res  = await authFetch(`${API_BASE_URL}/delete_order.php?id=${deletingOrder}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setOrders(o => o.filter(x => x.id !== deletingOrder));
                if (expanded === deletingOrder) setExpanded(null);
            }
        } catch (e) { console.error('Delete order failed:', e); }
        finally { setODing(false); setDO(null); }
    };

    // ── Products fetch ────────────────────────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        setPL(true);
        try {
            const params = new URLSearchParams();
            if (search)    params.set('search', search);
            if (filterCat) params.set('category', filterCat);
            const res  = await authFetch(`${API_BASE_URL}/admin_products.php?${params}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
                const cats = [...new Set(data.map(p => p.category).filter(Boolean))].sort();
                setCategories(cats);
            }
        } catch {}
        finally { setPL(false); }
    }, [authFetch, search, filterCat]);

    useEffect(() => { fetchProducts(); }, [search, filterCat]);
    useEffect(() => { if (tab === 'products') fetchProducts(); }, [tab]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await authFetch(`${API_BASE_URL}/admin_products.php?id=${deleteTarget.id}`, { method: 'DELETE' });
            setProducts(p => p.filter(x => x.id !== deleteTarget.id));
        } catch {}
        finally { setDeleting(false); setDT(null); }
    };

    const orderStats = {
        revenue:    orders.reduce((s, o) => s + parseFloat(o.total || 0), 0),
        totalOrders:orders.length,
        avgValue:   orders.length ? (orders.reduce((s, o) => s + parseFloat(o.total || 0), 0) / orders.length).toFixed(0) : 0,
    };

    // Filtered products for display
    const displayed = products.filter(p => p.active || true); // admin sees all

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 font-['Outfit']">
            {/* ── Top Bar ── */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                            Classyfitters <span className="text-[#EB3461]">Admin</span>
                        </h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Store Management</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {hasNew && (
                            <span className="bg-[#EB3461] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                                New Order!
                            </span>
                        )}
                        <button onClick={() => { setHasNew(false); fetchOrders(); }}
                            className="flex items-center gap-2 border border-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-2xl hover:text-[#EB3461] transition">
                            <RefreshCw size={13} className={hasNew ? 'animate-spin text-[#EB3461]' : ''} />
                            Refresh
                        </button>
                        <button onClick={logout}
                            className="flex items-center gap-2 border border-gray-200 text-gray-500 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-2xl hover:text-red-500 transition">
                            <LogOut size={13} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* ── Stats ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Revenue',  value: `Rs. ${orderStats.revenue.toLocaleString()}`,        icon: TrendingUp,  color: 'text-green-500',   bg: 'bg-green-50'  },
                        { label: 'Orders',   value: orderStats.totalOrders,                              icon: ShoppingCart,color: 'text-[#EB3461]',   bg: 'bg-pink-50'   },
                        { label: 'Avg Order',value: `Rs. ${Number(orderStats.avgValue).toLocaleString()}`,icon: TrendingUp,  color: 'text-blue-500',    bg: 'bg-blue-50'   },
                        { label: 'Products', value: products.length,                                     icon: Package,     color: 'text-purple-500',  bg: 'bg-purple-50' },
                    ].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                            className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-lg shadow-gray-200/20">
                            <div className={`${s.bg} ${s.color} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
                                <s.icon size={18} />
                            </div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">{s.label}</p>
                            <p className="text-xl font-black text-gray-900 tracking-tight">{s.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ── Tabs ── */}
                <div className="flex gap-2 mb-6">
                    {[['products', `Products (${products.length})`], ['orders', `Orders (${orders.length})`]].map(([key, label]) => (
                        <button key={key} onClick={() => setTab(key)}
                            className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                tab === key ? 'bg-[#EB3461] text-white shadow-lg shadow-pink-200' : 'bg-white text-gray-400 border border-gray-100 hover:text-gray-700'
                            }`}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* ══════════════ PRODUCTS TAB ════════════════════════════ */}
                {tab === 'products' && (
                    <div>
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <div className="relative flex-1">
                                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                                    className="w-full bg-white border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-semibold text-gray-900 shadow-lg shadow-gray-100/50 outline-none focus:border-[#EB3461] placeholder:text-gray-300" />
                            </div>
                            {categories.length > 0 && (
                                <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                                    className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 shadow-lg shadow-gray-100/50 outline-none focus:border-[#EB3461]">
                                    <option value="">All Categories</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            )}
                            <button onClick={() => { setEditing(null); setShowModal(true); }}
                                className="flex items-center gap-2 bg-[#EB3461] text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#d42d57] transition shadow-lg shadow-pink-200 whitespace-nowrap">
                                <Plus size={16} /> Add Product
                            </button>
                        </div>

                        {/* Grid */}
                        {prodLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-[24px] overflow-hidden animate-pulse">
                                        <div className="aspect-square bg-gray-100" />
                                        <div className="p-4 space-y-2">
                                            <div className="h-3 bg-gray-100 rounded w-3/4" />
                                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-[32px] border border-gray-100 p-20 text-center">
                                <div className="w-20 h-20 bg-pink-50 rounded-[24px] flex items-center justify-center mx-auto mb-6">
                                    <Package size={36} className="text-[#EB3461]" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">No Products Yet</h3>
                                <p className="text-gray-400 text-sm mb-8">Start adding your products — it only takes a minute!</p>
                                <button onClick={() => { setEditing(null); setShowModal(true); }}
                                    className="bg-[#EB3461] text-white font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl hover:bg-[#d42d57] transition shadow-lg shadow-pink-200">
                                    + Add Your First Product
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {displayed.map(p => (
                                    <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                        className={`bg-white rounded-[24px] border overflow-hidden shadow-lg shadow-gray-200/20 group transition-all hover:shadow-xl hover:-translate-y-0.5 ${!p.active ? 'opacity-60 border-gray-100' : 'border-gray-100'}`}>
                                        {/* Image */}
                                        <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                            {p.image
                                                ? <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                : <div className="w-full h-full flex items-center justify-center"><Image size={32} className="text-gray-200" /></div>
                                            }
                                            {/* Badges */}
                                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                {p.featured && (
                                                    <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Featured</span>
                                                )}
                                                {!p.active && (
                                                    <span className="bg-gray-700 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Hidden</span>
                                                )}
                                            </div>
                                            {/* Hover actions */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                                <button onClick={() => { setEditing(p); setShowModal(true); }}
                                                    className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-blue-50 transition">
                                                    <Edit2 size={15} className="text-blue-500" />
                                                </button>
                                                <button onClick={() => setDT(p)}
                                                    className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-50 transition">
                                                    <Trash2 size={15} className="text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                        {/* Info */}
                                        <div className="p-3">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 line-clamp-1">{p.category}</p>
                                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight line-clamp-1">{p.name}</p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-sm font-black text-[#EB3461]">Rs. {parseFloat(p.price).toLocaleString()}</span>
                                                {p.old_price && parseFloat(p.old_price) > parseFloat(p.price) && (
                                                    <span className="text-xs text-gray-400 line-through">Rs. {parseFloat(p.old_price).toLocaleString()}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                    p.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'
                                                }`}>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ══════════════ ORDERS TAB ══════════════════════════════ */}
                {tab === 'orders' && (
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/30 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">All Orders</h2>
                            <span className="bg-gray-50 text-gray-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{orders.length} total</span>
                        </div>
                        {ordersLoading ? (
                            <div className="p-20 flex justify-center">
                                <div className="w-10 h-10 border-4 border-pink-100 border-t-[#EB3461] rounded-full animate-spin" />
                            </div>
                        ) : ordersError ? (
                            <div className="p-12 text-center">
                                <p className="text-red-400 font-bold">{ordersError}</p>
                                <button onClick={() => fetchOrders()} className="mt-4 bg-[#EB3461] text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-2xl">Retry</button>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="p-20 text-center">
                                <ShoppingCart size={40} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No orders yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {orders.map(order => (
                                    <div key={order.id}>
                                        <div onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                            className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/60 transition group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-black text-xs flex-shrink-0">#{order.id}</div>
                                                <div>
                                                    <p className="font-black text-gray-900 uppercase tracking-tight">{order.first_name} {order.last_name}</p>
                                                    <div className="flex flex-wrap items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                            <Calendar size={11} /> {new Date(order.created_at).toLocaleDateString()}
                                                        </span>
                                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${order.payment_method === 'cod' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{order.payment_method}</span>
                                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                                            order.status === 'Delivered' ? 'border-green-200 text-green-600 bg-green-50'
                                                            : order.status === 'Cancelled' ? 'border-red-200 text-red-500 bg-red-50'
                                                            : 'border-orange-200 text-orange-500 bg-orange-50'
                                                        }`}>{order.status || 'Pending'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 justify-between md:justify-end">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{order.items?.length} items</p>
                                                    <p className="text-lg font-black text-gray-900">Rs. {parseFloat(order.total).toLocaleString()}</p>
                                                </div>
                                                <button onClick={e => { e.stopPropagation(); setDO(order.id); }}
                                                    className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition flex-shrink-0"
                                                    title="Delete order">
                                                    <Trash2 size={14} className="text-red-400" />
                                                </button>
                                                <div className="text-gray-300 group-hover:text-[#EB3461] transition">
                                                    {expanded === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </div>
                                            </div>
                                        </div>
                                        <AnimatePresence>
                                            {expanded === order.id && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-gray-50/40 border-t border-gray-50">
                                                    <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                        <div>
                                                            <p className="text-[10px] font-black text-[#EB3461] uppercase tracking-widest mb-3">Customer Details</p>
                                                            <div className="space-y-3 text-sm">
                                                                <p className="flex items-center gap-2 text-gray-600"><Mail size={14} className="text-gray-300" /> {order.email}</p>
                                                                <p className="flex items-center gap-2 text-gray-600"><MapPin size={14} className="text-gray-300" /> {order.address}, {order.city} {order.postal_code}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-[#EB3461] uppercase tracking-widest mb-3">Items Ordered</p>
                                                            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                                                                {order.items?.map((item, i) => (
                                                                    <div key={i} className="flex justify-between text-sm">
                                                                        <div>
                                                                            <p className="font-bold text-gray-900">{item.title}</p>
                                                                            <p className="text-[11px] text-gray-400">Qty {item.quantity} × Rs. {parseFloat(item.price).toLocaleString()}</p>
                                                                        </div>
                                                                        <p className="font-black text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                                                    </div>
                                                                ))}
                                                                <div className="border-t border-gray-100 pt-3 flex justify-between">
                                                                    <span className="text-[10px] font-black uppercase text-[#EB3461] tracking-widest">Total</span>
                                                                    <span className="font-black text-gray-900">Rs. {parseFloat(order.total).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mt-4">
                                                                <p className="text-[10px] font-black text-[#EB3461] uppercase tracking-widest mb-2">Update Status</p>
                                                                <div className="flex gap-3 items-center">
                                                                    <select value={order.status || 'Pending'} onChange={e => handleStatus(order.id, e.target.value)}
                                                                        disabled={updatingStatus === order.id}
                                                                        className="flex-1 bg-white border border-gray-200 text-gray-900 text-xs font-bold uppercase tracking-widest rounded-2xl px-4 py-3 outline-none focus:border-[#EB3461] disabled:opacity-50">
                                                                        {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                                                    </select>
                                                                    {updatingStatus === order.id && <div className="w-5 h-5 border-2 border-pink-100 border-t-[#EB3461] rounded-full animate-spin" />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            <AnimatePresence>
                {showModal && (
                    <ProductModal
                        product={editing}
                        categories={categories}
                        token={token}
                        onSave={() => { setShowModal(false); setEditing(null); fetchProducts(); }}
                        onClose={() => { setShowModal(false); setEditing(null); }}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {deleteTarget && (
                    <DeleteConfirm
                        productName={deleteTarget.name}
                        onConfirm={handleDelete}
                        onCancel={() => setDT(null)}
                        loading={deleting}
                    />
                )}
            </AnimatePresence>

            {/* ── Order Delete Confirm ── */}
            <AnimatePresence>
                {deletingOrder && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setDO(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center"
                            onClick={e => e.stopPropagation()}>
                            <div className="w-16 h-16 bg-red-50 rounded-[24px] flex items-center justify-center mx-auto mb-5">
                                <Trash2 size={28} className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Delete Order?</h3>
                            <p className="text-sm text-gray-400 font-medium mb-2">Order <span className="text-gray-700 font-bold">#{deletingOrder}</span></p>
                            <p className="text-xs text-gray-400 mb-8">This will permanently remove the order and all its items. This cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDO(null)} className="flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
                                <button onClick={handleDeleteOrder} disabled={orderDeleting}
                                    className="flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-60">
                                    {orderDeleting ? 'Deleting…' : 'Yes, Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPanel;
