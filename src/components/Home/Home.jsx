import React from 'react';
import Hero from './Hero.jsx';
import PmScheme from './PmScheme.jsx';
import SolarCalculator from './SolarCalculator.jsx';
import HowItWorks from './HowItWorks.jsx';
import BrandPartners from './BrandPartners.jsx';
import Benefit from './Benefit.jsx';
import Testimonials from './Testimonials.jsx';
import FaqSection from './FaqSection.jsx';
import SEO from '../common/SEO.jsx';

const Home = ({ onOpenCustomKit }) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title="No.1 Rooftop Solar Company & PM Surya Ghar in UP"
        description="Power24 (Power 24 Solar) is Uttar Pradesh's leading solar rooftop company. Authorized PM Surya Ghar Muft Bijli Yojana vendor offering Tier-1 solar panels, rooftop installation, and government subsidy up to ₹1,08,000. Book a free solar rooftop survey today!"
        canonical="https://power24.in/"
        keywords="Power24, Power 24, Power 24 Solar, Power24 Solar, Power 24 Solar Energy, Power24 Solar Services, Power 24 Gorakhpur, Power 24 UP, Power 24 Rooftop, Power24 Solar Rooftop, Power 24 Solar Company, PM Surya Ghar Power24, Power 24 Subsidy, Solar Company Gorakhpur, Best Solar EPC UP, Tata Power Solar Gorakhpur, Waaree Solar Gorakhpur, Adani Solar UP"
      />
      {/* 1. Hero Section */}
      <Hero onOpenCustomKit={onOpenCustomKit} />

      {/* 2. PM Surya Ghar Scheme Section with Modi Ji Portrait */}
      <div className="py-2 sm:py-4">
        <PmScheme />
      </div>

      {/* 3. Interactive Solar Savings & Subsidy Calculator */}
      <SolarCalculator onOpenCustomKit={onOpenCustomKit} />

      {/* 4. How It Works (4-Step Solar Journey) */}
      <HowItWorks onOpenCustomKit={onOpenCustomKit} />

      {/* 5. Authorized Tier-1 Brands Showcase */}
      <BrandPartners />

      {/* 6. Solar System Advantages & Benefits */}
      <Benefit />

      {/* 7. Verified Customer Reviews & Stories */}
      <Testimonials />

      {/* 8. Frequently Asked Questions (FAQ) */}
      <FaqSection />
    </div>
  );
};

export default Home;
