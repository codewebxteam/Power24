import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Zap, PiggyBank, Sparkles, Leaf, ArrowRight, IndianRupee, SunMedium } from 'lucide-react';

const SolarCalculator = ({ onOpenCustomKit }) => {
  const [monthlyBill, setMonthlyBill] = useState(4500);

  // Approximate calculations
  // Average tariff in UP: ₹7.5 / unit
  // Units consumed = monthlyBill / 7.5
  // Required kW = (Units per month / 30) / 4 (since 1 kW produces ~4 units/day)
  const approxUnits = Math.round(monthlyBill / 7.5);
  const rawKw = Math.max(1, Math.min(20, Math.round((approxUnits / 120) * 10) / 10));
  const recommendedKw = Math.max(1, Math.min(20, Math.round(rawKw)));

  // Subsidy calculation based on PM Surya Ghar guidelines
  let subsidy = 0;
  if (recommendedKw === 1) subsidy = 30000;
  else if (recommendedKw === 2) subsidy = 90000; // 60k central + 30k state
  else subsidy = 108000; // 78k central + 30k state

  const annualSavings = Math.round(monthlyBill * 12 * 0.9);
  const twentyFiveYearSavings = Math.round(annualSavings * 25);
  const carbonOffsetTonnes = (recommendedKw * 1.3).toFixed(1);
  const treesEquivalent = Math.round(recommendedKw * 60);

  return (
    <section className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden font-['Outfit',sans-serif]">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d91478]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#16a34a]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
            <Calculator className="w-4 h-4 text-[#d91478]" />
            <span>Interactive Solar Savings Estimator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-[#d91478]">Solar Savings & Subsidy</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-normal max-w-2xl mx-auto">
            अपने वर्तमान मासिक बिजली बिल के अनुसार जानें कि आपके घर के लिए कितने kW का सोलर उपयुक्त है और आप कितनी सरकारी सब्सिडी पा सकते हैं।
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="max-w-5xl mx-auto bg-slate-950/80 border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Interactive Bill Slider */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="bill-range" className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
                    आपका मासिक बिजली बिल (Average Monthly Bill)
                  </label>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                    ₹{monthlyBill.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  id="bill-range"
                  type="range"
                  min="1000"
                  max="35000"
                  step="500"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#16a34a]"
                />

                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1.5">
                  <span>₹1,000 / mo</span>
                  <span>₹15,000 / mo</span>
                  <span>₹35,000+ / mo</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-bold">Quick Pick:</span>
                {[1200, 2500, 4500, 7500, 12000, 20000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMonthlyBill(val)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      monthlyBill === val
                        ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ₹{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Estimated System Need Summary Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">अनुशंसित सोलर क्षमता (Recommended):</span>
                  <span className="font-black text-white text-base sm:text-lg flex items-center gap-1">
                    <SunMedium className="w-4 h-4 text-amber-400" />
                    {recommendedKw} kW Rooftop Solar
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">अनुमानित मासिक खपत (Units/Mo):</span>
                  <span className="font-bold text-slate-200">~{approxUnits} Units</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">आवश्यक छत का क्षेत्रफल (Roof Area):</span>
                  <span className="font-bold text-slate-200">~{recommendedKw * 80} - {recommendedKw * 100} sq.ft</span>
                </div>
              </div>
            </div>

            {/* Right: Calculated Returns & Savings Cards */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* 1. Subsidy */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">Govt Subsidy</span>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300">
                    ₹{subsidy.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">सीधे बैंक खाते में (DBT)</p>
                </div>

                {/* 2. Annual Savings */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#d91478]/20 to-slate-900 border border-[#d91478]/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-pink-400">Annual Savings</span>
                    <PiggyBank className="w-4 h-4 text-[#d91478]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-pink-300">
                    ₹{annualSavings.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">हर साल बिजली बिल पर बचत</p>
                </div>

                {/* 3. 25-Year Cumulative Savings */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-400">25-Yr Lifetime Savings</span>
                  <div className="text-xl sm:text-2xl font-black text-amber-300">
                    ₹{twentyFiveYearSavings.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">कुल 25 वर्षों की शुद्ध बचत</p>
                </div>

                {/* 4. Eco Impact */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-teal-400">Green Impact</span>
                    <Leaf className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-teal-300">
                    {carbonOffsetTonnes} T <span className="text-xs font-normal">CO₂/yr</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">≈ {treesEquivalent} पेड़ लगाने के बराबर</p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {onOpenCustomKit && (
                  <button
                    type="button"
                    onClick={onOpenCustomKit}
                    className="w-full sm:w-1/2 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-[#d91478] to-[#16a34a] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>कस्टमाइज़ किट बनाएं</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <Link
                  to={`/book?kw=${recommendedKw}kW`}
                  className="w-full sm:w-1/2 py-3.5 rounded-full bg-[#16a34a] hover:bg-emerald-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer text-center"
                >
                  <span>फ्री साइट सर्वे बुक करें ({recommendedKw} kW)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default SolarCalculator;
