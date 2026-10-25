export interface BusinessConfig {
  name: string;
  tagline: string;
  location: string;
  city: string;
  state: string;
  country: string;
  coverage: string[];
  phone: string;
  displayPhone: string;
  whatsapp: string;
  displayWhatsapp: string;
  email: string;
  officeAddress: string;
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
  reraDisclaimer: string;
}

export const businessConfig: BusinessConfig = {
  name: 'Keshavan Realty',
  tagline: 'Trust | Transparency | Value',
  location: 'Pune, Maharashtra, India',
  city: 'Pune',
  state: 'Maharashtra',
  country: 'India',
  coverage: [
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
  phone: '+919552537074',
  displayPhone: '+91 95525 37074',
  whatsapp: '919552537074',
  displayWhatsapp: '+91 95525 37074',
  email: 'keshavanrealty@gmail.com',
  officeAddress: 'Charoli, Pune, Maharashtra 412105',
  workingHours: {
    weekdays: '9:30 AM – 7:30 PM',
    saturday: '10:00 AM – 6:30 PM',
    sunday: 'By Appointment Only',
  },
  socialLinks: {
    instagram: 'https://instagram.com/keshavanrealty',
    facebook: 'https://facebook.com/keshavanrealty',
    linkedin: 'https://linkedin.com/company/keshavanrealty',
    twitter: 'https://twitter.com/keshavanrealty',
  },
  reraDisclaimer: 'Keshavan Realty is a professional real estate advisory and property assistance service firm operating in Pune. All property listings and project details are provided for informational and demonstration purposes.',
};
