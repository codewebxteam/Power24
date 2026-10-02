import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Cpu, Wrench, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const HowItWorks = ({ onOpenCustomKit }) => {
  const steps = [
    {
      step: '01',
      title: 'Free Rooftop Site Survey',
      hindiTitle: 'निःशुल्क साइट सर्वे',
      description: 'Our certified engineer visits your site, measures shadow-free roof area, checks electrical load and feasibility.',
      icon: ClipboardCheck,
      badge: 'Step 1',
    },
    {
      step: '02',
      title: 'Custom Engineering & Subsidy Filing',
      hindiTitle: '3D डिज़ाइन व सब्सिडी आवेदन',
      description: 'We prepare high-efficiency customized 3D design and submit PM Surya Ghar National Portal subsidy application for you.',
      icon: Cpu,
      badge: 'Step 2',
    },
    {
      step: '03',
      title: '1-Day Express Installation',
      hindiTitle: '1 दिन में एक्सपर्ट इंस्टॉलेशन',
      description: 'Heavy-duty galvanized mounting structure, Tier-1 solar modules, and smart inverter installation by certified technicians.',
      icon: Wrench,
      badge: 'Step 3',
    },
    {
      step: '04',
      title: 'Net Metering & Zero Electricity Bills',
      hindiTitle: 'नेट मीटरिंग व आजीवन बचत',
      description: 'Discom net meter activation, direct DBT subsidy transfer in your bank, and 25 years of uninterrupted solar energy.',
      icon: Zap,
      badge: 'Step 4',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white text-slate-950 font-['Outfit',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d91478]/10 to-[#16a34a]/10 border border-[#d91478]/20 text-xs font-bold uppercase tracking-wider text-[#d91478]">
            <Zap className="w-3.5 h-3.5 fill-[#d91478]" />
            <span>Seamless 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight">
            How Rooftop Solar <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d91478] via-purple-600 to-[#16a34a]">Works with Power24</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-normal max-w-2xl mx-auto">
            सर्वे से लेकर नेट-मीटरिंग और सब्सिडी आपके खाते में पहुंचने तक का पूरा सफर बेहद आसान और पारदर्शी।
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-slate-50 rounded-3xl p-6 sm:p-7 border-2 border-slate-200/80 hover:border-[#d91478] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Step Number Top Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d91478] to-[#16a34a] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-300 group-hover:text-[#d91478] transition-colors">
                    {item.step}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                    {item.hindiTitle}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-950 group-hover:text-[#d91478] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Assurance */}
                <div className="pt-4 mt-5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Hassle-free
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-bold">अपना कस्टमाइज़ सोलर सिस्टम आज ही डिज़ाइन करें</h4>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              अपनी पसंद के पैनल्स, इनवर्टर, और बैटरी चुनकर रियल-टाइम कोटेशन प्राप्त करें।
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {onOpenCustomKit && (
              <button
                type="button"
                onClick={onOpenCustomKit}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-[#d91478] to-[#16a34a] hover:opacity-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Make Your Own Kit</span>
              </button>
            )}
            <Link
              to="/book"
              className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all text-center"
            >
              <span>Book Survey Now</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
