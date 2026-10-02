import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Sun, ArrowLeft, KeyRound, Sparkles, Leaf } from 'lucide-react';
import { getAdminAuth, setAdminAuth } from '../../utils/storage';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (getAdminAuth()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Default Admin Credentials
      if (
        (email.trim().toLowerCase() === 'admin@power24.com' || email.trim().toLowerCase() === 'admin@power.com' || email.trim().toLowerCase() === 'admin') &&
        (password === 'admin123' || password === 'power24' || password === 'admin')
      ) {
        setAdminAuth(true);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid Email or Password. Default: admin@power24.com / admin123');
        setLoading(false);
      }
    }, 400);
  };

  const handleAutoFill = () => {
    setEmail('admin@power24.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-['Outfit',sans-serif]">
      {/* Ambient Lighting Background */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700/80 backdrop-blur-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 via-emerald-500 to-teal-500 p-0.5 shadow-xl shadow-emerald-500/20 mb-2">
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center">
              <Sun className="w-7 h-7 text-emerald-400 stroke-[2.5]" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            POWER<span className="text-emerald-400">24</span> ADMIN
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Solar Management Control Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between border-b-2 border-slate-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Admin Login</h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">Sign in to manage bookings, products & gallery</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/30 text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-2">
              <KeyRound className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <div>
              <label className="text-xs sm:text-sm font-black text-slate-200 uppercase tracking-wider block mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="admin@power24.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border-2 border-slate-700 text-white font-bold placeholder-slate-500 text-base focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs sm:text-sm font-black text-slate-200 uppercase tracking-wider block mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-950/80 border-2 border-slate-700 text-white font-bold placeholder-slate-500 text-base focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Logging In...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>Log In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Auto-Fill Pill */}
          <div className="mt-6 pt-5 border-t-2 border-slate-800 text-center">
            <div className="bg-slate-950/90 rounded-2xl p-3.5 border-2 border-slate-800 flex items-center justify-between text-xs sm:text-sm">
              <div className="text-left text-slate-400">
                <span className="block text-xs uppercase font-black text-emerald-400">Default Demo Credentials:</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-200">admin@power24.com / admin123</span>
              </div>
              <button
                type="button"
                onClick={handleAutoFill}
                className="px-3.5 py-2 rounded-xl bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 text-xs font-black uppercase transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Auto Fill</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
