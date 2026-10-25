import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Building,
  Upload,
  X,
  Plus,
  Check,
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Star,
  MapPin,
  IndianRupee,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import {
  Property,
  PropertyCategory,
  CategoryGroup,
  ListingType,
  PropertyStatus,
  FurnishingStatus,
  ConstructionStatus,
  AreaUnit,
} from '../../types/property';
import { businessConfig } from '../../config/business';

export const AdminPropertyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyCategory>('Flat / Apartment');
  const [listingType, setListingType] = useState<ListingType>('buy');
  const [status, setStatus] = useState<PropertyStatus>('available');
  const [featured, setFeatured] = useState(false);
  const [verified, setVerified] = useState(true);

  // Price & Financials
  const [price, setPrice] = useState<string>('');
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [maintenanceCharges, setMaintenanceCharges] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');

  // Location
  const [city] = useState('Pune');
  const [location, setLocation] = useState('Wakad');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Area
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('sq.ft');
  const [carpetArea, setCarpetArea] = useState('');
  const [builtUpArea, setBuiltUpArea] = useState('');
  const [plotArea, setPlotArea] = useState('');

  // Residential Specific Fields
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [balconies, setBalconies] = useState('1');
  const [floorNumber, setFloorNumber] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [parkingSpaces, setParkingSpaces] = useState('1 Covered Car Park');
  const [furnishingStatus, setFurnishingStatus] = useState<FurnishingStatus>('Semi-Furnished');
  const [possessionStatus, setPossessionStatus] = useState<ConstructionStatus>('Ready to Move');
  const [possessionDate, setPossessionDate] = useState('');
  const [facing, setFacing] = useState('East Facing');

  // Commercial / Industrial Specific Fields
  const [zoning, setZoning] = useState('');
  const [roadAccess, setRoadAccess] = useState('');
  const [waterSupply, setWaterSupply] = useState('');
  const [electricity, setElectricity] = useState('');
  const [commercialUseDetails, setCommercialUseDetails] = useState('');
  const [industrialUseDetails, setIndustrialUseDetails] = useState('');
  const [reraNumber, setReraNumber] = useState('');

  // Description & Highlights
  const [description, setDescription] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');

  // Media
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [videoUrl, setVideoUrl] = useState('');

  const commonAmenitiesList = [
    'Swimming Pool',
    'Clubhouse',
    'Gymnasium',
    '24/7 Security & CCTV',
    'Children Play Area',
    'Power Backup',
    'High-Speed Elevators',
    'EV Charging Point',
    'Jogging Track',
    'Intercom Facility',
    'Solar Water Heating',
    'Rainwater Harvesting',
    'Multipurpose Hall',
    'Visitor Parking',
    'Private Garden',
    'Terrace Gazebo',
    'Home Automation',
    'Fire Fighting System',
  ];

  // Derive Category Group
  const getCategoryGroup = (type: PropertyCategory): CategoryGroup => {
    if (type === 'Shop' || type === 'Office Space' || type === 'Commercial Space') return 'commercial';
    if (type === 'Industrial Land') return 'industrial';
    return 'residential';
  };

  const isResidential = getCategoryGroup(propertyType) === 'residential' && propertyType !== 'Residential Plot';
  const isPlot = propertyType === 'Residential Plot';
  const isCommercial = getCategoryGroup(propertyType) === 'commercial';
  const isIndustrial = propertyType === 'Industrial Land';

  // Load existing property when in edit mode
  useEffect(() => {
    if (id) {
      setLoading(true);
      propertyService
        .getPropertyById(id)
        .then((prop) => {
          if (prop) {
            setTitle(prop.title);
            setPropertyType(prop.propertyType);
            setListingType(prop.listingType);
            setStatus(prop.status);
            setFeatured(prop.featured);
            setVerified(prop.verified ?? true);
            setPrice(prop.price ? String(prop.price) : '');
            setPriceNegotiable(Boolean(prop.priceNegotiable));
            setMaintenanceCharges(prop.maintenanceCharges ? String(prop.maintenanceCharges) : '');
            setSecurityDeposit(prop.securityDeposit ? String(prop.securityDeposit) : '');
            setLocation(prop.location || 'Wakad');
            setAddress(prop.address || '');
            setLandmark(prop.landmark || '');
            setLatitude(prop.latitude ? String(prop.latitude) : '');
            setLongitude(prop.longitude ? String(prop.longitude) : '');
            setArea(prop.area ? String(prop.area) : '');
            setAreaUnit(prop.areaUnit || 'sq.ft');
            setCarpetArea(prop.carpetArea ? String(prop.carpetArea) : '');
            setBuiltUpArea(prop.builtUpArea ? String(prop.builtUpArea) : '');
            setPlotArea(prop.plotArea ? String(prop.plotArea) : '');
            setBedrooms(prop.bedrooms ? String(prop.bedrooms) : '2');
            setBathrooms(prop.bathrooms ? String(prop.bathrooms) : '2');
            setBalconies(prop.balconies ? String(prop.balconies) : '1');
            setFloorNumber(prop.floor || '');
            setTotalFloors(prop.totalFloors ? String(prop.totalFloors) : '');
            setParkingSpaces(prop.parking || '');
            setFurnishingStatus(prop.furnishingStatus || 'Semi-Furnished');
            setPossessionStatus(prop.constructionStatus || 'Ready to Move');
            setPossessionDate(prop.possessionDate || '');
            setFacing(prop.facing || '');
            setDescription(prop.description || '');
            setHighlights(prop.highlights || []);
            setSelectedAmenities(prop.amenities || []);
            setExistingImages(prop.images || []);
            setVideoUrl(prop.videoUrl || '');
            setZoning(prop.zoning || '');
            setRoadAccess(prop.roadAccess || '');
            setWaterSupply(prop.waterSupply || '');
            setElectricity(prop.electricity || '');
            setCommercialUseDetails(prop.commercialUseDetails || '');
            setIndustrialUseDetails(prop.industrialUseDetails || '');
            setReraNumber(prop.reraNumber || '');
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddHighlight = () => {
    if (highlightsInput.trim()) {
      setHighlights([...highlights, highlightsInput.trim()]);
      setHighlightsInput('');
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleToggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleAddCustomAmenity = () => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities([...selectedAmenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImageFiles((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveNewFile = (idx: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
    if (coverImageIndex === idx) {
      setCoverImageIndex(0);
    } else if (coverImageIndex > idx) {
      setCoverImageIndex(coverImageIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic validation
    if (!title.trim()) {
      setErrorMessage('Please enter property title.');
      return;
    }

    if (!price || Number(price) <= 0) {
      setErrorMessage('Please specify a valid property price or monthly rent.');
      return;
    }

    if (!area || Number(area) <= 0) {
      setErrorMessage('Please specify property area.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please write a short property description.');
      return;
    }

    setSubmitting(true);
    setUploadProgress('Preparing property images...');

    try {
      // 1. Upload new files to Supabase Storage
      const uploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        for (let i = 0; i < newImageFiles.length; i++) {
          setUploadProgress(`Uploading photo ${i + 1} of ${newImageFiles.length} to Supabase Storage...`);
          const url = await propertyService.uploadPropertyImage(newImageFiles[i]);
          uploadedUrls.push(url);
        }
      }

      // Combine existing images + newly uploaded images
      const allImages = [...existingImages, ...uploadedUrls];
      if (allImages.length === 0) {
        allImages.push('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
      }

      const coverImg = allImages[coverImageIndex] || allImages[0];

      setUploadProgress('Saving property record into database...');

      const payload: Partial<Property> = {
        title: title.trim(),
        propertyType,
        categoryGroup: getCategoryGroup(propertyType),
        listingType,
        status,
        featured,
        verified,
        price: Number(price),
        priceNegotiable,
        maintenanceCharges: maintenanceCharges ? Number(maintenanceCharges) : undefined,
        securityDeposit: securityDeposit ? Number(securityDeposit) : undefined,
        location,
        locality: location,
        address: address.trim() || `${location}, Pune`,
        landmark: landmark.trim() || undefined,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        area: Number(area),
        areaUnit,
        carpetArea: carpetArea ? Number(carpetArea) : undefined,
        builtUpArea: builtUpArea ? Number(builtUpArea) : undefined,
        plotArea: plotArea ? Number(plotArea) : undefined,
        description: description.trim(),
        highlights,
        amenities: selectedAmenities,
        images: allImages,
        coverImage: coverImg,
        videoUrl: videoUrl.trim() || undefined,
        reraNumber: reraNumber.trim() || undefined,
        ownershipType: 'Freehold',
        waterSupply: waterSupply.trim() || undefined,
        electricity: electricity.trim() || undefined,
        roadAccess: roadAccess.trim() || undefined,
        zoning: zoning.trim() || undefined,
        commercialUseDetails: commercialUseDetails.trim() || undefined,
        industrialUseDetails: industrialUseDetails.trim() || undefined,
      };

      // Category-specific properties
      if (isResidential) {
        payload.bedrooms = bedrooms ? Number(bedrooms) : undefined;
        payload.bathrooms = bathrooms ? Number(bathrooms) : undefined;
        payload.balconies = balconies ? Number(balconies) : undefined;
        payload.floor = floorNumber.trim() || undefined;
        payload.totalFloors = totalFloors ? Number(totalFloors) : undefined;
        payload.parking = parkingSpaces.trim() || undefined;
        payload.furnishingStatus = furnishingStatus;
        payload.constructionStatus = possessionStatus;
        payload.possessionDate = possessionDate.trim() || undefined;
        payload.facing = facing.trim() || undefined;
      }

      if (isEditMode && id) {
        await propertyService.updateProperty(id, payload);
        setSuccessMessage('Property updated successfully in Supabase!');
      } else {
        await propertyService.createProperty(payload);
        setSuccessMessage('New property created successfully in Supabase!');
      }

      setTimeout(() => {
        navigate('/admin/properties');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save property. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
        <p className="text-xs text-gray-500 font-semibold">Loading property data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/properties"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-display font-extrabold text-brand-charcoal tracking-tight">
              {isEditMode ? 'Edit Property Record' : 'Add New Property to Database'}
            </h2>
            <p className="text-xs text-brand-grey-text">
              Directly saves into your Supabase database and updates the public website live.
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Classification & Status */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-brand-charcoal border-l-3 border-brand-orange pl-3">
            1. Classification &amp; Listing Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Property Category *</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyCategory)}
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-brand-charcoal"
              >
                <option value="Flat / Apartment">Flat / Apartment</option>
                <option value="Residential Plot">Residential Plot</option>
                <option value="Independent House">Independent House / Villa</option>
                <option value="Row House">Row House</option>
                <option value="Shop">Shop / Retail Showroom</option>
                <option value="Office Space">Office Space</option>
                <option value="Commercial Space">Commercial Space</option>
                <option value="Industrial Land">Industrial Land / Shed</option>
              </select>
            </div>

            {/* Listing Intent */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Listing Intent *</label>
              <select
                value={listingType}
                onChange={(e) => setListingType(e.target.value as ListingType)}
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-brand-charcoal"
              >
                <option value="buy">For Sale (Outright)</option>
                <option value="rent">For Rent / Lease</option>
              </select>
            </div>

            {/* Publication Status */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold text-brand-charcoal"
              >
                <option value="available">Available (Public)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Featured & Verified Toggles */}
            <div className="flex flex-col justify-end gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-brand-charcoal">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4"
                />
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>Feature on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-brand-charcoal">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Listing Badge</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Identification & Basic Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-brand-charcoal border-l-3 border-brand-orange pl-3">
            2. Title &amp; Pricing
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Property Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2 BHK Luxury High-Rise Apartment in Wakad"
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-3 px-3.5 text-xs sm:text-sm font-medium text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-brand-orange" />
                Price in INR *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 8850000 (88.5 Lakh)"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                {price && Number(price) >= 10000000
                  ? `≈ ₹${(Number(price) / 10000000).toFixed(2)} Cr`
                  : price && Number(price) >= 100000
                  ? `≈ ₹${(Number(price) / 100000).toFixed(2)} Lakh`
                  : ''}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Maintenance Charges (Monthly)</label>
              <input
                type="number"
                value={maintenanceCharges}
                onChange={(e) => setMaintenanceCharges(e.target.value)}
                placeholder="e.g. 3500"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Security Deposit (For Rent)</label>
              <input
                type="number"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="e.g. 100000"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Location in Pune */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-brand-charcoal border-l-3 border-brand-orange pl-3">
            3. Pune Location &amp; Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                Pune Locality *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal font-semibold"
              >
                {businessConfig.coverage.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Nearby Landmark</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Bhumkar Chowk / Datta Mandir"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Complete Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Flat 1102, Tower B, Datta Mandir Road, Wakad, Pune, Maharashtra 411057"
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Latitude (Optional)</label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="18.5987"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs text-brand-charcoal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Longitude (Optional)</label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="73.7654"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs text-brand-charcoal"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Area & Category-Adaptive Specifications */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-brand-charcoal border-l-3 border-brand-orange pl-3">
            4. Area &amp; Specifications ({propertyType})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Total Area *</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="1000"
                  className="w-2/3 bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal font-semibold"
                />
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                  className="w-1/3 bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-2 text-xs font-semibold text-brand-charcoal"
                >
                  <option value="sq.ft">sq.ft</option>
                  <option value="guntha">guntha</option>
                  <option value="acres">acres</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Carpet Area</label>
              <input
                type="number"
                value={carpetArea}
                onChange={(e) => setCarpetArea(e.target.value)}
                placeholder="e.g. 780"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Built-up Area</label>
              <input
                type="number"
                value={builtUpArea}
                onChange={(e) => setBuiltUpArea(e.target.value)}
                placeholder="e.g. 1020"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>
          </div>

          {/* Conditional Residential Fields */}
          {isResidential && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">
                Residential Configuration
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Bedrooms (BHK)</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium"
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Bathrooms</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Balconies</label>
                  <select
                    value={balconies}
                    onChange={(e) => setBalconies(e.target.value)}
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Floor Number</label>
                  <input
                    type="text"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(e.target.value)}
                    placeholder="e.g. 11th of 22"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Furnishing Status</label>
                  <select
                    value={furnishingStatus}
                    onChange={(e) => setFurnishingStatus(e.target.value as FurnishingStatus)}
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium"
                  >
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Furnished">Fully Furnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Possession Status</label>
                  <select
                    value={possessionStatus}
                    onChange={(e) => setPossessionStatus(e.target.value as ConstructionStatus)}
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium"
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Parking</label>
                  <input
                    type="text"
                    value={parkingSpaces}
                    onChange={(e) => setParkingSpaces(e.target.value)}
                    placeholder="e.g. 1 Covered Dedicated Parking"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditional Plot / Commercial / Industrial Fields */}
          {(isPlot || isCommercial || isIndustrial) && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">
                Zoning &amp; Infrastructure
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Road Access</label>
                  <input
                    type="text"
                    value={roadAccess}
                    onChange={(e) => setRoadAccess(e.target.value)}
                    placeholder="e.g. 60-ft wide concrete road"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Zoning / Sanctions</label>
                  <input
                    type="text"
                    value={zoning}
                    onChange={(e) => setZoning(e.target.value)}
                    placeholder="e.g. MIDC Heavy Industrial / Collector NA"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">RERA Number (if applicable)</label>
                  <input
                    type="text"
                    value={reraNumber}
                    onChange={(e) => setReraNumber(e.target.value)}
                    placeholder="P521000..."
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Description & Highlights */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-brand-charcoal border-l-3 border-brand-orange pl-3">
            5. Description &amp; Highlights
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Property Description *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the property layout, ventilation, builder reputation, society features, and prime benefits..."
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Key Highlights (Bullet Points)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                placeholder="e.g. Just 5 mins from Hinjawadi Phase 1 Circle"
                className="flex-1 bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs text-brand-charcoal"
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="px-4 py-2 rounded-xl bg-brand-charcoal text-white text-xs font-bold hover:bg-brand-orange"
              >
                Add Highlight
              </button>
            </div>

            {highlights.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-700">
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {h}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(i)}
                      className="text-gray-400 hover:text-rose-500 font-bold px-1"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 6: Amenities */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-brand-charcoal border-l-3 border-brand-orange pl-3">
            6. Amenities &amp; Facilities
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {commonAmenitiesList.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => handleToggleAmenity(amenity)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-brand-orange bg-brand-orange-light text-brand-orange font-bold'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{amenity}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              placeholder="Add custom amenity (e.g. Squash Court)"
              className="flex-1 bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs"
            />
            <button
              type="button"
              onClick={handleAddCustomAmenity}
              className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-xs font-bold text-gray-800"
            >
              Add Custom
            </button>
          </div>
        </div>

        {/* Section 7: Media & Supabase Storage Images */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-brand-charcoal border-l-3 border-brand-orange pl-3">
            7. Photos &amp; Media (Supabase Storage)
          </h3>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-gray-300 hover:border-brand-orange rounded-2xl p-6 text-center bg-brand-grey/50 transition-colors">
            <input
              type="file"
              id="admin-image-upload"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="admin-image-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-brand-orange-light text-brand-orange flex items-center justify-center shadow-sm">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-brand-charcoal">
                Click to browse property photos for Supabase Storage
              </span>
              <span className="text-xs text-gray-400">
                Supports JPG, PNG, WEBP up to 10MB each.
              </span>
            </label>
          </div>

          {/* Existing Images Grid */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-600 block">
                Saved Photos ({existingImages.length}) &bull; Click &quot;Cover&quot; to set as primary photo
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {existingImages.map((img, idx) => {
                  const isCover = coverImageIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 shadow-sm ${
                        isCover ? 'border-brand-orange ring-2 ring-brand-orange/40' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="Property" className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setCoverImageIndex(idx)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shadow ${
                            isCover ? 'bg-brand-orange text-white' : 'bg-black/60 text-white hover:bg-black'
                          }`}
                        >
                          {isCover ? 'Cover Photo' : 'Make Cover'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(idx)}
                          className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow hover:bg-rose-700"
                          title="Remove Photo"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Newly Selected Local Files */}
          {newImageFiles.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-brand-orange block">
                New Photos to Upload ({newImageFiles.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {newImageFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-brand-orange-light border border-brand-orange/30 flex items-center justify-between text-xs"
                  >
                    <span className="truncate max-w-[120px] font-medium text-brand-charcoal">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewFile(idx)}
                      className="text-rose-600 hover:text-rose-800 font-bold px-1"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">YouTube / Video Tour Link</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs text-brand-charcoal"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
          <div>
            {uploadProgress ? (
              <span className="text-xs font-bold text-brand-orange flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploadProgress}
              </span>
            ) : (
              <span className="text-xs text-gray-500">
                Saving will immediately publish or update this record in Supabase.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/admin/properties"
              className="flex-1 sm:flex-none px-6 py-3 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:flex-none px-8 py-3 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold shadow-md hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Property...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditMode ? 'Save & Update Property' : 'Publish Property to Supabase'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
