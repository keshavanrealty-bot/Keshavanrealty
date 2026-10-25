import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Car,
  Calendar,
  Compass,
  Building,
  CheckCircle2,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Home,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { PropertyGallery } from '../components/PropertyGallery';
import { EnquiryForm } from '../components/EnquiryForm';
import { PropertyCard } from '../components/PropertyCard';
import { businessConfig } from '../config/business';
import { useSiteSettings } from '../context/SiteSettingsContext';
import {
  formatIndianPrice,
  formatArea,
  generateWhatsAppLink,
  generatePropertyShareUrl,
} from '../utils/formatters';

interface PropertyDetailsProps {
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onQuickEnquire: (property: Property) => void;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  wishlistIds,
  onToggleWishlist,
  onQuickEnquire,
}) => {
  const { settings } = useSiteSettings();
  const bInfo = settings.business_info || businessConfig;
  const crmSettings = settings.enquiry_crm;
  const pDisplay = settings.property_display;

  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (id) {
      setLoading(true);
      propertyService.getPropertyById(id).then((found) => {
        setProperty(found);
        if (found) {
          propertyService.getSimilarProperties(found, 3).then(setSimilarProperties);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleShare = async () => {
    if (!property) return;
    const url = generatePropertyShareUrl(property.id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${property.title} | Keshavan Realty`,
          text: `Check out this property in ${property.location}, Pune on Keshavan Realty: ${property.title}`,
          url: url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(url);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  const scrollToEnquiry = () => {
    const el = document.getElementById('enquiry-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-grey/40 py-12 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-brand-grey/40 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 text-center space-y-4 shadow-sm border border-gray-200">
          <Info className="w-12 h-12 text-brand-orange mx-auto" />
          <h2 className="text-xl font-bold text-brand-charcoal">Property Not Found</h2>
          <p className="text-xs text-brand-grey-text">
            The property reference you requested does not exist or may have been unlisted.
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-charcoal text-white text-xs font-bold hover:bg-brand-orange transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Properties</span>
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = wishlistIds.includes(property.id);

  const formattedPrice = formatIndianPrice(property.price, property.listingType);
  const whatsappTemplate = 'Hello Keshavan Realty, I am interested in {title} (ID: {code}) priced at {price} in {location}, Pune. Please share more details.';
  
  const propertyCodeStr = `${pDisplay?.propertyCodePrefix || 'KR-'}${property.id}`;
  const whatsappMessage = whatsappTemplate
    .replace('{title}', property.title)
    .replace('{code}', propertyCodeStr)
    .replace('{price}', formattedPrice)
    .replace('{location}', property.location);

  const whatsappUrl = generateWhatsAppLink(bInfo.whatsapp || businessConfig.whatsapp, whatsappMessage);

  return (
    <div className="min-h-screen bg-brand-grey/30 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-brand-grey-text">
          <Link to="/" className="hover:text-brand-orange flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/properties" className="hover:text-brand-orange">
            Properties
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link
            to={`/properties?location=${encodeURIComponent(property.location)}`}
            className="hover:text-brand-orange"
          >
            {property.location}
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-brand-charcoal font-semibold truncate max-w-xs">
            {property.title}
          </span>
        </nav>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                  property.listingType === 'buy'
                    ? 'bg-brand-charcoal text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {property.listingType === 'buy' ? 'For Sale' : 'For Rent'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-grey text-brand-charcoal border border-gray-200">
                {property.propertyType}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-gray-500 bg-gray-100">
                ID: {property.id}
              </span>
              {property.verified && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Listing
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-brand-charcoal tracking-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-brand-grey-text">
              <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
              <span>{property.address}</span>
            </div>
          </div>

          {/* Price & Action Icons */}
          <div className="flex md:flex-col items-baseline md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
            <div>
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-brand-charcoal tracking-tight">
                {formatIndianPrice(property.price, property.listingType)}
              </div>
              {property.pricePerSqFt && property.listingType === 'buy' && (
                <div className="text-xs text-brand-grey-text text-right font-medium">
                  ₹{property.pricePerSqFt.toLocaleString('en-IN')} / sq.ft
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleWishlist(property.id)}
                className={`p-2.5 rounded-full border transition-all ${
                  isSaved
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-gray-200 text-gray-700 hover:text-rose-600 hover:bg-gray-50'
                }`}
                title={isSaved ? 'Remove from Saved' : 'Save Property'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors relative"
                title="Share Property"
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <PropertyGallery images={property.images} title={property.title} />

        {/* Action Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={scrollToEnquiry}
            className="py-3 px-4 rounded-2xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enquire Now</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Enquiry</span>
          </a>

          <a
            href={`tel:${businessConfig.phone}`}
            className="py-3 px-4 rounded-2xl bg-brand-charcoal hover:bg-black text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow transition-all"
          >
            <Phone className="w-4 h-4 text-brand-orange" />
            <span>Call Advisor</span>
          </a>

          <button
            onClick={handleShare}
            className="py-3 px-4 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-brand-charcoal text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Listing</span>
          </button>
        </div>

        {/* Main Content Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Key Specs Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-brand-charcoal border-l-3 border-brand-orange pl-3">
                Overview &amp; Specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 bg-brand-grey/60 rounded-2xl border border-gray-100 flex items-start gap-3">
                  <Maximize2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-gray-400 block font-medium">Carpet Area</span>
                    <strong className="text-brand-charcoal text-sm">
                      {formatArea(property.area, property.areaUnit)}
                    </strong>
                  </div>
                </div>

                {property.bedrooms !== undefined && (
                  <div className="p-3.5 bg-brand-grey/60 rounded-2xl border border-gray-100 flex items-start gap-3">
                    <BedDouble className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-gray-400 block font-medium">Bedrooms</span>
                      <strong className="text-brand-charcoal text-sm">{property.bedrooms} BHK</strong>
                    </div>
                  </div>
                )}

                {property.bathrooms !== undefined && (
                  <div className="p-3.5 bg-brand-grey/60 rounded-2xl border border-gray-100 flex items-start gap-3">
                    <Bath className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-gray-400 block font-medium">Bathrooms</span>
                      <strong className="text-brand-charcoal text-sm">{property.bathrooms} Baths</strong>
                    </div>
                  </div>
                )}

                {property.parking && (
                  <div className="p-3.5 bg-brand-grey/60 rounded-2xl border border-gray-100 flex items-start gap-3">
                    <Car className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-gray-400 block font-medium">Parking</span>
                      <strong className="text-brand-charcoal text-sm">{property.parking}</strong>
                    </div>
                  </div>
                )}

                {property.furnishingStatus && (
                  <div className="p-3.5 bg-brand-grey/60 rounded-2xl border border-gray-100 flex items-start gap-3">
                    <Building className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-gray-400 block font-medium">Furnishing</span>
                      <strong className="text-brand-charcoal text-sm">
                        {property.furnishingStatus}
                      </strong>
                    </div>
                  </div>
                )}

                {property.constructionStatus && (
                  <div className="p-3.5 bg-brand-grey/60 rounded-2xl border border-gray-100 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-gray-400 block font-medium">Possession</span>
                      <strong className="text-brand-charcoal text-sm">
                        {property.constructionStatus}
                      </strong>
                    </div>
                  </div>
                )}

                {property.floor && (
                  <div className="p-3.5 bg-brand-grey/60 rounded-2xl border border-gray-100 flex items-start gap-3">
                    <Building className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-gray-400 block font-medium">Floor</span>
                      <strong className="text-brand-charcoal text-sm">{property.floor}</strong>
                    </div>
                  </div>
                )}

                {property.facing && (
                  <div className="p-3.5 bg-brand-grey/60 rounded-2xl border border-gray-100 flex items-start gap-3">
                    <Compass className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-gray-400 block font-medium">Facing / Vastu</span>
                      <strong className="text-brand-charcoal text-sm">{property.facing}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-brand-charcoal border-l-3 border-brand-orange pl-3">
                Property Description
              </h3>
              <p className="text-xs sm:text-sm text-brand-grey-text leading-relaxed whitespace-pre-line">
                {property.description}
              </p>

              {property.highlights && property.highlights.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-3">
                    Key Highlights
                  </h4>
                  <ul className="space-y-2">
                    {property.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-brand-charcoal border-l-3 border-brand-orange pl-3">
                  Amenities &amp; Facilities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-3 rounded-2xl bg-brand-grey/50 border border-gray-100 text-xs sm:text-sm font-medium text-brand-charcoal"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Landmarks */}
            {property.landmarks && property.landmarks.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-brand-charcoal border-l-3 border-brand-orange pl-3">
                  Nearby Landmarks &amp; Connectivity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.landmarks.map((lm) => (
                    <div
                      key={lm.name}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-grey/50 border border-gray-100 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-orange" />
                        <span className="font-semibold text-brand-charcoal">{lm.name}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-brand-orange bg-brand-orange-light px-2.5 py-0.5 rounded-full">
                        {lm.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Form (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div id="enquiry-section">
              <EnquiryForm propertyId={property.id} propertyTitle={property.title} />
            </div>

            {/* Safety & RERA note card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-brand-orange">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                  Keshavan Assurance
                </h4>
              </div>
              <p className="text-xs text-brand-grey-text leading-relaxed">
                All property visits and documentation verifications are conducted in full
                transparency. No hidden commissions or charges.
              </p>
              <div className="pt-2 text-xs font-semibold text-brand-charcoal">
                Need Immediate Help?{' '}
                <a
                  href={`tel:${bInfo.phone}`}
                  className="text-brand-orange hover:underline block pt-1"
                >
                  Call {bInfo.displayPhone || bInfo.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="pt-12 border-t border-gray-200 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">
                  Related Recommendations
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-brand-charcoal">
                  Similar Properties in {property.location}
                </h3>
              </div>
              <Link
                to={`/properties?location=${encodeURIComponent(property.location)}`}
                className="text-xs font-bold text-brand-orange hover:underline"
              >
                View More &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  isWishlisted={wishlistIds.includes(p.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickEnquire={onQuickEnquire}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Enquiry Bar (Prompt Requirement) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0">
          <div className="text-xs font-bold text-brand-charcoal truncate">{property.title}</div>
          <div className="text-sm font-extrabold text-brand-orange">
            {formatIndianPrice(property.price, property.listingType)}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow"
            aria-label="WhatsApp Enquiry"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <button
            onClick={scrollToEnquiry}
            className="px-4 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow hover:bg-brand-orange-hover"
          >
            Enquire
          </button>
        </div>
      </div>
    </div>
  );
};
