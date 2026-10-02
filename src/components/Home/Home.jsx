import React from 'react';
import Hero from './Hero.jsx';
import PmScheme from './PmScheme.jsx';
import SolarCalculator from './SolarCalculator.jsx';
import HowItWorks from './HowItWorks.jsx';
import BrandPartners from './BrandPartners.jsx';
import Benefit from './Benefit.jsx';
import Testimonials from './Testimonials.jsx';
import FaqSection from './FaqSection.jsx';

const Home = ({ onOpenCustomKit }) => {
  return (
    <div className="bg-slate-50 min-h-screen">
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
