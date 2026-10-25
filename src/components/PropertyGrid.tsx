import React from 'react';
import { Property } from '../types/property';
import { PropertyCard } from './PropertyCard';
import { Building, SearchX } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onQuickEnquire?: (property: Property) => void;
  onResetFilters?: () => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  loading = false,
  wishlistIds,
  onToggleWishlist,
  onQuickEnquire,
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
          >
            <div className="aspect-[16/10] bg-gray-200" />
            <div className="p-5 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-10 bg-gray-100 rounded-xl" />
              <div className="flex gap-2 pt-2">
                <div className="h-9 bg-gray-200 rounded-xl flex-1" />
                <div className="h-9 bg-gray-200 rounded-xl w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-10 sm:p-16 text-center max-w-xl mx-auto my-8">
        <div className="w-16 h-16 bg-brand-orange-light rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-orange">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-brand-charcoal mb-2">No Matching Properties Found</h3>
        <p className="text-sm text-brand-grey-text mb-6">
          We couldn&apos;t find any property matching your exact filter criteria in Pune. Try
          broadening your price range, choosing another location, or resetting filters.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors shadow"
          >
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isWishlisted={wishlistIds.includes(property.id)}
          onToggleWishlist={onToggleWishlist}
          onQuickEnquire={onQuickEnquire}
        />
      ))}
    </div>
  );
};
