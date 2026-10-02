import React from 'react';
import { Sliders, Sparkles, Zap } from 'lucide-react';

const FloatingKitButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-5 right-5 z-40 font-['Outfit',sans-serif]">
      <button
        type="button"
        onClick={onClick}
        className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#d91478] via-purple-600 to-[#16a34a] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-[#d91478]/40 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/80 cursor-pointer overflow-hidden animate-bounce hover:animate-none"
        aria-label="Make Your Own Solar Kit"
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000" />

        {/* Icon */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
          <Sliders className="w-4 h-4 text-white" />
        </div>

        {/* Text */}
        <div className="text-left leading-tight">
          <span className="block text-[10px] text-pink-200 font-bold uppercase tracking-widest">
            Customizer
          </span>
          <span className="block text-xs sm:text-sm font-black text-white">
            Make Your Own Kit ⚡
          </span>
        </div>

        <div className="w-2 h-2 rounded-full bg-emerald-300 animate-ping shrink-0" />
      </button>
    </div>
  );
};

export default FloatingKitButton;
