import React, { useState } from 'react';
import {
  Sun,
  Award,
  ShieldCheck,
  Users,
  Target,
  CheckCircle2,
  Zap,
  Leaf,
  MapPin,
  Phone,
  Mail,
  FileCheck,
  Building2,
  ChevronDown,
  Sparkles,
  Layers,
  Wrench,
  Clock,
  Banknote,
  Cpu,
  BadgeCheck,
  ArrowRight,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { value: '50,000+', label: 'Rooftops Installed', desc: 'Across UP & Purvanchal' },
    { value: '120 MW+', label: 'Clean Power Capacity', desc: 'Grid-Connected Solar' },
    { value: '25 Years', label: 'Linear Performance', desc: 'Manufacturer Backed' },
    { value: '99.8%', label: 'Happy Customers', desc: '5-Star Rated Service' },
  ];

  const coreValues = [
    {
      icon: Target,
      title: 'Our Mission (हमारा लक्ष्य)',
      desc: 'To liberate Indian households and business owners from escalating monthly electricity bills by delivering accessible, zero-maintenance, and ultra high-yield rooftop solar infrastructure.',
      color: 'from-[#d91478] to-pink-600',
    },
    {
      icon: ShieldCheck,
      title: 'Engineering Integrity (विश्वसनीयता)',
      desc: 'Every system is engineered strictly with Tier-1 bifacial/TOPCon monocrystalline modules, hot-dip galvanized wind-resistant structures (tested up to 150 km/h), and IP65 smart dual-MPPT inverters.',
      color: 'from-emerald-600 to-[#16a34a]',
    },
    {
      icon: Users,
      title: 'Customer-First EPC (पूर्ण सहयोग)',
      desc: 'We manage 100% of the heavy lifting—from 3D shadow analysis, UPPCL DISCOM net metering sanction, and national portal subsidy approval to turnkey installation and lifetime maintenance.',
      color: 'from-blue-600 to-indigo-600',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Digital Rooftop Survey & Feasibility',
      hindi: 'डिजिटल साइट सर्वे एवं लोड विश्लेषण',
      desc: 'Our certified solar engineers visit your location to measure shadow-free roof area, evaluate 3-phase/single-phase electrical wiring, and calculate exact kilowatt requirements based on your monthly electricity bill.',
      icon: MapPin,
    },
    {
      step: '02',
      title: '3D CAD System Design & Engineering',
      hindi: '3D स्ट्रक्चरल डिज़ाइन एवं कस्टमाइजेशन',
      desc: 'We draft customized structural blueprints using premium pre-galvanized GI hardware, optimal tilt angles for maximum peak sun hours, and fire-retardant DC cabling routes.',
      icon: Layers,
    },
    {
      step: '03',
      title: 'DISCOM Net-Metering & Subsidy Filing',
      hindi: 'UPPCL नेट मीटरिंग व सब्सिडी रजिस्ट्रेशन',
      desc: 'We handle complete administrative liaisoning with the PM Surya Ghar National Portal and local UPPCL DISCOM for swift load sanction, net-meter allotment, and direct subsidy credit.',
      icon: FileCheck,
    },
    {
      step: '04',
      title: 'Turnkey Installation & Commissioning',
      hindi: 'त्वरित इंस्टालेशन व ग्रिड सिंक्रोनाइज़ेशन',
      desc: 'Our skilled technicians complete physical panel mounting, ACDB/DCDB protection installation, chemical earthing, lightning arrestor setup, and bi-directional meter activation within 48-72 hours.',
      icon: Wrench,
    },
    {
      step: '05',
      title: 'IoT Monitoring & Lifetime Care',
      hindi: 'मोबाइल ऐप मॉनिटरिंग व 25-वर्षीय वारंटी',
      desc: 'Enjoy real-time daily generation tracking via smart smartphone apps, dedicated local helpline support, and scheduled preventive health checkups for lifetime uninterrupted generation.',
      icon: Cpu,
    },
  ];

  const faqs = [
    {
      q: 'How much roof space is required for a rooftop solar system?',
      a: 'Generally, a 1 kW solar system requires approximately 70 to 90 sq. ft. of clear, shadow-free shadow area. For a typical 3 kW home system eligible for the maximum ₹78,000 - ₹1,08,000 subsidy, around 220–250 sq. ft. is ideal.',
    },
    {
      q: 'How does the PM Surya Ghar Muft Bijli Yojana subsidy work with Power24?',
      a: 'Under the PM Surya Ghar scheme, residential households receive up to ₹30,000 for 1 kW, ₹60,000 for 2 kW, and up to ₹78,000 to ₹1,08,000 for 3 kW and above. Power24 manages the entire portal documentation, inspection, and verification so the subsidy is deposited directly (DBT) into your linked bank account.',
    },
    {
      q: 'What is the return on investment (ROI) and payback period?',
      a: 'With up to 90% savings on your monthly electricity bill and the central/state government subsidy, most residential rooftop systems achieve complete financial breakeven (payback) in just 2.5 to 3.5 years. After that, your electricity is virtually free for the remaining 22+ years.',
    },
    {
      q: 'What kind of warranties do you provide?',
      a: 'We provide an industry-leading 25-Year Linear Performance Warranty on solar PV modules (Tier-1 Tata, Waaree, Adani, etc.), 5 to 10 years warranty on Grid-Tie Inverters, and 5 years comprehensive on-site warranty on all electrical balance-of-system hardware.',
    },
    {
      q: 'Is easy bank finance / 0% EMI available?',
      a: 'Yes! Power24 has direct tie-ups with leading nationalized and private banks (SBI, Canara Bank, PNB, HDFC, etc.) offering collateral-free solar loans with low interest rates starting from 7% p.a. and flexible EMI tenure up to 7 years.',
    },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 font-['Outfit',sans-serif] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">

        {/* 1. Hero / Header Section */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d91478]/10 via-purple-500/10 to-[#16a34a]/10 border border-[#d91478]/20 text-[#d91478] text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#d91478]" />
            <span>Powering India's Clean Energy Revolution</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            Power24 & Solar Services <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d91478] to-[#16a34a]">Pvt Ltd</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            Premier Ministry of Corporate Affairs registered Solar EPC enterprise delivering end-to-end rooftop solar solutions, smart net-metering approvals, bank financing, and PM Surya Ghar Muft Bijli Yojana subsidies across Uttar Pradesh.
          </p>
        </div>

        {/* 2. Official Corporate Credential Strip */}
        <div className="bg-slate-950 text-white border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#d91478]/20 via-[#16a34a]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-black uppercase tracking-wider mb-6 pb-3 border-b border-slate-800 relative z-10">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Government Registered & Certified Solar EPC Company</span>
            </div>
            <span className="text-slate-400 font-bold normal-case tracking-normal">
              Ministry of Corporate Affairs (MCA), Govt. of India
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-bold">Company CIN</span>
              <p className="text-sm sm:text-base font-mono font-black text-emerald-300">U46593UP2026PTC243205</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-bold">GSTIN Registration</span>
              <p className="text-sm sm:text-base font-mono font-black text-emerald-300">09AAQCP6701N1ZQ</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-bold">Direct Helpline / WhatsApp</span>
              <a href="tel:+917398198475" className="text-sm sm:text-base font-black text-white hover:text-emerald-300 transition-colors block">
                +91 7398198475
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-bold">Official Email Support</span>
              <a href="mailto:naarishakti2026@gmail.com" className="text-sm sm:text-base font-bold text-slate-200 hover:text-emerald-300 truncate block">
                naarishakti2026@gmail.com
              </a>
            </div>
          </div>

          <div className="mt-5 p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-200 relative z-10">
            <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-emerald-400 font-bold uppercase tracking-wider mr-1.5">Registered Corporate Office:</strong>
              House No-46 F, Nahar Road Shivpur, Near MMM Engineering College, Kurnaghat, Gorakhpur, UP, PIN - 273008
            </p>
          </div>
        </div>

        {/* 3. Performance Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 text-center shadow-sm hover:border-[#d91478]/50 hover:shadow-lg transition-all group"
            >
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d91478] to-[#16a34a] group-hover:scale-105 transition-transform">
                {item.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-900 mt-1 font-black uppercase tracking-wider">{item.label}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 4. Company Vision, Mission & Integrity */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#d91478]">FOUNDATIONAL VALUES</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">Why India Trusts Power24</h2>
            <p className="text-xs sm:text-sm text-slate-600">Built on uncompromising engineering standards, ethical pricing, and complete turnkey execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-white border-2 border-slate-200/90 hover:border-[#d91478]/40 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${val.color} text-white flex items-center justify-center shadow-md`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">{val.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {val.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#d91478]">
                    <span>100% Guaranteed Standard</span>
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. 5-Step Turnkey EPC Process */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">TURNKEY EXECUTION</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">How We Power Your Rooftop</h2>
            <p className="text-xs sm:text-sm text-slate-600">From initial site survey to subsidy disbursement, our 5-step seamless journey guarantees peace of mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-white hover:border-[#d91478]/40 hover:shadow-md transition-all space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#d91478] to-[#16a34a] text-white flex items-center justify-center font-black text-sm shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-slate-300 font-mono group-hover:text-[#d91478] transition-colors">
                      {s.step}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900">{s.title}</h3>
                    <p className="text-xs font-bold text-[#d91478]">{s.hindi}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>
              );
            })}

            {/* Final CTA Card in Grid */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 text-white border border-slate-800 space-y-4 flex flex-col justify-between shadow-md">
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready to Start?
                </span>
                <h3 className="text-lg font-black text-white">Book Free 3D Solar Site Inspection</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our solar engineer will visit your home or business with laser measuring tools and calculate your bill savings on the spot.
                </p>
              </div>
              <Link
                to="/book"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider text-center shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span>Book Survey Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 6. PM Surya Ghar Muft Bijli Yojana Info Banner */}
        <div className="bg-gradient-to-r from-amber-50 via-white to-emerald-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
                <Sun className="w-3.5 h-3.5 fill-slate-950" />
                <span>PM Surya Ghar: Muft Bijli Yojana Official Partner</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Get Up to ₹1,08,000 Direct Bank Subsidy
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Under the Central Government initiative, residential rooftop solar installations qualify for direct financial assistance credited directly to your bank account. Power24 ensures 100% compliant paperwork for instant processing.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-white border border-amber-200 text-center shadow-xs">
                <span className="text-[10px] font-black text-slate-500 uppercase block">1 kW System</span>
                <span className="text-base sm:text-lg font-black text-emerald-600">₹30,000</span>
                <span className="text-[9px] text-slate-400 block font-bold">Direct Subsidy</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-amber-200 text-center shadow-xs">
                <span className="text-[10px] font-black text-slate-500 uppercase block">2 kW System</span>
                <span className="text-base sm:text-lg font-black text-emerald-600">₹60,000</span>
                <span className="text-[9px] text-slate-400 block font-bold">Direct Subsidy</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-amber-300 text-center shadow-xs bg-amber-50/50">
                <span className="text-[10px] font-black text-amber-700 uppercase block">3kW - 10kW</span>
                <span className="text-base sm:text-lg font-black text-[#d91478]">₹78,000+</span>
                <span className="text-[9px] text-slate-400 block font-bold">Max Benefit</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7. FAQ Accordion Section */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#d91478]">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">Got Questions? We Have Answers</h2>
            <p className="text-xs sm:text-sm text-slate-600">Everything you need to know about rooftop solar installation, warranties, and bill reduction.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border-2 border-slate-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-black text-sm sm:text-base text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#d91478] shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#d91478]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. Bottom CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border-2 border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#d91478]/25 via-[#16a34a]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left relative z-10 max-w-xl">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Start Saving Today
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Transform Your Rooftop into a Green Powerhouse
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Join 50,000+ happy homes across Uttar Pradesh and slash your monthly electricity bill by up to 90%.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 shrink-0">
            <Link
              to="/book"
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95 text-center"
            >
              Book Free Site Survey
            </Link>
            <a
              href="tel:+917398198475"
              className="px-6 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider border border-slate-700 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call +91 7398198475</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
