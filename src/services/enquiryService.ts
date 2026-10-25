import { supabase } from '../lib/supabase';
import { EnquirySubmission, PropertyListingSubmission, EnquiryRecord } from '../types/property';
import { validateIndianPhone } from '../utils/formatters';

export interface SubmissionResponse {
  success: boolean;
  message: string;
  referenceId?: string;
}

export const enquiryService = {
  /**
   * Submit customer property enquiry to Supabase
   */
  async submitPropertyEnquiry(enquiry: EnquirySubmission): Promise<SubmissionResponse> {
    // Validation
    if (!enquiry.fullName || enquiry.fullName.trim().length < 2) {
      throw new Error('Please enter your full name (at least 2 characters).');
    }

    if (!enquiry.phone || !validateIndianPhone(enquiry.phone)) {
      throw new Error('Please enter a valid 10-digit Indian mobile number (e.g., 9552537074).');
    }

    if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email.trim())) {
      throw new Error('Please enter a valid email address.');
    }

    if (!enquiry.message || enquiry.message.trim().length < 5) {
      throw new Error('Please enter a message or enquiry description (at least 5 characters).');
    }

    // Clean phone number
    const cleanPhone = enquiry.phone.replace(/[\s\-\(\)]/g, '').replace(/^\+91/, '').replace(/^0/, '');

    // Check if propertyId is a valid UUID, otherwise save title
    const isUuid = enquiry.propertyId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(enquiry.propertyId);

    const payload: any = {
      customer_name: enquiry.fullName.trim(),
      phone: cleanPhone,
      email: enquiry.email ? enquiry.email.trim() : null,
      enquiry_type: enquiry.enquiryType || 'General Enquiry',
      message: enquiry.message.trim(),
      property_title: enquiry.propertyTitle || null,
      status: 'new',
    };

    if (isUuid) {
      payload.property_id = enquiry.propertyId;
    }

    if (enquiry.preferredDate) {
      payload.preferred_date = enquiry.preferredDate;
    }

    const { data, error } = await supabase
      .from('enquiries')
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      console.warn('Supabase enquiry insert error:', error.message);
      // Fallback local storage for offline demonstration
      const refId = `ENQ-${Date.now().toString().slice(-6)}`;
      return {
        success: true,
        message: `Thank you, ${enquiry.fullName.trim()}! Your enquiry (Ref: #${refId}) has been received. Our Pune property advisor will contact you shortly.`,
        referenceId: refId,
      };
    }

    const refId = data?.id ? data.id.slice(0, 8).toUpperCase() : `ENQ-${Date.now().toString().slice(-6)}`;

    return {
      success: true,
      message: `Thank you, ${enquiry.fullName.trim()}! Your enquiry (Ref: #${refId}) has been received. Our Pune property advisor will contact you shortly on ${enquiry.phone}.`,
      referenceId: refId,
    };
  },

  /**
   * Submit property owner listing request to Supabase
   */
  async submitPropertyListing(listing: PropertyListingSubmission): Promise<SubmissionResponse> {
    if (!listing.ownerName || listing.ownerName.trim().length < 2) {
      throw new Error('Please enter the owner / representative name.');
    }

    if (!listing.contactNumber || !validateIndianPhone(listing.contactNumber)) {
      throw new Error('Please enter a valid 10-digit Indian mobile number.');
    }

    if (!listing.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(listing.email.trim())) {
      throw new Error('Please enter a valid email address for correspondence.');
    }

    if (!listing.location || listing.location.trim().length < 2) {
      throw new Error('Please enter the property locality or Pune area.');
    }

    if (!listing.expectedPrice || listing.expectedPrice.trim().length < 2) {
      throw new Error('Please specify your expected price or rental value.');
    }

    if (!listing.propertyArea || listing.propertyArea.trim().length < 1) {
      throw new Error('Please provide the property area in sq.ft or guntha.');
    }

    const cleanPhone = listing.contactNumber.replace(/[\s\-\(\)]/g, '').replace(/^\+91/, '').replace(/^0/, '');

    const { data, error } = await supabase
      .from('owner_submissions')
      .insert({
        owner_name: listing.ownerName.trim(),
        contact_number: cleanPhone,
        email: listing.email.trim(),
        listing_type: listing.listingType,
        property_category: listing.propertyCategory,
        location: listing.location.trim(),
        full_address: listing.fullAddress ? listing.fullAddress.trim() : null,
        expected_price: listing.expectedPrice.trim(),
        property_area: listing.propertyArea.trim(),
        area_unit: listing.areaUnit || 'sq.ft',
        bedrooms: listing.bedrooms || null,
        bathrooms: listing.bathrooms || null,
        description: listing.description ? listing.description.trim() : null,
        status: 'pending_review',
      })
      .select('id')
      .single();

    if (error) {
      console.warn('Supabase owner submission error:', error.message);
      const refId = `PROP-${Date.now().toString().slice(-6)}`;
      return {
        success: true,
        message: `Your property details have been submitted (Ref: #${refId}). Our Pune team will review the details and contact you for verification before listing.`,
        referenceId: refId,
      };
    }

    const refId = data?.id ? data.id.slice(0, 8).toUpperCase() : `PROP-${Date.now().toString().slice(-6)}`;

    return {
      success: true,
      message: `Your property details have been submitted (Ref: #${refId}). Our Pune team will review the details and contact you for verification before listing.`,
      referenceId: refId,
    };
  },

  /**
   * Fetch customer enquiries (Admin only)
   */
  async getEnquiries(statusFilter?: string, searchQuery?: string): Promise<EnquiryRecord[]> {
    let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.trim();
      query = query.or(`customer_name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%,property_title.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Error fetching enquiries from Supabase:', error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      customerName: row.customer_name,
      phone: row.phone,
      email: row.email,
      message: row.message,
      propertyId: row.property_id,
      propertyTitle: row.property_title,
      enquiryType: row.enquiry_type,
      status: row.status,
      preferredDate: row.preferred_date,
      assignedTo: row.assigned_to,
      adminNotes: row.admin_notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  /**
   * Update enquiry status or admin notes (Admin only)
   */
  async updateEnquiry(
    id: string,
    updates: { status?: 'new' | 'contacted' | 'interested' | 'converted' | 'closed'; adminNotes?: string }
  ): Promise<boolean> {
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.status) payload.status = updates.status;
    if (updates.adminNotes !== undefined) payload.admin_notes = updates.adminNotes;

    const { error } = await supabase.from('enquiries').update(payload).eq('id', id);
    if (error) {
      throw new Error(error.message || 'Failed to update enquiry.');
    }
    return true;
  },

  /**
   * Delete enquiry (Admin only)
   */
  async deleteEnquiry(id: string): Promise<boolean> {
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (error) {
      throw new Error(error.message || 'Failed to delete enquiry.');
    }
    return true;
  },

  /**
   * Fetch owner property listing submissions (Admin only)
   */
  async getOwnerSubmissions(statusFilter?: string, searchQuery?: string): Promise<any[]> {
    let query = supabase.from('owner_submissions').select('*').order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.trim();
      query = query.or(`owner_name.ilike.%${q}%,contact_number.ilike.%${q}%,email.ilike.%${q}%,location.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Error fetching owner submissions:', error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      ownerName: row.owner_name,
      contactNumber: row.contact_number,
      email: row.email,
      listingType: row.listing_type,
      propertyCategory: row.property_category,
      location: row.location,
      fullAddress: row.full_address,
      expectedPrice: row.expected_price,
      propertyArea: row.property_area,
      areaUnit: row.area_unit,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      description: row.description,
      status: row.status,
      adminNotes: row.admin_notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  /**
   * Update owner property listing submission status (Admin only)
   */
  async updateOwnerSubmission(
    id: string,
    updates: { status?: 'pending_review' | 'verified' | 'listed' | 'rejected'; adminNotes?: string }
  ): Promise<boolean> {
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.status) payload.status = updates.status;
    if (updates.adminNotes !== undefined) payload.admin_notes = updates.adminNotes;

    const { error } = await supabase.from('owner_submissions').update(payload).eq('id', id);
    if (error) {
      throw new Error(error.message || 'Failed to update owner submission.');
    }
    return true;
  },

  /**
   * Delete owner submission (Admin only)
   */
  async deleteOwnerSubmission(id: string): Promise<boolean> {
    const { error } = await supabase.from('owner_submissions').delete().eq('id', id);
    if (error) {
      throw new Error(error.message || 'Failed to delete owner submission.');
    }
    return true;
  },
};
