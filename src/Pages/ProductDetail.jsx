import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Sun,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Phone,
  MessageCircle,
  Truck,
  Sparkles,
  Leaf,
  Layers,
  Award,
  Clock,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  ShoppingBag,
  MapPin,
  User,
  Mail,
  X,
  Check
} from 'lucide-react';
import { getProducts, addOrder } from '../utils/storage';
import { subscribeProducts, fetchProductsFromDB } from '../firebase/firestoreService';
const productBannerImg = 'https://ik.imagekit.io/qvztwdsij/product%20solor1.png?updatedAt=1790432410195';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedKw, setSelectedKw] = useState('3kW');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // COD Order State
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Gorakhpur',
    pincode: '273001',
    notes: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const updateFromList = (allProducts) => {
      if (!allProducts || allProducts.length === 0) return;
      const found = allProducts.find((p) => p.id === id || p.id === `kit-${id}` || p.id === `prod-${id}`) || allProducts[0];
      setProduct(found);
      setActiveImgIndex(0);
      setRelatedProducts(allProducts.filter((p) => p.id !== found?.id).slice(0, 3));
    };

    updateFromList(getProducts());

    fetchProductsFromDB().then((items) => {
      if (items && items.length > 0) updateFromList(items);
    }).catch(() => { });

    const unsub = subscribeProducts((liveItems) => {
      if (liveItems && liveItems.length > 0) updateFromList(liveItems);
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [id]);

  if (!product) return null;

  const isKit = product.isKit || product.category === 'kits';

  const productImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : [product.image || productBannerImg];

  const currentMainImg = productImages[activeImgIndex] || productImages[0] || productBannerImg;

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0));
  };

  const getCapacityPrice = (prod, kw) => {
    if (kw === '1kW' && prod?.manualGross) {
      const g = Number(String(prod.manualGross).replace(/[^\d.]/g, ''));
      if (g > 0) return g;
    }
    if (prod?.capacityPricing && prod.capacityPricing[kw]) {
      return Number(prod.capacityPricing[kw]);
    }
    const defaults = {
      '1kW': 65000,
      '2kW': 125000,
      '3kW': 185000,
      '4kW': 240000,
      '5kW': 295000,
      '6kW': 350000,
      '8kW': 450000,
      '10kW': 550000,
    };
    return defaults[kw] || 185000;
  };

  const getSubsidy = (kwStr) => {
    const kw = parseInt(kwStr, 10) || 3;
    if (kw === 1) {
      if (product?.manualSubsidy) {
        const s = Number(String(product.manualSubsidy).replace(/[^\d.]/g, ''));
        if (s > 0) return s;
      }
      return 30000;
    }
    if (kw === 2) return 90000;
    return 108000;
  };

  const hasKwCapacity = Boolean(product.isKit || product.category === 'kits');
  const isSubsidyEligible = hasKwCapacity;
  const currentGross = hasKwCapacity
    ? getCapacityPrice(product, selectedKw)
    : (parseInt(String(product.price || '').replace(/\D/g, ''), 10) || 25000);
  const currentSubsidy = isSubsidyEligible ? getSubsidy(selectedKw) : 0;
  const manualNetVal = (selectedKw === '1kW' && product?.manualPrice)
    ? Number(String(product.manualPrice).replace(/[^\d.]/g, ''))
    : 0;
  const currentNet = (manualNetVal > 0) ? manualNetVal : Math.max(0, currentGross - currentSubsidy);

  // Estimates
  const kwNum = parseInt(selectedKw, 10) || 3;
  const dailyUnits = (kwNum * 4.2).toFixed(1);
  const monthlyUnits = Math.round(kwNum * 4.2 * 30);
  const annualSavings = Math.round(monthlyUnits * 12 * 7.5);
  const twentyFiveYearSavings = Math.round(annualSavings * 25);

  const handleShareWhatsApp = () => {
    const text = hasKwCapacity
      ? `*Power24 Solar Inquiry*%0A%0A*Item:* ${product.name}%0A*Selected Size:* ${selectedKw}%0A*Gross Price:* ₹${currentGross.toLocaleString('en-IN')}%0A${isSubsidyEligible ? `*PM Surya Ghar Subsidy:* ₹${currentSubsidy.toLocaleString('en-IN')}%0A*Net Payable:* ₹${currentNet.toLocaleString('en-IN')}%0A` : ''}%0APlease schedule a site survey!`
      : `*Power24 Product Inquiry*%0A%0A*Product:* ${product.name}%0A*Price:* ${product.price}%0A%0APlease send quotation!`;
    window.open(`https://api.whatsapp.com/send?phone=917398198475&text=${text}`, '_blank');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!orderForm.customerName.trim() || !orderForm.phone.trim() || !orderForm.address.trim()) {
      alert('कृपया अपना पूरा नाम, मोबाइल नंबर और डिलीवरी का पता भरें।');
      return;
    }

    setIsSubmittingOrder(true);

    const payableAmount = isSubsidyEligible && currentSubsidy > 0 ? currentNet : currentGross;

    const newOrderPayload = {
      customerName: orderForm.customerName.trim(),
      phone: orderForm.phone.trim(),
      email: orderForm.email.trim() || 'N/A',
      address: orderForm.address.trim(),
      city: orderForm.city.trim() || 'Gorakhpur',
      pincode: orderForm.pincode.trim() || '273001',
      notes: orderForm.notes.trim() || '',
      productId: product.id,
      productName: product.name,
      productImage: currentMainImg,
      capacity: hasKwCapacity ? selectedKw : 'Standard Pack',
      quantity: 1,
      grossPrice: currentGross,
      subsidy: isSubsidyEligible ? currentSubsidy : 0,
      netPayable: payableAmount,
      paymentMode: 'Cash on Delivery (COD)',
    };

    const createdOrder = addOrder(newOrderPayload);
    setIsSubmittingOrder(false);
    setShowOrderModal(false);
    setOrderSuccess(createdOrder);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-['Outfit',sans-serif] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* 1. Breadcrumbs & Back Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/product"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-slate-700 hover:text-[#d91478] bg-white border border-slate-200 px-4 py-2 rounded-full shadow-2xs transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products (सभी सोलर किट)</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <Link to="/product" className="hover:text-slate-900">Products</Link>
            <span>/</span>
            <span className="text-[#d91478] truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>

        {/* 2. Main Product Details 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (Images, Specs, Inclusions) - 7 cols */}
          <div className="lg:col-span-7 space-y-6">

            {/* Product Multi-Image Showcase Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-200 shadow-xl overflow-hidden space-y-3 relative group">
              {/* Main Image Display */}
              <div className="relative h-64 sm:h-96 md:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={currentMainImg}
                  alt={`${product.name} - View ${activeImgIndex + 1}`}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {/* Left/Right Navigation Arrows if multiple photos */}
                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-[#d91478] text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-110 cursor-pointer"
                      title="Previous Image"
                    >
                      <ChevronLeft className="w-6 h-6 stroke-[3]" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-[#d91478] text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-110 cursor-pointer"
                      title="Next Image"
                    >
                      <ChevronRight className="w-6 h-6 stroke-[3]" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${isKit ? 'bg-[#d91478] text-white' : 'bg-emerald-600 text-white'
                    }`}>
                    {product.tag || (isKit ? '☀️ Complete Solar Kit' : '⚡ Hardware')}
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {productImages.length > 1 && (
                    <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white border border-white/20">
                      📸 {activeImgIndex + 1} / {productImages.length}
                    </span>
                  )}
                  <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    {product.efficiency}
                  </span>
                </div>
              </div>

              {/* Thumbnails Row if Multiple Images */}
              {productImages.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5">
                  {productImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImgIndex(idx)}
                      className={`relative w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${activeImgIndex === idx
                          ? 'border-[#d91478] ring-4 ring-[#d91478]/30 scale-105 shadow-md'
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                        }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Sun className="w-5 h-5 text-[#d91478]" />
                <span>System Overview & Technical Description</span>
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-medium">
                {product.description}
              </p>
            </div>

            {/* Key Inclusions & Features */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#16a34a]" />
                  <span>Package Inclusions & Key Features</span>
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  100% Certified Tier-1
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {Array.isArray(product.features) &&
                  product.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-bold text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{feat}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Warranty & Government Subsidy Approvals */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#d91478] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{product.warranty}</h4>
                  <p className="text-xs text-slate-300">MNRE Approved & Direct Bank Transfer (DBT) Subsidy Guaranteed</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
                <div className="bg-slate-800/60 p-3 rounded-2xl">
                  <span className="block font-black text-emerald-400">₹1,08,000</span>
                  <span className="text-[10px] text-slate-400">Max UP Subsidy</span>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-2xl">
                  <span className="block font-black text-[#d91478]">25 Years</span>
                  <span className="text-[10px] text-slate-400">Linear Performance</span>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-2xl">
                  <span className="block font-black text-amber-400">0% EMI</span>
                  <span className="text-[10px] text-slate-400">Bank Loan Support</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Capacity Selector, Live Subsidy & Booking Action) - 5 cols */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">

            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6">

              {/* Product Header */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${isKit ? 'bg-pink-100 text-[#d91478] border-pink-300' : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                    }`}>
                    {isKit ? 'PM Surya Ghar Subsidy Eligible' : 'Tier-1 Certified Hardware'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{product.warranty}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Interactive Capacity Selector (1kW to 10kW) for Solar Kits, Panels & Inverters */}
              {hasKwCapacity ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-[#d91478]" />
                        <span>Select System Size (सिस्टम क्षमता):</span>
                      </label>
                      <span className="text-xs font-black text-[#d91478] bg-pink-100 px-2.5 py-0.5 rounded-full">
                        {selectedKw} Selected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['1kW', '2kW', '3kW', '4kW', '5kW', '6kW', '8kW', '10kW'].map((cap) => {
                        const capGross = getCapacityPrice(product, cap);
                        const capSub = isSubsidyEligible ? getSubsidy(cap) : 0;
                        const capNet = Math.max(0, capGross - capSub);
                        const isSelected = selectedKw === cap;

                        return (
                          <button
                            key={cap}
                            type="button"
                            onClick={() => setSelectedKw(cap)}
                            className={`p-2.5 rounded-2xl text-left transition-all cursor-pointer border ${isSelected
                                ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white shadow-lg shadow-[#d91478]/25 scale-102 border-transparent'
                                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>{cap}</span>
                            </div>
                            <div className={`text-xs font-black mt-0.5 ${isSelected ? 'text-amber-200' : 'text-[#d91478]'}`}>
                              ₹{capNet.toLocaleString('en-IN')}{isSubsidyEligible ? '*' : ''}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price & Subsidy Box */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border-2 border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>{selectedKw} Turnkey Gross Price (Original):</span>
                      <span className="font-bold line-through text-slate-400">
                        ₹{currentGross.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {currentSubsidy > 0 && (
                      <div className="flex items-center justify-between text-xs text-emerald-800 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        <span>PM Surya Ghar Govt Subsidy (Direct to Bank):</span>
                        <span className="text-emerald-700 font-black">- ₹{currentSubsidy.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black uppercase text-slate-900 block">
                          Effective Net Cost (Customer Payable):
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Customer payable after deducting subsidy
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-black text-[#d91478]">
                        ₹{currentNet.toLocaleString('en-IN')}*
                      </span>
                    </div>
                  </div>

                  {/* Generation & Savings Breakdown */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div>
                      <span className="text-slate-600 block text-[11px] font-bold">Monthly Generation:</span>
                      <span className="font-black text-emerald-950 text-sm">{monthlyUnits} Units / Month</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[11px] font-bold">Annual Bill Cut:</span>
                      <span className="font-black text-emerald-700 text-sm">~ ₹{annualSavings.toLocaleString('en-IN')} / Yr</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Non-Kit Single Product Price Box */
                <div className="p-5 bg-gradient-to-br from-emerald-50/60 via-slate-50 to-emerald-50/30 rounded-2xl border-2 border-emerald-200 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-900 block tracking-wider">Product Price:</span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-800">
                        {product.price || `₹${currentGross.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    <span className="text-xs font-black text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-300 shadow-2xs">
                      {product.tag || 'Tier-1 Certified Hardware'}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 pt-1 border-t border-emerald-100">
                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Free Doorstep Delivery Available</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* 1. Order Now (with checkout modal) */}
                <button
                  type="button"
                  onClick={() => setShowOrderModal(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#d91478]/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Now</span>
                </button>

                {/* 2. Book Free Site Survey */}
                <Link
                  to={`/book?id=${product.id}&kw=${selectedKw}&kit=${encodeURIComponent(product.name)}`}
                  className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4 text-emerald-700" />
                  <span>Book Free Site Survey ({hasKwCapacity ? `${selectedKw} Kit` : 'Inquire'})</span>
                </Link>

                {/* 3. WhatsApp Direct */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Inquire on WhatsApp (+91 7398198475)</span>
                </button>
              </div>

              {/* Assurances Strip */}
              <div className="pt-2 flex flex-col gap-1.5 text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#d91478]" />
                  <span>Fast Delivery Across Gorakhpur & Eastern UP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Free Doorstep Site Survey in Gorakhpur</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Complete Net Metering & UP Govt Subsidy Liaison</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>0% Interest Easy Bank EMI Options Available</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* COD CHECKOUT / ORDER MODAL */}
        {/* ========================================================================= */}
        {showOrderModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-8">

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#d91478] flex items-center justify-center text-white">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">Cash on Delivery (COD) Order</h3>
                    <p className="text-xs text-slate-300">No advance payment required. Pay upon delivery.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Order Form */}
              <form onSubmit={handlePlaceOrder} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">

                {/* Product Summary Mini Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
                  <img
                    src={currentMainImg}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {hasKwCapacity && (
                        <span className="text-[10px] font-black bg-pink-100 text-[#d91478] px-2 py-0.2 rounded-md">
                          Size: {selectedKw}
                        </span>
                      )}
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-md">
                        COD Verified
                      </span>
                    </div>
                    <div className="text-xs font-black text-[#d91478] mt-1">
                      Payable on Delivery: ₹{(isSubsidyEligible && currentSubsidy > 0 ? currentNet : currentGross).toLocaleString('en-IN')}{isSubsidyEligible ? '*' : ''}
                    </div>
                  </div>
                </div>

                {/* Customer Details Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                      Full Name (पूरा नाम) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar Verma"
                        value={orderForm.customerName}
                        onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#d91478]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                        Mobile Number (फ़ोन नंबर) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9839012345"
                          value={orderForm.phone}
                          onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#d91478]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={orderForm.email}
                          onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#d91478]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                      Complete Delivery Address (पूरा डिलीवरी पता) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <textarea
                        required
                        rows={2}
                        placeholder="House / Flat No., Colony / Village, Landmark..."
                        value={orderForm.address}
                        onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#d91478]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">City / District</label>
                      <input
                        type="text"
                        value={orderForm.city}
                        onChange={(e) => setOrderForm({ ...orderForm, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#d91478]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">Pin Code</label>
                      <input
                        type="text"
                        value={orderForm.pincode}
                        onChange={(e) => setOrderForm({ ...orderForm, pincode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#d91478]"
                      />
                    </div>
                  </div>

                  {/* Payment Mode Notice (Only COD) */}
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                        ✓
                      </div>
                      <div>
                        <span className="text-xs font-black text-emerald-900 block">Payment Method: Cash on Delivery (COD)</span>
                        <span className="text-[10px] text-emerald-700">Pay 100% at doorstep after material inspection</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                      0 Advance
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Special Delivery Notes (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Call before arrival / 3rd floor rooftop"
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#d91478]"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#d91478]/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSubmittingOrder ? 'Placing Order...' : 'Confirm Order (कैश ऑन डिलीवरी)'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ORDER SUCCESS POPUP MODAL */}
        {/* ========================================================================= */}
        {orderSuccess && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center space-y-5 border-2 border-emerald-500 shadow-2xl animate-in fade-in zoom-in-95">

              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                  Order Successfully Placed (COD)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  बधाई! आपका आर्डर दर्ज हो गया है
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Order ID: <span className="font-black text-slate-900">{orderSuccess.id}</span>
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Product:</span>
                  <span className="truncate max-w-[200px] text-slate-950 font-black">{orderSuccess.productName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Capacity:</span>
                  <span className="font-bold text-slate-900">{orderSuccess.capacity}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Customer:</span>
                  <span className="font-bold text-slate-900">{orderSuccess.customerName} ({orderSuccess.phone})</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery Address:</span>
                  <span className="font-bold text-slate-900 text-right truncate max-w-[180px]">{orderSuccess.address}, {orderSuccess.city}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-black text-slate-900">Amount Payable (COD):</span>
                  <span className="text-base font-black text-[#d91478]">₹{orderSuccess.netPayable.toLocaleString('en-IN')}*</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <a
                  href={`https://api.whatsapp.com/send?phone=917398198475&text=*Power24 New COD Order Placed*%0A%0A*Order ID:* ${orderSuccess.id}%0A*Product:* ${orderSuccess.productName}%0A*Size:* ${orderSuccess.capacity}%0A*Customer:* ${orderSuccess.customerName}%0A*Phone:* ${orderSuccess.phone}%0A*Address:* ${orderSuccess.address}, ${orderSuccess.city} - ${orderSuccess.pincode}%0A*Payable Amount (COD):* ₹${orderSuccess.netPayable.toLocaleString('en-IN')}%0A%0APlease confirm dispatch timeline!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-[#16a34a] hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Confirmation on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setOrderSuccess(null)}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase cursor-pointer transition-colors"
                >
                  Continue Browsing (बंद करें)
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 3. Related Products & Kits */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t-2 border-slate-200 space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Explore Other Solar Kits & Hardware
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/product/${rel.id}`}
                  className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-slate-200 hover:border-[#d91478] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-2 sm:space-y-3">
                    {rel.image && (
                      <div className="h-28 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950">
                        <img
                          src={rel.image}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#d91478] transition-colors line-clamp-2">
                      {rel.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium line-clamp-2 hidden sm:block">
                      {rel.description}
                    </p>
                  </div>
                  <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between mt-2 sm:mt-3 text-[10px] sm:text-xs font-black text-[#d91478]">
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
