import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Cpu,
    Sun,
    BatteryCharging,
    Zap,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    Truck,
    Percent,
    Headphones,
    BadgeCheck,
    Leaf,
    Sparkles,
    ZoomIn,
    X
} from 'lucide-react';
const productBannerImg = 'https://ik.imagekit.io/qvztwdsij/product%20solor1.png?updatedAt=1790432410195';
import { getProducts } from '../utils/storage';
import { subscribeProducts, fetchProductsFromDB } from '../firebase/firestoreService';

const Product = ({ onOpenCustomKit }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [products, setProducts] = useState(() => getProducts());
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchProductsFromDB().then((items) => {
            if (items && items.length > 0) setProducts(items);
        }).catch(() => { });

        const unsub = subscribeProducts((liveItems) => {
            if (liveItems) setProducts(liveItems);
        });

        return () => {
            if (typeof unsub === 'function') unsub();
        };
    }, []);

    const filteredProducts = products.filter(p => {
        const isKit = p.isKit || p.category === 'kits';
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'kits') return isKit;
        if (selectedCategory === 'products') return !isKit;
        return true;
    });

    // Calculate price display for products, panels, inverters and kits
    const getLowestPrice = (product) => {
        const isKit = product.isKit || product.category === 'kits';
        const isPanel = product.category === 'panels' || (!isKit && String(product.name || '').toLowerCase().includes('panel'));
        const isInverter = product.category === 'inverters' || (!isKit && String(product.name || '').toLowerCase().includes('inverter'));

        // 1. Manual Price override if set by Admin
        if (product.manualPrice !== undefined && product.manualPrice !== '' && product.manualPrice !== null) {
            const rawVal = String(product.manualPrice).trim();
            const numVal = parseFloat(rawVal.replace(/[^\d.]/g, ''));

            let displayValue = rawVal;
            if (!isNaN(numVal) && numVal > 0) {
                if (isPanel || rawVal.toLowerCase().includes('watt')) {
                    displayValue = `₹${Math.round(numVal)} / Watt`;
                } else if (isKit) {
                    displayValue = `₹${Math.round(numVal).toLocaleString('en-IN')}*`;
                } else {
                    displayValue = `₹${Math.round(numVal).toLocaleString('en-IN')}`;
                }
            } else if (!displayValue.startsWith('₹')) {
                displayValue = `₹${displayValue}`;
            }

            let grossDisplay = null;
            if (product.manualGross !== undefined && product.manualGross !== '' && product.manualGross !== null) {
                const numGross = parseFloat(String(product.manualGross).replace(/[^\d.]/g, ''));
                if (!isNaN(numGross) && numGross > 0) {
                    grossDisplay = isPanel ? `₹${Math.round(numGross)} / Watt` : `₹${Math.round(numGross).toLocaleString('en-IN')}`;
                } else {
                    grossDisplay = String(product.manualGross);
                }
            } else if (isKit && product.capacityPricing?.['1kW']) {
                grossDisplay = `₹${Number(product.capacityPricing['1kW']).toLocaleString('en-IN')}`;
            }

            let subsidyBadge = null;
            if (product.manualSubsidy !== undefined && product.manualSubsidy !== '' && product.manualSubsidy !== null) {
                const numSub = parseFloat(String(product.manualSubsidy).replace(/[^\d.]/g, ''));
                if (isKit && !isNaN(numSub) && numSub > 0) {
                    subsidyBadge = `-₹${Math.round(numSub).toLocaleString('en-IN')} Subsidy`;
                } else if (String(product.manualSubsidy).trim() !== '') {
                    subsidyBadge = String(product.manualSubsidy);
                }
            } else if (isKit) {
                subsidyBadge = '-₹30,000 Subsidy';
            }

            return {
                isKit,
                label: product.priceLabel || (isKit ? 'Effective 1kW Price (After Subsidy)' : (isPanel ? 'Rate / Watt' : 'Starting Hardware Price')),
                value: displayValue,
                sub: grossDisplay ? `MRP: ${grossDisplay}` : (product.tag || 'Tier-1 Certified Hardware'),
                subsidyBadge,
                gross: grossDisplay,
            };
        }

        // 2. Solar Kit Default
        if (isKit) {
            const lowestGross = Number(product.capacityPricing?.['1kW']) || 65000;
            const subsidy1kw = 30000;
            const lowestNet = Math.max(0, lowestGross - subsidy1kw);
            return {
                isKit: true,
                label: 'Effective 1kW Price (After Subsidy)',
                value: `₹${lowestNet.toLocaleString('en-IN')}*`,
                sub: `Gross: ₹${lowestGross.toLocaleString('en-IN')}`,
                subsidyBadge: `-₹30,000 Subsidy`,
                gross: `₹${lowestGross.toLocaleString('en-IN')}`,
            };
        }

        // 3. Solar Panels Default
        if (isPanel) {
            const num = parseFloat(String(product.price || '').replace(/[^\d.]/g, '') || '25');
            const rate = num < 100 ? Math.round(num) : 25;
            const mrpRate = rate + 7;
            return {
                isKit: false,
                label: 'Rate / Watt',
                value: `₹${rate} / Watt`,
                sub: product.tag || 'Tier-1 Certified Panel',
                subsidyBadge: '22% OFF',
                gross: `₹${mrpRate} / Watt`,
            };
        }

        // 4. Inverters and Other Hardware Units Default
        let displayPrice = product.price || (isInverter ? '₹14,500' : '₹25,000');
        const numPrice = parseFloat(String(displayPrice).replace(/,/g, '').match(/\d+(?:\.\d+)?/)?.[0] || '14500');
        const formattedPrice = `₹${Math.round(numPrice).toLocaleString('en-IN')}`;
        const estimatedMRP = `₹${Math.round(numPrice * 1.3).toLocaleString('en-IN')}`;

        return {
            isKit: false,
            label: 'Starting Hardware Price',
            value: formattedPrice,
            sub: product.tag || 'Tier-1 Certified Hardware',
            subsidyBadge: '25% OFF',
            gross: estimatedMRP,
        };
    };

    return (
        <div className="bg-slate-50 min-h-screen text-slate-950 font-['Outfit',sans-serif]">
            {/* 1. Large Image Preview Modal (Only for zoom preview) */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 p-2 shadow-2xl animate-in fade-in zoom-in-95">
                        <button
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                            <X className="w-6 h-6 stroke-[2.5]" />
                        </button>
                        <div className="w-full h-full flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden">
                            <img
                                src={previewImage.url}
                                alt={previewImage.title}
                                className="max-w-full max-h-[80vh] object-contain"
                            />
                        </div>
                        <div className="p-4 text-center">
                            <h4 className="text-white font-black text-lg sm:text-xl">
                                {previewImage.title}
                            </h4>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Top Banner Section */}
            <div className="w-full h-36 sm:h-64 md:h-[60vh] min-h-[150px] sm:min-h-[380px] max-h-[580px] overflow-hidden bg-slate-950 flex items-center justify-center relative">
                <img
                    src={productBannerImg}
                    alt="Solar Products Showcase"
                    className="w-full h-full object-cover select-none"
                />
            </div>

            {/* 4. Floating Trust & Feature Strip */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6 sm:-mt-12 md:-mt-14 relative z-20">
                <div className="bg-white rounded-2xl sm:rounded-full border-2 border-slate-300 shadow-2xl p-4 sm:p-6 md:p-7 sm:px-8 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-center">

                    {/* Feature 1 */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#16a34a]/30">
                            <Truck className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5]" />
                        </div>
                        <div>
                            <h4 className="text-sm sm:text-base font-black text-slate-950 leading-tight">Direct Factory Dispatch</h4>
                            <p className="text-xs sm:text-sm text-slate-600 font-bold mt-0.5">Fast Delivery</p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#d91478] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#d91478]/30">
                            <Percent className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5]" />
                        </div>
                        <div>
                            <h4 className="text-sm sm:text-base font-black text-slate-950 leading-tight">High B2B Margins</h4>
                            <p className="text-xs sm:text-sm text-slate-600 font-bold mt-0.5">Best Prices</p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                            <BadgeCheck className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5]" />
                        </div>
                        <div>
                            <h4 className="text-sm sm:text-base font-black text-slate-950 leading-tight">100% Stock Guarantee</h4>
                            <p className="text-xs sm:text-sm text-slate-600 font-bold mt-0.5">Tier-1 Batch</p>
                        </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
                            <Headphones className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5]" />
                        </div>
                        <div>
                            <h4 className="text-sm sm:text-base font-black text-slate-950 leading-tight">Dedicated Support</h4>
                            <p className="text-xs sm:text-sm text-slate-600 font-bold mt-0.5">24/7 Assistance</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* 5. Product Catalog Section */}
            <div className="pt-12 sm:pt-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Heading */}
                <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#d91478]/10 to-[#16a34a]/10 border border-[#d91478]/30 text-slate-900 text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm">
                        <Leaf className="w-4 h-4 text-[#16a34a]" />
                        <span>Products & Kits</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 font-['Outfit',sans-serif]">
                        Explore <span className="text-[#16a34a]">Products & Kits</span>
                    </h2>
                    <p className="text-slate-800 text-base sm:text-lg font-bold leading-relaxed max-w-2xl mx-auto">
                        Top-tier complete solar kits with PM Surya Ghar subsidy support, alongside certified solar panels, inverters, and battery storage products with doorstep Cash on Delivery (COD).
                    </p>

                    {onOpenCustomKit && (
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={onOpenCustomKit}
                                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d91478] via-purple-600 to-[#16a34a] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Build Your Own Custom Kit (कस्टमाइज़ किट) ⚡</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Filter Tabs (All, Kits, Products) */}
                <div className="flex items-center justify-start sm:justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 overflow-x-auto pb-2 no-scrollbar">
                    {[
                        { id: 'all', label: 'All', icon: '⚡' },
                        { id: 'kits', label: 'Kits', icon: '☀️' },
                        { id: 'products', label: 'Products', icon: '📦' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedCategory(tab.id)}
                            className={`px-7 sm:px-9 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 shadow-sm flex items-center gap-2 ${selectedCategory === tab.id
                                ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white shadow-lg shadow-[#d91478]/30 scale-105'
                                : 'bg-white text-slate-800 border-2 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Clean, Uncluttered Product & Kit Grid (2 Columns on Mobile) */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
                    {filteredProducts.map(product => {
                        const isKit = product.isKit || product.category === 'kits';
                        const priceInfo = getLowestPrice(product);

                        return (
                            <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className={`p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border-2 transition-all duration-300 flex flex-col justify-between shadow-md sm:shadow-lg cursor-pointer group hover:-translate-y-1 ${isKit
                                        ? 'border-slate-300 hover:border-[#d91478] hover:shadow-2xl'
                                        : 'border-slate-300 hover:border-emerald-600 hover:shadow-2xl'
                                    }`}
                            >
                                <div className="space-y-2 sm:space-y-3.5">
                                    {/* Product Image */}
                                    {product.image ? (
                                        <div className="relative h-32 sm:h-52 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-200">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                                            <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 flex items-center gap-1">
                                                <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase shadow-md ${isKit ? 'bg-[#d91478] text-white' : 'bg-emerald-600 text-white'
                                                    }`}>
                                                    {product.tag || (isKit ? 'Solar Kit' : 'Hardware')}
                                                </span>
                                            </div>
                                            {product.images && product.images.length > 1 && (
                                                <div className="absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5 bg-slate-950/80 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-black text-white border border-white/20">
                                                    📸 {product.images.length}
                                                </div>
                                            )}
                                            <div className="absolute bottom-1.5 sm:bottom-2.5 right-1.5 sm:right-2.5 bg-slate-950/80 backdrop-blur-md p-1 sm:p-1.5 rounded-lg sm:rounded-xl text-white group-hover:text-emerald-400 transition-colors hidden sm:block">
                                                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-black border ${isKit
                                                    ? 'bg-pink-50 text-[#d91478] border-pink-200'
                                                    : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                                }`}>
                                                {product.tag || (isKit ? 'Solar Kit' : 'Hardware')}
                                            </span>
                                            <span className="text-[9px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 sm:px-2.5 rounded-full border border-emerald-200">
                                                {product.efficiency}
                                            </span>
                                        </div>
                                    )}

                                    {/* Product Title & Spec */}
                                    <div>
                                        {product.image && (
                                            <span className="text-[9px] sm:text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 sm:px-2.5 rounded-full border border-emerald-200 inline-block mb-1 sm:mb-1.5 truncate max-w-full">
                                                {product.efficiency}
                                            </span>
                                        )}
                                        <h3 className="text-xs sm:text-lg font-black text-slate-950 leading-snug group-hover:text-[#d91478] transition-colors line-clamp-2 min-h-[32px] sm:min-h-[44px]">
                                            {product.name}
                                        </h3>
                                    </div>

                                    {/* Price Card (Clean & Focused) */}
                                    <div className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 ${isKit
                                            ? 'bg-gradient-to-br from-pink-50/80 via-slate-50 to-emerald-50/50 border-pink-200/80 shadow-2xs'
                                            : 'bg-slate-50 border-slate-200'
                                        }`}>
                                        <div className="space-y-0.5">
                                            <span className="text-[8px] sm:text-[10px] font-black uppercase text-slate-500 block">
                                                {priceInfo.label}
                                            </span>
                                            <div className="flex items-baseline gap-1.5 flex-wrap">
                                                <span className="text-xs sm:text-lg font-black text-[#d91478] block leading-tight font-mono">
                                                    {priceInfo.value}
                                                </span>
                                                {priceInfo.gross && (
                                                    <span className="text-[10px] sm:text-xs text-slate-400 line-through font-bold">
                                                        {priceInfo.gross}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            {priceInfo.subsidyBadge ? (
                                                <span className="inline-block bg-emerald-100 text-emerald-800 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-300 shadow-2xs">
                                                    {priceInfo.subsidyBadge}
                                                </span>
                                            ) : (
                                                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500">{priceInfo.sub}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Strip */}
                                <div className="pt-2 sm:pt-4 flex items-center justify-between border-t border-slate-100 mt-2 sm:mt-4 gap-1">
                                    <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-600">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span className="truncate max-w-[100px]">{product.warranty}</span>
                                    </div>
                                    <div
                                        className={`w-full sm:w-auto text-center px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-white font-black text-[10px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-md transition-all group-hover:scale-105 ${isKit
                                                ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] shadow-[#d91478]/25'
                                                : 'bg-emerald-600 shadow-emerald-600/25'
                                            }`}
                                    >
                                        <span>{isKit ? 'Explore' : 'View'}</span>
                                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default Product;
