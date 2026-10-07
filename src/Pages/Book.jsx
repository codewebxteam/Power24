import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CalendarCheck,
  ShieldCheck,
  Sun,
  CheckCircle2,
  Zap,
  ArrowRight,
  Leaf,
  LayoutDashboard,
  UserCheck,
  ShoppingBag,
  Sparkles,
  Phone,
  MessageCircle,
  Truck,
  MapPin,
  Clock,
  Check
} from 'lucide-react';
import { saveBooking, getCurrentUser, getProducts } from '../utils/storage';
import { subscribeProducts } from '../firebase/firestoreService';
import SEO from '../components/common/SEO.jsx';

const Book = () => {
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get('id') || '';
  const kitParam = searchParams.get('kit') || '';
  const kwParam = searchParams.get('kw') || '';

  const [currentUser, setCurrentUser] = useState(null);
  const [bookedBooking, setBookedBooking] = useState(null);
  const [propertyType, setPropertyType] = useState('residential');
  const [selectedKw, setSelectedKw] = useState(kwParam || '3kW');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    address: '',
    date: '',
    timeSlot: 'Morning (9 AM - 12 PM)',
  });

  useEffect(() => {
    const updateProductMatch = (products) => {
      let found = null;
      if (idParam) {
        found = products.find((p) => p.id === idParam);
      }
      if (!found && kitParam) {
        found = products.find((p) => p.name.toLowerCase() === kitParam.toLowerCase());
      }
      if (found) {
        setSelectedProduct(found);
      }
      if (kwParam) {
        setSelectedKw(kwParam);
      }
    };

    updateProductMatch(getProducts());
    const unsub = subscribeProducts((liveItems) => {
      if (liveItems) updateProductMatch(liveItems);
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [idParam, kitParam, kwParam]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, []);

  // Pricing calculations
  const isKit = selectedProduct ? (selectedProduct.isKit || selectedProduct.category === 'kits') : false;

  const getCapacityGross = (kw) => {
    if (selectedProduct?.capacityPricing && selectedProduct.capacityPricing[kw]) {
      return Number(selectedProduct.capacityPricing[kw]);
    }
    const kwNum = parseInt(kw, 10) || 1;
    if (selectedProduct?.ratePerWatt) {
      return kwNum * 1000 * Number(selectedProduct.ratePerWatt);
    }
    if (kw === '1kW' && selectedProduct?.manualGross) {
      return Number(selectedProduct.manualGross);
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
    if (kw === 1) return 30000;
    if (kw === 2) return 90000;
    return 108000;
  };

  const currentGross = selectedProduct
    ? (isKit
      ? getCapacityGross(selectedKw)
      : (Number(selectedProduct.originalPrice || selectedProduct.manualGross) || parseInt(String(selectedProduct.price || '').replace(/\D/g, ''), 10) || 0))
    : 0;

  const currentSubsidy = isKit ? getSubsidy(selectedKw) : 0;
  const currentNet = isKit
    ? Math.max(0, currentGross - currentSubsidy)
    : (Number(selectedProduct?.offerPrice || selectedProduct?.manualPrice) || currentGross);

  const handleBooking = (e) => {
    e.preventDefault();

    const bookingPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      propertyType,
      address: formData.address.trim(),
      date: formData.date,
      timeSlot: formData.timeSlot,
      productId: selectedProduct?.id || undefined,
      productName: selectedProduct?.name || kitParam || undefined,
      productImage: selectedProduct?.images?.[0] || selectedProduct?.image || undefined,
      capacity: isKit ? selectedKw : (selectedProduct ? 'Standard Unit' : undefined),
      grossPrice: currentGross > 0 ? currentGross : undefined,
      subsidy: currentSubsidy > 0 ? currentSubsidy : 0,
      netPayable: currentGross > 0 ? currentNet : undefined,
      type: selectedProduct
        ? (isKit ? `Solar Kit Booking (${selectedKw})` : `Hardware Booking: ${selectedProduct.name}`)
        : 'Site Survey Booking',
    };

    const saved = saveBooking(bookingPayload);
    setBookedBooking(saved);
  };

  const handleSendWhatsAppReceipt = (b) => {
    const text = `*Power24 Solar Booking Confirmation*%0A%0A*Customer:* ${b.name}%0A*Phone:* ${b.phone}%0A*Booking ID:* #${b.id.slice(-6)}%0A*Type:* ${b.type}%0A${b.productName ? `*Product/Kit:* ${b.productName}%0A` : ''}${b.capacity ? `*Capacity:* ${b.capacity}%0A` : ''}${b.grossPrice ? `*Gross Price:* ₹${b.grossPrice.toLocaleString('en-IN')}%0A` : ''}${b.subsidy > 0 ? `*Govt Subsidy:* -₹${b.subsidy.toLocaleString('en-IN')}%0A*Net Payable Cost:* ₹${b.netPayable.toLocaleString('en-IN')}*%0A` : ''}*Date & Slot:* ${b.date || 'Soon'} (${b.timeSlot})%0A*Address:* ${b.address}%0A%0APlease confirm my booking!`;
    window.open(`https://api.whatsapp.com/send?phone=917398198475&text=${text}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-950 py-6 sm:py-16 font-['Outfit',sans-serif]">
      <SEO
        title="Book Free Solar Site Survey & Consultation"
        description="Book your free rooftop solar site survey with Power24 Solar (Power 24). Check rooftop shade feasibility, PM Surya Ghar subsidy eligibility, and custom solar kit quotes."
        canonical="https://power24.in/book"
        keywords="Book solar survey Power24, Power 24 site visit, PM Surya Ghar survey Gorakhpur, Solar rooftop booking UP"
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-[#d91478]/10 to-[#16a34a]/10 border border-[#d91478]/30 text-slate-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
            <Leaf className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Zero-Cost Rooftop Assessment • PM Surya Ghar</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950">
            Book Your Free <span className="text-[#16a34a]">Solar Site Survey & Kit</span>
          </h1>
          <p className="text-slate-700 text-xs sm:text-sm font-medium max-w-2xl mx-auto leading-relaxed">
            Get an expert engineer to assess your rooftop shade, structure feasibility, and exact PM Surya Ghar subsidy eligibility with complete itemized pricing.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {bookedBooking ? (
            /* ========================================================= */
            /* 1. COMPREHENSIVE BOOKING ORDER RECEIPT / CONFIRMATION */
            /* ========================================================= */
            <div className="p-5 sm:p-10 rounded-3xl bg-white border-2 border-emerald-400 text-center space-y-5 sm:space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#d91478] to-[#16a34a] text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30">
                <CheckCircle2 className="w-7 h-7 sm:w-10 sm:h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Booking Confirmed!</h2>
                <p className="text-slate-700 text-xs sm:text-sm font-medium">
                  Thank you, <strong className="text-emerald-700 font-bold">{bookedBooking.name}</strong>! Your solar booking has been scheduled for <strong className="text-slate-950 font-bold">{bookedBooking.date || 'the upcoming slot'}</strong> ({bookedBooking.timeSlot}).
                </p>
                <span className="inline-block text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Booking ID: #{bookedBooking.id.slice(-6)}
                </span>
              </div>

              {/* Itemized Order & Price Receipt Card */}
              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/50 border-2 border-slate-200 text-left space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#d91478]" />
                    <span>Selected Booking Item:</span>
                  </span>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {bookedBooking.type}
                  </span>
                </div>

                {bookedBooking.productName && (
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    {bookedBooking.productImage && (
                      <img
                        src={bookedBooking.productImage}
                        alt={bookedBooking.productName}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-slate-200 bg-slate-900 shrink-0"
                      />
                    )}
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">{bookedBooking.productName}</h4>
                      {bookedBooking.capacity && (
                        <span className="inline-block text-[10px] font-bold text-[#d91478] bg-pink-50 border border-pink-200 px-2 py-0.2 rounded-md">
                          ⚡ Capacity: {bookedBooking.capacity}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Price Breakdown (Kitne ka book kiya hai) */}
                {bookedBooking.grossPrice && (
                  <div className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                    <div className="text-xs font-black uppercase text-slate-700 pb-1 border-b border-slate-100 flex items-center justify-between">
                      <span>Price Breakdown (कीमत का पूरा विवरण):</span>
                      <span className="text-[10px] text-emerald-700 font-bold">Zero Advance Required</span>
                    </div>

                    <div className="flex justify-between text-slate-600 text-xs">
                      <span>Gross System Turnkey Price:</span>
                      <span className="font-bold text-slate-900">₹{bookedBooking.grossPrice.toLocaleString('en-IN')}</span>
                    </div>

                    {bookedBooking.subsidy > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md text-xs">
                        <span>PM Surya Ghar Govt Subsidy:</span>
                        <span>- ₹{bookedBooking.subsidy.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                      <div>
                        <span className="font-black text-slate-900 text-xs sm:text-sm block">Effective Customer Payable:</span>
                        <span className="text-[9px] text-slate-500 font-medium">Payable after subsidy deduction</span>
                      </div>
                      <span className="text-lg sm:text-xl font-black text-[#d91478]">
                        ₹{bookedBooking.netPayable?.toLocaleString('en-IN')}*
                      </span>
                    </div>
                  </div>
                )}

                {/* Customer & Visit Location Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Contact Number:</span>
                    <span className="font-bold text-slate-900">{bookedBooking.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Property Type:</span>
                    <span className="font-bold text-slate-900 capitalize">{bookedBooking.propertyType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Inspection Slot:</span>
                    <span className="font-bold text-slate-900">{bookedBooking.date || 'Upcoming'} ({bookedBooking.timeSlot})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Installation Address:</span>
                    <span className="font-bold text-slate-900 truncate block">{bookedBooking.address}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleSendWhatsAppReceipt(bookedBooking)}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Confirmation to WhatsApp</span>
                </button>

                <Link
                  to="/dashboard"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#d91478] to-[#16a34a] text-xs sm:text-sm font-black uppercase tracking-wider text-white hover:opacity-95 shadow-lg shadow-[#d91478]/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Track Live in Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setBookedBooking(null)}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 transition-colors cursor-pointer"
                >
                  Book Another
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* 2. BOOKING FORM WITH PREVIEW CARD */
            /* ========================================================= */
            <form onSubmit={handleBooking} className="p-4 sm:p-8 rounded-3xl bg-white border-2 border-slate-200 space-y-4 sm:space-y-6 shadow-xl">
              
              {/* Logged In Info Banner */}
              {currentUser && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Logged in as <strong>{currentUser.name}</strong> ({currentUser.phone}) — details auto-filled.</span>
                </div>
              )}

              {/* Selected Product / Kit Live Price Banner (If chosen) */}
              {selectedProduct && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-pink-50 via-white to-emerald-50 border-2 border-[#d91478]/30 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-xs border border-amber-300">
                        <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
                        Special Offer
                      </span>
                      <span className="text-xs font-black uppercase text-[#d91478] flex items-center gap-1">
                        <span>Selected Solar Product / Kit</span>
                      </span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {isKit ? 'Govt Subsidy Eligible' : 'Direct Hardware'}
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5">
                    {(selectedProduct.images?.[0] || selectedProduct.image) && (
                      <img
                        src={selectedProduct.images?.[0] || selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 bg-slate-950 shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-black text-slate-950 leading-tight">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-1">{selectedProduct.description}</p>
                    </div>
                  </div>

                  {/* If kit, allow selecting capacity (1kW to 10kW) */}
                  {isKit && (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <label className="text-xs font-black uppercase text-slate-700 flex items-center justify-between">
                        <span>Select System Size:</span>
                        <span className="text-[#d91478] font-black">{selectedKw} Selected</span>
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                        {['1kW', '2kW', '3kW', '4kW', '5kW', '6kW', '8kW', '10kW'].map((kw) => (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => setSelectedKw(kw)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
                              selectedKw === kw
                                ? 'bg-[#d91478] text-white shadow-md'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {kw}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing Summary Strip */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block font-bold uppercase">
                        {isKit ? `${selectedKw} Effective Net Price:` : 'Product Price:'}
                      </span>
                      <span className="text-xl font-black text-[#d91478]">
                        ₹{currentNet.toLocaleString('en-IN')}{isKit ? '*' : ''}
                      </span>
                    </div>
                    {isKit && currentSubsidy > 0 && (
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-800 font-bold block">
                          PM Surya Ghar Subsidy:
                        </span>
                        <span className="text-xs font-black text-emerald-700">
                          - ₹{currentSubsidy.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Property Type */}
              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
                  1. Select Property Type
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                  {[
                    { id: 'residential', label: 'Residential' },
                    { id: 'commercial', label: 'Commercial' },
                    { id: 'industrial', label: 'Industrial' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPropertyType(item.id)}
                      className={`py-2 px-1 sm:py-2.5 sm:px-3 rounded-xl text-[10.5px] xs:text-[11px] sm:text-xs font-black capitalize sm:uppercase tracking-tight sm:tracking-wider transition-all border-2 cursor-pointer text-center truncate ${
                        propertyType === item.id
                          ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white border-transparent shadow-md'
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact & Date Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1">
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 font-bold placeholder-slate-400 text-xs focus:outline-none focus:border-[#d91478] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 73981 98475"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 font-bold placeholder-slate-400 text-xs focus:outline-none focus:border-[#d91478] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">Preferred Inspection Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 font-bold text-xs focus:outline-none focus:border-[#d91478] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">Preferred Time Slot</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 font-bold text-xs focus:outline-none focus:border-[#d91478] focus:bg-white"
                  >
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">Rooftop Address & Pincode *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="House/Building No, Street, City and PIN Code..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 font-bold placeholder-slate-400 text-xs focus:outline-none focus:border-[#d91478] focus:bg-white"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#d91478] via-purple-600 to-[#16a34a] hover:opacity-95 shadow-lg shadow-[#d91478]/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <CalendarCheck className="w-4 h-4 stroke-[2]" />
                  <span>Confirm Free Site Survey & Booking</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;

