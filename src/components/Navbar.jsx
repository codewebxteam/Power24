import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, User, LayoutDashboard } from 'lucide-react';
import p24Logo from '../assets/P24logo.webp';
import { getCurrentUser } from '../utils/storage';

const Navbar = ({ onOpenCustomKit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, [location]);

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
          
          {/* 1. Brand Logo with P24 Official Badge */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <img
              src={p24Logo}
              alt="Power24 Solar Logo"
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight font-['Outfit',sans-serif]">
                  <span className="text-[#d91478]">POWER</span>
                  <span className="text-[#16a34a]">24</span>
                </span>
              </div>
              <span className="block text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-widest uppercase -mt-0.5">
                Power & Solar Services Pvt Ltd
              </span>
            </div>
          </Link>

          {/* 2. Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 bg-slate-100/90 border border-slate-300/80 rounded-full p-1.5 shadow-inner">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 xl:px-5 py-2 text-xs xl:text-sm font-black tracking-wider uppercase transition-all duration-200 rounded-full ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white shadow-md shadow-[#d91478]/25'
                      : 'text-slate-800 hover:text-[#d91478] hover:bg-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* 3. Right CTA Buttons (Desktop) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {/* User Account / Login Button */}
            {currentUser ? (
              <Link
                to="/dashboard"
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#d91478] to-[#16a34a] text-white flex items-center justify-center text-[10px] font-black uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <span>{currentUser.name.split(' ')[0]}</span>
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

              {currentUser ? (
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-3.5 text-sm font-black uppercase tracking-wider rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-[#d91478]" />
                    <span>My Dashboard ({currentUser.name})</span>
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
