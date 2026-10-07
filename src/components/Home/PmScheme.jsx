import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, Leaf, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import modijiImg from '../../assets/modiji.jpg';

const PmScheme = () => {
  const subsidyData = [
    {
      sno: '1',
      capacity: '1 kW (कि०वा०)',
      central: '₹30,000',
      state: '₹0',
      total: '₹30,000',
      highlight: false,
    },
    {
      sno: '2',
      capacity: '2 kW (कि०वा०)',
      central: '₹60,000',
      state: '₹30,000',
      total: '₹90,000',
      highlight: false,
    },
    {
      sno: '3',
      capacity: '3 kW (कि०वा०)',
      central: '₹78,000',
      state: '₹30,000',
      total: '₹1,08,000',
      highlight: true,
    },
    {
      sno: '4',
      capacity: '4 kW (कि०वा०)',
      central: '₹78,000',
      state: '₹30,000',
      total: '₹1,08,000',
      highlight: false,
    },
    {
      sno: '5',
      capacity: '5 kW (कि०वा०)',
      central: '₹78,000',
      state: '₹30,000',
      total: '₹1,08,000',
      highlight: false,
    },
    {
      sno: '6',
      capacity: '6 kW - 10 kW',
      central: '₹78,000',
      state: '₹30,000',
      total: '₹1,08,000',
      highlight: false,
    },
  ];

  return (
    <section className="py-12 sm:py-16 font-['Outfit',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Card Container with Dark Slate + Brand Gradient Accents */}
        <div className="bg-gradient-to-br from-[#06241a] via-[#0b1b2b] to-[#1a0b1e] text-white rounded-3xl p-6 sm:p-9 lg:p-11 relative overflow-hidden shadow-2xl border-2 border-emerald-500/40">
          
          {/* Ambient Lighting Background */}
          <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-[#d91478]/20 blur-3xl pointer-events-none" />

          {/* Top National Ribbon / Tricolor Touch */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-6 mb-6 border-b border-white/10 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 via-white/10 to-emerald-500/20 border border-white/20 text-xs sm:text-sm font-bold tracking-wider uppercase text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>भारत सरकार की महत्वाकांक्षी राष्ट्रीय सौर योजना</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>National Portal: pmsuryaghar.gov.in</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            
            {/* Left Column: Modi Ji Photo + Scheme Highlights */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Modi Ji Card with Quote */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 sm:p-5 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md shadow-lg">
                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-xl shadow-amber-500/20 bg-slate-900">
                    <img
                      src={modijiImg}
                      alt="Prime Minister Narendra Modi"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-md uppercase">
                    PM India
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-md uppercase">
                    श्री नरेंद्र मोदी (माननीय प्रधानमंत्री)
                  </div>
                  <blockquote className="text-xs sm:text-sm text-amber-200 font-medium italic leading-relaxed">
                    "पीएम सूर्य घर मुफ्त बिजली योजना से हर घर बनेगा आत्मनिर्भर और बिजली बिल होगा शून्य। रूफटॉप सोलर लगाएं, 300 यूनिट तक फ्री बिजली पाएं।"
                  </blockquote>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Direct Benefit Transfer (DBT) सीधे बैंक खाते में
                  </p>
                </div>
              </div>

              {/* Headline & Description */}
              <div className="space-y-2.5">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  पीएम सूर्य घर <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-[#d91478]">मुफ्त बिजली योजना</span>
                </h2>
                <p className="text-base sm:text-lg font-bold text-emerald-300">
                  रूफटॉप सोलर पर ₹1,08,000 तक की सीधी सरकारी सब्सिडी पाएं
                </p>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-normal">
                  Power24 टीम आपके घर/दुकान के लिए संपूर्ण कागजी कार्रवाई, डिस्कॉम नेट-मीटरिंग और डायरेक्ट सब्सिडी स्वीकृति में 100% सहायता प्रदान करती है।
                </p>
              </div>

              {/* Feature Points */}
              <div className="space-y-2.5 text-xs sm:text-sm text-white font-medium">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>केंद्र सरकार सब्सिडी: <strong>रु० 78,000</strong> सीधे बैंक खाते में</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#d91478]/20 text-[#d91478] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-pink-400" />
                  </div>
                  <span>उत्तर प्रदेश राज्य सरकार अतिरिक्त सब्सिडी: <strong>रु० 30,000</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span><strong>300 यूनिट तक फ्री बिजली</strong> और 25 साल की वारंटी</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/book"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#16a34a] to-emerald-500 hover:from-emerald-500 hover:to-[#16a34a] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>सब्सिडी पात्रता जांचें (Book Survey)</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </Link>

                <a
                  href="https://pmsuryaghar.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-white/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>National Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Column: Exact Client Subsidy Breakdown Table */}
            <div className="lg:col-span-6">
              <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-2xl border border-slate-200 text-slate-950">
                
                {/* Table Header Title */}
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-slate-950 font-['Outfit',sans-serif]">
                      सब्सिडी विवरण तालिका (केन्द्र + राज्य)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      रूफटॉप सोलर क्षमता अनुसार आधिकारिक सरकारी दरें
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-bold uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official 2026</span>
                  </span>
                </div>

                {/* The Responsive Subsidy Table */}
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="w-full text-left border-collapse min-w-[380px] sm:min-w-full">
                    <thead>
                      <tr className="bg-slate-900 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                        <th className="py-3 px-3 rounded-l-xl text-center w-12">क्र०</th>
                        <th className="py-3 px-3">सोलर क्षमता</th>
                        <th className="py-3 px-3 text-right">केन्द्र</th>
                        <th className="py-3 px-3 text-right">राज्य</th>
                        <th className="py-3 px-3 rounded-r-xl text-right font-bold text-emerald-400">कुल सब्सिडी</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {subsidyData.map((row) => (
                        <tr
                          key={row.sno}
                          className={`transition-colors hover:bg-emerald-50/80 ${
                            row.highlight ? 'bg-emerald-100/80 font-bold border-l-4 border-l-[#16a34a]' : 'font-medium'
                          }`}
                        >
                          {/* S.No */}
                          <td className="py-2.5 px-3 text-center text-slate-500">
                            {row.sno}
                          </td>

                          {/* Solar Rooftop Capacity */}
                          <td className="py-2.5 px-3 font-bold text-slate-950">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                              {row.capacity}
                            </span>
                          </td>

                          {/* Central Subsidy */}
                          <td className="py-2.5 px-3 text-right text-slate-700">
                            {row.central}
                          </td>

                          {/* State Subsidy */}
                          <td className="py-2.5 px-3 text-right text-slate-700">
                            {row.state}
                          </td>

                          {/* Total Subsidy */}
                          <td className="py-2.5 px-3 text-right font-black text-emerald-700 font-['Outfit',sans-serif] text-sm sm:text-base">
                            {row.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footnote & Guarantee Badge */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-1.5 font-medium">
                    <span>* केन्द्र सरकार + राज्य सरकार अतिरिक्त अनुदान</span>
                    <span className="font-black text-emerald-700 text-sm">अधिकतम लाभ: ₹1,08,000</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default PmScheme;
