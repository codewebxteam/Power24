import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sun,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Building,
  Wrench,
  User,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  getStaffAuth,
  logoutStaff,
  getCurrentStaff
} from '../../utils/storage';
import ProjectManagement from '../../components/Admin/Management/ProjectManagement.jsx';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [currentStaff, setCurrentStaff] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Authentication Guard
  useEffect(() => {
    if (!getStaffAuth()) {
      navigate('/staff/login');
      return;
    }
    const staffData = getCurrentStaff() || {
      name: 'Rohan Sharma',
      role: 'Project Operations & Site Incharge',
      department: 'Solar Project Management',
      badgeId: 'P24-STAFF-08'
    };
    setCurrentStaff(staffData);
  }, [navigate]);

  const handleLogout = () => {
    logoutStaff();
    navigate('/staff/login');
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 font-['Outfit',sans-serif] flex flex-col antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#10b981] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Staff Navigation Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-lg text-white no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-500 via-sky-400 to-emerald-400 p-0.5 shadow-lg shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-xl font-black tracking-tight text-white font-mono">
                  POWER<span className="text-sky-400">24</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/25 text-sky-300 border border-blue-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  Staff Project Portal
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium hidden sm:block">
                Solar Project Management, Site Master, Expense Vouchers & Client Payments
              </p>
            </div>
          </div>

          {/* Staff Profile & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <Link
              to="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-300" />
              <span>Live Website</span>
            </Link>

            {/* Staff Info Badge */}
            <div className="flex items-center gap-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-inner">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-sky-400 font-black text-xs sm:text-sm">
                {currentStaff?.name ? currentStaff.name[0] : 'S'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-white block leading-tight">
                  {currentStaff?.name || 'Field Officer'}
                </span>
                <span className="text-[10px] text-sky-400 font-mono font-bold">
                  {currentStaff?.badgeId || 'P24-STAFF-08'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Logout from Staff Portal"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace: 100% Same-to-Same Complete Project Management Module */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <ProjectManagement onShowToast={showToast} />
      </main>

      {/* Staff Portal Footer */}
      <footer className="bg-white border-t border-slate-200/90 py-4 px-4 sm:px-8 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono">
            POWER24Solar Services Pvt Ltd — Staff Project Portal v2.4
          </p>
          <p className="text-slate-400 font-medium">
            Real-time synchronization with Admin HQ active
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StaffDashboard;
