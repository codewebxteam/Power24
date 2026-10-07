import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, User, LayoutDashboard, Sparkles } from 'lucide-react';
import p24Logo from '../assets/P24logo.webp';
import { getCurrentUser } from '../utils/storage';

const Navbar = ({ onOpenCustomKit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const updateUser = () => setCurrentUser(getCurrentUser());
    updateUser();
    window.addEventListener('power24_user_updated', updateUser);
    return () => window.removeEventListener('power24_user_updated', updateUser);
  }, [location]);

  const rawName = (
    currentUser?.name ||
    currentUser?.customerName ||
    (currentUser?.email ? currentUser.email.split('@')[0] : '') ||
    currentUser?.phone ||
    'User'
  ).trim();
  const initialChar = rawName ? rawName.charAt(0).toUpperCase() : 'U';
  const firstName = rawName ? rawName.split(' ')[0] : 'User';

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'PRODUCT', path: '/product' },
    { name: 'ABOUT', path: '/about' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* 1. Brand Logo with Colorful Name in One Line */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0 py-1">
            <img
              src={p24Logo}
              alt="Power24 Solar - Power 24 Rooftop Solar Energy Services"
              className="h-9 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            <div className="flex items-center">
              <span className="text-base sm:text-lg lg:text-xl font-black tracking-tight font-['Outfit',sans-serif] whitespace-nowrap flex items-center gap-0.5">
                <span className="text-[#d91478]">POWER</span>
                <span className="text-[#16a34a]">24</span>
                <span className="bg-gradient-to-r from-[#0284c7] via-[#16a34a] to-[#d91478] bg-clip-text text-transparent font-extrabold text-xs sm:text-sm lg:text-base ml-1">
                  Solar Services Pvt Ltd
                </span>
              </span>
            </div>
          </Link>

          {/* 2. Center Navigation Links (Clean, Compact, Colorful) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 border border-slate-200/90 rounded-full p-1 shadow-inner">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 xl:px-4 py-1.5 text-[11px] xl:text-xs font-black tracking-wider uppercase transition-all duration-200 rounded-full ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white shadow-md shadow-[#d91478]/25'
                      : 'text-slate-700 hover:text-[#d91478] hover:bg-white/90'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* 3. Right CTA Buttons (Desktop) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {onOpenCustomKit && (
              <button
                type="button"
                onClick={onOpenCustomKit}
                className="px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Custom Kit</span>
              </button>
            )}

            {/* User Account / Login Button */}
            {currentUser ? (
              <Link
                to="/dashboard"
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#d91478] to-[#16a34a] text-white flex items-center justify-center text-[10px] font-black uppercase">
                  {initialChar}
                </div>
                <span>{firstName}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#d91478]/25 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Right Actions */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            {onOpenCustomKit && (
              <button
                type="button"
                onClick={onOpenCustomKit}
                className="p-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                aria-label="Custom Solar Kit"
                title="Design Custom Kit"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </button>
            )}

            {currentUser ? (
              <Link
                to="/dashboard"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 flex items-center justify-center transition-colors shadow-xs"
                aria-label="User Account"
              >
                <User className="w-4 h-4 text-[#d91478]" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-9 h-9 rounded-full bg-[#d91478] hover:bg-[#b01060] text-white flex items-center justify-center shadow-xs transition-colors"
                aria-label="Customer Login"
              >
                <User className="w-4 h-4 text-white" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6 text-[#d91478]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 space-y-3 bg-white/98 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col space-y-1.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-5 py-3.5 text-sm font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white shadow-sm'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`
                  }
                >
                  <span>{link.name}</span>
                </NavLink>
              ))}

              {onOpenCustomKit && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenCustomKit();
                  }}
                  className="w-full px-5 py-3.5 text-sm font-black uppercase tracking-wider rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Design Custom Solar Kit</span>
                  </span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                    Calculator
                  </span>
                </button>
              )}

              {currentUser ? (
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-3.5 text-sm font-black uppercase tracking-wider rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-[#d91478]" />
                    <span>My Dashboard ({firstName})</span>
                  </span>
                </NavLink>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-3.5 text-sm font-black uppercase tracking-wider rounded-2xl bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white flex items-center justify-between shadow-sm"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Customer Login / Register</span>
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
