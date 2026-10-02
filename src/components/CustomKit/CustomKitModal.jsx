import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Check,
  Sliders,
  Sun,
  Cpu,
  BatteryCharging,
  Wrench,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Download,
  Phone,
  CheckCircle2,
  Leaf,
  Layers,
  Zap,
  IndianRupee,
  Share2,
  LayoutDashboard
} from 'lucide-react';
import { saveBooking, getCurrentUser, getProducts } from '../../utils/storage';
import { saveCustomKitInquiryToDB } from '../../firebase/firestoreService';
import p24Logo from '../../assets/P24logo.webp';

const CustomKitModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Step state: 1 to 7
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form State
  const [systemSize, setSystemSize] = useState(3); // kW
  const [propertyType, setPropertyType] = useState('residential');
  const [roofType, setRoofType] = useState('rcc'); // 'rcc' | 'tin' | 'elevated' | 'tiled'
  
  // Selected Brands
  const [selectedPanel, setSelectedPanel] = useState('');
  const [selectedInverter, setSelectedInverter] = useState('');
  const [selectedBattery, setSelectedBattery] = useState('none');
  const [structureType, setStructureType] = useState('standard_gi');
  const [wireBrand, setWireBrand] = useState('polycab');
  const [protectionKit, setProtectionKit] = useState(true);

  // User Contact details for final booking
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerDate, setCustomerDate] = useState('');

  // Products loaded from Admin / Storage
  const [allProducts, setAllProducts] = useState(() => getProducts());

  useEffect(() => {
    if (isOpen) {
      const prods = getProducts();
      setAllProducts(prods);

      const user = getCurrentUser();
      if (user) {
        setCustomerName(user.name || '');
        setCustomerPhone(user.phone || '');
        setCustomerAddress(user.address || '');
      }

      const panels = prods.filter(p => p.category === 'panels');
      if (panels.length > 0 && (!selectedPanel || !panels.some(p => p.id === selectedPanel))) {
        setSelectedPanel(panels[0].id);
      }

      const inverters = prods.filter(p => p.category === 'inverters');
      if (inverters.length > 0 && (!selectedInverter || !inverters.some(i => i.id === selectedInverter))) {
        setSelectedInverter(inverters[0].id);
      }
    }
  }, [isOpen]);

  // --- CALCULATION LOGIC ---
  const totalWatts = systemSize * 1000;
  const numberOfPanels = Math.ceil(totalWatts / 550);

  // Dynamic Panels from Admin Products / Catalog (Only individual panels, not full combo kits)
  const panelProducts = allProducts.filter((p) => p.category === 'panels' && !p.isKit);
  const defaultPanels = [
    {
      id: 'panel-tata',
      name: 'Tata Power Solar N-Type TOPCon 580W',
      category: 'panels',
      price: '₹27 / Watt',
      efficiency: '23.5%',
      warranty: '25-Year Tata Linear Guarantee',
      tag: 'Best Seller',
      desc: 'India’s most trusted brand. High bifacial generation even in low light / cloudy weather.',
      image: null,
    },
    {
      id: 'panel-waaree',
      name: 'Waaree Energies Mono PERC 550W',
      category: 'panels',
      price: '₹25 / Watt',
      efficiency: '22.8% Module Efficiency',
      warranty: '25-Year Performance',
      tag: 'India No. 1 Maker',
      desc: 'High-density half-cut monocrystalline cells with anti-reflective glass.',
      image: null,
    },
    {
      id: 'panel-adani',
      name: 'Adani Solar Ultra High Power 550W',
      category: 'panels',
      price: '₹26 / Watt',
      efficiency: '23.2% Cell Efficiency',
      warranty: '30-Year Linear Warranty',
      tag: 'Heavy Duty 30-Yr',
      desc: 'Extreme wind resistance (150 km/h) and minimum light degradation.',
      image: null,
    },
  ];

  const panelOptions = (panelProducts.length > 0 ? panelProducts : defaultPanels).map((p) => {
    let pricePerWatt = 26;
    let panelTotal = null;

    if (typeof p.pricePerWatt === 'number' && p.pricePerWatt > 0 && p.pricePerWatt < 200) {
      pricePerWatt = Math.round(p.pricePerWatt);
      panelTotal = pricePerWatt * totalWatts;
    } else if (p.price) {
      const match = String(p.price).replace(/,/g, '').match(/\d+(?:\.\d+)?/);
      if (match) {
        const val = parseFloat(match[0]);
        if (val >= 1000) {
          // E.g. ₹26,000 for 1kW (1000W) -> pricePerWatt = 26
          pricePerWatt = Math.round(val / 1000);
        } else if (val > 0 && val < 200) {
          // E.g. ₹24, ₹25, ₹26, ₹27 per Watt
          pricePerWatt = Math.round(val);
        }
        panelTotal = pricePerWatt * totalWatts;
      }
    }

    if (!panelTotal) {
      panelTotal = pricePerWatt * totalWatts;
    }

    return {
      id: p.id,
      name: p.name,
      brand: p.name.split(' ')[0] || 'Solar Panel',
      efficiency: p.efficiency || '22.8% Module Efficiency',
      warranty: p.warranty || '25-Year Linear Warranty',
      pricePerWatt: pricePerWatt,
      panelTotal: panelTotal,
      tag: p.tag || 'Tier-1 Approved',
      desc: p.description || (Array.isArray(p.features) ? p.features.join(', ') : 'High efficiency solar photovoltaic module.'),
      image: p.image || (Array.isArray(p.images) && p.images[0]) || null,
    };
  });

  // Dynamic Inverters from Admin Products
  const inverterProducts = allProducts.filter((p) => p.category === 'inverters');
  const defaultInverters = [
    {
      id: 'inv-havells',
      name: 'Havells Enviro Smart On-Grid Inverter',
      brand: 'Havells',
      type: 'Grid-Tie Dual MPPT',
      efficiency: '98.5%',
      warranty: '7-Year Warranty',
      basePricePerKw: 4500,
      desc: 'German engineering, WiFi real-time smartphone monitoring, IP65 waterproof.',
      image: null,
    },
    {
      id: 'inv-luminous',
      name: 'Luminous NXG Pure Sine Wave Solar PCU',
      brand: 'Luminous',
      type: 'Hybrid Solar PCU',
      efficiency: '95.5%',
      warranty: '5-Year Warranty',
      basePricePerKw: 4200,
      desc: 'Heavy load management for home air conditioners, refrigerators, and pumps.',
      image: null,
    },
  ];

  const inverterOptions = (inverterProducts.length > 0 ? inverterProducts : defaultInverters).map((p) => {
    let basePricePerKw = 4500;
    let invTotal = null;

    if (p.capacityPricing && p.capacityPricing[`${systemSize}kW`]) {
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
      efficiency: p.efficiency || '98.5%',
      warranty: p.warranty || '7-Year Warranty',
      basePricePerKw: basePricePerKw,
      invTotal: invTotal,
      desc: p.description || (Array.isArray(p.features) ? p.features.join(', ') : 'High performance smart solar grid inverter.'),
      image: p.image || (Array.isArray(p.images) && p.images[0]) || null,
    };
  });

  // Dynamic Batteries from Admin Products
  const batteryProducts = allProducts.filter((p) => p.category === 'batteries');
  const noBatteryOption = {
    id: 'none',
    name: 'No Battery (Pure Grid-Tied Net Metering)',
    brand: 'On-Grid System',
    capacity: '0 kWh',
    warranty: 'N/A',
    price: 0,
    desc: 'Best for areas with reliable grid. 100% of excess solar electricity is sold back to grid via Net Meter.',
    image: null,
  };

  const adminBatteryOptions = batteryProducts.map((p) => {
    let price = 0;
    if (typeof p.price === 'number') {
      price = p.price;
    } else if (p.price) {
      const num = parseInt(String(p.price).replace(/,/g, '').match(/\d+/)?.[0] || '0', 10);
      price = num > 0 ? num : 0;
    }
    return {
      id: p.id,
      name: p.name,
      brand: p.name.split(' ')[0] || 'Battery Storage',
      capacity: p.tag || 'Solar Battery Bank',
      warranty: p.warranty || '5-10 Year Warranty',
      price: price,
      desc: p.description || (Array.isArray(p.features) ? p.features.join(', ') : 'Heavy-duty energy storage system.'),
      image: p.image || (Array.isArray(p.images) && p.images[0]) || null,
    };
  });

  const batteryOptions = [noBatteryOption, ...adminBatteryOptions];

  // 4. Balance of System Structure & Wiring Options
  const structureOptions = [
    {
      id: 'standard_gi',
      name: 'Heavy Galvanized GI Structure (150 km/h Wind Load)',
      extraPerKw: 3500,
      desc: 'Rust-proof hot-dip galvanized mounting structure bolted with high-tensile fasteners.',
    },
    {
      id: 'elevated_pergola',
      name: 'High-Rise Elevated Pergola Structure (6-8 Ft Height)',
      extraPerKw: 6500,
      desc: 'Elevated structure that keeps your entire rooftop free for garden, seating or household use.',
    },
  ];

  const wireOptions = [
    {
      id: 'polycab',
      name: 'Polycab 4/6 sq.mm Tinned Copper Solar DC Cables',
      price: 4000,
    },
    {
      id: 'havells_wire',
      name: 'Havells Flame-Retardant UV-Protected Solar DC Wire',
      price: 4500,
    },
  ];

  // Selected Objects
  const currentPanelObj = panelOptions.find((p) => p.id === selectedPanel) || panelOptions[0] || {};
  const currentInverterObj = inverterOptions.find((i) => i.id === selectedInverter) || inverterOptions[0] || {};
  const currentBatteryObj = batteryOptions.find((b) => b.id === selectedBattery) || batteryOptions[0] || {};
  const currentStructureObj = structureOptions.find((s) => s.id === structureType) || structureOptions[0];
  const currentWireObj = wireOptions.find((w) => w.id === wireBrand) || wireOptions[0];

  // Component Costs
  const panelCost = currentPanelObj.panelTotal || (totalWatts * (currentPanelObj.pricePerWatt || 26));
  const inverterCost = currentInverterObj.invTotal || (systemSize * (currentInverterObj.basePricePerKw || 4500));
  const batteryCost = currentBatteryObj.price;
  const structureCost = systemSize * currentStructureObj.extraPerKw;
  const wiringCost = currentWireObj.price;
  const protectionCost = protectionKit ? 5500 + systemSize * 800 : 0; // ACDB/DCDB, Earthing & LA
  const installationCivilCost = 6000 + systemSize * 1200;

  const grossTotal = panelCost + inverterCost + batteryCost + structureCost + wiringCost + protectionCost + installationCivilCost;

  // Subsidy Calculation (PM Surya Ghar)
  let govtSubsidy = 0;
  if (propertyType === 'residential') {
    if (systemSize === 1) govtSubsidy = 30000;
    else if (systemSize === 2) govtSubsidy = 90000; // 60k central + 30k UP state
    else govtSubsidy = 108000; // 78k central + 30k UP state (capped at 1.08L)
  }

  const netPayable = Math.max(0, grossTotal - govtSubsidy);
  const estimatedAnnualSavings = Math.round(systemSize * 4.2 * 365 * 7.2); // 4.2 units/day/kW * 365 days * ₹7.2 avg tariff
  const twentyFiveYearSavings = Math.round(estimatedAnnualSavings * 25);

  // Handle final submission
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const customKitSummary = {
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      date: customerDate || new Date().toISOString().split('T')[0],
      propertyType: propertyType + ` (${systemSize} kW Custom Kit)`,
      type: 'Custom Solar Kit Booking',
      productName: `${systemSize}kW Custom Configured Solar Kit`,
      productImage: currentPanelObj.image || undefined,
      capacity: `${systemSize}kW`,
      grossPrice: grossTotal,
      subsidy: govtSubsidy,
      netPayable: netPayable,
      customKitDetails: {
        systemSize: `${systemSize} kW`,
        propertyType,
        roofType,
        panelBrand: currentPanelObj.name,
        panelCost,
        inverterBrand: currentInverterObj.name,
        inverterCost,
        batteryOption: currentBatteryObj.name,
        batteryCost,
        structure: currentStructureObj.name,
        structureCost,
        wires: currentWireObj.name,
        wiringCost,
        protectionCost,
        installationCivilCost,
        grossTotal,
        govtSubsidy,
        netPayable,
      },
    };

    saveBooking(customKitSummary);
    saveCustomKitInquiryToDB(customKitSummary).catch((err) => console.warn('[Power24] Custom Kit DB Note:', err));
    setBookingSuccess(true);
  };

  const shareWhatsApp = () => {
    const text = `*Power24 Custom Solar Kit Inquiry*%0A%0A*Capacity:* ${systemSize} kW%0A*Panels:* ${currentPanelObj.name}%0A*Inverter:* ${currentInverterObj.name}%0A*Battery:* ${currentBatteryObj.name}%0A*Structure:* ${currentStructureObj.name}%0A%0A*Gross Total:* ₹${grossTotal.toLocaleString('en-IN')}%0A*PM Surya Ghar Subsidy:* ₹${govtSubsidy.toLocaleString('en-IN')}%0A*Net Estimated Price:* ₹${netPayable.toLocaleString('en-IN')}%0A%0APlease arrange a site survey!`;
    window.open(`https://api.whatsapp.com/send?phone=917398198475&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-['Outfit',sans-serif]">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img src={p24Logo} alt="P24" className="h-10 sm:h-11 w-auto object-contain shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-2xl font-black text-white">
                  Make Your Own <span className="text-[#16a34a]">Solar Kit</span>
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white text-[10px] font-black uppercase tracking-wider">
                  Live Customizer
                </span>
              </div>
              <p className="text-xs text-slate-300 font-normal">
                Choose any brand, panel, inverter & battery with 100% independence
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Tabs */}
        {!bookingSuccess && (
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 overflow-x-auto shrink-0">
            <div className="flex items-center justify-between min-w-[500px] sm:min-w-full text-xs font-bold">
              {[
                { s: 1, label: '1. Capacity (kW)' },
                { s: 2, label: '2. Building Purpose' },
                { s: 3, label: '3. Solar Panels' },
                { s: 4, label: '4. Inverter' },
                { s: 5, label: '5. Battery' },
                { s: 6, label: '6. Summary & Price' },
              ].map((tab) => (
                <button
                  key={tab.s}
                  type="button"
                  onClick={() => setCurrentStep(tab.s)}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
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
        <div className="p-4 sm:p-8 overflow-y-auto flex-grow text-slate-950">
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
                  <span className="text-slate-600">Panels Chosen:</span>
                  <span className="font-bold text-slate-900">{currentPanelObj.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Inverter Chosen:</span>
                  <span className="font-bold text-slate-900">{currentInverterObj.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Battery Chosen:</span>
                  <span className="font-bold text-slate-900">{currentBatteryObj.name}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-emerald-200 text-sm font-bold">
                  <span className="text-emerald-950">Estimated Net Payable:</span>
                  <span className="text-emerald-700 text-base">₹{netPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to="/dashboard"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#d91478]/30 transition-all hover:scale-105"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Track Status in Dashboard</span>
                </Link>
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
              {/* STEP 1: Capacity (kW) */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#d91478] uppercase tracking-wider">Step 1 of 6</span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-950">
                      Select System Size / क्षमता (kW)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Choose the solar capacity you want to install based on your rooftop size and daily unit requirements.
                    </p>
                  </div>

                  {/* kW Grid Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map((kw) => {
                      const isSelected = systemSize === kw;
                      const dailyUnits = kw * 4.2;
                      const roofNeeded = kw * 90;
                      return (
                        <div
                          key={kw}
                          onClick={() => setSystemSize(kw)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#16a34a] bg-emerald-50/80 shadow-md ring-2 ring-[#16a34a]/30'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl sm:text-2xl font-black text-slate-950 font-['Outfit']">
                              {kw} kW
                            </span>
                            {isSelected && (
                              <div className="w-6 h-6 rounded-full bg-[#16a34a] text-white flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-1 text-xs text-slate-600">
                            <div>⚡ ~{dailyUnits.toFixed(0)} Units / Day</div>
                            <div>🏠 ~{roofNeeded} sq.ft Roof</div>
                            {kw <= 10 && (
                              <div className="text-emerald-700 font-bold">
                                {kw === 1 ? '₹30,000 Subsidy' : kw === 2 ? '₹90,000 Subsidy' : '₹1,08,000 Subsidy'}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Purpose */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#d91478] uppercase tracking-wider">Step 2 of 6</span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-950">
                      Application Purpose & Building Category
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Select your building category for accurate solar sizing and subsidy eligibility.
                    </p>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                      Building Purpose (उपयोग का प्रकार)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { id: 'residential', label: 'Residential Home', sub: 'PM Surya Ghar Subsidy Eligible' },
                        { id: 'commercial', label: 'Commercial Shop / Office', sub: 'Tax Depreciation 40%' },
                        { id: 'industrial', label: 'Factory / Industrial', sub: 'High Load HT Connection' },
                        { id: 'agricultural', label: 'Farmhouse / Tubewell', sub: 'Solar Water Pump Support' },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setPropertyType(item.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            propertyType === item.id
                              ? 'border-[#d91478] bg-pink-50/60 shadow-md ring-2 ring-[#d91478]/30'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="font-bold text-sm text-slate-950">{item.label}</div>
                          <div className="text-xs text-slate-500 mt-1">{item.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Solar Panels (Any Brand Independence) */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#d91478] uppercase tracking-wider">Step 3 of 6</span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-950">
                      Choose Your Solar Panel Brand (सोलर पैनल ब्रांड)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Pick any manufacturer. All panels come with 25-30 year warranties and MNRE approval.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {panelOptions.map((panel) => {
                      const isSelected = selectedPanel === panel.id;
                      const panelTotal = panel.panelTotal || (totalWatts * panel.pricePerWatt);
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
                              <img src={panel.image} alt={panel.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0" />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <Sun className="w-6 h-6" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 truncate max-w-[150px]">
                                  {panel.tag}
                                </span>
                                <span className="text-base font-black text-emerald-700 shrink-0">
                                  ₹{panel.pricePerWatt} / Watt
                                </span>
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
                            <span className="text-slate-500">Efficiency: <strong className="text-slate-900">{panel.efficiency}</strong></span>
                            <span className="text-emerald-800 font-extrabold">{systemSize} kW Total: ₹{panelTotal.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: Solar Inverter (Any Brand Independence) */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#d91478] uppercase tracking-wider">Step 4 of 6</span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-950">
                      Choose Your Solar Inverter Brand (इनवर्टर)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Choose between On-Grid Smart Inverter or Hybrid Solar PCU with Wi-Fi App monitoring.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inverterOptions.map((inv) => {
                      const isSelected = selectedInverter === inv.id;
                      const invTotal = inv.invTotal || (systemSize * inv.basePricePerKw);
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
                              <img src={inv.image} alt={inv.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0" />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-pink-100 text-[#d91478] flex items-center justify-center shrink-0">
                                <Cpu className="w-6 h-6" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 truncate max-w-[150px]">
                                  {inv.type}
                                </span>
                                <span className="text-base font-black text-[#d91478] shrink-0">
                                  ₹{invTotal.toLocaleString('en-IN')}
                                </span>
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
                            <span className="text-slate-500">Rate: <strong className="text-slate-900">₹{inv.basePricePerKw.toLocaleString('en-IN')} / kW</strong></span>
                            <span className="text-pink-900 font-extrabold">{systemSize} kW Total: ₹{invTotal.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: Battery Storage (Optional) */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#d91478] uppercase tracking-wider">Step 5 of 6</span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-950">
                      Choose Battery Storage Option (बैटरी बैकअप)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Optional: Choose 'No Battery' for maximum net metering savings, or select Lithium/Tubular for 24/7 backup.
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
                              <img src={bat.image} alt={bat.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0" />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <BatteryCharging className="w-6 h-6" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 truncate max-w-[150px]">
                                  {bat.capacity}
                                </span>
                                <span className="text-base font-black text-emerald-700 shrink-0">
                                  {bat.price === 0 ? '₹0 (Included)' : `+₹${bat.price.toLocaleString('en-IN')}`}
                                </span>
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
                            <span className="text-slate-500">Warranty: <strong className="text-slate-900">{bat.warranty}</strong></span>
                            <span className="text-emerald-700 font-bold">{bat.brand}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 6: Live Summary, Price Breakdown & Checkout */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#d91478] uppercase tracking-wider">Step 6 of 6</span>
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
                          <span className="font-bold text-slate-900">₹{panelCost.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 -mt-1 font-mono">{currentPanelObj.name}</p>

                        <div className="flex justify-between pt-1">
                          <span className="text-slate-600">Inverter System:</span>
                          <span className="font-bold text-slate-900">₹{inverterCost.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 -mt-1 font-mono">{currentInverterObj.name}</p>

                        <div className="flex justify-between pt-1">
                          <span className="text-slate-600">Battery Backup:</span>
                          <span className="font-bold text-slate-900">{batteryCost === 0 ? '₹0 (Grid-Tie)' : `₹${batteryCost.toLocaleString('en-IN')}`}</span>
                        </div>

                        <div className="flex justify-between pt-1">
                          <span className="text-slate-600">Mounting Structure & Cables:</span>
                          <span className="font-bold text-slate-900">₹{(structureCost + wiringCost).toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between pt-1">
                          <span className="text-slate-600">AC/DC Protection & Earthing:</span>
                          <span className="font-bold text-slate-900">₹{protectionCost.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between pt-1">
                          <span className="text-slate-600">Turnkey Civil & Net-Meter Liaisoning:</span>
                          <span className="font-bold text-slate-900">₹{installationCivilCost.toLocaleString('en-IN')}</span>
                        </div>

                        {/* Totals */}
                        <div className="pt-3 border-t-2 border-slate-300 space-y-1.5">
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

                          <button
                            type="button"
                            onClick={shareWhatsApp}
                            className="w-full py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
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
              <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
                Net Est: <strong className="text-slate-950 font-bold">₹{netPayable.toLocaleString('en-IN')}</strong>
              </span>

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
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
