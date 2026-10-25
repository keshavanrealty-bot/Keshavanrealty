import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { businessConfig } from '../config/business';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { generateWhatsAppLink } from '../utils/formatters';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const bInfo = settings.business_info || businessConfig;
  const appearance = settings.appearance;
  const pDisplay = settings.property_display;

  const categories = (pDisplay?.categories || [
    'Flat / Apartment',
    'Residential Plot',
    'Independent House',
    'Row House',
    'Shop',
    'Office Space',
    'Commercial Space',
    'Industrial Land',
  ]).map((cat) => ({
    name: cat,
    path: `/properties?category=${encodeURIComponent(cat)}`,
  }));

  const locations = pDisplay?.locations?.slice(0, 12) || [
    'Wakad',
    'Hinjawadi',
    'Baner',
    'Balewadi',
    'Tathawade',
    'Ravet',
    'Punawale',
    'Pimple Saudagar',
    'Moshi',
    'Chikhali',
    'Charholi',
    'Talegaon',
  ];

  const whatsappHref = generateWhatsAppLink(
    bInfo.whatsapp || businessConfig.whatsapp,
    settings.enquiry_crm?.defaultWhatsAppMessage ||
      'Hello Keshavan Realty, I would like to enquire about properties in Pune.'
  );

  return (
    <footer className="bg-brand-charcoal text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Info (col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-xl bg-brand-charcoal-surface border border-brand-orange/40 p-1 flex items-center justify-center overflow-hidden shadow-lg">
                <img
                  src={appearance?.logoUrl || '/keshavan-logo.png'}
                  alt={bInfo.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  {bInfo.name ? (
                    <>
                      {bInfo.name.split(' ')[0]}
                      <span className="text-brand-orange">{bInfo.name.split(' ').slice(1).join(' ') || 'REALTY'}</span>
                    </>
                  ) : (
                    <>
                      KESHAVAN <span className="text-brand-orange">REALTY</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-gray-300">
                  {bInfo.tagline}
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-300 leading-relaxed pr-4">
              {appearance?.footerText ||
                'Your trusted partner for verified residential, commercial, and industrial property solutions across Pune, Maharashtra. We bring transparency, local market expertise, and dedicated advisory to property buyers and investors.'}
            </p>

            {/* Quick Contact CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
              <a
                href={`tel:${bInfo.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-gray-200 bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-brand-orange" />
                <span>Call Advisor</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              {bInfo.socialLinks?.instagram && (
                <a
                  href={bInfo.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-brand-orange hover:border-brand-orange transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {bInfo.socialLinks?.facebook && (
                <a
                  href={bInfo.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-brand-orange hover:border-brand-orange transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                  </svg>
                </a>
              )}
              {bInfo.socialLinks?.linkedin && (
                <a
                  href={bInfo.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-brand-orange hover:border-brand-orange transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              )}
              {bInfo.socialLinks?.youtube && (
                <a
                  href={bInfo.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-brand-orange hover:border-brand-orange transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {bInfo.socialLinks?.twitter && (
                <a
                  href={bInfo.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-brand-orange hover:border-brand-orange transition-colors"
                  aria-label="Twitter / X"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links & Categories (col 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-brand-orange pl-2.5">
              Property Categories
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.name}>
                  <Link
                    to={cat.path}
                    className="hover:text-brand-orange transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-brand-orange/70" />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/properties"
                  className="text-brand-orange hover:underline text-xs font-semibold inline-flex items-center gap-1 pt-1"
                >
                  View All Categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Pune Locations (col 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-brand-orange pl-2.5">
              Pune Locations
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-xs text-gray-300">
              {locations.map((loc) => (
                <Link
                  key={loc}
                  to={`/properties?location=${encodeURIComponent(loc)}`}
                  className="hover:text-brand-orange transition-colors py-0.5 truncate"
                  title={`Properties in ${loc}`}
                >
                  {loc}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Details (col 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-brand-orange pl-2.5">
              Pune Office & Contact
            </h4>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span>{bInfo.officeAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a
                  href={`tel:${bInfo.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {bInfo.displayPhone || bInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a
                  href={`mailto:${bInfo.email}`}
                  className="hover:text-white transition-colors"
                >
                  {bInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Fri: {bInfo.workingHours?.weekdays || '9:30 AM - 7:30 PM'}</p>
                  <p>Sat: {bInfo.workingHours?.saturday || '10:00 AM - 6:00 PM'}</p>
                  <p className="text-gray-400">Sun: {bInfo.workingHours?.sunday || 'Site Visits by Prior Appointment'}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Demo Disclaimer / RERA Banner */}
        <div className="my-6 p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-200">RERA & Compliance:</strong>{' '}
            {bInfo.reraDisclaimer || 'Keshavan Realty complies with MahaRERA guidelines for real estate advisory in Maharashtra.'}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} {bInfo.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-white transition-colors underline"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setShowTermsModal(true)}
              className="hover:text-white transition-colors underline"
            >
              Terms & Conditions
            </button>
            <Link to="/contact" className="text-brand-orange hover:underline font-semibold">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-brand-charcoal text-white rounded-2xl max-w-lg w-full p-6 border border-white/10 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white flex items-center justify-between">
              <span>Privacy Policy</span>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-400 hover:text-white p-1 text-xl"
              >
                &times;
              </button>
            </h3>
            <div className="text-xs text-gray-300 space-y-3 leading-relaxed">
              <p>
                At Keshavan Realty, we respect your privacy and are committed to safeguarding any
                personal information you provide when browsing our website or submitting property
                enquiries.
              </p>
              <h5 className="font-semibold text-white">Information Collection</h5>
              <p>
                We collect your name, phone number, and email address only when you voluntarily
                submit an enquiry or list a property for review. We do not sell or lease your
                contact information to third-party telemarketers.
              </p>
              <h5 className="font-semibold text-white">Use of Information</h5>
              <p>
                Information provided is solely utilized by Keshavan Realty advisors to respond to
                your real estate requirements, arrange property visits, and provide tailored
                consultation across Pune.
              </p>
            </div>
            <div className="text-right pt-2">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-brand-orange text-white text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-brand-charcoal text-white rounded-2xl max-w-lg w-full p-6 border border-white/10 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white flex items-center justify-between">
              <span>Terms & Conditions</span>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-white p-1 text-xl"
              >
                &times;
              </button>
            </h3>
            <div className="text-xs text-gray-300 space-y-3 leading-relaxed">
              <p>
                Welcome to Keshavan Realty. By accessing this website, you agree to comply with
                and be bound by these terms.
              </p>
              <h5 className="font-semibold text-white">Property Information</h5>
              <p>
                All property listings, photographs, rates, and measurements are displayed for
                informational and demonstration purposes. Prospective buyers and lessees are advised
                to independently verify all legal titles, RERA registrations, and physical
                dimensions before executing transactions.
              </p>
              <h5 className="font-semibold text-white">Advisory &amp; Inquiries</h5>
              <p>
                Property inquiries or consultation requests submitted through this website do not
                constitute a binding transaction without formal documentation and validation.
              </p>
            </div>
            <div className="text-right pt-2">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 bg-brand-orange text-white text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
