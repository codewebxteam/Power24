import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Leaf,
  ShieldCheck,
  FileText,
  MessageCircle,
  Building2,
  Sparkles,
  Headphones,
  Zap,
  HelpCircle,
  ChevronDown,
  Navigation,
  Award,
  Users,
  Wrench
} from 'lucide-react';
import { saveBooking } from '../utils/storage';
import { saveContactMessageToDB } from '../firebase/firestoreService';

const Contacts = () => {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Gorakhpur',
    inquiryType: 'Residential Rooftop',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      address: formData.city,
      message: `[${formData.inquiryType}] ${formData.message}`,
      propertyType: formData.inquiryType,
      type: 'General Contact Inquiry',
    };
    saveBooking(payload);
    saveContactMessageToDB(payload).catch((err) => console.warn('[Power24] Contact DB Note:', err));
    setSubmitted(true);
  };

  const contactFaqs = [
    {
      q: 'साइट सर्वे के लिए कितना शुल्क (Fee) लगता है?',
      a: 'Power24 द्वारा साइट इंस्पेक्शन और फिजिबिलिटी सर्वे 100% नि:शुल्क (Free of Cost) है। हमारे सोलर इंजीनियर आपके छत का छाया विश्लेषण (Shade Analysis) और सटीक कोटेशन मुफ्त में प्रदान करते हैं।'
    },
    {
      q: 'कांटेक्ट फॉर्म सबमिट करने के बाद कितनी देर में रिस्पांस मिलेगा?',
      a: 'हमारी कस्टमर केयर टीम और टेक्निकल इंजीनियर्स 15 से 30 मिनट के भीतर आपसे टेलीफोन/व्हाट्सएप पर संपर्क करते हैं और आपकी सुविधानुसार सर्वे स्लॉट बुक करते हैं।'
    },
    {
      q: 'पीएम सूर्य घर सब्सिडी के कागजी काम में आप कैसे मदद करते हैं?',
      a: 'हम राष्ट्रीय पोर्टल (pmsuryaghar.gov.in) पर रजिस्ट्रेशन से लेकर डिस्कॉम (UPPCL) नेट-मीटरिंग अप्रूवल और DBT सब्सिडी आपके बैंक खाते में आने तक का 100% पेपरवर्क संभालते हैं।'
    },
    {
      q: 'क्या हम आपके गोरखपुर ऑफिस पर सीधे आकर बात कर सकते हैं?',
      a: 'हाँ, बिल्कुल! हमारा रजिस्टर्ड कॉर्पोरेट ऑफिस House No-46 F, Nahar Road Shivpur, Near MMM Engineering College, Kurnaghat, Gorakhpur पर सोमवार से शनिवार (सुबह 9:00 AM से शाम 7:00 PM) खुला रहता है।'
    },
  ];

  const serviceHubs = [
    { city: 'Gorakhpur (Head Office)', address: 'Shivpur, Near MMM Engineering College, Kurnaghat', timing: '9:00 AM - 7:00 PM', phone: '+91 7398198475' },
    { city: 'Lucknow Hub', address: 'Gomti Nagar & Transport Nagar Extension', timing: '9:30 AM - 6:30 PM', phone: '+91 7398198475' },
    { city: 'Varanasi Hub', address: 'Sigra & Cantt Industrial Route', timing: '9:30 AM - 6:30 PM', phone: '+91 7398198475' },
    { city: 'Basti & Deoria Regional Units', address: 'Dedicated Mobile Installation Crews', timing: 'Fast Dispatch', phone: '+91 7398198475' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-950 py-10 sm:py-16 font-['Outfit',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d91478]/10 to-[#16a34a]/10 border border-[#d91478]/30 text-slate-900 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Leaf className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Official Support & Corporate Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950">
            Connect With Our <span className="text-[#16a34a]">Solar Engineering Team</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base font-normal max-w-2xl mx-auto leading-relaxed">
            Have questions about PM Surya Ghar Subsidies, custom solar kits, dealership partnerships, or scheduling an on-site rooftop survey? We're here to assist you 24/7.
          </p>
        </div>

        {/* 2. Quick Contact Bar Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 sm:mb-14">
          <a
            href="tel:+917398198475"
            className="p-5 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#16a34a] transition-all shadow-md flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Call Direct Helpline</span>
              <span className="text-base sm:text-lg font-black text-slate-950 group-hover:text-[#16a34a] transition-colors block">
                +91 73981 98475
              </span>
            </div>
          </a>

          <a
            href="https://api.whatsapp.com/send?phone=917398198475&text=Hello%20Power24%20Team,%20I%20have%20an%20inquiry%20regarding%20rooftop%20solar%20and%20subsidy."
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 transition-all shadow-md flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md shadow-emerald-500/20">
              <MessageCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Instant WhatsApp Chat</span>
              <span className="text-base sm:text-lg font-black text-slate-950 group-hover:text-emerald-600 transition-colors block">
                Chat on WhatsApp
              </span>
            </div>
          </a>

          <a
            href="mailto:naarishakti2026@gmail.com"
            className="p-5 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#d91478] transition-all shadow-md flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-[#d91478] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Email Inquiries</span>
              <span className="text-sm sm:text-base font-black text-slate-950 group-hover:text-[#d91478] transition-colors truncate block">
                naarishakti2026@gmail.com
              </span>
            </div>
          </a>
        </div>

        {/* 3. Main Form & Corporate Credentials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
          
          {/* Left Column: Corporate Info & Direct Support Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Corporate Registration Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 space-y-5 shadow-xl">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider inline-block mb-2">
                  Government Registered Entity
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                  Power24 & Solar Services Pvt Ltd
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  Engineering Excellence in Power & Renewable Energy Infrastructure
                </p>
              </div>

              {/* CIN & GSTIN Badges */}
              <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-2 text-xs font-mono shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#d91478] uppercase tracking-wider">CIN:</span>
                  <span className="text-white font-bold tracking-wider">U46593UP2026PTC243205</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider">GSTIN:</span>
                  <span className="text-white font-bold tracking-wider">09AAQCP6701N1ZQ</span>
                </div>
              </div>

              {/* Detailed Contact List */}
              <div className="space-y-4 pt-1">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider">Headquarters & Service Centre</span>
                    <span className="text-slate-900 text-xs sm:text-sm leading-relaxed font-semibold block mt-0.5">
                      House No-46 F, Nahar Road Shivpur, Near MMM Engineering College, Kurnaghat, Gorakhpur, UP - 273008
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-purple-600 text-white shrink-0 shadow-sm">
                    <Clock className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider">Office Hours</span>
                    <span className="text-slate-900 text-xs sm:text-sm font-bold block mt-0.5">
                      Monday - Saturday: 9:00 AM – 7:00 PM
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold block">Sunday: On-Demand Survey Appointments</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#d91478] text-white shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider">Service Guarantee</span>
                    <span className="text-slate-900 text-xs sm:text-sm font-semibold block mt-0.5">
                      25-Year Linear Module Warranty • Free 5-Year Maintenance AMC Support
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Help Desks */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border-2 border-slate-800 space-y-3.5 shadow-xl">
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <Headphones className="w-5 h-5 text-emerald-400" />
                <span>Department Direct Helplines</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 font-bold block">Subsidy & Paperwork</span>
                  <span className="text-emerald-300 font-bold mt-0.5 block">+91 7398198475</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 font-bold block">Technical & Inverter O&M</span>
                  <span className="text-emerald-300 font-bold mt-0.5 block">+91 7398198475</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Multi-Category Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-white border-2 border-slate-200 shadow-xl">
            {submitted ? (
              <div className="py-12 sm:py-16 text-center space-y-5 animate-in fade-in zoom-in-95">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#d91478] to-[#16a34a] text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/30">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950">Inquiry Received Successfully!</h3>
                <p className="text-slate-600 max-w-md mx-auto text-xs sm:text-sm font-medium leading-relaxed">
                  Thank you, <strong className="text-emerald-700 font-bold">{formData.name}</strong>! Our solar engineer assigned to <strong className="text-slate-950 font-bold">{formData.city}</strong> will call you at <strong className="text-slate-950 font-bold">{formData.phone}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#d91478] to-[#16a34a] text-xs font-black uppercase tracking-wider text-white shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                    Send Us an Inquiry
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Fill out the form below and our solar engineering desk will provide a personalized quotation.
                  </p>
                </div>

                {/* Inquiry Category Switcher */}
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
                    1. Select Inquiry Topic / Purpose
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'Residential Rooftop', label: 'Home Rooftop' },
                      { id: 'Commercial & Industrial', label: 'Commercial' },
                      { id: 'Make Custom Solar Kit', label: 'Custom Solar Kit' },
                      { id: 'Dealership / Franchise', label: 'Partnership' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, inquiryType: t.id });
                        }}
                        className={`p-2.5 rounded-xl text-xs font-black text-center transition-all cursor-pointer border ${
                          formData.inquiryType === t.id
                            ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white border-transparent shadow-md'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 font-bold placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#d91478] focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 73981 98475"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 font-bold placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#d91478] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Email & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 font-bold placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#d91478] focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gorakhpur, Lucknow, Varanasi"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 font-bold placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#d91478] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Detailed Message */}
                <div>
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                    How Can Our Solar Engineering Team Help You? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your rooftop area, current monthly bill, or specific solar brands you prefer..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 font-bold placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#d91478] focus:bg-white transition-colors"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider text-white bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 shadow-lg shadow-[#d91478]/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4. Regional Service Network Grid */}
        <div className="mb-14 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
              Regional Service & Installation Hubs
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              We provide on-site technical inspection, turnkey EPC delivery, and DISCOM net-metering support across Eastern UP & NCR.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {serviceHubs.map((hub, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-emerald-600 font-black text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>{hub.city}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{hub.address}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>{hub.timing}</span>
                  <a href={`tel:${hub.phone}`} className="text-[#d91478] font-bold hover:underline">
                    Call Hub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Google Map Location & Office Visit Card */}
        <div className="mb-14 rounded-3xl overflow-hidden border-2 border-slate-200 bg-white shadow-xl">
          <div className="p-6 sm:p-8 bg-slate-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase mb-2">
                <Navigation className="w-3.5 h-3.5" />
                <span>Visit Corporate Headquarters</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Power24 Solar Engineering Campus
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                House No-46 F, Nahar Road Shivpur, Near MMM Engineering College, Kurnaghat, Gorakhpur, UP - 273008
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=MMM+Engineering+College+Kurnaghat+Gorakhpur"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>
          </div>

          <div className="w-full h-72 sm:h-96 bg-slate-200">
            <iframe
              title="Power24 Gorakhpur Office Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14251.349788789518!2d83.428612!3d26.758838!2m3!1f0!2f0!3f0!3m2!1i1024!2f784!3i768!4f13.1!3m3!1m2!1s0x399144fa506f3635%3A0x6b44f2d3cf380387!2sMadan%20Mohan%20Malaviya%20University%20of%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* 6. Frequently Asked Questions (FAQ) Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
              Frequently Asked Questions (FAQ)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Common questions about scheduling site surveys, subsidy claims, and corporate consultations.
            </p>
          </div>

          <div className="space-y-3">
            {contactFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border-2 border-slate-200 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-slate-950 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#d91478] shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-[#16a34a]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contacts;
