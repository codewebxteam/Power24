import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Zap,
} from 'lucide-react';
import { loginUser, registerUser, getCurrentUser } from '../../utils/storage';
import p24Logo from '../../assets/P24logo.webp';

const UserAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultMode = location.pathname.includes('register') ? 'register' : 'login';
  const [mode, setMode] = useState(defaultMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (getCurrentUser()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (!phone.trim()) throw new Error('Please enter your 10-digit mobile number');
        if (!email.trim()) throw new Error('Please enter your email address');
        if (!password || password.length < 4) throw new Error('Password must be at least 4 characters');

        const res = registerUser({
          name,
          email,
          phone,
          password,
          address,
        });
        if (!res.success) throw new Error(res.message || 'Registration failed.');
      } else {
        if (!email.trim() && !phone.trim()) throw new Error('Please enter your email or mobile number');
        if (!password) throw new Error('Please enter your password');

        const res = loginUser(email || phone, password);
        if (!res.success) throw new Error(res.message || 'Invalid email/phone or password.');
      }

      // Success
      setLoading(false);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  const handleDemoLogin = () => {
    setEmail('amitabh.verma@example.com');
    setPassword('password123');
    try {
      const res = loginUser('amitabh.verma@example.com', 'password123');
      if (res.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(res.message || 'Demo user login failed');
      }
    } catch {
      setError('Demo user login failed');
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-['Outfit',sans-serif]">
      <div className="max-w-md w-full bg-white rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Top Header Strip */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#d91478]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#16a34a]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Logo */}
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-3">
            <img src={p24Logo} alt="Power24 Logo" className="h-12 w-auto object-contain" />
            <div className="text-left">
              <span className="text-xl font-black text-white leading-tight block">
                <span className="text-[#d91478]">POWER</span>
                <span className="text-[#16a34a]">24</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Customer Portal
              </span>
            </div>
          </Link>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {mode === 'login' ? 'Welcome Back!' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {mode === 'login'
              ? 'Track your solar survey, kit status & subsidy progress'
              : 'Sign up to manage your rooftop solar bookings & subsidy'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Login (लॉगिन)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New User (नया खाता)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* REGISTER FIELDS */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Full Name (पूरा नाम) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#d91478]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Mobile Number (मोबाइल नंबर) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#d91478]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Email Address (ईमेल) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#d91478]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    City / Address (शहर / पता - Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Golghar, Gorakhpur, UP"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#d91478]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* LOGIN FIELDS */}
            {mode === 'login' && (
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Email or Mobile Number (ईमेल या मोबाइल नंबर) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter email or 10-digit mobile"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#d91478]"
                  />
                </div>
              </div>
            )}

            {/* PASSWORD FIELD (FOR BOTH) */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                Password (पासवर्ड) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#d91478]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#d91478]/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-2"
            >
              <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Login to Dashboard' : 'Create My Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          {mode === 'login' && (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Demo Login (Auto-fill Sample User)</span>
              </button>
            </div>
          )}

          {/* Trust points */}
          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Secure
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d91478]" />
              PM Surya Ghar Portal
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserAuth;
