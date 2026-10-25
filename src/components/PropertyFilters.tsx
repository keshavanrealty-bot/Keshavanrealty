import React from 'react';
import {
  X,
  RotateCcw,
  SlidersHorizontal,
  Home,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Maximize2,
  Check,
} from 'lucide-react';
import {
  PropertyFilterParams,
  PropertyCategory,
  CategoryGroup,
  ListingType,
  FurnishingStatus,
  ConstructionStatus,
  PropertyStatus,
} from '../types/property';
import { businessConfig } from '../config/business';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface PropertyFiltersProps {
  filters: PropertyFilterParams;
  onFilterChange: (newFilters: Partial<PropertyFilterParams>) => void;
  onReset: () => void;
  totalResults: number;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
  isMobile = false,
  onCloseMobile,
}) => {
  const { settings } = useSiteSettings();

  const propertyCategories = (settings.property_display?.categories || [
    'Flat / Apartment',
    'Residential Plot',
    'Independent House',
    'Row House',
    'Shop',
    'Office Space',
    'Commercial Space',
    'Industrial Land',
  ]) as PropertyCategory[];

  const puneLocations = settings.property_display?.locations || businessConfig.coverage;

  const furnishingOptions: FurnishingStatus[] = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const constructionOptions: ConstructionStatus[] = ['Ready to Move', 'Under Construction'];

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-brand-orange" />
          <h3 className="font-bold text-brand-charcoal text-base">Filters</h3>
          <span className="text-xs bg-brand-orange-light text-brand-orange px-2 py-0.5 rounded-full font-bold">
            {totalResults}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="text-xs font-semibold text-brand-grey-text hover:text-brand-orange flex items-center gap-1 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
          {isMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Buy or Rent Toggle */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Listing Type
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-brand-grey rounded-2xl">
          {[
            { label: 'All', value: 'all' },
            { label: 'Buy', value: 'buy' },
            { label: 'Rent', value: 'rent' },
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() =>
                onFilterChange({
                  listingType: type.value as ListingType | 'all',
                })
              }
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                (filters.listingType || 'all') === type.value
                  ? 'bg-brand-charcoal text-white shadow-sm'
                  : 'text-brand-grey-text hover:text-brand-charcoal'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Category Group (Residential / Commercial / Industrial) */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Sector
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: 'All', value: 'all' },
            { label: 'Residential', value: 'residential' },
            { label: 'Commercial', value: 'commercial' },
          ].map((group) => (
            <button
              key={group.value}
              type="button"
              onClick={() =>
                onFilterChange({
                  categoryGroup: group.value as CategoryGroup | 'all',
                  category: 'all', // reset specific category when changing group
                })
              }
              className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                (filters.categoryGroup || 'all') === group.value
                  ? 'border-brand-orange bg-brand-orange-light text-brand-orange font-bold'
                  : 'border-gray-200 text-brand-grey-text hover:border-gray-300'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Property Category */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5 text-brand-orange" />
          Property Category
        </label>
        <select
          value={filters.category || 'all'}
          onChange={(e) =>
            onFilterChange({
              category: e.target.value as PropertyCategory | 'all',
            })
          }
          className="w-full bg-brand-grey border border-gray-200 text-brand-charcoal text-xs sm:text-sm rounded-xl py-2.5 px-3 font-medium focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
        >
          <option value="all">All Categories</option>
          {propertyCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Location in Pune */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand-orange" />
          Pune Location
        </label>
        <select
          value={filters.location || 'all'}
          onChange={(e) =>
            onFilterChange({
              location: e.target.value === 'all' ? undefined : e.target.value,
            })
          }
          className="w-full bg-brand-grey border border-gray-200 text-brand-charcoal text-xs sm:text-sm rounded-xl py-2.5 px-3 font-medium focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
        >
          <option value="all">All Pune Localities</option>
          {puneLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Budget Range */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <IndianRupee className="w-3.5 h-3.5 text-brand-orange" />
          Max Budget
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-gray-400 block mb-1">Min Price</span>
            <select
              value={filters.minPrice || 0}
              onChange={(e) => onFilterChange({ minPrice: Number(e.target.value) })}
              className="w-full bg-brand-grey border border-gray-200 text-xs rounded-xl py-2 px-2.5"
            >
              <option value="0">Min Price</option>
              <option value="3000000">₹30 Lakh</option>
              <option value="5000000">₹50 Lakh</option>
              <option value="8000000">₹80 Lakh</option>
              <option value="12000000">₹1.20 Cr</option>
              <option value="20000000">₹2.00 Cr</option>
            </select>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block mb-1">Max Price</span>
            <select
              value={filters.maxPrice || 0}
              onChange={(e) =>
                onFilterChange({
                  maxPrice: Number(e.target.value) === 0 ? undefined : Number(e.target.value),
                })
              }
              className="w-full bg-brand-grey border border-gray-200 text-xs rounded-xl py-2 px-2.5"
            >
              <option value="0">Any Max</option>
              <option value="5000000">₹50 Lakh</option>
              <option value="9000000">₹90 Lakh</option>
              <option value="15000000">₹1.50 Cr</option>
              <option value="25000000">₹2.50 Cr</option>
              <option value="50000000">₹5.00 Cr+</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. Bedrooms (BHK) */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <Bed className="w-3.5 h-3.5 text-brand-orange" />
          Bedrooms
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { label: 'All', value: 'any' },
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
            { label: '4+', value: 4 },
          ].map((item) => (
            <button
              key={String(item.value)}
              type="button"
              onClick={() =>
                onFilterChange({
                  bedrooms: item.value as number | 'any',
                })
              }
              className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                (filters.bedrooms ?? 'any') === item.value
                  ? 'border-brand-orange bg-brand-orange text-white font-bold'
                  : 'border-gray-200 text-brand-grey-text hover:border-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Construction Status */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Possession Status
        </label>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onFilterChange({ constructionStatus: 'all' })}
            className={`w-full py-2 px-3 text-left rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
              (filters.constructionStatus || 'all') === 'all'
                ? 'border-brand-orange bg-brand-orange-light text-brand-orange font-bold'
                : 'border-gray-200 text-brand-grey-text hover:bg-gray-50'
            }`}
          >
            <span>All Statuses</span>
            {(filters.constructionStatus || 'all') === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>
          {constructionOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onFilterChange({ constructionStatus: opt })}
              className={`w-full py-2 px-3 text-left rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
                filters.constructionStatus === opt
                  ? 'border-brand-orange bg-brand-orange-light text-brand-orange font-bold'
                  : 'border-gray-200 text-brand-grey-text hover:bg-gray-50'
              }`}
            >
              <span>{opt}</span>
              {filters.constructionStatus === opt && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* 8. Furnishing */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Furnishing
        </label>
        <select
          value={filters.furnishingStatus || 'all'}
          onChange={(e) =>
            onFilterChange({
              furnishingStatus: e.target.value as FurnishingStatus | 'all',
            })
          }
          className="w-full bg-brand-grey border border-gray-200 text-brand-charcoal text-xs rounded-xl py-2 px-3 font-medium"
        >
          <option value="all">Any Furnishing</option>
          {furnishingOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* 9. Availability Status */}
      <div>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Property Status
        </label>
        <select
          value={filters.status || 'available'}
          onChange={(e) =>
            onFilterChange({
              status: e.target.value as PropertyStatus | 'all',
            })
          }
          className="w-full bg-brand-grey border border-gray-200 text-brand-charcoal text-xs rounded-xl py-2 px-3 font-medium"
        >
          <option value="available">Available Listings</option>
          <option value="all">All (Including Sold/Rented)</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
        </select>
      </div>

      {/* Apply / Reset Buttons */}
      <div className="pt-2 border-t border-gray-100 flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-brand-charcoal hover:bg-gray-100 transition-colors"
        >
          Reset
        </button>
        {isMobile && onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex-1 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow hover:bg-brand-orange-hover transition-colors"
          >
            Show {totalResults} Properties
          </button>
        )}
      </div>
    </div>
  );
};
