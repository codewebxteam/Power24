import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'पीएम सूर्य घर मुफ्त बिजली योजना के तहत कितनी सब्सिडी मिलती है?',
      a: 'पीएम सूर्य घर योजना के तहत 2 kW के सिस्टम पर ₹90,000 (₹60,000 केंद्र + ₹30,000 राज्य) और 3 kW या उससे अधिक के सिस्टम पर ₹1,08,000 (₹78,000 केंद्र + ₹30,000 यूपी राज्य सरकार) की सीधी सब्सिडी सीधे आपके बैंक खाते में DBT के माध्यम से ट्रांसफर होती है।',
    },
    {
      q: 'क्या मैं अपनी पसंद के ब्रांड (जैसे Tata Solar, Waaree, Havells) चुन सकता हूँ?',
      a: 'हाँ, बिल्कुल! Power24 पर आपको 100% आज़ादी मिलती है। आप हमारे "Make Your Own Kit" टूल से किसी भी ब्रांड के सोलर पैनल्स (Tata, Waaree, Adani, Loom), इनवर्टर (Havells, Solis, Growatt, Luminous) और बैटरी को अपनी इच्छानुसार कस्टमाइज़ कर सकते हैं।',
    },
    {
      q: 'नेट मीटरिंग क्या है और यह कैसे काम करती है?',
      a: 'नेट मीटर एक द्वि-दिशात्मक (Bi-directional) मीटर होता है जो यह रिकॉर्ड करता है कि आपके सोलर पैनल ने ग्रिड को कितनी अतिरिक्त बिजली भेजी और आपने ग्रिड से कितनी बिजली ली। महीने के अंत में सिर्फ नेट डिफरेंस का बिल बनता है, और यदि आपने अधिक बिजली ग्रिड को दी है तो वह यूनिट्स आपके अगले बिल में क्रेडिट हो जाती हैं।',
    },
    {
      q: 'क्या सोलर सिस्टम लगाने के लिए बैंक लोन या EMI उपलब्ध है?',
      a: 'हाँ, भारत सरकार के राष्ट्रीय पोर्टल के तहत प्रमुख राष्ट्रीयकृत बैंकों (SBI, PNB, Canara Bank आदि) द्वारा 7% की रियायती ब्याज दर पर बिना किसी कोलेटरल (Collateral-free) के आसान सोलर लोन उपलब्ध है। बची हुई राशि को आप आसान मासिक किश्तों में चुका सकते हैं।',
    },
    {
      q: 'सोलर पैनल और इनवर्टर की लाइफ और वारंटी कितनी होती है?',
      a: 'Tier-1 Mono PERC व TOPCon सोलर पैनल्स पर 25 से 30 साल की लीनियर परफॉर्मेंस वारंटी मिलती है। ऑन-ग्रिड व हाइब्रिड इनवर्टर पर 5 से 10 साल की कॉम्प्रीहेंसिव वारंटी और LiFePO4 लिथियम बैटरी पर 10 साल / 6000 साइकल की वारंटी मिलती है।',
    },
    {
      q: 'Power24 से फ्री साइट सर्वे कैसे बुक करें?',
      a: 'आप हमारी वेबसाइट के "Book Survey" बटन पर क्लिक करके या ऊपर दिए गए नंबर पर कॉल करके तुरंत अपना फ्री रूफटॉप साइट सर्वे बुक कर सकते हैं। हमारे इंजीनियर आपके घर आकर शैडो एनालिसिस और लोड कैलकुलेशन करेंगे।',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-100/90 border-t border-slate-200 font-['Outfit',sans-serif]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight">
            Frequently Asked <span className="text-[#16a34a]">Questions (FAQ)</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-normal">
            सोलर रूफटॉप, सब्सिडी, और इंस्टॉलेशन से जुड़े मुख्य सवालों के सरल जवाब।
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-950 hover:text-[#d91478] transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base leading-snug">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal border-t border-slate-100 pt-3">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Box */}
        <div className="mt-10 p-6 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-md">
          <h4 className="text-base sm:text-lg font-bold text-slate-950">
            कोई अन्य प्रश्न है? हमारे सोलर एक्सपर्ट से सीधे बात करें
          </h4>
          <p className="text-xs sm:text-sm text-slate-600">
            हेल्पलाइन: <strong>+91 7398198475</strong> (सुबह 9 बजे से शाम 7 बजे तक)
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <a
              href="tel:+917398198475"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#16a34a] to-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Solar Expert</span>
            </a>
            <Link
              to="/contact"
              className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all"
            >
              <span>Contact Page</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FaqSection;
