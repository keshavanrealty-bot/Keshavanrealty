import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  MapPin,
  Compass,
  CheckCircle2,
  ChevronDown,
  Building,
  KeyRound,
  TrendingUp,
  Headphones,
  Search,
  MessageSquare,
  Sparkles,
  Star,
  Quote,
} from 'lucide-react';
import { PropertySearch } from '../components/PropertySearch';
import { PropertyCard } from '../components/PropertyCard';
import { CategoryCard } from '../components/CategoryCard';
import { LocationCard } from '../components/LocationCard';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { businessConfig } from '../config/business';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface HomeProps {
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onQuickEnquire: (property: Property) => void;
}

export const Home: React.FC<HomeProps> = ({
  wishlistIds,
  onToggleWishlist,
  onQuickEnquire,
}) => {
  const { settings } = useSiteSettings();
  const bInfo = settings.business_info || businessConfig;
  const appearance = settings.appearance;
  const hpContent = settings.homepage_content;
  const visibility = appearance?.sectionVisibility || {
    heroSearch: true,
    categoryCards: true,
    featuredProperties: true,
    splitPromo: true,
    puneLocations: true,
    whyChooseUs: true,
    testimonials: true,
    faqAccordion: true,
  };

  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const categories = propertyService.getCategories();

  React.useEffect(() => {
    propertyService.getFeaturedProperties(6).then(setFeaturedProperties);
  }, []);

  // Determine active hero banner image
  const activeBanner = appearance?.heroBanners?.[0] ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85';

  const puneLocations = [
    {
      name: 'Wakad',
      tagline: 'High-growth residential belt near Hinjawadi IT Park',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Hinjawadi',
      tagline: 'Pune’s premier Rajiv Gandhi Infotech Park & tech campuses',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Baner',
      tagline: 'Upscale urban living, fine-dining, and high street retail',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Balewadi',
      tagline: 'Balewadi High Street entertainment and modern towers',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Ravet',
      tagline: 'Green residential hub with direct Expressway access',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Punawale',
      tagline: 'Affordable gated communities & rapid infrastructure',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Tathawade',
      tagline: 'Education corridor with JSPM & Indira campuses',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Moshi',
      tagline: 'Industrial & residential junction with International Center',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Chikhali',
      tagline: 'Thriving manufacturing & warehousing MIDC zone',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Charholi',
      tagline: 'Scenic Ring Road connectivity near Pride World City',
      image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Dighi',
      tagline: 'Alandi Road commercial connectivity & airport link',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Talegaon',
      tagline: 'Cool climate NA plots and affordable bungalow projects',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const whyChooseIcons = [Compass, Shield, Building, Headphones];

  const faqs = [
    {
      question: 'What types of properties are available?',
      answer:
        'Keshavan Realty covers a diverse spectrum of Pune properties including residential flats (1, 2, 3 & 4 BHK), collector-sanctioned NA residential plots, independent villas, duplex row houses, high-street retail shops, Grade-A IT office spaces, and industrial MIDC lands.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    },
    {
      question: 'Which areas of Pune do you cover?',
      answer:
        'We specialize across prominent Pune and PCMC micro-markets including Wakad, Hinjawadi, Baner, Balewadi, Tathawade, Ravet, Punawale, Pimple Saudagar, Moshi, Chikhali, Charholi, Dighi, Alandi Road, and Talegaon Dabhade.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
    },
    {
      question: 'How can I enquire about a property?',
      answer:
        `You can enquire directly via the "Enquire Now" button on any listing card or details page, call our property desk directly at ${bInfo.displayPhone || bInfo.phone}, or send an instant prefilled WhatsApp enquiry.`,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    },
    {
      question: 'Can I submit my property for listing?',
      answer:
        'Yes. Property owners and developers can share their property details directly with our team via our Contact page or WhatsApp desk. Our advisors will inspect the property, verify documents, and assist you with onboarding.',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80',
    },
    {
      question: 'How can I arrange a property visit?',
      answer:
        'Simply submit the enquiry form indicating your preferred date, or call us. Our local Pune property advisor will coordinate with the owner/site office to organize a hassle-free physical site visit.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80',
    },
    {
      question: 'Are the displayed properties available for sale or rent?',
      answer:
        'We offer both outright purchase (Sale) and long-term rental/leasing opportunities. You can easily filter listings by "Buy" or "Rent" at the top of our search panel.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative pt-24 sm:pt-28 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-brand-charcoal">
        {/* Ambient Warm Gradient Glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-0 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Main Hero Container */}
          <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden border border-white/10 shadow-2xl min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-between p-6 sm:p-10 lg:p-14">
            {/* Background Architectural Image */}
            <img
              src={activeBanner}
              alt={appearance?.heroHeading || 'Luxury Architecture Pune'}
              className="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/95 via-brand-charcoal/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 via-transparent to-black/30" />

            {/* Top Tag Pills */}
            <div className="relative z-10 flex items-center gap-2 flex-wrap">
              {['Residential', 'Commercial', 'Plots', 'Luxury Villas'].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-sm"
                >
                  {tag}
                </span>
              ))}
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Verified Pune Listings
              </span>
            </div>

            {/* Hero Main Content */}
            <div className="relative z-10 my-auto py-8 max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 text-brand-orange text-xs sm:text-sm font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>Pune Real Estate Advisory</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.12]">
                {hpContent?.heroHeading || (
                  <>
                    Find Your Perfect Property in <span className="text-brand-orange">Pune</span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-xl">
                {hpContent?.heroSubtitle ||
                  'Discover the right place to call home or the ideal property for your next investment. Explore verified property opportunities across Pune with Keshavan Realty.'}
              </p>

              {/* Two Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={hpContent?.ctaPrimaryLink || '/properties'}
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-all shadow-md hover:shadow-glow transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>{hpContent?.ctaPrimaryText || 'Explore Properties'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={hpContent?.ctaSecondaryLink || '/contact'}
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full text-sm font-bold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{hpContent?.ctaSecondaryText || 'Enquire Now'}</span>
                </Link>
              </div>
            </div>

            {/* Three Small Trust Indicators */}
            <div className="relative z-10 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(hpContent?.trustIndicators && hpContent.trustIndicators.length > 0
                ? hpContent.trustIndicators.map((text) => ({ title: text, subtitle: '' }))
                : [
                    { title: 'Residential & Commercial', subtitle: 'Flats, plots, offices & land' },
                    { title: 'Properties Across Pune', subtitle: 'Wakad, Baner to Talegaon' },
                    { title: 'Personalised Assistance', subtitle: 'Transparent advisory & visits' },
                  ]
              ).map((badge, idx) => {
                const IconComponent = idx === 0 ? Building : idx === 1 ? MapPin : Shield;
                return (
                  <div key={idx} className="flex items-center gap-3 text-white">
                    <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-brand-orange border border-white/10">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{badge.title}</h4>
                      {badge.subtitle && <p className="text-[11px] text-gray-300">{badge.subtitle}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overlapping Search Panel */}
          {visibility.heroSearch && (
            <div className="-mt-8 sm:-mt-12 relative z-30">
              <PropertySearch />
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          2. HIGHLIGHT / SPLIT PROMO SECTION
          ========================================================================= */}
      {visibility.splitPromo && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Large Architectural Photo with 3 Circular Inset Thumbnails */}
            <div className="lg:col-span-7 relative">
              <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden shadow-elevated aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
                  alt="Contemporary Pune Home"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Inset Circular Thumbnail Previews */}
                <div className="absolute bottom-5 right-5 flex items-center -space-x-3 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-white shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=120&q=80"
                    alt="Living Area"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=120&q=80"
                    alt="Bedroom"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=120&q=80"
                    alt="Kitchen"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                </div>

                <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-brand-charcoal/80 backdrop-blur-md text-white text-xs font-semibold">
                  Featured Pune Enclaves
                </div>
              </div>
            </div>

            {/* Right: Teaser Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-brand-grey rounded-3xl p-6 sm:p-8 space-y-4 border border-brand-grey-border/60">
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                  Value &amp; Transparency
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-brand-charcoal leading-tight">
                  Your primary home might begin to feel left out.
                </h2>
                <p className="text-xs sm:text-sm text-brand-grey-text leading-relaxed">
                  With verified titles, transparent price breakups, and handpicked Pune locations, we
                  help you discover homes designed to maximize comfort and investment potential.
                </p>
                <div className="pt-2">
                  <Link
                    to="/properties?type=buy"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-charcoal text-white text-xs font-bold hover:bg-brand-orange transition-colors"
                  >
                    <span>Explore Residential</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Mini preview card */}
              <div className="bg-white rounded-3xl p-5 border border-brand-grey-border shadow-card flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=80"
                  alt="Pune Prime Property"
                  className="w-24 h-24 rounded-2xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider">
                    Price Starting From
                  </span>
                  <h4 className="text-lg font-extrabold text-brand-charcoal">₹32.50 Lakh</h4>
                  <p className="text-xs text-brand-grey-text">
                    Plots &amp; Apartments across Pune West &amp; PCMC.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          3. PROPERTY CATEGORIES
          ========================================================================= */}
      {visibility.categoryCards && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-brand-grey/50 border-y border-brand-grey-border/60">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-orange uppercase tracking-widest block mb-2">
                  Diverse Portfolios
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-charcoal tracking-tight">
                  Explore Properties by Category
                </h2>
                <p className="text-sm text-brand-grey-text mt-2 max-w-xl">
                  Browse our curated categories ranging from compact urban flats to expansive industrial
                  lands across Pune and PCMC.
                </p>
              </div>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-orange hover:text-brand-orange-hover hover:underline"
              >
                <span>View All Categories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.title}
                  title={cat.title}
                  description={cat.description}
                  image={cat.image}
                  count={cat.count}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          4. FEATURED PROPERTIES IN PUNE
          ========================================================================= */}
      {visibility.featuredProperties && (
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-orange uppercase tracking-widest block mb-2">
                  Handpicked Listings
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-charcoal tracking-tight">
                  Featured Properties in Pune
                </h2>
                <p className="text-sm text-brand-grey-text mt-2 max-w-xl">
                  Explore selected residential, commercial, and investment opportunities across Pune.
                </p>
              </div>

              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-brand-charcoal bg-brand-grey hover:bg-brand-charcoal hover:text-white transition-all shadow-sm"
              >
                <span>View All Properties</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isWishlisted={wishlistIds.includes(property.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickEnquire={onQuickEnquire}
                />
              ))}
            </div>

            {/* Bottom View All CTA */}
            <div className="text-center pt-6">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-all shadow-md hover:shadow-glow transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore All Pune Properties</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          5. WHY CHOOSE KESHAVAN REALTY?
          ========================================================================= */}
      {visibility.whyChooseUs && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-brand-grey/40 border-t border-brand-grey-border/60">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
                Our Core Principles
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-charcoal tracking-tight">
                Why Choose {bInfo.name || 'Keshavan Realty'}?
              </h2>
              <p className="text-sm text-brand-grey-text">
                We focus on delivering genuine guidance, transparent property valuations, and tailored
                assistance across Pune.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(hpContent?.whyChooseUs && hpContent.whyChooseUs.length > 0
                ? hpContent.whyChooseUs
                : [
                    {
                      title: 'Local Market Knowledge',
                      description: "In-depth insight into Pune's emerging residential corridors, highway links, and upcoming metro expansions.",
                    },
                    {
                      title: 'Transparent Communication',
                      description: 'Clear pricing, genuine property status, and complete clarity on carpet area and legal approvals.',
                    },
                    {
                      title: 'Options Across Pune',
                      description: 'Wide coverage spanning IT corridors, suburban villa communities, retail hubs, and industrial belts.',
                    },
                    {
                      title: 'Personalised Assistance',
                      description: 'Dedicated site visits, property shortlist coordination, and end-to-end guidance from search to possession.',
                    },
                  ]
              ).map((card, idx) => {
                const IconComponent = whyChooseIcons[idx % whyChooseIcons.length];
                return (
                  <div
                    key={card.title}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-grey-border shadow-card hover:shadow-card-hover transition-all space-y-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-brand-charcoal">{card.title}</h3>
                    <p className="text-xs text-brand-grey-text leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          6. EXPLORE PUNE LOCATIONS
          ========================================================================= */}
      {visibility.puneLocations && (
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-orange uppercase tracking-widest block mb-2">
                  Prime Neighborhoods
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-charcoal tracking-tight">
                  Explore Pune Locations
                </h2>
                <p className="text-sm text-brand-grey-text mt-2 max-w-xl">
                  Discover properties across the most sought-after residential and commercial pockets of
                  Pune.
                </p>
              </div>
              <Link
                to="/properties"
                className="text-xs font-bold text-brand-orange hover:underline inline-flex items-center gap-1"
              >
                <span>View All Pune Localities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {puneLocations.map((loc) => (
                <LocationCard
                  key={loc.name}
                  name={loc.name}
                  tagline={loc.tagline}
                  image={loc.image}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          6.5 CLIENT TESTIMONIALS (Dynamic from Admin Homepage Editor)
          ========================================================================= */}
      {visibility.testimonials && hpContent?.testimonials && hpContent.testimonials.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-brand-charcoal text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto space-y-10 relative z-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
                Client Experiences
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight">
                Trusted by Homeowners &amp; Investors
              </h2>
              <p className="text-sm text-gray-300">
                Read what our buyers, landlords, and commercial clients have to say about working with{' '}
                {bInfo.name || 'Keshavan Realty'}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {hpContent.testimonials.map((testi, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-4 backdrop-blur-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, sIdx) => (
                        <Star
                          key={sIdx}
                          className={`w-4 h-4 ${
                            sIdx < (testi.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-200 italic leading-relaxed">
                      &ldquo;{testi.text}&rdquo;
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{testi.name}</h4>
                      <p className="text-[11px] text-gray-400">{testi.location}</p>
                    </div>
                    <Quote className="w-5 h-5 text-brand-orange/40 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          7. RESIDENTIAL & COMMERCIAL PROMOTIONAL PANELS
          ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Panel 1: Find Your Next Home */}
          <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] p-8 sm:p-10 flex flex-col justify-between shadow-card group">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
              alt="Residential Living Pune"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/70 to-black/30" />

            <div className="relative z-10">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                Residential Living
              </span>
            </div>

            <div className="relative z-10 space-y-3">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Find Your Next Home
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-md">
                Spacious 2 &amp; 3 BHK apartments, serene row houses, and independent luxury villas
                situated in family-friendly neighborhoods.
              </p>
              <div className="pt-2">
                <Link
                  to="/properties?type=buy"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover transition-colors shadow"
                >
                  <span>Explore Homes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Panel 2: Discover Commercial & Industrial Opportunities */}
          <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] p-8 sm:p-10 flex flex-col justify-between shadow-card group">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80"
              alt="Commercial & Industrial Pune"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/70 to-black/30" />

            <div className="relative z-10">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                Commercial &amp; Industrial
              </span>
            </div>

            <div className="relative z-10 space-y-3">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Commercial &amp; Industrial Opportunities
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-md">
                High-yield retail shops, corporate offices in tech hubs, and MIDC industrial land with
                heavy logistics infrastructure.
              </p>
              <div className="pt-2">
                <Link
                  to="/properties?group=commercial"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-brand-charcoal text-xs font-bold hover:bg-brand-orange hover:text-white transition-colors shadow"
                >
                  <span>Explore Commercial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FREQUENTLY ASKED QUESTIONS
          ========================================================================= */}
      {visibility.faqAccordion && (
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Title Column */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
                Common Queries
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-charcoal tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-brand-grey-text leading-relaxed">
                Find clear answers regarding property visits, Pune coverage, submission guidelines, and
                transaction support.
              </p>
              <div className="pt-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-brand-charcoal/20 text-xs font-bold text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-colors"
                >
                  <span>Have a Specific Question?</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Accordion List */}
            <div className="lg:col-span-8 space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className="bg-brand-grey/50 rounded-2xl border border-brand-grey-border/80 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-brand-charcoal hover:text-brand-orange transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-brand-orange shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-brand-grey-border/40 flex flex-col sm:flex-row gap-4 items-start animate-fadeIn">
                        <p className="text-xs sm:text-sm text-brand-grey-text leading-relaxed flex-1">
                          {faq.answer}
                        </p>
                        <img
                          src={faq.image}
                          alt="FAQ Topic"
                          className="w-20 h-20 rounded-xl object-cover shrink-0 hidden sm:block border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          9. FINAL CALL TO ACTION
          ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-brand-charcoal text-white relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
            Ready to Begin?
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight">
            Let&apos;s Find the Right Property for You
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            Whether you are looking for your dream residence, commercial office space, or industrial
            investment in Pune, our advisory team is here to assist you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/properties"
              className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-all shadow-md hover:shadow-glow transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Properties
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              Contact {bInfo.name || 'Keshavan Realty'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
