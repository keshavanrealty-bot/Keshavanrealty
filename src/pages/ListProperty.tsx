import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Home,
  User,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Maximize2,
  FileText,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { enquiryService } from '../services/enquiryService';
import { PropertyCategory, ListingType, AreaUnit } from '../types/property';
import { businessConfig } from '../config/business';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { validateIndianPhone } from '../utils/formatters';

export const ListProperty: React.FC = () => {
  const { settings } = useSiteSettings();
  const bInfo = settings.business_info || businessConfig;
  const pDisplay = settings.property_display;

  const [formData, setFormData] = useState({
    ownerName: '',
    contactNumber: '',
    email: '',
    listingType: 'buy' as ListingType,
    propertyCategory: 'Flat / Apartment' as PropertyCategory,
    location: '',
    fullAddress: '',
    expectedPrice: '',
    propertyArea: '',
    areaUnit: 'sq.ft' as AreaUnit,
    bedrooms: '2',
    bathrooms: '2',
    description: '',
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = (pDisplay?.categories || [
    'Flat / Apartment',
    'Residential Plot',
    'Independent House',
    'Row House',
    'Shop',
    'Office Space',
    'Commercial Space',
    'Industrial Land',
  ]) as PropertyCategory[];

  const puneLocations = pDisplay?.locations || businessConfig.coverage;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.ownerName.trim()) {
      setErrorMessage('Please enter your full name as owner/representative.');
      return;
    }

    if (!formData.contactNumber.trim() || !validateIndianPhone(formData.contactNumber)) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!formData.location.trim()) {
      setErrorMessage('Please choose or enter your Pune locality.');
      return;
    }

    if (!formData.expectedPrice.trim()) {
      setErrorMessage('Please provide your expected price or rent.');
      return;
    }

    if (!formData.propertyArea.trim()) {
      setErrorMessage('Please specify property carpet area or plot size.');
      return;
    }

    setLoading(true);
    try {
      const response = await enquiryService.submitPropertyListing({
        ...formData,
        imageFiles: selectedFiles,
      });
      setSuccessResponse(response.message);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit property. Please check the fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-grey/30 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
            Property Owners &amp; Landlords
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-brand-charcoal tracking-tight">
            List Your Property with Keshavan Realty
          </h1>
          <p className="text-sm text-brand-grey-text max-w-xl mx-auto leading-relaxed">
            Reach genuine buyers, tenants, and corporate lessees across Pune. Submit your property
            details for review by our advisory team.
          </p>
        </div>

        {/* Verification Notice / Disclaimer */}
        <div className="bg-amber-50 border border-amber-200/90 rounded-3xl p-5 sm:p-6 flex items-start gap-4 text-xs sm:text-sm text-amber-900 shadow-sm">
          <ShieldAlert className="w-6 h-6 text-brand-orange shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-brand-charcoal">Submission &amp; Review Policy</h4>
            <p className="text-amber-800 leading-relaxed text-xs">
              Please note: Submitting your property details here does not automatically publish it
              on the public website. To uphold our standard of <strong>Trust &amp; Transparency</strong>,
              all listings undergo physical verification and document validation by our Keshavan
              Realty Pune team before going live.
            </p>
          </div>
        </div>

        {/* Form Container */}
        {successResponse ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-card text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal">
              Property Submitted for Review!
            </h2>
            <p className="text-sm text-brand-grey-text max-w-lg mx-auto leading-relaxed">
              {successResponse}
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/properties"
                className="px-6 py-2.5 rounded-full bg-brand-charcoal text-white text-xs font-bold hover:bg-brand-orange transition-colors"
              >
                Browse Pune Properties
              </Link>
              <button
                onClick={() => {
                  setSuccessResponse(null);
                  setSelectedFiles([]);
                  setFormData({
                    ownerName: '',
                    contactNumber: '',
                    email: '',
                    listingType: 'buy',
                    propertyCategory: 'Flat / Apartment',
                    location: '',
                    fullAddress: '',
                    expectedPrice: '',
                    propertyArea: '',
                    areaUnit: 'sq.ft',
                    bedrooms: '2',
                    bathrooms: '2',
                    description: '',
                  });
                }}
                className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-bold text-brand-charcoal hover:bg-gray-100 transition-colors"
              >
                Submit Another Property
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-card space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-brand-charcoal">Property Details Form</h3>
              <p className="text-xs text-brand-grey-text">
                Fields marked with <span className="text-rose-500 font-bold">*</span> are required.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Owner Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-orange flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Owner / Representative Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="e.g. Suresh Kulkarni"
                      className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 text-xs font-semibold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={formData.contactNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, contactNumber: e.target.value })
                        }
                        placeholder="95525 37074"
                        className="w-full bg-brand-grey border border-gray-200 rounded-r-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="suresh@example.com"
                      className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Property Type & Intent */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-orange flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5" />
                  Property Type &amp; Listing Intent
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      I Want To <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, listingType: 'buy' })}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          formData.listingType === 'buy'
                            ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-sm'
                            : 'bg-brand-grey text-brand-grey-text border-gray-200'
                        }`}
                      >
                        Sell Property
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, listingType: 'rent' })}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          formData.listingType === 'rent'
                            ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-sm'
                            : 'bg-brand-grey text-brand-grey-text border-gray-200'
                        }`}
                      >
                        Rent / Lease Out
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Property Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.propertyCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertyCategory: e.target.value as PropertyCategory,
                        })
                      }
                      className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Location & Financials */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-orange flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Location, Area &amp; Price
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Pune Locality <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal font-medium"
                    >
                      <option value="">Select Locality</option>
                      {puneLocations.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Expected Price / Rent <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.expectedPrice}
                        onChange={(e) =>
                          setFormData({ ...formData, expectedPrice: e.target.value })
                        }
                        placeholder="e.g. ₹85 Lakh or ₹30,000/mo"
                        className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Property Area <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={formData.propertyArea}
                        onChange={(e) =>
                          setFormData({ ...formData, propertyArea: e.target.value })
                        }
                        placeholder="e.g. 1050"
                        className="w-2/3 bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal"
                      />
                      <select
                        value={formData.areaUnit}
                        onChange={(e) =>
                          setFormData({ ...formData, areaUnit: e.target.value as AreaUnit })
                        }
                        className="w-1/3 bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-2 text-xs text-brand-charcoal font-medium"
                      >
                        <option value="sq.ft">sq.ft</option>
                        <option value="guntha">guntha</option>
                        <option value="acres">acres</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Property Address / Landmark
                  </label>
                  <input
                    type="text"
                    value={formData.fullAddress}
                    onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                    placeholder="e.g. Flat 604, Tower B, Near Datta Mandir, Wakad, Pune 411057"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal"
                  />
                </div>
              </div>

              {/* Section 4: Description & Photos */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-orange flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Description &amp; Photos
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Property Description &amp; Highlights
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe furnishing, floor, parking, society amenities, age of construction, or any special features..."
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal resize-none"
                  />
                </div>

                {/* Upload Photos Dropzone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Upload Property Images (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 hover:border-brand-orange rounded-2xl p-6 text-center bg-brand-grey/50 transition-colors">
                    <input
                      type="file"
                      id="property-images"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="property-images"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-orange-light text-brand-orange flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-brand-charcoal">
                        Click to select property photos
                      </span>
                      <span className="text-[11px] text-gray-400">
                        PNG, JPG or WEBP (Max 10 photos)
                      </span>
                    </label>
                    {selectedFiles.length > 0 && (
                      <div className="mt-3 text-xs font-semibold text-emerald-600">
                        &check; {selectedFiles.length} file(s) selected
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-all shadow-md hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Property Details...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Property for Keshavan Realty Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
