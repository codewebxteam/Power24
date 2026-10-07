import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Zap,
  ShieldCheck,
  Plus,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Sun,
  Layers,
  FileText,
  BadgeCheck,
  Building,
  Home as HomeIcon,
  RefreshCw,
  MessageCircle,
  ShoppingBag,
  Truck,
  IndianRupee
} from 'lucide-react';
import { getCurrentUser, logoutUser, getUserBookings, getUserOrders } from '../../utils/storage';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'orders'
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  const loadUserData = () => {
    const current = getCurrentUser();
    if (!current) {
      navigate('/login', { replace: true });
      return;
    }
    setUser(current);
    const userLeads = getUserBookings(current);
    const userOrdersList = getUserOrders(current);
    setBookings(userLeads);
    setOrders(userOrdersList);
  };

  useEffect(() => {
    loadUserData();

    const handleUpdate = () => {
      const current = getCurrentUser();
      if (current) {
        setBookings(getUserBookings(current));
        setOrders(getUserOrders(current));
      }
    };

    window.addEventListener('power24_bookings_updated', handleUpdate);
    window.addEventListener('power24_orders_updated', handleUpdate);

    return () => {
      window.removeEventListener('power24_bookings_updated', handleUpdate);
      window.removeEventListener('power24_orders_updated', handleUpdate);
    };
  }, [navigate]);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logoutUser();
    navigate('/', { replace: true });
  };

  if (!user) return null;

  const isCompletedStatus = (st) => {
    const s = (st || '').toLowerCase();
    return s === 'installation done' || s === 'completed' || s === 'delivered';
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'active') return !isCompletedStatus(b.status) && b.status !== 'Cancelled';
    if (filter === 'completed') return isCompletedStatus(b.status);
    return true;
  });

  const activeCount = bookings.filter((b) => !isCompletedStatus(b.status) && b.status !== 'Cancelled').length;
  const completedCount = bookings.filter((b) => isCompletedStatus(b.status)).length;

  const getStatusBadge = (status) => {
    const norm = (status || '').toLowerCase().trim();
    if (norm === 'installation done' || norm === 'completed' || norm === 'delivered') {
      return {
        bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
        dot: 'bg-emerald-500',
        label: 'Installation Done (सोलर एक्टिव)',
        step: 4,
      };
    }
    if (norm === 'subsidy approval' || norm === 'dispatched' || norm === 'out for delivery') {
      return {
        bg: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
        dot: 'bg-purple-500',
        label: status || 'Subsidy Approval (सरकारी सब्सिडी)',
        step: 3,
      };
    }
    if (norm === 'site inspection' || norm === 'scheduled' || norm === 'confirmed') {
      return {
        bg: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
        dot: 'bg-blue-500 animate-pulse',
        label: status || 'Site Inspection (इंजीनियर विज़िट)',
        step: 2,
      };
    }
    if (norm === 'cancelled') {
      return {
        bg: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
        dot: 'bg-rose-500',
        label: 'Cancelled (रद्द)',
        step: 0,
      };
    }
    return {
      bg: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
      dot: 'bg-amber-500 animate-ping',
      label: 'Request Received (डिटेल्स दर्ज)',
      step: 1,
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-['Outfit',sans-serif] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* 1. Header & User Profile Bar */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#d91478]/10 via-[#16a34a]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Left: Avatar & Info */}
          <div className="flex items-center gap-4 sm:gap-5 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#d91478] via-purple-600 to-[#16a34a] p-1 shadow-lg shadow-[#d91478]/25 shrink-0 flex items-center justify-center text-white">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-black uppercase text-white">
                {user.name.charAt(0)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Verified Customer
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-bold">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {user.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#d91478]" />
                  {user.email}
                </span>
                {user.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {user.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <Link
              to="/product"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Explore Products & Kits</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 2. Stat Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Total Bookings</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{bookings.length}</div>
            <p className="text-[11px] text-slate-500 font-medium">Solar survey consultations</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Product Orders (COD)</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">{orders.length}</div>
            <p className="text-[11px] text-slate-500 font-medium">Hardware & direct orders</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Completed</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <BadgeCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{completedCount}</div>
            <p className="text-[11px] text-slate-500 font-medium">Installed rooftops</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">PM Subsidy Help</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#d91478]">Up to ₹1,08,000</div>
            <p className="text-[11px] text-slate-500 font-medium">Direct Bank Transfer (DBT)</p>
          </div>
        </div>

        {/* 3. Section Switcher Tabs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-slate-950 text-white shadow-lg'
                : 'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sun className="w-4 h-4 text-[#d91478]" />
            <span>Solar Bookings & Surveys ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-slate-950 text-white shadow-lg'
                : 'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Product Orders (COD) ({orders.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: SOLAR BOOKINGS & SURVEY STATUS */}
        {/* ========================================================================= */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* Top Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Sun className="w-6 h-6 text-[#d91478]" />
                  <span>My Solar Bookings & Survey Status (सर्वेक्षण व किट स्टेटस)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time tracking of what you booked, system cost, subsidy paperwork, and commissioning
                </p>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    filter === 'all'
                      ? 'bg-slate-950 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({bookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('active')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    filter === 'active'
                      ? 'bg-[#d91478] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    filter === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Completed ({completedCount})
                </button>
              </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">No Bookings Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You haven't booked any solar site surveys or kit orders yet. Book a free solar consultation today!
                  </p>
                </div>
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book Free Site Survey Now</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBookings.map((b) => {
                  const statusMeta = getStatusBadge(b.status);

                  return (
                    <div
                      key={b.id}
                      className="border-2 border-slate-200 rounded-3xl p-5 sm:p-7 space-y-5 bg-gradient-to-b from-white to-slate-50/50 shadow-sm hover:border-[#d91478]/40 transition-all"
                    >
                      {/* Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-slate-900 text-white">
                            {b.type || 'Free Site Survey'}
                          </span>
                          <span className="text-xs text-slate-500 font-bold">
                            Booking ID: <strong className="text-slate-800">#{b.id.slice(-6)}</strong>
                          </span>
                        </div>

                        {/* Current Status Pill */}
                        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-black uppercase ${statusMeta.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
                          <span>{statusMeta.label}</span>
                        </div>
                      </div>

                      {/* Visual 4-Step Progress Tracker */}
                      <div className="py-2">
                        <div className="grid grid-cols-4 gap-2 text-center relative">
                          {[
                            { step: 1, title: 'Request Received', desc: 'डिटेल्स दर्ज' },
                            { step: 2, title: 'Site Inspection', desc: 'इंजीनियर विज़िट' },
                            { step: 3, title: 'Subsidy Approval', desc: 'सरकारी सब्सिडी' },
                            { step: 4, title: 'Installation Done', desc: 'सोलर एक्टिव' },
                          ].map((s) => {
                            const isDone = statusMeta.step >= s.step;
                            const isCurrent = statusMeta.step === s.step;

                            return (
                              <div key={s.step} className="space-y-1.5">
                                <div
                                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-black text-xs transition-all ${
                                    isDone
                                      ? 'bg-gradient-to-tr from-[#d91478] to-[#16a34a] text-white shadow-md'
                                      : 'bg-slate-200 text-slate-500'
                                  } ${isCurrent ? 'ring-4 ring-[#d91478]/20 scale-110' : ''}`}
                                >
                                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                                </div>
                                <p className="text-[11px] font-black text-slate-800 leading-tight">{s.title}</p>
                                <p className="text-[9px] text-slate-500">{s.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Booked Product / Kit & Price Breakdown Card (क्या बुक किया है और कितने का) */}
                      {(b.productName || b.kitName || b.grossPrice) && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 via-white to-emerald-50/70 border border-pink-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                          <div className="flex items-center gap-3.5">
                            {b.productImage ? (
                              <img
                                src={b.productImage}
                                alt={b.productName || b.kitName}
                                className="w-14 h-14 object-cover rounded-xl border border-slate-200 bg-slate-950 shrink-0 shadow-xs"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#d91478] to-[#16a34a] text-white flex items-center justify-center text-lg font-black shrink-0 shadow-xs">
                                ☀️
                              </div>
                            )}
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#d91478] block">
                                Booked Solar Item:
                              </span>
                              <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                                {b.productName || b.kitName || 'Custom Solar Rooftop System'}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                {(b.capacity || b.kw) && (
                                  <span className="text-[11px] font-bold text-[#d91478] bg-pink-50 border border-pink-200 px-2 py-0.2 rounded-md">
                                    ⚡ Capacity: {b.capacity || b.kw}
                                  </span>
                                )}
                                <span className="text-[11px] font-bold text-slate-500">
                                  {b.propertyType || 'Residential'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Pricing Breakdown (कितने का बुक किया है) */}
                          {b.grossPrice && (
                            <div className="bg-white p-3 px-4 rounded-xl border border-slate-200 text-left sm:text-right space-y-0.5 shadow-2xs shrink-0">
                              <div className="text-[10px] text-slate-400 font-bold line-through">
                                Gross Price: ₹{Number(b.grossPrice).toLocaleString('en-IN')}
                              </div>
                              <div className="text-base sm:text-lg font-black text-[#d91478]">
                                Net Cost: ₹{Number(b.netPayable || b.grossPrice).toLocaleString('en-IN')}*
                              </div>
                              {b.subsidy > 0 && (
                                <div className="text-[10px] font-bold text-emerald-700">
                                  PM Subsidy: -₹{Number(b.subsidy).toLocaleString('en-IN')}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Booking Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 p-4 rounded-2xl bg-white border border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[11px] font-bold">Property Type</span>
                          <span className="font-black text-slate-900 capitalize flex items-center gap-1 mt-0.5">
                            {b.propertyType === 'commercial' ? <Building className="w-3.5 h-3.5 text-blue-600" /> : <HomeIcon className="w-3.5 h-3.5 text-emerald-600" />}
                            {b.propertyType || 'Residential Rooftop'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-500 block text-[11px] font-bold">Scheduled Survey Date</span>
                          <span className="font-black text-slate-900 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-[#d91478]" />
                            {b.date || 'To be scheduled'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-500 block text-[11px] font-bold">Time Slot</span>
                          <span className="font-black text-slate-900 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-purple-600" />
                            {b.timeSlot || 'Standard Working Hours'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-500 block text-[11px] font-bold">Installation Location</span>
                          <span className="font-bold text-slate-900 truncate block mt-0.5" title={b.address}>
                            {b.address || 'Gorakhpur, UP'}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Action Strip */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                        <div className="text-xs text-slate-500">
                          Need instant update? Chat with our Gorakhpur engineering desk.
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/917398198475?text=${encodeURIComponent(
                              `Hello Power24 Team, I want to check status for my booking #${b.id.slice(-6)} (${b.name}) - Item: ${b.productName || b.type}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Status Update</span>
                          </a>

                          <a
                            href="tel:+917398198475"
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Call Support</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCT ORDERS (COD ORDERS) */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-emerald-600" />
                  <span>My Product Orders (Cash on Delivery - COD)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct hardware orders and doorstep delivery tracking
                </p>
              </div>

              <Link
                to="/product"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Buy More Products</span>
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">No Product Orders Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You haven't placed any Cash on Delivery hardware orders yet. Browse our verified products catalog.
                  </p>
                </div>
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Products</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 sm:p-6 rounded-3xl border-2 border-slate-200 bg-white space-y-4 hover:border-emerald-500/40 transition-all shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900">Order ID: #{order.id}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                          {order.paymentMode || 'Cash on Delivery (COD)'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {order.status || 'Order Received'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        {order.productImage ? (
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            className="w-16 h-16 object-cover rounded-xl border border-slate-200 bg-slate-950 shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0">
                            📦
                          </div>
                        )}
                        <div>
                          <h4 className="text-base font-black text-slate-900">{order.productName}</h4>
                          <div className="text-xs text-slate-500 font-bold mt-0.5">
                            Capacity: <strong className="text-slate-800">{order.capacity || 'Standard'}</strong> • Qty: <strong className="text-slate-800">{order.quantity || 1}</strong>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Delivery to: {order.address}, {order.city} - {order.pincode}
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right bg-slate-50 p-3 px-4 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Payable at Delivery (COD)</span>
                        <span className="text-xl font-black text-emerald-700">
                          ₹{Number(order.netPayable || order.grossPrice || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <a
                        href={`https://wa.me/917398198475?text=${encodeURIComponent(
                          `Hello Power24 Team, I want to track my product order #${order.id} (${order.productName})`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Track Order on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* User Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <LogOut className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Confirm Logout
              </h3>
              <p className="text-sm text-slate-600">
                क्या आप अपने Customer Account से लॉगआउट करना चाहते हैं?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-rose-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Yes, Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
