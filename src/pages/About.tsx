import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Eye,
  Handshake,
  MapPin,
  CheckCircle,
  Building2,
  ArrowRight,
  Compass,
  Sparkles,
} from 'lucide-react';
import { businessConfig } from '../config/business';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const About: React.FC = () => {
  const { settings } = useSiteSettings();
  const bInfo = settings.business_info || businessConfig;
  const pDisplay = settings.property_display;

  const values = [
    {
      title: 'Trust',
      icon: ShieldCheck,
      description:
        'Building enduring relationships founded on verified titles, honest property evaluations, and dependable real estate advice.',
    },
    {
      title: 'Transparency',
      icon: Eye,
      description:
        'Zero ambiguous terms, upfront price breakdowns, and full disclosure on carpet measurements and project sanctions.',
    },
    {
      title: 'Value',
      icon: Handshake,
      description:
        'Guiding buyers and investors toward properties with genuine liveability and long-term appreciation potential across Pune.',
    },
  ];

  const categories = [
    'Residential Flats & Apartments (1 to 4+ BHK)',
    'Collector NA Residential Plots & Bungalow Layouts',
    'Independent Villas & Standalone Residences',
    'Duplex Row Houses in Gated Townships',
    'High-Street Retail Showrooms & Commercial Shops',
    'Grade-A Corporate IT Office Spaces',
    'Industrial PEB Sheds & Warehousing Land',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="bg-brand-charcoal text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-orange text-xs font-bold uppercase tracking-widest border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{bInfo.tagline}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight">
            Your Trusted Real Estate Partner in Pune
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Professional property assistance and real estate advisory helping home buyers and
            investors navigate residential, commercial, and industrial property opportunities across
            Pune, Maharashtra.
          </p>
        </div>
      </section>

      {/* Brand Story & Introduction */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
              About Keshavan Realty
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-charcoal tracking-tight">
              Guided by Integrity, Driven by Pune&apos;s Growth
            </h2>
            <p className="text-sm text-brand-grey-text leading-relaxed">
              Keshavan Realty operates with a clear vision: to make property search and real estate
              transactions in Pune straightforward, verified, and transparent. We understand that
              purchasing a home or investing in commercial property represents a major life decision.
            </p>
            <p className="text-sm text-brand-grey-text leading-relaxed">
              Our team provides personalized property assistance across West Pune IT corridors, PCMC
              growth centers, and developing suburban nodes, assisting you from initial enquiry and
              site visits to paperwork verification and final possession.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-charcoal bg-brand-grey px-3.5 py-2 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Verified Documentation</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-charcoal bg-brand-grey px-3.5 py-2 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Zero Misleading Claims</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-charcoal bg-brand-grey px-3.5 py-2 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Dedicated Pune Advisors</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Modern Pune Architecture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
                  Keshavan Realty Focus
                </p>
                <h4 className="text-xl font-bold">Pune &amp; Surrounding Regions</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Approach (Trust | Transparency | Value) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-brand-grey/50 border-y border-brand-grey-border/60">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
              Our Foundation
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-charcoal tracking-tight">
              Our Approach to Real Estate
            </h2>
            <p className="text-sm text-brand-grey-text">
              Every interaction at Keshavan Realty is grounded in three enduring pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-3xl p-8 border border-brand-grey-border shadow-card space-y-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-brand-charcoal">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-brand-grey-text leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Property Categories & Pune Locations Served */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Categories */}
          <div className="space-y-6">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
              Our Capabilities
            </span>
            <h3 className="text-2xl font-display font-bold text-brand-charcoal">
              Property Categories Served
            </h3>
            <p className="text-sm text-brand-grey-text leading-relaxed">
              We assist customers across residential, commercial, and industrial segments to provide
              a comprehensive property portfolio.
            </p>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c} className="flex items-center gap-3 text-xs sm:text-sm text-brand-charcoal font-medium">
                  <div className="w-5 h-5 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div className="space-y-6">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
              Micro-Markets
            </span>
            <h3 className="text-2xl font-display font-bold text-brand-charcoal">
              Pune Locations Covered
            </h3>
            <p className="text-sm text-brand-grey-text leading-relaxed">
              Our team operates across premier residential clusters, IT employment nodes, and
              industrial expansion zones.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(pDisplay?.locations || businessConfig.coverage).map((loc) => (
                <Link
                  key={loc}
                  to={`/properties?location=${encodeURIComponent(loc)}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-grey hover:bg-brand-charcoal hover:text-white transition-colors text-xs font-medium text-brand-charcoal border border-gray-100"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                  <span className="truncate">{loc}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-brand-charcoal text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-display font-bold">
            Connect with Keshavan Realty Today
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Tell us about your property requirements or schedule a consultation with our local Pune
            experts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/contact"
              className="px-8 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors shadow"
            >
              Get In Touch
            </Link>
            <Link
              to="/properties"
              className="px-8 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              Explore Pune Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
