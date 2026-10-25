export interface BusinessInfoSettings {
  name: string;
  tagline: string;
  location: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  displayPhone: string;
  whatsapp: string;
  displayWhatsapp: string;
  email: string;
  officeAddress: string;
  mapsLink: string;
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  description: string;
  reraNumber?: string;
  reraDisclaimer: string;
  companyRegistration?: string;
  contactPreferences?: string;
}

export interface AppearanceSettings {
  primaryColor: string;
  secondaryColor: string;
  heroHeading: string;
  heroSubtitle: string;
  websiteTagline: string;
  logoUrl: string;
  faviconUrl: string;
  heroBanners: string[];
  defaultPropertyImage: string;
  footerText: string;
  promoBanner: {
    enabled: boolean;
    text: string;
    link: string;
    badge?: string;
  };
  sectionVisibility: {
    heroSearch: boolean;
    categoryCards: boolean;
    featuredProperties: boolean;
    splitPromo: boolean;
    puneLocations: boolean;
    whyChooseUs: boolean;
    testimonials: boolean;
    faqAccordion: boolean;
  };
}

export interface PropertyDisplaySettings {
  categories: string[];
  locations: string[];
  itemsPerPage: number;
  defaultSort: 'newest' | 'price-low' | 'price-high' | 'area';
  propertyCodePrefix: string;
  priceFormat: 'inr' | 'full';
  showPriceNegotiable: boolean;
  showReraBadge: boolean;
  showVerifiedBadge: boolean;
  showContactAdvisorButton: boolean;
  showWhatsAppButton: boolean;
}

export interface LeadStatusConfig {
  key: string;
  label: string;
  color: string;
}

export interface EnquiryCrmSettings {
  requiredFields: string[];
  optionalFields: string[];
  defaultWhatsAppMessage: string;
  customerAckMessage: string;
  leadStatuses: LeadStatusConfig[];
  privacyText: string;
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface TestimonialItem {
  name: string;
  location: string;
  text: string;
  rating?: number;
}

export interface HomepageContentSettings {
  heroHeading: string;
  heroSubtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  trustIndicators: string[];
  whyChooseUs: WhyChooseUsItem[];
  stats: StatItem[];
  testimonials: TestimonialItem[];
}

export interface SeoSettings {
  siteTitle: string;
  metaDescription: string;
  homepageTitle: string;
  propertyTitleTemplate: string;
  propertyDescriptionTemplate: string;
  ogImage: string;
  googleAnalyticsId?: string;
  googleSearchConsole?: string;
  robotsIndex: boolean;
  canonicalUrl?: string;
}

export interface AllSiteSettings {
  business_info: BusinessInfoSettings;
  appearance: AppearanceSettings;
  property_display: PropertyDisplaySettings;
  enquiry_crm: EnquiryCrmSettings;
  homepage_content: HomepageContentSettings;
  seo_settings: SeoSettings;
}
