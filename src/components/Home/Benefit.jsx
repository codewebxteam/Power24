import React from 'react';
import {
  Zap,
  TrendingDown,
  PiggyBank,
  Award,
  BatteryCharging,
  Leaf,
  Home as HomeIcon,
  CheckCircle2,
  Sun,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Benefit = () => {
  const benefitsList = [
    {
      id: 1,
      title: 'बिजली का बिल कम होता है',
      points: [
        'दिन में बनने वाली बिजली सीधे घर में उपयोग होती है।',
        'बिल 50% से 90% तक कम हो सकता है।'
      ],
      icon: TrendingDown,
      badge: '50-90% बचत',
    },
    {
      id: 2,
      title: 'लंबी अवधि की बचत',
      points: [
        'एक बार लगाने के बाद 20–25 साल तक बिजली पैदा कर सकता है।',
        'शुरुआती खर्च कुछ वर्षों में वसूल हो जाता है।'
      ],
      icon: PiggyBank,
      badge: '25 साल बिजली',
    },
    {
      id: 3,
      title: 'सरकारी सब्सिडी',
      points: [
        'घरेलू रूफटॉप सोलर पर केंद्र व राज्य सरकार की संयुक्त योजना के तहत ₹1,08,000 तक की सब्सिडी मिल सकती है।'
      ],
      icon: Award,
      badge: '₹1,08,000 सब्सिडी',
    },
    {
      id: 4,
      title: 'बिजली कटौती पर मदद',
      points: [
        'यदि बैटरी वाला सिस्टम लगाते हैं तो बिजली जाने पर भी उपकरण निर्बाध रूप से चलते रहेंगे।'
      ],
      icon: BatteryCharging,
      badge: '24/7 बैकअप',
    },
    {
      id: 5,
      title: 'पर्यावरण के लिए अच्छा',
      points: [
        'सोलर सिस्टम कोई प्रदूषण नहीं करता और कार्बन उत्सर्जन को पूरी तरह कम करता है।'
      ],
      icon: Leaf,
      badge: '100% स्वच्छ ऊर्जा',
    },
    {
      id: 6,
      title: 'घर की वैल्यू बढ़ सकती है',
      points: [
        'सोलर पैनल लगे आधुनिक घरों की रियल एस्टेट बाजार में मांग और कीमत बढ़ जाती है।'
      ],
      icon: HomeIcon,
      badge: 'प्रॉपर्टी वैल्यू Boost',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-100/90 border-t-2 border-slate-200 font-['Outfit',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d91478]/10 to-[#16a34a]/10 border border-[#d91478]/30 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm">
            <Leaf className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Solar Advantage & Lifetime Value</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950">
            Solar System लगाने के <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d91478] via-purple-600 to-[#16a34a]">मुख्य फायदे</span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal max-w-2xl mx-auto">
            रूफटॉप सोलर अपनाकर अपने बिजली बिल को 90% तक कम करें और अगले 25 वर्षों तक मुफ्त स्वच्छ बिजली का आनंद लें।
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefitsList.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 hover:border-[#d91478] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Icon & Badge Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-[#d91478] to-[#16a34a] text-white shadow-md group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-900 border border-slate-200">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-950 pt-1 group-hover:text-[#d91478] transition-colors">
                    {item.title}
                  </h3>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-1">
                    {item.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5 stroke-[2]" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Line */}
                <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-mono">Power24 Care</span>
                  <Link
                    to="/book"
                    className="text-xs font-bold text-[#16a34a] hover:text-[#d91478] flex items-center gap-1 transition-colors uppercase tracking-wider"
                  >
                    <span>सोलर लगवाएं</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner CTA */}
        <div className="mt-14 p-6 sm:p-9 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0b1b2b] to-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border-2 border-emerald-500/40">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-black">आज ही अपने घर के लिए सोलर चुनें</h4>
            <p className="text-xs sm:text-sm font-normal text-emerald-200">
              हमारे सोलर इंजीनियर से फ्री रूफटॉप साइट सर्वे और शैडो एनालिसिस बुक करें।
            </p>
          </div>
          <Link
            to="/book"
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#16a34a] to-emerald-500 hover:from-emerald-500 hover:to-[#16a34a] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-900/50 transition-all shrink-0 hover:scale-105 active:scale-95 text-center"
          >
            फ्री साइट सर्वे बुक करें →
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Benefit;
