import React from 'react';
import { Star, Quote, CheckCircle2, MapPin, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  const reviews = [
    {
      id: 1,
      name: 'Er. Rajesh Srivastava',
      role: 'Homeowner (5.5 kW System)',
      location: 'Civil Lines, Gorakhpur',
      billBefore: '₹6,800/mo',
      billAfter: '₹420/mo',
      savings: '94% Bill Cut',
      text: 'Power24 team ne sirf 1 din me installation complete kiya aur PM Surya Ghar ki ₹1,08,000 subsidy mere account me 28 dino ke andar aa gayi. Bill lagbhag zero ho chuka hai!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Dr. Vivek Tripathi',
      role: 'Clinic & Residence (8 kW System)',
      location: 'Golghar, Gorakhpur',
      billBefore: '₹14,500/mo',
      billAfter: '₹1,100/mo',
      savings: '₹1.6L/Year Saved',
      text: 'Tata Solar panels aur Havells inverter ka custom kit lagwaya tha. Solar generation bahut high hai aur customer support 10/10 hai. Very highly recommended!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Anand Prakash Singh',
      role: 'Factory Owner (30 kW Commercial)',
      location: 'GIDA Industrial Area, UP',
      billBefore: '₹48,000/mo',
      billAfter: '₹8,500/mo',
      savings: '₹4.7L/Year Saved',
      text: 'Heavy load machinery ke liye 30 kW grid-tie system lagwaya. Net metering liaisoning aur structure quality solid hai. Return on investment 2.5 saal me complete ho jayega.',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white font-['Outfit',sans-serif] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Quote className="w-3.5 h-3.5 text-[#d91478]" />
            <span>Verified Customer Stories</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-[#d91478]">500+ Happy Rooftops</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-normal max-w-2xl mx-auto">
            जानिए हमारे ग्राहकों ने कैसे Power24 सोलर अपनाकर अपने बिजली बिल को 90% तक कम किया।
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-950/90 rounded-3xl p-6 sm:p-7 border border-slate-800 hover:border-[#16a34a] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating Stars & Location */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {rev.location}
                  </span>
                </div>

                {/* Savings Pill Box */}
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Before</span>
                    <span className="text-slate-300 font-bold line-through">{rev.billBefore}</span>
                  </div>
                  <Zap className="w-4 h-4 text-[#d91478]" />
                  <div>
                    <span className="text-emerald-400 block text-[10px] font-bold">Now Bill</span>
                    <span className="text-emerald-300 font-black text-sm">{rev.billAfter}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#16a34a]/20 text-[#16a34a] text-[11px] font-bold border border-[#16a34a]/30">
                    {rev.savings}
                  </span>
                </div>

                {/* Testimonial Text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic font-normal">
                  "{rev.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-[11px] text-emerald-400 font-medium">{rev.role}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Teaser Link */}
        <div className="text-center mt-10">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-slate-700 transition-all hover:scale-105"
          >
            <span>View All Completed Solar Projects (Gallery) →</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
