import React from 'react';
import { Phone, ArrowRight, Sliders, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const solarHeroImg = 'https://ik.imagekit.io/qvztwdsij/solar%20hero%20-%20Copy.png?updatedAt=1790432262362';

const Hero = ({ onOpenCustomKit }) => {
  return (
    <section className="relative w-full font-['Outfit',sans-serif] overflow-hidden">
      
      {/* 1. Full Image Showcase Container */}
      <div className="relative w-full min-h-[460px] sm:min-h-[540px] md:min-h-[600px] lg:min-h-[640px] flex items-center">
        {/* Full Image */}
        <img
          src={solarHeroImg}
          alt="Power24 Solar - Power 24 Rooftop Clean Energy Installation in Gorakhpur and UP"
          className="absolute inset-0 w-full h-full object-cover object-center select-none"
        />
        
        {/* Transparent Overlay with subtle text readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        {/* 2. Content Container - Fully Transparent Clean Layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="max-w-xl lg:max-w-2xl bg-transparent space-y-4 sm:space-y-5">
            
            {/* Top Welcome Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/40 text-[10px] sm:text-xs font-bold tracking-widest text-emerald-300 uppercase shadow-lg">
              <Zap className="w-3.5 h-3.5 text-[#d91478] fill-[#d91478]" />
              <span>POWER24Solar Services Pvt Ltd • Gorakhpur, UP</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              <span className="sr-only">Power24 Solar - Power 24 Rooftop Solar Energy Company - </span>
              Smart Solar Power for a<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-[#d91478] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                Zero-Bill Tomorrow
              </span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-white font-semibold leading-relaxed max-w-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Join thousands of families powering with <strong className="text-emerald-300">Power24 Solar</strong>. High-yield Tier-1 Mono PERC & TOPCon rooftop installations with up to <strong className="text-emerald-300 font-bold">₹1,08,000 PM Surya Ghar Subsidy</strong>. Save up to 90% on electricity bills.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-2">
              {/* Custom Kit Builder Button */}
              {onOpenCustomKit && (
                <button
                  type="button"
                  onClick={onOpenCustomKit}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#d91478] via-purple-600 to-[#16a34a] hover:opacity-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-[#d91478]/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Make Your Own Kit</span>
                </button>
              )}

              {/* Book Free Survey Button */}
              <Link
                to="/book"
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-emerald-950/60 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-1.5 sm:gap-2"
              >
                <span>Book Free Survey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Outline Call Button */}
              <a
                href="tel:+917398198475"
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-slate-950/40 hover:bg-slate-900/70 text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-white/70 hover:border-emerald-400 backdrop-blur-md flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 shadow-lg"
              >
                <Phone className="w-4 h-4 text-emerald-400 fill-emerald-400 stroke-[2]" />
                <span>+91 7398198475</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
