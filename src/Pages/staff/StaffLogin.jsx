import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Sun,
  ArrowLeft,
  KeyRound,
  Briefcase,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { getStaffAuth, loginStaff } from '../../utils/storage';

const StaffLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in as staff, redirect to staff dashboard
  useEffect(() => {
    if (getStaffAuth()) {
      navigate('/staff/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = loginStaff(email, password);
      if (res.success) {
        navigate('/staff/dashboard');
      } else {
        setError(res.error || 'Invalid Staff Credentials. Please contact your administrator.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#060c18] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-['Outfit',sans-serif]">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700/80 backdrop-blur-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 via-sky-400 to-emerald-400 p-0.5 shadow-xl shadow-blue-500/20 mb-2">
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center">
              <Briefcase className="w-7 h-7 text-sky-400 stroke-[2.2]" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white font-mono">
            POWER<span className="text-sky-400">24</span> STAFF
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Solar Project Management & Operations Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between border-b-2 border-slate-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Staff Login</h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                Enter your staff credentials to access Project Management
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Briefcase className="w-6 h-6 stroke-[2.2]" />
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
                Staff Email / ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="staff@power24.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border-2 border-slate-700 text-white font-bold placeholder-slate-500 text-base focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs sm:text-sm font-black text-slate-200 uppercase tracking-wider block mb-2">
                Staff Password
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
              className="w-full mt-2 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Verifying Staff Credentials...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>Access Staff Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
