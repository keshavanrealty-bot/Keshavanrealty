import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Car,
  CheckCircle2,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react';
import { Property } from '../types/property';
import { formatIndianPrice, formatArea } from '../utils/formatters';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface PropertyCardProps {
  property: Property;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onQuickEnquire?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isWishlisted,
  onToggleWishlist,
  onQuickEnquire,
}) => {
  const { settings } = useSiteSettings();
  const pDisplay = settings.property_display;

  return (
    <div className="group bg-white rounded-3xl border border-brand-grey-border/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Buy / Rent Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
                property.listingType === 'buy'
                  ? 'bg-brand-charcoal text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {property.listingType === 'buy' ? 'For Sale' : 'For Rent'}
            </span>

            {/* Featured Badge */}
            {property.featured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                Featured
              </span>
            )}

            {/* Property Type Badge */}
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-brand-charcoal shadow-sm">
              {property.propertyType}
            </span>
          </div>

          {/* Wishlist Heart Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist(property.id);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 scale-105'
                : 'bg-white/90 backdrop-blur-md text-gray-700 hover:text-rose-600 hover:bg-white'
            }`}
            title={isWishlisted ? 'Remove from Saved' : 'Save Property'}
            aria-label="Save Property"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? 'fill-rose-600 text-rose-600' : ''
              }`}
            />
          </button>
        </div>

        {/* Bottom Image Overlay Info (ID & Verified) */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between z-10 text-xs text-white/90 font-medium">
          <span className="bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-md font-mono text-[11px]">
            {pDisplay?.propertyCodePrefix || 'KR-'}{property.id}
          </span>
          {property.verified && (
            <span className="inline-flex items-center gap-1 bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-semibold text-white">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-brand-charcoal tracking-tight">
                {formatIndianPrice(property.price, property.listingType)}
              </span>
              {property.priceNegotiable && pDisplay?.showPriceNegotiable !== false && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Negotiable
                </span>
              )}
            </div>
            {property.pricePerSqFt && property.listingType === 'buy' && (
              <span className="text-xs text-brand-grey-text font-medium">
                ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/properties/${property.id}`} className="block group/title">
            <h3 className="text-base font-bold text-brand-charcoal line-clamp-1 group-hover/title:text-brand-orange transition-colors">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-brand-grey-text mt-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
            <span className="truncate">
              {property.locality ? `${property.locality}, ` : ''}
              {property.location}, Pune
            </span>
          </div>

          {/* Key Property Specs Row */}
          <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-brand-grey/70 rounded-2xl border border-brand-grey-border/50 text-xs text-brand-charcoal mb-4">
            {/* Bedrooms if applicable, else Construction status */}
            {property.bedrooms !== undefined ? (
              <div className="flex items-center gap-1.5" title={`${property.bedrooms} Bedrooms`}>
                <BedDouble className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span className="font-semibold truncate">{property.bedrooms} BHK</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5" title={property.propertyType}>
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span className="font-medium truncate">{property.constructionStatus || 'Prime'}</span>
              </div>
            )}

            {/* Bathrooms if applicable, else Parking */}
            {property.bathrooms !== undefined ? (
              <div className="flex items-center gap-1.5" title={`${property.bathrooms} Bathrooms`}>
                <Bath className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span className="font-semibold truncate">{property.bathrooms} Baths</span>
              </div>
            ) : property.parking ? (
              <div className="flex items-center gap-1.5" title={property.parking}>
                <Car className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span className="font-medium truncate">Parking</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span className="font-medium truncate">Clear Title</span>
              </div>
            )}

            {/* Area */}
            <div className="flex items-center gap-1.5" title={`Area: ${property.area} ${property.areaUnit}`}>
              <Maximize2 className="w-3.5 h-3.5 text-brand-orange shrink-0" />
              <span className="font-semibold truncate">{formatArea(property.area, property.areaUnit)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            to={`/properties/${property.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-brand-charcoal bg-white border border-brand-charcoal/20 hover:bg-brand-charcoal hover:text-white transition-all"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => onQuickEnquire && onQuickEnquire(property)}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
