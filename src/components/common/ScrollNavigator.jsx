import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ScrollNavigator = () => {
  const [direction, setDirection] = useState('down'); // 'down' | 'up'
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const maxScroll = fullHeight - windowHeight;

      if (maxScroll <= 120) {
        setIsVisible(false);
        return;
      }

      setIsVisible(true);

      const percent = Math.min(100, Math.max(0, Math.round((scrollY / maxScroll) * 100)));
      setScrollPercent(percent);

      // If user is in upper 45% -> button points down (to footer)
      // If user is in lower half -> button points up (to top)
      if (scrollY < maxScroll * 0.45) {
        setDirection('down');
      } else {
        setDirection('up');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleClick = () => {
    if (direction === 'down') {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Page scroll navigation"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 font-['Outfit',sans-serif] print:hidden"
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={direction === 'down' ? 'Scroll to bottom footer' : 'Scroll to top'}
        title={direction === 'down' ? 'Niche footer par jayein' : 'Upar top par jayein'}
        className="group relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white shadow-2xl shadow-slate-950/50 backdrop-blur-md border border-slate-700/80 hover:border-emerald-400/80 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d91478]"
      >
        {/* Circular Scroll Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
          viewBox="0 0 44 44"
        >
          <circle
            cx="22"
            cy="22"
            r="19"
            className="text-slate-800 stroke-current"
            strokeWidth="2.5"
            fill="none"
          />
          <circle
            cx="22"
            cy="22"
            r="19"
            className="text-[#d91478] stroke-current transition-all duration-150"
            strokeWidth="2.5"
            strokeDasharray={119.38}
            strokeDashoffset={119.38 - (119.38 * scrollPercent) / 100}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Dynamic Icon */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {direction === 'down' ? (
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-emerald-400 group-hover:translate-y-0.5 transition-all duration-200 stroke-[2.5]" />
          ) : (
            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#d91478] group-hover:-translate-y-0.5 transition-all duration-200 stroke-[2.5]" />
          )}
        </div>

        {/* Hover / Tooltip Label (Desktop only) */}
        <span className="hidden sm:block absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-slate-900/95 text-white text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 border border-slate-700 shadow-md">
          {direction === 'down' ? 'Go to Bottom ↓' : 'Go to Top ↑'}
        </span>
      </button>
    </aside>
  );
};

export default ScrollNavigator;
