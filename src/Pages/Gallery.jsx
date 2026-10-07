import React, { useState, useEffect } from 'react';
import { Image, MapPin, Zap, CheckCircle2, ArrowRight, Leaf, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
const solarHeroImg = 'https://ik.imagekit.io/qvztwdsij/solar%20hero%20-%20Copy.png?updatedAt=1790432262362';
import { getGalleryItems } from '../utils/storage';
import { subscribeGallery } from '../firebase/firestoreService';
import SEO from '../components/common/SEO.jsx';

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    setGalleryItems(getGalleryItems());
    const unsub = subscribeGallery((items) => {
      setGalleryItems(items);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-950 py-10 sm:py-16 font-['Outfit',sans-serif]">
      <SEO
        title="Project Installations Gallery"
        description="Explore real rooftop solar installations completed across Uttar Pradesh by Power24 Solar (Power 24). See 1kW to 10kW residential and commercial rooftop solar projects."
        canonical="https://power24.in/gallery"
        keywords="Power24 solar installations, Power 24 project gallery, Solar photos Gorakhpur, Rooftop solar UP"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
            <Leaf className="w-3.5 h-3.5 fill-white" />
            <span>Project Gallery</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-['Outfit',sans-serif]">
            Featured Solar <span className="text-emerald-600">Installations</span>
          </h1>
          <p className="text-slate-700 text-xs sm:text-sm font-normal max-w-2xl mx-auto leading-relaxed">
            Browse our completed residential, commercial, and industrial turnkey solar installations across the country.
          </p>
        </div>

        {/* Filter Tabs (Horizontal Scrollable on Mobile) */}
        <div className="flex items-center justify-start sm:justify-center gap-2.5 mb-8 sm:mb-10 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'residential', label: 'Residential' },
            { id: 'commercial', label: 'Commercial' },
            { id: 'industrial', label: 'Industrial' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                filter === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid or Empty State */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border-2 border-slate-200 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No projects found in this category</h3>
            <p className="text-xs text-slate-600">Explore other categories or contact our engineering team to inspect upcoming project sites.</p>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <span>Book Site Survey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="group rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between shadow-sm"
              >
                <div className="relative h-56 sm:h-72 overflow-hidden bg-slate-950">
                  <img
                    src={item.image || solarHeroImg}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-600 text-white shadow-sm">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400 bg-slate-950/90 px-3 py-1 rounded-xl backdrop-blur-md border border-slate-800">
                      <Zap className="w-4 h-4 fill-emerald-400 stroke-[2]" />
                      <span>{item.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white font-medium bg-slate-950/90 px-3 py-1 rounded-xl backdrop-blur-md border border-slate-800">
                      <MapPin className="w-4 h-4 text-emerald-400 stroke-[2]" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-950 font-['Outfit',sans-serif]">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs sm:text-sm pt-3 border-t border-slate-100">
                    <span className="text-slate-700 font-medium">Savings: <strong className="text-emerald-700 font-bold">{item.savings}</strong></span>
                    <Link
                      to="/book"
                      className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      <span>Get Similar System</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
