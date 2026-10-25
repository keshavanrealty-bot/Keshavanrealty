import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  Heart,
  Building2,
  ChevronDown,
  Megaphone,
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { businessConfig } from '../config/business';

interface NavbarProps {
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ wishlistCount, onOpenWishlist }) => {
  const { settings } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const bInfo = settings.business_info || businessConfig;
  const promo = settings.appearance?.promoBanner;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setPropertiesDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Buy Property', path: '/properties?type=buy' },
    { name: 'Rent Property', path: '/properties?type=rent' },
    { name: 'Commercial', path: '/properties?group=commercial' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-charcoal/95 backdrop-blur-md shadow-lg py-2.5 border-b border-white/10'
            : isHomePage
            ? 'bg-brand-charcoal/80 backdrop-blur-sm py-3 border-b border-white/10'
            : 'bg-brand-charcoal py-3 border-b border-white/10'
        }`}
      >
        {/* Top Promo Banner if enabled */}
        {promo?.enabled && promo.text && (
          <div className="bg-gradient-to-r from-brand-orange to-amber-500 text-white py-1 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 mb-2">
            {promo.badge && (
              <span className="bg-brand-charcoal text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                {promo.badge}
              </span>
            )}
            <span>{promo.text}</span>
            {promo.link && (
              <Link to={promo.link} className="underline text-[11px] font-bold hover:text-brand-charcoal ml-1">
                Explore &rarr;
              </Link>
            )}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-brand-charcoal-surface border border-brand-orange/30 p-1 flex items-center justify-center overflow-hidden shadow-md group-hover:border-brand-orange transition-colors">
                <img
                  src={settings.appearance?.logoUrl || '/keshavan-logo.png'}
                  alt="Keshavan Realty Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-display font-extrabold tracking-tight text-white leading-tight flex items-center gap-1.5">
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
                <span className="text-[10px] tracking-widest uppercase font-medium text-gray-300 group-hover:text-brand-orange transition-colors">
                  {bInfo.tagline || businessConfig.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  location.pathname === '/'
                    ? 'text-white bg-white/15'
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Home
              </Link>

              {/* Properties Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPropertiesDropdownOpen(!propertiesDropdownOpen)}
                  onMouseEnter={() => setPropertiesDropdownOpen(true)}
                  className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span>Properties</span>
                  <ChevronDown className="w-4 h-4 opacity-75" />
                </button>

                {propertiesDropdownOpen && (
                  <div
                    onMouseLeave={() => setPropertiesDropdownOpen(false)}
                    className="absolute top-full left-0 w-60 mt-1 py-2 bg-brand-charcoal-surface rounded-2xl shadow-xl border border-white/10 z-50 backdrop-blur-md animate-fadeIn"
                  >
                    <Link
                      to="/properties"
                      className="block px-4 py-2 text-xs font-bold text-brand-orange hover:bg-white/10"
                    >
                      All Verified Properties &rarr;
                    </Link>
                    <div className="border-t border-white/10 my-1"></div>
                    <Link
                      to="/properties?type=buy"
                      className="block px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      Buy Residential Properties
                    </Link>
                    <Link
                      to="/properties?type=rent"
                      className="block px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      Rent Properties in Pune
                    </Link>
                    <Link
                      to="/properties?group=commercial"
                      className="block px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      Shops &amp; Commercial Spaces
                    </Link>
                    <Link
                      to="/properties?category=Industrial+Land"
                      className="block px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      Industrial Land &amp; Sheds
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/about"
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  location.pathname === '/about'
                    ? 'text-white bg-white/15'
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                About Us
              </Link>

              <Link
                to="/contact"
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  location.pathname === '/contact'
                    ? 'text-white bg-white/15'
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Contact Us
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Wishlist Button */}
              <button
                onClick={onOpenWishlist}
                className="relative p-2.5 rounded-full text-gray-200 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                aria-label="View Saved Properties"
              >
                <Heart className="w-5 h-5 text-brand-orange" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Direct Call Button (Dynamic) */}
              <a
                href={`tel:${bInfo.phone || businessConfig.phone}`}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold text-gray-200 bg-white/10 hover:bg-white/20 transition-all"
                title="Direct Phone Call"
              >
                <Phone className="w-3.5 h-3.5 text-brand-orange" />
                <span>{bInfo.displayPhone || businessConfig.displayPhone}</span>
              </a>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-charcoal-surface border-t border-white/10 px-4 pt-3 pb-6 animate-fadeIn shadow-2xl">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-brand-orange text-white'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href={`tel:${bInfo.phone || businessConfig.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-center text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Call {bInfo.displayPhone || businessConfig.displayPhone}</span>
              </a>

              <div className="flex items-center justify-between px-2 pt-1 text-xs text-gray-400">
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-brand-orange underline"
                >
                  Contact Desk
                </Link>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Pune, MH
                </span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer so content doesn't get hidden behind navbar */}
      {!isHomePage && <div className="h-20 bg-brand-charcoal" />}
    </>
  );
};
