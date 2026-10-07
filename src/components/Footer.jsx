import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, ArrowRight, Sparkles, X, FileText, CheckCircle2, ExternalLink } from 'lucide-react';
import p24Logo from '../assets/P24logo.webp';

const Footer = () => {
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | null

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-12 sm:pt-16 pb-10 sm:pb-12 mt-auto font-['Outfit',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-slate-800">
          
          {/* 1. Brand & Registration Column (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <img
                src={p24Logo}
                alt="Power24 Solar"
                className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
              />
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-tight">
                  <span className="text-[#d91478]">POWER</span><span className="text-[#16a34a]">24</span>
                  <span className="text-white text-lg ml-1 font-bold">& Solar Services</span>
                </span>
                <span className="text-xs sm:text-sm text-emerald-400 font-bold block tracking-wide mt-0.5">
                  (Engineering Excellence in Power & Renewables)
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md font-normal">
              Pioneering rooftop solar energy installations, Tier-1 photovoltaic modules, PM Surya Ghar subsidy claims, and turnkey electrical infrastructure.
            </p>

            {/* CIN & GSTIN Registration Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs sm:text-sm">
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono flex items-center gap-2 shadow-md">
                <span className="text-[#d91478] font-black">CIN:</span>
                <span className="font-bold text-slate-200">U46593UP2026PTC243205</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono flex items-center gap-2 shadow-md">
                <span className="text-[#16a34a] font-black">GSTIN:</span>
                <span className="font-bold text-slate-200">09AAQCP6701N1ZQ</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d91478]/15 via-purple-500/10 to-[#16a34a]/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
              <span>Government Registered & MNRE Approved Tier-1 Vendor</span>
            </div>
          </div>

          {/* 2. Quick Links (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-sm">
              <li>
                <Link to="/" className="text-slate-300 hover:text-emerald-400 font-medium transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/product" className="text-slate-300 hover:text-emerald-400 font-medium transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-emerald-400 font-medium transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-300 hover:text-emerald-400 font-medium transition-colors">Project Gallery</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-emerald-400 font-medium transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/staff/login" className="text-slate-300 hover:text-emerald-400 font-medium transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span>Staff Login</span>
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-emerald-400 font-black hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <span>Book Survey</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Technologies (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-3 sm:mb-4">Technologies</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-sm text-slate-300 font-medium">
              <li className="hover:text-emerald-400 transition-colors">N-Type TOPCon Cells</li>
              <li className="hover:text-emerald-400 transition-colors">Mono PERC Modules</li>
              <li className="hover:text-emerald-400 transition-colors">Dual MPPT Inverters</li>
              <li className="hover:text-emerald-400 transition-colors">PM Surya Ghar Yojana</li>
              <li className="hover:text-emerald-400 transition-colors">LiFePO4 Storage</li>
            </ul>
          </div>

          {/* 4. Registered Office & Contact (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-3 sm:mb-4">Registered Office</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200 text-sm leading-relaxed font-semibold">
                  House No-46 F Nahar Road Shivpur Near MMM Engineering College Kurnaghat Gorakhpur UP Pin-273008
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-black">Contact Helpline:</span>
                  <a href="tel:+917398198475" className="text-white font-black text-base hover:text-emerald-400 transition-colors">
                    +91 7398198475
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-black">Official Email:</span>
                  <a href="mailto:naarishakti2026@gmail.com" className="text-slate-100 font-bold hover:text-emerald-400 transition-colors truncate block">
                    naarishakti2026@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400 text-center sm:text-left font-medium">
          <p>© 2026 POWER24Solar Services Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-slate-200 transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs sm:text-sm text-slate-400"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-slate-200 transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs sm:text-sm text-slate-400"
            >
              Terms of Service
            </button>
            <a
              href="https://pmsuryaghar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs sm:text-sm text-slate-400"
            >
              <span>MNRE Guidelines</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <Link to="/staff/login" className="text-slate-300 hover:text-blue-400 transition-colors font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
              <span>Staff Login</span>
            </Link>
            <Link to="/admin" className="text-slate-300 hover:text-emerald-400 transition-colors font-bold flex items-center gap-1">
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Legal Information Modal (Privacy Policy & Terms of Service) */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 max-h-[85vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                  </h3>
                  <p className="text-xs text-slate-400">POWER24Solar Services Pvt Ltd</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {legalModal === 'privacy' ? (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div>
                  <h4 className="font-bold text-white mb-1">1. Information We Collect</h4>
                  <p>When you request a solar site survey or place an equipment order, we collect your name, contact phone number, installation address, and estimated monthly electricity consumption to determine rooftop engineering feasibility.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">2. PM Surya Ghar Subsidy Processing</h4>
                  <p>Consumer numbers and DISCOM verification details provided for government subsidy claims are shared strictly with the National PM Surya Ghar Portal and your local electricity distribution company for Direct Benefit Transfer (DBT) approval.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">3. Data Security & Confidentiality</h4>
                  <p>We do not sell, rent, or trade your personal information to third-party marketing entities. All customer records are stored securely in encrypted cloud infrastructure.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">4. Grievance & Inquiries</h4>
                  <p>For data privacy queries, please write to our compliance officer at <span className="text-emerald-400 font-bold">naarishakti2026@gmail.com</span> or call <span className="text-emerald-400 font-bold">+91 7398198475</span>.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div>
                  <h4 className="font-bold text-white mb-1">1. Site Survey & Feasibility</h4>
                  <p>Site surveys arranged through Power24 are preliminary technical evaluations. Final system capacity (kW) and energy yield depend on physical roof structural strength, shadow assessment, and DISCOM sanctioned electrical load.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">2. Government Subsidies & Approvals</h4>
                  <p>PM Surya Ghar subsidies (up to ₹1,08,000) are disbursed directly by the Government of India / MNRE into the consumer's bank account following technical inspection and net-metering synchronization by the electricity utility.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">3. Equipment Warranties</h4>
                  <p>Photovoltaic modules carry standard 25-year manufacturer performance warranties. Grid-tie and hybrid inverters are backed by 5 to 8 years OEM warranties as specified in the product documentation.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">4. Jurisdiction</h4>
                  <p>All service engagements and commercial transactions are subject to the exclusive jurisdiction of the competent courts in Gorakhpur, Uttar Pradesh.</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
