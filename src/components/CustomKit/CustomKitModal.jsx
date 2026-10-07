import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Check,
  Sliders,
  Sun,
  Cpu,
  BatteryCharging,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Phone,
  CheckCircle2,
  Share2,
  LayoutDashboard
} from 'lucide-react';
import { saveBooking, getCurrentUser, getProducts } from '../../utils/storage';
import { saveCustomKitInquiryToDB, subscribeProducts, fetchProductsFromDB } from '../../firebase/firestoreService';
import p24Logo from '../../assets/P24logo.webp';

const CustomKitModal = ({ isOpen, onClose }) => {
  // 4 Focused Steps: 1. Solar Panels -> 2. Battery -> 3. Inverter -> 4. Summary & Booking
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // System Configuration
  const [systemSize, setSystemSize] = useState(3); // kW default

  // Selected Products
  const [selectedPanel, setSelectedPanel] = useState('');
  const [selectedInverter, setSelectedInverter] = useState('');
  const [selectedBattery, setSelectedBattery] = useState('none');

  // Customer Contact Details for booking
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerDate, setCustomerDate] = useState('');

  // Products loaded strictly from Admin / Database (No mock or dummy fallbacks)
  const [allProducts, setAllProducts] = useState(() => getProducts());

  // Subscribe to live products from DB
  useEffect(() => {
    fetchProductsFromDB()
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) setAllProducts(items);
      })
      .catch(() => {});

    const unsub = subscribeProducts((liveItems) => {
      if (Array.isArray(liveItems)) setAllProducts(liveItems);
    });

    const handleSync = () => {
      setAllProducts(getProducts());
    };
    window.addEventListener('power24_products_updated', handleSync);

    return () => {
      if (typeof unsub === 'function') unsub();
      window.removeEventListener('power24_products_updated', handleSync);
    };
  }, []);

  // Filter REAL added products by type/category
  const isSolarProduct = (p) => {
    if (p.isKit || p.category === 'kits') return false;
    const cat = String(p.category || '').toLowerCase().trim();
    const name = String(p.name || '').toLowerCase().trim();
    return cat === 'panels' || cat === 'solar' || cat.includes('panel') || name.includes('panel') || name.includes('solar');
  };

  const isBatteryProduct = (p) => {
    if (p.isKit || p.category === 'kits') return false;
    const cat = String(p.category || '').toLowerCase().trim();
    const name = String(p.name || '').toLowerCase().trim();
    return cat === 'batteries' || cat === 'battery' || cat.includes('battery') || name.includes('battery');
  };

  const isInverterProduct = (p) => {
    if (p.isKit || p.category === 'kits') return false;
    const cat = String(p.category || '').toLowerCase().trim();
    const name = String(p.name || '').toLowerCase().trim();
    return cat === 'inverters' || cat === 'inverter' || cat.includes('inverter') || name.includes('inverter');
  };

  const panelProducts = allProducts.filter(isSolarProduct);
  const batteryProducts = allProducts.filter(isBatteryProduct);
  const inverterProducts = allProducts.filter(isInverterProduct);

  // Sync selection on modal open or product changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setBookingSuccess(false);
      const prods = getProducts();
      setAllProducts(prods);

      const user = getCurrentUser();
      if (user) {
        setCustomerName(user.name || '');
        setCustomerPhone(user.phone || '');
        setCustomerAddress(user.address || '');
      }

      const panels = prods.filter(isSolarProduct);
      if (panels.length > 0) {
        if (!selectedPanel || !panels.some((p) => p.id === selectedPanel)) {
          setSelectedPanel(panels[0].id);
        }
      } else {
        setSelectedPanel('');
      }

      const inverters = prods.filter(isInverterProduct);
      if (inverters.length > 0) {
        if (!selectedInverter || !inverters.some((i) => i.id === selectedInverter)) {
          setSelectedInverter(inverters[0].id);
        }
      } else {
        setSelectedInverter('');
      }

      setSelectedBattery('none');
    }
  }, [isOpen]);

  // Calculations based on chosen capacity
  const totalWatts = systemSize * 1000;
  const numberOfPanels = Math.ceil(totalWatts / 550);

  // Panel Options (Only real products)
  const panelOptions = panelProducts.map((p) => {
    const offer = Number(p.offerPrice || p.manualPrice || 0);
    const original = Number(p.originalPrice || p.manualGross || 0);

    let pricePerWatt = 26;
    let panelTotal = null;

    if (offer > 0 && offer < 200) {
      pricePerWatt = Math.round(offer);
      panelTotal = pricePerWatt * totalWatts;
    } else if (offer >= 200) {
      panelTotal = Math.round(offer * numberOfPanels);
      pricePerWatt = Math.round((panelTotal / totalWatts) * 10) / 10;
    } else if (typeof p.pricePerWatt === 'number' && p.pricePerWatt > 0 && p.pricePerWatt < 200) {
      pricePerWatt = Math.round(p.pricePerWatt);
      panelTotal = pricePerWatt * totalWatts;
    } else if (p.ratePerWatt) {
      pricePerWatt = Math.round(Number(p.ratePerWatt));
      panelTotal = pricePerWatt * totalWatts;
    } else if (p.price) {
      const match = String(p.price).replace(/,/g, '').match(/\d+(?:\.\d+)?/);
      if (match) {
        const val = parseFloat(match[0]);
        if (val >= 1000) {
          panelTotal = Math.round(val * numberOfPanels);
          pricePerWatt = Math.round((panelTotal / totalWatts) * 10) / 10;
        } else if (val > 0 && val < 200) {
          pricePerWatt = Math.round(val);
          panelTotal = pricePerWatt * totalWatts;
        }
      }
    }

    if (!panelTotal) {
      panelTotal = pricePerWatt * totalWatts;
    }

    return {
      id: p.id,
      name: p.name,
      brand: p.name.split(' ')[0] || 'Solar Panel',
      efficiency: p.efficiency || 'Tier-1 High Yield',
      warranty: p.warranty || '25-Year Linear Warranty',
      pricePerWatt: pricePerWatt,
      panelTotal: panelTotal,
      offerPrice: offer,
      originalPrice: original,
      tag: p.tag || 'Tier-1 Approved',
      desc: p.description || (Array.isArray(p.features) ? p.features.join(', ') : 'High efficiency solar photovoltaic module.'),
      image: p.image || (Array.isArray(p.images) && p.images[0]) || null,
    };
  });

  // Inverter Options (Only real products)
  const inverterOptions = inverterProducts.map((p) => {
    const offer = Number(p.offerPrice || p.manualPrice || 0);
    const original = Number(p.originalPrice || p.manualGross || 0);

    let basePricePerKw = 4500;
    let invTotal = null;

    if (offer > 0) {
      if (offer >= 10000) {
        basePricePerKw = Math.round(offer / 3);
        invTotal = Math.round(basePricePerKw * systemSize);
      } else {
        basePricePerKw = Math.round(offer);
        invTotal = Math.round(basePricePerKw * systemSize);
      }
    } else if (p.capacityPricing && p.capacityPricing[`${systemSize}kW`]) {
      invTotal = Number(p.capacityPricing[`${systemSize}kW`]);
      basePricePerKw = Math.round(invTotal / systemSize);
    } else if (typeof p.basePricePerKw === 'number' && p.basePricePerKw > 0) {
      basePricePerKw = p.basePricePerKw;
      invTotal = basePricePerKw * systemSize;
    } else if (p.price) {
      const match = String(p.price).replace(/,/g, '').match(/\d+(?:\.\d+)?/);
      if (match) {
        const val = parseFloat(match[0]);
        if (val >= 10000) {
          basePricePerKw = Math.round(val / 3);
        } else if (val >= 1000 && val < 10000) {
          basePricePerKw = Math.round(val);
        }
        invTotal = basePricePerKw * systemSize;
      }
    }

    if (!invTotal) {
      invTotal = basePricePerKw * systemSize;
    }

    return {
      id: p.id,
      name: p.name,
      brand: p.name.split(' ')[0] || 'Solar Inverter',
      type: p.tag || 'Grid-Tie Dual MPPT',
      efficiency: p.efficiency || '98.5% High Efficiency',
      warranty: p.warranty || '5-7 Year Warranty',
      basePricePerKw: basePricePerKw,
      invTotal: invTotal,
      offerPrice: offer,
      originalPrice: original,
      desc: p.description || (Array.isArray(p.features) ? p.features.join(', ') : 'High performance smart solar grid inverter.'),
      image: p.image || (Array.isArray(p.images) && p.images[0]) || null,
    };
  });

  // Battery Options: Always provide "No Battery (Grid-Tied)" + any real added batteries
  const noBatteryOption = {
    id: 'none',
    name: 'No Battery (Pure Grid-Tied Net Metering)',
    brand: 'On-Grid System',
    capacity: '0 kWh',
    warranty: 'N/A',
    price: 0,
    originalPrice: 0,
    desc: 'Best for areas with reliable grid. 100% of excess solar electricity is sent back to the grid for maximum savings via Net Meter.',
    image: null,
  };

  const adminBatteryOptions = batteryProducts.map((p) => {
    const offer = Number(p.offerPrice || p.manualPrice || 0) || (typeof p.price === 'number' ? p.price : parseInt(String(p.price || '').replace(/,/g, '').match(/\d+/)?.[0] || '0', 10));
    const original = Number(p.originalPrice || p.manualGross || 0);

    return {
      id: p.id,
      name: p.name,
      brand: p.name.split(' ')[0] || 'Battery Storage',
      capacity: p.tag || 'Solar Battery Bank',
      warranty: p.warranty || '5-10 Year Warranty',
      price: offer,
      originalPrice: original,
      offerPrice: offer,
      desc: p.description || (Array.isArray(p.features) ? p.features.join(', ') : 'Heavy-duty energy storage system.'),
      image: p.image || (Array.isArray(p.images) && p.images[0]) || null,
    };
  });

  const batteryOptions = [noBatteryOption, ...adminBatteryOptions];

  // Selected Objects
  const currentPanelObj = panelOptions.find((p) => p.id === selectedPanel) || panelOptions[0] || null;
  const currentInverterObj = inverterOptions.find((i) => i.id === selectedInverter) || inverterOptions[0] || null;
  const currentBatteryObj = batteryOptions.find((b) => b.id === selectedBattery) || noBatteryOption;

  // Component Costs
  const panelCost = currentPanelObj ? (currentPanelObj.panelTotal || (totalWatts * (currentPanelObj.pricePerWatt || 26))) : 0;
  const inverterCost = currentInverterObj ? (currentInverterObj.invTotal || (systemSize * (currentInverterObj.basePricePerKw || 4500))) : 0;
  const batteryCost = currentBatteryObj ? currentBatteryObj.price : 0;

  const hasCoreSelection = panelOptions.length > 0 || inverterOptions.length > 0;
  const grossTotal = hasCoreSelection
    ? panelCost + inverterCost + batteryCost
    : 0;

  // Subsidy Calculation (PM Surya Ghar Muft Bijli Yojana)
  let govtSubsidy = 0;
  if (grossTotal > 0) {
    if (systemSize === 1) govtSubsidy = 30000;
    else if (systemSize === 2) govtSubsidy = 90000; // 60k central + 30k UP state
    else govtSubsidy = 108000; // 78k central + 30k UP state
  }

  const netPayable = Math.max(0, grossTotal - govtSubsidy);
  const estimatedAnnualSavings = Math.round(systemSize * 4.2 * 365 * 7.2); // ~4.2 units/day/kW * 365 days * ₹7.2 avg tariff

  // Handle final submission
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert('Please fill in your name, phone number, and address to confirm booking.');
      return;
    }

    const bookingPayload = {
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      date: customerDate || new Date().toISOString().split('T')[0],
      type: `Custom Kit Booking (${systemSize} kW)`,
      capacity: `${systemSize}kW`,
      grossPrice: grossTotal,
      subsidy: govtSubsidy,
      netPayable: netPayable,
      customKitDetails: {
        systemSize: `${systemSize} kW`,
        panelName: currentPanelObj?.name || 'Custom Panel via Support',
        inverterName: currentInverterObj?.name || 'Custom Inverter via Support',
        batteryName: currentBatteryObj?.name || 'No Battery',
      },
    };

    saveBooking(bookingPayload);
    saveCustomKitInquiryToDB(bookingPayload).catch(() => {});
    setBookingSuccess(true);
  };

  const shareWhatsApp = () => {
    const text = `*Power24 Custom Solar Kit Quotation*%0A%0A*System Size:* ${systemSize} kW%0A*Solar Panels:* ${currentPanelObj?.name || 'Custom'}%0A*Inverter:* ${currentInverterObj?.name || 'Custom'}%0A*Battery:* ${currentBatteryObj?.name || 'None'}%0A*Gross Total:* ₹${grossTotal.toLocaleString('en-IN')}%0A*PM Surya Ghar Subsidy:* -₹${govtSubsidy.toLocaleString('en-IN')}%0A*Net Payable:* ₹${netPayable.toLocaleString('en-IN')}*%0A*Customer:* ${customerName || 'Inquiry'} (${customerPhone || ''})%0A%0APlease arrange a site survey!`;
    window.open(`https://api.whatsapp.com/send?phone=917398198475&text=${text}`, '_blank');
  };

  if (!isOpen) return null;

  const stepTabs = [
    { s: 1, label: '1. Solar Panels (सोलर)' },
    { s: 2, label: '2. Battery Storage (बैटरी)' },
    { s: 3, label: '3. Smart Inverter (इनवर्टर)' },
    { s: 4, label: '4. Summary & Booking (समरी)' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-['Outfit',sans-serif]">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">

        {/* Modal Header */}
        <div className="bg-slate-950 text-white px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <img src={p24Logo} alt="Power24 Solar" className="h-9 sm:h-11 w-auto object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-xl font-black tracking-tight">
                  <span className="text-[#d91478]">Make Your Own</span> <span className="text-[#16a34a]">Solar Kit</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#d91478] to-[#16a34a] text-[10px] font-black uppercase tracking-wider text-white">
                  Live Customizer
                </span>
              </div>
              <p className="text-xs text-slate-300 font-normal">
                Choose any brand, panel, inverter & battery with 100% independence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="tel:+917398198475"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              title="Call Helpline Directly"
            >
              <Phone className="w-3.5 h-3.5 fill-white" />
              <span>Call Team Support</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Step Progression Tabs */}
        {!bookingSuccess && (
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 overflow-x-auto shrink-0">
            <div className="flex items-center justify-between min-w-[520px] sm:min-w-full text-xs font-bold gap-2">
              {stepTabs.map((tab) => (
                <button
                  key={tab.s}
                  type="button"
                  onClick={() => setCurrentStep(tab.s)}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    currentStep === tab.s
                      ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white shadow-sm'
                      : currentStep > tab.s
                      ? 'text-emerald-800 bg-emerald-100'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <div className="p-4 sm:p-7 overflow-y-auto flex-grow text-slate-950">
          {bookingSuccess ? (
            /* Booking Confirmed Screen */
            <div className="text-center py-8 space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/30">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                  Custom Kit Booked Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Thank you, <strong className="text-emerald-700 font-bold">{customerName || 'Customer'}</strong>! Your customized <strong className="text-slate-950 font-bold">{systemSize} kW Solar System</strong> has been registered. Our solar engineer will call you shortly on <strong className="text-slate-950 font-bold">{customerPhone}</strong>.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-left text-xs sm:text-sm space-y-2 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-600">Capacity:</span>
                  <span className="font-bold text-slate-900">{systemSize} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Panels Chosen:</span>
                  <span className="font-bold text-slate-900">{currentPanelObj?.name || 'Custom Selection'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Battery Chosen:</span>
                  <span className="font-bold text-slate-900">{currentBatteryObj?.name || 'No Battery'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Inverter Chosen:</span>
                  <span className="font-bold text-slate-900">{currentInverterObj?.name || 'Custom Selection'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-emerald-200 text-sm font-bold">
                  <span className="text-emerald-950">Estimated Net Payable:</span>
                  <span className="text-emerald-700 text-base">₹{netPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href="tel:+917398198475"
                  className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>Call Team Support (+91 7398198475)</span>
                </a>

                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className="px-6 py-3 rounded-full bg-[#16a34a] hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send Spec on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Solar Panels (1st Priority: Solar) */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* System Capacity Quick Selector */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                          1. Choose Capacity / सिस्टम क्षमता (kW)
                        </span>
                        <h4 className="text-lg font-black text-slate-950">
                          Current Selection: <span className="text-emerald-700">{systemSize} kW Solar System</span>
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-3 py-1 rounded-xl border border-emerald-300 w-fit">
                        {systemSize <= 2 ? (systemSize === 1 ? '₹30,000' : '₹90,000') : '₹1,08,000'} PM Surya Ghar Subsidy
                      </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((kw) => {
                        const isSelected = systemSize === kw;
                        return (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => setSystemSize(kw)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300 scale-105'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                            }`}
                          >
                            {kw} kW
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Solar Panel Products Header */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#d91478] uppercase tracking-wider">
                        Step 1 of 4 • Solar Modules (सोलर पैनल)
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Available Products: <strong>{panelOptions.length}</strong>
                      </span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-950">
                      Select Solar Panel Product (पैनल चुनें)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Choose from verified solar panel models added in our catalog.
                    </p>
                  </div>

                  {/* Panel Cards or Clean Empty State with Direct Call Button */}
                  {panelOptions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {panelOptions.map((panel) => {
                        const isSelected = selectedPanel === panel.id;
                        const panelTotal = panel.panelTotal || totalWatts * panel.pricePerWatt;
                        return (
                          <div
                            key={panel.id}
                            onClick={() => setSelectedPanel(panel.id)}
                            className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#16a34a] bg-emerald-50/70 shadow-lg ring-2 ring-[#16a34a]/30'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {panel.image ? (
                                <img
                                  src={panel.image}
                                  alt={panel.name}
                                  className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                  <Sun className="w-6 h-6" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border border-amber-300 shadow-2xs">
                                      <Sparkles className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                                      Special Offer
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 truncate max-w-[120px]">
                                      {panel.tag}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm sm:text-base font-black text-emerald-700 block">
                                      {panel.offerPrice && panel.offerPrice >= 200
                                        ? `₹${panel.offerPrice.toLocaleString('en-IN')} / Panel`
                                        : `₹${panel.pricePerWatt} / Watt`}
                                    </span>
                                    {panel.originalPrice > panel.offerPrice && panel.offerPrice > 0 && (
                                      <span className="text-[10px] text-slate-400 line-through font-bold block">
                                        MRP: ₹{panel.originalPrice.toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <h5 className="text-sm sm:text-base font-bold text-slate-950 line-clamp-1">
                                  {panel.name}
                                </h5>
                                <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                                  {panel.desc}
                                </p>
                              </div>
                            </div>

                            <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-500">
                                Efficiency: <strong className="text-slate-900">{panel.efficiency}</strong>
                              </span>
                              <span className="text-emerald-800 font-extrabold">
                                {systemSize} kW Total: ₹{panelTotal.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* User-Friendly Empty State with Direct Call Support Button */
                    <div className="text-center py-12 px-6 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-300 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                        <Sun className="w-8 h-8" />
                      </div>
                      <div className="space-y-1.5 max-w-md mx-auto">
                        <h5 className="text-lg font-black text-slate-900">
                          अभी कोई सोलर पैनल प्रोडक्ट उपलब्ध नहीं है
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          (No Solar Panels currently added in catalog). किसी भी ब्रांड (Tata Power Solar, Waaree, Adani, Loom आदि) के सोलर पैनल के साथ अपनी कस्टम किट बनवाने के लिए सीधे हमारी टीम को कॉल करें।
                        </p>
                      </div>
                      <a
                        href="tel:+917398198475"
                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Phone className="w-4 h-4 fill-white" />
                        <span>Call Team Support (+91 7398198475)</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Battery Storage (2nd Priority: Battery) */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#d91478] uppercase tracking-wider">
                        Step 2 of 4 • Battery Storage (बैटरी बैकअप)
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Battery Models: <strong>{batteryProducts.length}</strong>
                      </span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-950">
                      Choose Battery Option (बैटरी चुनें)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      अधिकतम सब्सिडी और नेट मीटरिंग के लिए 'No Battery' चुनें, अथवा पावर बैकअप हेतु बैटरी स्टोरेज जोड़ें।
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {batteryOptions.map((bat) => {
                      const isSelected = selectedBattery === bat.id;
                      return (
                        <div
                          key={bat.id}
                          onClick={() => setSelectedBattery(bat.id)}
                          className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#16a34a] bg-emerald-50/70 shadow-lg ring-2 ring-[#16a34a]/30'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {bat.image ? (
                              <img
                                src={bat.image}
                                alt={bat.name}
                                className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <BatteryCharging className="w-6 h-6" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {bat.id !== 'none' && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border border-amber-300 shadow-2xs">
                                      <Sparkles className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                                      Special Offer
                                    </span>
                                  )}
                                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 truncate max-w-[120px]">
                                    {bat.capacity}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm sm:text-base font-black text-emerald-700 block">
                                    {bat.price === 0 ? '₹0 (Included)' : `+₹${bat.price.toLocaleString('en-IN')}`}
                                  </span>
                                  {bat.originalPrice > bat.price && bat.price > 0 && (
                                    <span className="text-[10px] text-slate-400 line-through font-bold block">
                                      MRP: ₹{bat.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <h5 className="text-sm sm:text-base font-bold text-slate-950 line-clamp-1">
                                {bat.name}
                              </h5>
                              <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                                {bat.desc}
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-500">
                              Warranty: <strong className="text-slate-900">{bat.warranty}</strong>
                            </span>
                            <span className="text-emerald-700 font-bold">{bat.brand}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Empty state note for battery models with direct call button */}
                  {batteryProducts.length === 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                      <p className="text-xs text-slate-600">
                        कैटलॉग में अभी अलग से कोई बैटरी लिस्टेड नहीं है। आप ऊपर <strong>'No Battery (Grid-Tied)'</strong> चुनकर आगे बढ़ सकते हैं, अथवा विशेष बैटरी स्टोरेज हेतु सीधे हमारी टीम को कॉल करें:
                      </p>
                      <a
                        href="tel:+917398198475"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 fill-white" />
                        <span>Call Team Support (+91 7398198475)</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Inverter (3rd Priority: Inverter) */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#d91478] uppercase tracking-wider">
                        Step 3 of 4 • Smart Inverter (इनवर्टर)
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Available Products: <strong>{inverterOptions.length}</strong>
                      </span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-950">
                      Choose Your Solar Inverter (इनवर्टर चुनें)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Pick smart grid-tie or hybrid solar inverters with WiFi app monitoring.
                    </p>
                  </div>

                  {inverterOptions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {inverterOptions.map((inv) => {
                        const isSelected = selectedInverter === inv.id;
                        const invTotal = inv.invTotal || systemSize * inv.basePricePerKw;
                        return (
                          <div
                            key={inv.id}
                            onClick={() => setSelectedInverter(inv.id)}
                            className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#d91478] bg-pink-50/70 shadow-lg ring-2 ring-[#d91478]/30'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {inv.image ? (
                                <img
                                  src={inv.image}
                                  alt={inv.name}
                                  className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-pink-100 text-[#d91478] flex items-center justify-center shrink-0">
                                  <Cpu className="w-6 h-6" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border border-amber-300 shadow-2xs">
                                      <Sparkles className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                                      Special Offer
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 truncate max-w-[120px]">
                                      {inv.type}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm sm:text-base font-black text-[#d91478] block">
                                      {inv.offerPrice ? `₹${inv.offerPrice.toLocaleString('en-IN')}` : `₹${invTotal.toLocaleString('en-IN')}`}
                                    </span>
                                    {inv.originalPrice > inv.offerPrice && inv.offerPrice > 0 && (
                                      <span className="text-[10px] text-slate-400 line-through font-bold block">
                                        MRP: ₹{inv.originalPrice.toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <h5 className="text-sm sm:text-base font-bold text-slate-950 line-clamp-1">
                                  {inv.name}
                                </h5>
                                <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                                  {inv.desc}
                                </p>
                              </div>
                            </div>

                            <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-500">
                                Rate: <strong className="text-slate-900">₹{inv.basePricePerKw.toLocaleString('en-IN')} / kW</strong>
                              </span>
                              <span className="text-pink-900 font-extrabold">
                                {systemSize} kW Total: ₹{invTotal.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Inverter Empty State with Direct Call Support Button */
                    <div className="text-center py-12 px-6 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-300 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-pink-100 text-[#d91478] flex items-center justify-center mx-auto shadow-sm">
                        <Cpu className="w-8 h-8" />
                      </div>
                      <div className="space-y-1.5 max-w-md mx-auto">
                        <h5 className="text-lg font-black text-slate-900">
                          अभी कोई इनवर्टर प्रोडक्ट उपलब्ध नहीं है
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          (No Inverters currently added in catalog). Havells, Solis, Growatt, Luminous आदि अपनी पसंद के इनवर्टर के साथ कस्टम किट तैयार करवाने के लिए सीधे हमारी टीम को कॉल करें।
                        </p>
                      </div>
                      <a
                        href="tel:+917398198475"
                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Phone className="w-4 h-4 fill-white" />
                        <span>Call Team Support (+91 7398198475)</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Live Summary, Price Breakdown & Booking */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#d91478] uppercase tracking-wider">
                      Step 4 of 4 • Final Quotation & Booking
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-950">
                      Live Custom Kit Quotation & Subsidy Summary
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Detailed itemized quotation with direct PM Surya Ghar subsidy deduction.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Itemized Table (7 cols) */}
                    <div className="lg:col-span-7 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
                      <h5 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                        Configured Component Breakdown ({systemSize} kW)
                      </h5>

                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Panels ({numberOfPanels} Modules):</span>
                          <span className="font-bold text-slate-900">
                            {currentPanelObj ? `₹${panelCost.toLocaleString('en-IN')}` : 'To be quoted via Call'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 -mt-1 font-mono">
                          {currentPanelObj?.name || 'Custom Panels (Consult support)'}
                        </p>

                        <div className="flex justify-between pt-1">
                          <span className="text-slate-600">Battery Storage:</span>
                          <span className="font-bold text-slate-900">
                            {batteryCost === 0 ? '₹0 (Grid-Tie / Net Meter)' : `₹${batteryCost.toLocaleString('en-IN')}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 -mt-1 font-mono">
                          {currentBatteryObj?.name || 'No Battery'}
                        </p>

                        <div className="flex justify-between pt-1">
                          <span className="text-slate-600">Inverter System:</span>
                          <span className="font-bold text-slate-900">
                            {currentInverterObj ? `₹${inverterCost.toLocaleString('en-IN')}` : 'To be quoted via Call'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 -mt-1 font-mono">
                          {currentInverterObj?.name || 'Custom Inverter (Consult support)'}
                        </p>

                        {/* Totals */}
                        <div className="pt-3 border-t-2 border-slate-300 space-y-1.5">
                          {grossTotal > 0 ? (
                            <>
                              <div className="flex justify-between text-sm font-bold text-slate-700">
                                <span>Gross System Price:</span>
                                <span>₹{grossTotal.toLocaleString('en-IN')}</span>
                              </div>

                              {govtSubsidy > 0 && (
                                <div className="flex justify-between text-sm font-black text-[#16a34a]">
                                  <span>PM Surya Ghar Govt Subsidy (DBT):</span>
                                  <span>- ₹{govtSubsidy.toLocaleString('en-IN')}</span>
                                </div>
                              )}

                              <div className="flex justify-between text-base sm:text-xl font-black text-slate-950 pt-2 border-t border-slate-200">
                                <span>Estimated Net Cost:</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d91478] to-[#16a34a]">
                                  ₹{netPayable.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-2">
                              <p className="text-xs text-amber-800 font-bold">
                                सटीक कोटेशन के लिए नीचे फॉर्म भरें या टीम से सीधे कॉल पर बात करें।
                              </p>
                              <a
                                href="tel:+917398198475"
                                className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3.5 py-1.5 rounded-full transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" /> Call Team Support (+91 7398198475)
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Booking Form (5 cols) */}
                    <div className="lg:col-span-5 bg-white p-5 rounded-3xl border-2 border-emerald-500 shadow-xl space-y-4">
                      <div className="space-y-1">
                        <h5 className="text-base font-black text-slate-950">
                          Book Free Survey with this Kit
                        </h5>
                        <p className="text-xs text-slate-500">
                          Zero-cost engineer visit to confirm roof size & subsidy.
                        </p>
                      </div>

                      <form onSubmit={handleFinalSubmit} className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Singh"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">WhatsApp / Phone Number *</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 98390 12345"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Installation City & Address *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Golghar, Gorakhpur, UP"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none"
                          />
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                          <button
                            type="submit"
                            className="w-full py-3 rounded-full bg-gradient-to-r from-[#d91478] via-purple-600 to-[#16a34a] text-white font-black uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Confirm & Book Survey</span>
                          </button>

                          <a
                            href="tel:+917398198475"
                            className="w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center"
                          >
                            <Phone className="w-3.5 h-3.5 fill-white" />
                            <span>Call Team Support</span>
                          </a>

                          <button
                            type="button"
                            onClick={shareWhatsApp}
                            className="w-full py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>WhatsApp This Kit</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        {!bookingSuccess && (
          <div className="bg-slate-100 p-4 sm:p-5 border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'bg-white hover:bg-slate-200 text-slate-800 shadow-sm cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3">
              <a
                href="tel:+917398198475"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white px-3 py-1.5 rounded-full border border-slate-200"
              >
                <Phone className="w-3.5 h-3.5 fill-emerald-700" />
                <span>Call Support (+91 7398198475)</span>
              </a>

              {grossTotal > 0 && (
                <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
                  Net Est: <strong className="text-slate-950 font-bold">₹{netPayable.toLocaleString('en-IN')}</strong>
                </span>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomKitModal;
