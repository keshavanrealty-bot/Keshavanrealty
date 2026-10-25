import { supabase } from '../lib/supabase';
import { AllSiteSettings } from '../types/settings';
import { businessConfig } from '../config/business';

export const DEFAULT_SETTINGS: AllSiteSettings = {
  business_info: {
    name: businessConfig.name,
    tagline: businessConfig.tagline,
    location: businessConfig.location,
    city: businessConfig.city,
    state: businessConfig.state,
    country: businessConfig.country,
    phone: businessConfig.phone,
    displayPhone: businessConfig.displayPhone,
    whatsapp: businessConfig.whatsapp,
    displayWhatsapp: businessConfig.displayWhatsapp,
    email: businessConfig.email,
    officeAddress: businessConfig.officeAddress,
    mapsLink: 'https://maps.google.com/maps?q=Charoli%2C%20Pune%2C%20Maharashtra%20412105&t=&z=14&ie=UTF8&iwloc=&output=embed',
    workingHours: businessConfig.workingHours,
    socialLinks: businessConfig.socialLinks,
    description: 'Keshavan Realty is a premier real estate advisory firm serving Pune and surrounding growth corridors with end-to-end residential, commercial, and industrial property consultancy.',
    reraNumber: 'A52100000000',
    reraDisclaimer: businessConfig.reraDisclaimer,
    companyRegistration: 'Pune, Maharashtra',
    contactPreferences: 'Phone, WhatsApp, Email, In-person Office Consultation',
  },
  appearance: {
    primaryColor: '#FF6A00',
    secondaryColor: '#15191E',
    heroHeading: 'Find Your Perfect Property in Pune',
    heroSubtitle: 'Discover the right place to call home or the ideal property for your next investment. Explore verified property opportunities across Pune with Keshavan Realty.',
    websiteTagline: 'Trust | Transparency | Value',
    logoUrl: '/keshavan-logo.png',
    faviconUrl: '/keshavan-logo.png',
    heroBanners: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
    ],
    defaultPropertyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    footerText: 'Keshavan Realty delivers dependable, transparent property guidance across Pune.',
    promoBanner: {
      enabled: false,
      text: 'New Luxury Residential Projects Launched in Wakad & Hinjawadi — Book a Site Visit Today!',
      link: '/properties?category=Flat+%2F+Apartment',
      badge: 'New Launch',
    },
    sectionVisibility: {
      heroSearch: true,
      categoryCards: true,
      featuredProperties: true,
      splitPromo: true,
      puneLocations: true,
      whyChooseUs: true,
      testimonials: true,
      faqAccordion: true,
    },
  },
  property_display: {
    categories: [
      'Flat / Apartment',
      'Residential Plot',
      'Independent House',
      'Row House',
      'Shop',
      'Office Space',
      'Commercial Space',
      'Industrial Land',
    ],
    locations: [
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
      'Dighi',
      'Alandi Road',
      'Talegaon',
      'Other Pune locations',
    ],
    itemsPerPage: 9,
    defaultSort: 'newest',
    propertyCodePrefix: 'KR-PUN-',
    priceFormat: 'inr',
    showPriceNegotiable: true,
    showReraBadge: true,
    showVerifiedBadge: true,
    showContactAdvisorButton: true,
    showWhatsAppButton: true,
  },
  enquiry_crm: {
    requiredFields: ['customerName', 'phone', 'message'],
    optionalFields: ['email', 'preferredDate'],
    defaultWhatsAppMessage: 'Hello Keshavan Realty, I would like to enquire about properties in Pune.',
    customerAckMessage: 'Thank you! Your enquiry has been received. Our Pune property advisor will contact you shortly.',
    leadStatuses: [
      { key: 'new', label: 'New / Unhandled', color: 'rose' },
      { key: 'contacted', label: 'Contacted', color: 'blue' },
      { key: 'follow_up', label: 'Follow-up Required', color: 'amber' },
      { key: 'site_visit', label: 'Site Visit Scheduled', color: 'purple' },
      { key: 'negotiation', label: 'Negotiation', color: 'indigo' },
      { key: 'converted', label: 'Converted / Closed Won', color: 'emerald' },
      { key: 'lost', label: 'Lost / Inactive', color: 'gray' },
    ],
    privacyText: 'Your contact details are kept strictly private and used only for property advisory by Keshavan Realty.',
  },
  homepage_content: {
    heroHeading: 'Find Your Perfect Property in Pune',
    heroSubtitle: 'Discover the right place to call home or the ideal property for your next investment. Explore verified property opportunities across Pune with Keshavan Realty.',
    ctaPrimaryText: 'Explore Properties',
    ctaPrimaryLink: '/properties',
    ctaSecondaryText: 'Enquire Now',
    ctaSecondaryLink: '/contact',
    trustIndicators: [
      'Residential & Commercial Properties',
      'Properties Across Pune',
      'Personalised Property Assistance',
    ],
    whyChooseUs: [
      {
        title: 'Verified Listings',
        description: 'Every property is vetted for clear titles, location accuracy, and authentic pricing details.',
      },
      {
        title: 'Local Market Expertise',
        description: "Deep insights across Pune's high-growth corridors from Baner & Hinjawadi to Charholi & Moshi.",
      },
      {
        title: 'Transparent Dealings',
        description: 'Zero hidden surprises. Direct developer and owner negotiations with complete clarity.',
      },
      {
        title: 'End-to-End Assistance',
        description: 'From first site visit to loan guidance, documentation, and key handover.',
      },
    ],
    stats: [
      { label: 'Active Listings', value: '150+' },
      { label: 'Satisfied Families', value: '500+' },
      { label: 'Pune Micro-Markets', value: '15+' },
      { label: 'Client Recommendation', value: '99%' },
    ],
    testimonials: [
      {
        name: 'Amit & Sneha Kulkarni',
        location: 'Bought a 3 BHK in Baner',
        text: 'Keshavan Realty made our home search completely stress-free. Transparent pricing and honest advice throughout.',
        rating: 5,
      },
      {
        name: 'Rajesh Deshmukh',
        location: 'Invested in Commercial Shop, Wakad',
        text: 'Found a high-yield retail space in Wakad through Keshavan Realty. Highly professional and dependable advisory.',
        rating: 5,
      },
      {
        name: 'Pooja Sharma',
        location: 'Rented a 2 BHK in Hinjawadi',
        text: 'Smooth documentation and quick turnaround. The team understood our preferences and arranged site visits immediately.',
        rating: 5,
      },
    ],
  },
  seo_settings: {
    siteTitle: 'Keshavan Realty | Premium Properties in Pune, Maharashtra',
    metaDescription: 'Explore verified flats, apartments, residential plots, independent houses, shops, and offices across Pune with Keshavan Realty. Trust, Transparency, Value.',
    homepageTitle: 'Keshavan Realty | Buy, Rent & Invest in Pune Real Estate',
    propertyTitleTemplate: '{title} in {locality}, Pune | Keshavan Realty',
    propertyDescriptionTemplate: '{title} available for {listingType} in {locality}, Pune. Price: {price}. Verified Pune real estate listing.',
    ogImage: '/keshavan-logo.png',
    googleAnalyticsId: '',
    googleSearchConsole: '',
    robotsIndex: true,
    canonicalUrl: '',
  },
};

export const settingsService = {
  /**
   * Fetch all site settings from Supabase, with automatic default fallbacks
   */
  async getAllSettings(): Promise<AllSiteSettings> {
    try {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (error || !data) {
        console.warn('Error fetching site_settings from Supabase, using defaults:', error?.message);
        return DEFAULT_SETTINGS;
      }

      const merged: AllSiteSettings = { ...DEFAULT_SETTINGS };
      for (const row of data) {
        const k = row.key as keyof AllSiteSettings;
        if (k && row.value && typeof row.value === 'object') {
          merged[k] = { ...DEFAULT_SETTINGS[k], ...row.value } as any;
        }
      }
      return merged;
    } catch (e) {
      console.warn('Exception fetching site_settings:', e);
      return DEFAULT_SETTINGS;
    }
  },

  /**
   * Update a specific settings group in Supabase (Admin only)
   */
  async updateSetting<K extends keyof AllSiteSettings>(
    key: K,
    value: AllSiteSettings[K]
  ): Promise<AllSiteSettings[K]> {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || null;

    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key,
        value,
        is_public: true,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      });

    if (error) {
      throw new Error(`Failed to save ${key}: ${error.message}`);
    }

    return value;
  },

  /**
   * Upload an image asset (branding, banners, avatars) to Supabase Storage
   */
  async uploadSiteAsset(file: File, folder: 'branding' | 'banners' | 'avatars' = 'branding'): Promise<string> {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/x-icon', 'image/svg+xml'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.ico') && !file.name.endsWith('.svg')) {
      throw new Error('Please upload a valid image (JPEG, PNG, WebP, SVG, or ICO).');
    }

    // Limit to 5MB for site branding/assets
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit. Please upload a smaller image.');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
    const fileName = `${folder}/${Date.now()}-${cleanName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Asset upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('property-images').getPublicUrl(fileName);
    return data.publicUrl;
  },

  /**
   * Delete an asset from Supabase Storage
   */
  async deleteSiteAsset(url: string): Promise<void> {
    if (url.includes('/property-images/')) {
      const filePath = url.split('/property-images/')[1];
      if (filePath) {
        await supabase.storage.from('property-images').remove([filePath]);
      }
    }
  },
};
