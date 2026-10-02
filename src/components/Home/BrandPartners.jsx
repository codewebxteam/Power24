import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

const BrandPartners = () => {
  const brands = [
    {
      name: 'Tata Power Solar',
      category: 'Tier-1 Modules & Kits',
      spec: 'N-Type TOPCon 580W',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      name: 'Waaree Energies',
      category: 'India’s No. 1 Manufacturer',
      spec: 'Mono PERC Bifacial 550W',
      color: 'from-amber-600 to-orange-700',
    },
    {
      name: 'Adani Solar',
      category: 'Tier-1 Ultra High Power',
      spec: '30-Yr Linear Warranty',
      color: 'from-emerald-600 to-teal-700',
    },
    {
      name: 'Havells Enviro',
      category: 'German Smart Inverters',
      spec: 'IP65 Dual MPPT WiFi',
      color: 'from-red-600 to-pink-700',
    },
    {
      name: 'Luminous Solar',
      category: 'Smart Hybrid Power',
      spec: 'Pure Sine Wave PCU',
      color: 'from-blue-700 to-cyan-700',
    },
    {
      name: 'Polycab Solar',
      category: 'Certified DC Cabling',
      spec: 'UV & Flame Resistant',
      color: 'from-purple-600 to-violet-800',
    },
    {
      name: 'UTL Solar',
      category: 'rMPPT Combo Systems',
      spec: 'Deep Cycle Storage',
      color: 'from-teal-600 to-emerald-800',
    },
    {
      name: 'Solis Inverters',
      category: 'Global High Yield',
      spec: '98.8% Peak Efficiency',
      color: 'from-sky-600 to-blue-800',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-y border-slate-200/80 font-['Outfit',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>Authorized Tier-1 OEM Partners</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
            Powered by India’s <span className="text-[#16a34a]">Top Solar Brands</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-normal max-w-2xl mx-auto">
            हम केवल 100% ओरिजिनल, MNRE स्वीकृत और 25 साल वारंटी वाले सर्टिफाइड ब्रांड्स का उपयोग करते हैं।
          </p>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {brands.map((brand, idx) => (
            <div
              key={brand.name}
              className="bg-white rounded-2xl p-5 border-2 border-slate-200/90 hover:border-[#16a34a] hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Tier-1 Brand
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-950 group-hover:text-[#d91478] transition-colors leading-snug">
                  {brand.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {brand.category}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                <span>{brand.spec}</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Certification Highlights */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-around gap-4 text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> MNRE ALMM Approved Modules
          </span>
          <span className="flex items-center gap-1.5 text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> BIS & IEC 61215 / 61730 Certified
          </span>
          <span className="flex items-center gap-1.5 text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ISO 9001:2015 Quality Tested
          </span>
          <span className="flex items-center gap-1.5 text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-[#d91478]" /> 25-Year Performance Guarantee
          </span>
        </div>

      </div>
    </section>
  );
};

export default BrandPartners;
