export type PropertyCategory =
  | 'Flat / Apartment'
  | 'Residential Plot'
  | 'Independent House'
  | 'Row House'
  | 'Shop'
  | 'Office Space'
  | 'Commercial Space'
  | 'Industrial Land';

export type CategoryGroup = 'residential' | 'commercial' | 'industrial';

export type ListingType = 'buy' | 'rent' | 'sale';

export type PropertyStatus = 'draft' | 'available' | 'sold' | 'rented' | 'inactive';

export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';

export type ConstructionStatus = 'Ready to Move' | 'Under Construction';

export type AreaUnit = 'sq.ft' | 'sq.m' | 'guntha' | 'acres';

export interface PropertyLandmark {
  name: string;
  distance: string;
}

export interface Property {
  id: string;
  propertyCode?: string;
  title: string;
  slug: string;
  propertyType: PropertyCategory;
  categoryGroup: CategoryGroup;
  listingType: ListingType;
  price: number; // in INR
  priceDisplay?: string;
  priceNegotiable?: boolean;
  pricePerSqFt?: number;
  maintenanceCharges?: number;
  securityDeposit?: number;
  location: string;
  locality?: string;
  address: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  landmark?: string;
  area: number;
  areaUnit: AreaUnit;
  carpetArea?: number;
  builtUpArea?: number;
  plotArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  parking?: string;
  furnishingStatus?: FurnishingStatus;
  constructionStatus?: ConstructionStatus;
  possessionDate?: string;
  floor?: string;
  totalFloors?: number;
  facing?: string;
  constructionYear?: number;
  ageOfProperty?: string;
  description: string;
  highlights?: string[];
  amenities: string[];
  landmarks?: PropertyLandmark[];
  specifications?: Record<string, any>;
  ownershipType?: string;
  waterSupply?: string;
  electricity?: string;
  roadAccess?: string;
  zoning?: string;
  industrialUseDetails?: string;
  commercialUseDetails?: string;
  reraNumber?: string;
  metaTitle?: string;
  metaDescription?: string;
  coverImage?: string;
  images: string[];
  floorPlanImages?: string[];
  videoUrl?: string;
  status: PropertyStatus;
  featured: boolean;
  verified?: boolean;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface PropertyFilterParams {
  listingType?: ListingType | 'all';
  category?: PropertyCategory | 'all';
  categoryGroup?: CategoryGroup | 'all';
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | 'any';
  bathrooms?: number | 'any';
  minArea?: number;
  maxArea?: number;
  furnishingStatus?: FurnishingStatus | 'all';
  constructionStatus?: ConstructionStatus | 'all';
  status?: PropertyStatus | 'all';
  searchQuery?: string;
}

export type PropertySortOption =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'area-asc'
  | 'area-desc';

export interface EnquirySubmission {
  propertyId?: string;
  propertyTitle?: string;
  fullName: string;
  phone: string;
  email?: string;
  enquiryType: 'Site Visit' | 'Price Details' | 'Floor Plan' | 'General Enquiry' | 'Other';
  message: string;
  preferredDate?: string;
}

export interface EnquiryRecord {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  enquiryType: string;
  status: 'new' | 'contacted' | 'interested' | 'converted' | 'closed';
  preferredDate?: string;
  assignedTo?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PropertyListingSubmission {
  ownerName: string;
  contactNumber: string;
  email: string;
  listingType: ListingType;
  propertyCategory: PropertyCategory;
  location: string;
  fullAddress: string;
  expectedPrice: string;
  propertyArea: string;
  areaUnit: AreaUnit;
  bedrooms?: string;
  bathrooms?: string;
  description: string;
  imageFiles?: File[];
}

export interface AdminDashboardStats {
  totalProperties: number;
  availableProperties: number;
  draftProperties: number;
  soldProperties: number;
  rentedProperties: number;
  featuredProperties: number;
  totalEnquiries: number;
  newEnquiries: number;
}
