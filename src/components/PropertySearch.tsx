import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Bed, IndianRupee, Layers } from 'lucide-react';
import { PropertyCategory, ListingType } from '../types/property';
import { businessConfig } from '../config/business';

export const PropertySearch: React.FC = () => {
  const navigate = useNavigate();

  // Active top tab (Looking for)
  const [lookingFor, setLookingFor] = useState<'buy' | 'rent' | 'commercial' | 'industrial'>('buy');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('0');
  const [maxPrice, setMaxPrice] = useState<string>('all');
  const [bedrooms, setBedrooms] = useState<string>('any');

  const propertyTypes: { label: string; value: PropertyCategory }[] = [
    { label: 'Flat / Apartment', value: 'Flat / Apartment' },
    { label: 'Residential Plot', value: 'Residential Plot' },
    { label: 'Independent House', value: 'Independent House' },
    { label: 'Row House', value: 'Row House' },
    { label: 'Shop', value: 'Shop' },
    { label: 'Office Space', value: 'Office Space' },
    { label: 'Commercial Space', value: 'Commercial Space' },
    { label: 'Industrial Land', value: 'Industrial Land' },
  ];

  const puneLocations = businessConfig.coverage;

  const buyPriceRanges = [
    { label: 'Up to ₹40 Lakh', min: 0, max: 4000000 },
    { label: '₹40 Lakh – ₹80 Lakh', min: 4000000, max: 8000000 },
    { label: '₹80 Lakh – ₹1.5 Cr', min: 8000000, max: 15000000 },
    { label: '₹1.5 Cr – ₹2.5 Cr', min: 15000000, max: 25000000 },
    { label: '₹2.5 Cr & Above', min: 25000000, max: 100000000 },
  ];

  const rentPriceRanges = [
    { label: 'Up to ₹20,000 / mo', min: 0, max: 20000 },
    { label: '₹20,000 – ₹40,000 / mo', min: 20000, max: 40000 },
    { label: '₹40,000 – ₹80,000 / mo', min: 40000, max: 80000 },
    { label: '₹80,000+ / mo', min: 80000, max: 500000 },
  ];

  const activePriceRanges = lookingFor === 'rent' ? rentPriceRanges : buyPriceRanges;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params = new URLSearchParams();

    if (lookingFor === 'buy') {
      params.set('type', 'buy');
    } else if (lookingFor === 'rent') {
      params.set('type', 'rent');
    } else if (lookingFor === 'commercial') {
      params.set('group', 'commercial');
    } else if (lookingFor === 'industrial') {
      params.set('group', 'industrial');
    }

    if (propertyType !== 'all') {
      params.set('category', propertyType);
    }

    if (location !== 'all' && location.trim() !== '') {
      params.set('location', location);
    }

    if (minPrice && minPrice !== '0') {
      params.set('minPrice', minPrice);
    }

    if (maxPrice && maxPrice !== 'all') {
      params.set('maxPrice', maxPrice);
    }

    if (bedrooms !== 'any') {
      params.set('bedrooms', bedrooms);
    }

    navigate(`/properties?${params.toString()}`);
  };

  const handleQuickPill = (filterType: string, value: string) => {
    const params = new URLSearchParams();
    if (filterType === 'type') {
      params.set('type', value);
    } else if (filterType === 'category') {
      params.set('category', value);
    } else if (filterType === 'group') {
      params.set('group', value);
    }
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl sm:rounded-4xl shadow-elevated border border-gray-100 p-4 sm:p-7 relative z-20">
      {/* Top Looking For Tabs (Inspired by screenshot pill controls) */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-gray-100 pb-4 mb-5 overflow-x-auto no-scrollbar">
        {[
          { key: 'buy', label: 'Buy Property' },
          { key: 'rent', label: 'Rent Property' },
          { key: 'commercial', label: 'Commercial' },
          { key: 'industrial', label: 'Industrial' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setLookingFor(tab.key as any)}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 ${
              lookingFor === tab.key
                ? 'bg-brand-charcoal text-white shadow-sm'
                : 'bg-brand-grey text-brand-grey-text hover:text-brand-charcoal hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Search Controls Grid */}
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
          {/* 1. Property Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-brand-orange" />
              Property Type
            </label>
            <div className="relative">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-brand-grey/80 border border-gray-200 text-brand-charcoal text-xs sm:text-sm rounded-2xl py-3 px-3.5 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all cursor-pointer"
              >
                <option value="all">All Property Types</option>
                {propertyTypes.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Location */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
              Location in Pune
            </label>
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-brand-grey/80 border border-gray-200 text-brand-charcoal text-xs sm:text-sm rounded-2xl py-3 px-3.5 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all cursor-pointer"
              >
                <option value="all">All Pune Localities</option>
                {puneLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Budget Range */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-brand-orange" />
              Budget Range
            </label>
            <div className="relative">
              <select
                value={`${minPrice}-${maxPrice}`}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'all') {
                    setMinPrice('0');
                    setMaxPrice('all');
                  } else {
                    const [min, max] = val.split('-');
                    setMinPrice(min);
                    setMaxPrice(max);
                  }
                }}
                className="w-full bg-brand-grey/80 border border-gray-200 text-brand-charcoal text-xs sm:text-sm rounded-2xl py-3 px-3.5 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all cursor-pointer"
              >
                <option value="all">Any Price</option>
                {activePriceRanges.map((range) => (
                  <option key={range.label} value={`${range.min}-${range.max}`}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Bedrooms / Configuration */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-brand-orange" />
              Bedrooms (BHK)
            </label>
            <div className="relative">
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                disabled={lookingFor === 'commercial' || lookingFor === 'industrial'}
                className="w-full bg-brand-grey/80 border border-gray-200 text-brand-charcoal text-xs sm:text-sm rounded-2xl py-3 px-3.5 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all cursor-pointer disabled:opacity-50"
              >
                <option value="any">Any Bedrooms</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK / Penthouse</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Filter Pills & Search CTA Button (Screenshot Style) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-gray-100">
          {/* Quick Filter Tag Pills */}
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-brand-orange" />
              Popular:
            </span>
            <button
              type="button"
              onClick={() => handleQuickPill('category', 'Flat / Apartment')}
              className="px-3 py-1 rounded-full text-xs font-medium bg-brand-grey hover:bg-brand-charcoal hover:text-white transition-colors text-brand-charcoal"
            >
              Apartment
            </button>
            <button
              type="button"
              onClick={() => handleQuickPill('category', 'Independent House')}
              className="px-3 py-1 rounded-full text-xs font-medium bg-brand-grey hover:bg-brand-charcoal hover:text-white transition-colors text-brand-charcoal"
            >
              House & Villa
            </button>
            <button
              type="button"
              onClick={() => handleQuickPill('category', 'Residential Plot')}
              className="px-3 py-1 rounded-full text-xs font-medium bg-brand-grey hover:bg-brand-charcoal hover:text-white transition-colors text-brand-charcoal"
            >
              Plots
            </button>
            <button
              type="button"
              onClick={() => handleQuickPill('group', 'commercial')}
              className="px-3 py-1 rounded-full text-xs font-medium bg-brand-grey hover:bg-brand-charcoal hover:text-white transition-colors text-brand-charcoal"
            >
              Commercial
            </button>
          </div>

          {/* Search Properties Button */}
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-brand-charcoal hover:bg-brand-orange transition-all duration-300 shadow-md hover:shadow-glow transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
          >
            <Search className="w-4 h-4 text-brand-orange" />
            <span>Search Properties</span>
          </button>
        </div>
      </form>
    </div>
  );
};
