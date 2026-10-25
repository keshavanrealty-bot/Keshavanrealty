import { supabase } from '../lib/supabase';
import { MOCK_PROPERTIES } from '../data/properties';
import {
  Property,
  PropertyFilterParams,
  PropertySortOption,
  PropertyCategory,
  AdminDashboardStats,
} from '../types/property';

/**
 * Maps a Postgres database record to the frontend Property model
 */
export function mapDbToProperty(row: any): Property {
  // Ensure images array exists and has at least cover_image
  let images: string[] = Array.isArray(row.images) && row.images.length > 0 ? row.images : [];
  if (images.length === 0 && row.cover_image) {
    images = [row.cover_image];
  } else if (row.cover_image && !images.includes(row.cover_image)) {
    images = [row.cover_image, ...images];
  }
  if (images.length === 0) {
    images = ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];
  }

  return {
    id: row.id,
    propertyCode: row.property_code || row.id,
    title: row.title,
    slug: row.slug,
    propertyType: row.property_type,
    categoryGroup: row.category_group,
    listingType: row.listing_type,
    price: Number(row.price),
    priceNegotiable: row.price_negotiable,
    pricePerSqFt: row.price_per_sq_ft ? Number(row.price_per_sq_ft) : undefined,
    maintenanceCharges: row.maintenance_charges ? Number(row.maintenance_charges) : undefined,
    securityDeposit: row.security_deposit ? Number(row.security_deposit) : undefined,
    location: row.locality || row.city || 'Pune',
    locality: row.locality,
    address: row.address,
    pincode: row.pincode,
    latitude: row.latitude ? Number(row.latitude) : undefined,
    longitude: row.longitude ? Number(row.longitude) : undefined,
    landmark: row.landmark,
    area: Number(row.area),
    areaUnit: row.area_unit || 'sq.ft',
    carpetArea: row.carpet_area ? Number(row.carpet_area) : undefined,
    builtUpArea: row.built_up_area ? Number(row.built_up_area) : undefined,
    plotArea: row.plot_area ? Number(row.plot_area) : undefined,
    bedrooms: row.bedrooms !== null && row.bedrooms !== undefined ? Number(row.bedrooms) : undefined,
    bathrooms: row.bathrooms !== null && row.bathrooms !== undefined ? Number(row.bathrooms) : undefined,
    balconies: row.balconies !== null && row.balconies !== undefined ? Number(row.balconies) : undefined,
    parking: row.parking_spaces || undefined,
    furnishingStatus: row.furnishing_status || undefined,
    constructionStatus: row.possession_status || undefined,
    possessionDate: row.possession_date || undefined,
    floor: row.floor_number || undefined,
    totalFloors: row.total_floors ? Number(row.total_floors) : undefined,
    facing: row.facing || undefined,
    constructionYear: row.construction_year ? Number(row.construction_year) : undefined,
    ageOfProperty: row.age_of_property || undefined,
    description: row.description,
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    landmarks: Array.isArray(row.landmarks) ? row.landmarks : [],
    specifications: row.specifications || {},
    ownershipType: row.ownership_type,
    waterSupply: row.water_supply,
    electricity: row.electricity,
    roadAccess: row.road_access,
    zoning: row.zoning,
    industrialUseDetails: row.industrial_use_details,
    commercialUseDetails: row.commercial_use_details,
    reraNumber: row.rera_registration_number,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    coverImage: row.cover_image,
    images: images,
    floorPlanImages: Array.isArray(row.floor_plan_images) ? row.floor_plan_images : [],
    videoUrl: row.video_url,
    status: row.status,
    featured: Boolean(row.featured),
    verified: Boolean(row.verified),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
}

/**
 * Maps a frontend Property object to PostgreSQL columns
 */
export function mapPropertyToDb(prop: Partial<Property>): any {
  const dbData: any = {};

  if (prop.title !== undefined) dbData.title = prop.title;
  if (prop.slug !== undefined) dbData.slug = prop.slug;
  if (prop.propertyCode !== undefined) dbData.property_code = prop.propertyCode;
  if (prop.propertyType !== undefined) dbData.property_type = prop.propertyType;
  if (prop.categoryGroup !== undefined) dbData.category_group = prop.categoryGroup;
  if (prop.listingType !== undefined) dbData.listing_type = prop.listingType;
  if (prop.price !== undefined) dbData.price = prop.price;
  if (prop.priceNegotiable !== undefined) dbData.price_negotiable = prop.priceNegotiable;
  if (prop.pricePerSqFt !== undefined) dbData.price_per_sq_ft = prop.pricePerSqFt;
  if (prop.maintenanceCharges !== undefined) dbData.maintenance_charges = prop.maintenanceCharges;
  if (prop.securityDeposit !== undefined) dbData.security_deposit = prop.securityDeposit;
  if (prop.location !== undefined) dbData.locality = prop.location;
  if (prop.locality !== undefined) dbData.locality = prop.locality;
  if (prop.address !== undefined) dbData.address = prop.address;
  if (prop.pincode !== undefined) dbData.pincode = prop.pincode;
  if (prop.latitude !== undefined) dbData.latitude = prop.latitude;
  if (prop.longitude !== undefined) dbData.longitude = prop.longitude;
  if (prop.landmark !== undefined) dbData.landmark = prop.landmark;
  if (prop.area !== undefined) dbData.area = prop.area;
  if (prop.areaUnit !== undefined) dbData.area_unit = prop.areaUnit;
  if (prop.carpetArea !== undefined) dbData.carpet_area = prop.carpetArea;
  if (prop.builtUpArea !== undefined) dbData.built_up_area = prop.builtUpArea;
  if (prop.plotArea !== undefined) dbData.plot_area = prop.plotArea;
  if (prop.bedrooms !== undefined) dbData.bedrooms = prop.bedrooms;
  if (prop.bathrooms !== undefined) dbData.bathrooms = prop.bathrooms;
  if (prop.balconies !== undefined) dbData.balconies = prop.balconies;
  if (prop.parking !== undefined) dbData.parking_spaces = prop.parking;
  if (prop.furnishingStatus !== undefined) dbData.furnishing_status = prop.furnishingStatus;
  if (prop.constructionStatus !== undefined) dbData.possession_status = prop.constructionStatus;
  if (prop.possessionDate !== undefined) dbData.possession_date = prop.possessionDate;
  if (prop.floor !== undefined) dbData.floor_number = prop.floor;
  if (prop.totalFloors !== undefined) dbData.total_floors = prop.totalFloors;
  if (prop.facing !== undefined) dbData.facing = prop.facing;
  if (prop.constructionYear !== undefined) dbData.construction_year = prop.constructionYear;
  if (prop.ageOfProperty !== undefined) dbData.age_of_property = prop.ageOfProperty;
  if (prop.description !== undefined) dbData.description = prop.description;
  if (prop.highlights !== undefined) dbData.highlights = prop.highlights;
  if (prop.amenities !== undefined) dbData.amenities = prop.amenities;
  if (prop.landmarks !== undefined) dbData.landmarks = prop.landmarks;
  if (prop.specifications !== undefined) dbData.specifications = prop.specifications;
  if (prop.ownershipType !== undefined) dbData.ownership_type = prop.ownershipType;
  if (prop.waterSupply !== undefined) dbData.water_supply = prop.waterSupply;
  if (prop.electricity !== undefined) dbData.electricity = prop.electricity;
  if (prop.roadAccess !== undefined) dbData.road_access = prop.roadAccess;
  if (prop.zoning !== undefined) dbData.zoning = prop.zoning;
  if (prop.industrialUseDetails !== undefined) dbData.industrial_use_details = prop.industrialUseDetails;
  if (prop.commercialUseDetails !== undefined) dbData.commercial_use_details = prop.commercialUseDetails;
  if (prop.reraNumber !== undefined) dbData.rera_registration_number = prop.reraNumber;
  if (prop.metaTitle !== undefined) dbData.meta_title = prop.metaTitle;
  if (prop.metaDescription !== undefined) dbData.meta_description = prop.metaDescription;
  if (prop.coverImage !== undefined) dbData.cover_image = prop.coverImage;
  if (prop.images !== undefined) dbData.images = prop.images;
  if (prop.floorPlanImages !== undefined) dbData.floor_plan_images = prop.floorPlanImages;
  if (prop.videoUrl !== undefined) dbData.video_url = prop.videoUrl;
  if (prop.status !== undefined) dbData.status = prop.status;
  if (prop.featured !== undefined) dbData.featured = prop.featured;
  if (prop.verified !== undefined) dbData.verified = prop.verified;
  dbData.updated_at = new Date().toISOString();

  return dbData;
}

export const propertyService = {
  /**
   * Fetch properties with multi-facet filters and sorting from Supabase
   */
  async getProperties(
    filters?: PropertyFilterParams,
    sort: PropertySortOption = 'newest',
    options?: { page?: number; limit?: number; isAdmin?: boolean }
  ): Promise<{ data: Property[]; total: number }> {
    try {
      let query = supabase.from('properties').select('*', { count: 'exact' });

      // If not admin, restrict to available properties
      if (!options?.isAdmin) {
        if (filters?.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        } else {
          query = query.eq('status', 'available');
        }
      } else if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Listing Type (Buy / Rent / Sale)
      if (filters?.listingType && filters.listingType !== 'all') {
        query = query.eq('listing_type', filters.listingType);
      }

      // Category
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('property_type', filters.category);
      }

      // Category Group
      if (filters?.categoryGroup && filters.categoryGroup !== 'all') {
        query = query.eq('category_group', filters.categoryGroup);
      }

      // Location (locality or address)
      if (filters?.location && filters.location !== 'all' && filters.location.trim() !== '') {
        const loc = filters.location.trim();
        query = query.ilike('locality', `%${loc}%`);
      }

      // Min & Max Price
      if (filters?.minPrice !== undefined && filters.minPrice > 0) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
        query = query.lte('price', filters.maxPrice);
      }

      // Bedrooms
      if (filters?.bedrooms !== undefined && filters.bedrooms !== 'any') {
        const beds = Number(filters.bedrooms);
        if (beds >= 4) {
          query = query.gte('bedrooms', 4);
        } else {
          query = query.eq('bedrooms', beds);
        }
      }

      // Bathrooms
      if (filters?.bathrooms !== undefined && filters.bathrooms !== 'any') {
        const baths = Number(filters.bathrooms);
        query = query.gte('bathrooms', baths);
      }

      // Min & Max Area
      if (filters?.minArea !== undefined && filters.minArea > 0) {
        query = query.gte('area', filters.minArea);
      }
      if (filters?.maxArea !== undefined && filters.maxArea > 0) {
        query = query.lte('area', filters.maxArea);
      }

      // Furnishing Status
      if (filters?.furnishingStatus && filters.furnishingStatus !== 'all') {
        query = query.eq('furnishing_status', filters.furnishingStatus);
      }

      // Construction / Possession Status
      if (filters?.constructionStatus && filters.constructionStatus !== 'all') {
        query = query.eq('possession_status', filters.constructionStatus);
      }

      // Search Query (title, description, address, property_code)
      if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.trim();
        query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,locality.ilike.%${q}%,address.ilike.%${q}%,property_code.ilike.%${q}%`);
      }

      // Sorting
      switch (sort) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'area-asc':
          query = query.order('area', { ascending: true });
          break;
        case 'area-desc':
          query = query.order('area', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      // Pagination
      if (options?.limit) {
        const page = options.page || 1;
        const from = (page - 1) * options.limit;
        const to = from + options.limit - 1;
        query = query.range(from, to);
      }

      const { data, count, error } = await query;

      if (error) {
        console.warn('Supabase query error, fallback to mock data:', error.message);
        return this.getMockProperties(filters, sort);
      }

      if (data && data.length >= 0) {
        return {
          data: data.map(mapDbToProperty),
          total: count ?? data.length,
        };
      }

      return { data: [], total: 0 };
    } catch (err) {
      console.warn('Error fetching from Supabase, falling back to mock data:', err);
      return this.getMockProperties(filters, sort);
    }
  },

  /**
   * Fallback mock filter implementation if Supabase is offline
   */
  getMockProperties(filters?: PropertyFilterParams, sort: PropertySortOption = 'newest') {
    let results = [...MOCK_PROPERTIES];
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        results = results.filter((p) => p.status === filters.status);
      } else if (!filters.status) {
        results = results.filter((p) => p.status === 'available');
      }
      if (filters.listingType && filters.listingType !== 'all') {
        results = results.filter((p) => p.listingType === filters.listingType);
      }
      if (filters.category && filters.category !== 'all') {
        results = results.filter((p) => p.propertyType === filters.category);
      }
      if (filters.categoryGroup && filters.categoryGroup !== 'all') {
        results = results.filter((p) => p.categoryGroup === filters.categoryGroup);
      }
      if (filters.location && filters.location !== 'all' && filters.location.trim() !== '') {
        const locLower = filters.location.toLowerCase().trim();
        results = results.filter(
          (p) =>
            p.location.toLowerCase().includes(locLower) ||
            (p.locality && p.locality.toLowerCase().includes(locLower)) ||
            p.address.toLowerCase().includes(locLower)
        );
      }
      if (filters.minPrice !== undefined && filters.minPrice > 0) {
        results = results.filter((p) => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        results = results.filter((p) => p.price <= filters.maxPrice!);
      }
    }
    return { data: results, total: results.length };
  },

  /**
   * Fetch single property by ID, Slug, or Property Code
   */
  async getPropertyById(idOrSlug: string): Promise<Property | null> {
    try {
      const clean = idOrSlug.trim();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

      let query = supabase.from('properties').select('*');
      if (isUuid) {
        query = query.eq('id', clean);
      } else {
        query = query.or(`slug.eq.${clean},property_code.eq.${clean.toUpperCase()}`);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.warn('Error fetching property by ID from Supabase:', error.message);
      }

      if (data) {
        return mapDbToProperty(data);
      }

      // Check fallback mock data
      const mock = MOCK_PROPERTIES.find(
        (p) => p.id.toLowerCase() === clean.toLowerCase() || p.slug.toLowerCase() === clean.toLowerCase()
      );
      return mock || null;
    } catch (err) {
      console.warn('Exception in getPropertyById, checking mock:', err);
      const mock = MOCK_PROPERTIES.find(
        (p) => p.id.toLowerCase() === idOrSlug.toLowerCase() || p.slug.toLowerCase() === idOrSlug.toLowerCase()
      );
      return mock || null;
    }
  },

  /**
   * Fetch featured properties for homepage
   */
  async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error || !data || data.length === 0) {
        const featured = MOCK_PROPERTIES.filter((p) => p.featured);
        return featured.slice(0, limit);
      }

      return data.map(mapDbToProperty);
    } catch {
      const featured = MOCK_PROPERTIES.filter((p) => p.featured);
      return featured.slice(0, limit);
    }
  },

  /**
   * Fetch similar properties based on category and location
   */
  async getSimilarProperties(property: Property, limit: number = 3): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .neq('id', property.id)
        .or(`property_type.eq.${property.propertyType},locality.eq.${property.location}`)
        .limit(limit);

      if (error || !data || data.length === 0) {
        const mock = MOCK_PROPERTIES.filter(
          (p) =>
            p.id !== property.id &&
            (p.propertyType === property.propertyType || p.location === property.location)
        );
        return mock.slice(0, limit);
      }

      return data.map(mapDbToProperty);
    } catch {
      const mock = MOCK_PROPERTIES.filter(
        (p) =>
          p.id !== property.id &&
          (p.propertyType === property.propertyType || p.location === property.location)
      );
      return mock.slice(0, limit);
    }
  },

  /**
   * Create a new property in Supabase (Admin only)
   */
  async createProperty(property: Partial<Property>): Promise<Property> {
    const slug =
      property.slug ||
      (property.title || 'property')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const code = property.propertyCode || `KR-PUN-${Date.now().toString().slice(-5)}`;

    const dbPayload = mapPropertyToDb({
      ...property,
      slug,
      propertyCode: code,
      status: property.status || 'draft',
      featured: property.featured ?? false,
    });

    const { data, error } = await supabase
      .from('properties')
      .insert(dbPayload)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to create property.');
    }

    return mapDbToProperty(data);
  },

  /**
   * Update an existing property in Supabase (Admin only)
   */
  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const dbPayload = mapPropertyToDb(updates);

    const { data, error } = await supabase
      .from('properties')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to update property.');
    }

    return mapDbToProperty(data);
  },

  /**
   * Delete a property and clean up its associated storage photos
   */
  async deleteProperty(propertyId: string): Promise<boolean> {
    // 1. Fetch property to get images to delete
    const prop = await this.getPropertyById(propertyId);

    // 2. Delete database record
    const { error } = await supabase.from('properties').delete().eq('id', propertyId);
    if (error) {
      throw new Error(error.message || 'Failed to delete property.');
    }

    // 3. Clean up storage files if stored in Supabase Storage
    if (prop && prop.images && prop.images.length > 0) {
      for (const imgUrl of prop.images) {
        if (imgUrl.includes('/property-images/')) {
          try {
            const fileName = imgUrl.split('/property-images/')[1];
            if (fileName) {
              await supabase.storage.from('property-images').remove([fileName]);
            }
          } catch (e) {
            console.warn('Failed to clean up storage image:', e);
          }
        }
      }
    }

    return true;
  },

  /**
   * Upload an image file to Supabase Storage
   */
  async uploadPropertyImage(file: File, folder: string = 'listings'): Promise<string> {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('property-images').getPublicUrl(fileName);
    return data.publicUrl;
  },

  /**
   * Delete a specific image from Supabase Storage
   */
  async deleteStorageImage(imageUrl: string): Promise<void> {
    if (imageUrl.includes('/property-images/')) {
      const filePath = imageUrl.split('/property-images/')[1];
      if (filePath) {
        await supabase.storage.from('property-images').remove([filePath]);
      }
    }
  },

  /**
   * Fetch real-time KPI metrics for Admin Dashboard
   */
  async getAdminStats(): Promise<AdminDashboardStats> {
    try {
      const [propsRes, enqRes] = await Promise.all([
        supabase.from('properties').select('status, featured'),
        supabase.from('enquiries').select('status'),
      ]);

      const props = propsRes.data || [];
      const enqs = enqRes.data || [];

      return {
        totalProperties: props.length,
        availableProperties: props.filter((p) => p.status === 'available').length,
        draftProperties: props.filter((p) => p.status === 'draft').length,
        soldProperties: props.filter((p) => p.status === 'sold').length,
        rentedProperties: props.filter((p) => p.status === 'rented').length,
        featuredProperties: props.filter((p) => p.featured).length,
        totalEnquiries: enqs.length,
        newEnquiries: enqs.filter((e) => e.status === 'new').length,
      };
    } catch {
      return {
        totalProperties: 16,
        availableProperties: 16,
        draftProperties: 0,
        soldProperties: 0,
        rentedProperties: 0,
        featuredProperties: 6,
        totalEnquiries: 0,
        newEnquiries: 0,
      };
    }
  },

  /**
   * Available Categories with metadata
   */
  getCategories(): {
    title: PropertyCategory;
    group: 'residential' | 'commercial' | 'industrial';
    description: string;
    image: string;
    count: number;
  }[] {
    return [
      {
        title: 'Flat / Apartment',
        group: 'residential',
        description: 'Modern 2 & 3 BHK high-rise flats with premium club amenities across Pune.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        count: 6,
      },
      {
        title: 'Residential Plot',
        group: 'residential',
        description: 'Collector NA plots in gated layouts with scenic hill views and clear titles.',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        count: 2,
      },
      {
        title: 'Independent House',
        group: 'residential',
        description: 'Exclusive private villas and standalone bungalows with private gardens.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        count: 1,
      },
      {
        title: 'Row House',
        group: 'residential',
        description: 'Charming duplex row houses offering community warmth and independent privacy.',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
        count: 1,
      },
      {
        title: 'Shop',
        group: 'commercial',
        description: 'Prime high-footfall road-facing retail showrooms and commercial stores.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        count: 1,
      },
      {
        title: 'Office Space',
        group: 'commercial',
        description: 'Grade-A corporate tech office spaces and business suites in Pune IT corridors.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        count: 1,
      },
      {
        title: 'Commercial Space',
        group: 'commercial',
        description: 'Versatile commercial floorplates suitable for banks, clinics, and showrooms.',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
        count: 1,
      },
      {
        title: 'Industrial Land',
        group: 'industrial',
        description: 'Zoned industrial plots, PEB warehouses, and factory lands near MIDC clusters.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        count: 2,
      },
    ];
  },
};
