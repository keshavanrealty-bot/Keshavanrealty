import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Building,
  MapPin,
  Tag,
  CheckSquare,
  Square,
  ShieldCheck,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { PropertyDisplaySettings } from '../../types/settings';

export const AdminPropertySettings: React.FC = () => {
  const { settings, updateSetting } = useSiteSettings();
  const [formData, setFormData] = useState<PropertyDisplaySettings>({ ...settings.property_display });
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    if (formData.categories.includes(newCategory.trim())) {
      setErrorMsg('Category already exists.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory.trim()],
    }));
    setNewCategory('');
  };

  const handleRemoveCategory = (cat: string) => {
    if (formData.categories.length <= 1) {
      alert('You must maintain at least one property category.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
    }));
  };

  const handleAddLocation = () => {
    if (!newLocation.trim()) return;
    if (formData.locations.includes(newLocation.trim())) {
      setErrorMsg('Location already exists.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      locations: [...prev.locations, newLocation.trim()],
    }));
    setNewLocation('');
  };

  const handleRemoveLocation = (loc: string) => {
    if (formData.locations.length <= 1) {
      alert('You must maintain at least one Pune locality.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((l) => l !== loc),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await updateSetting('property_display', formData);
      setSuccessMsg('Property display settings updated and applied across website!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save property display settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-charcoal tracking-tight flex items-center gap-2.5">
            <SlidersHorizontal className="w-7 h-7 text-brand-orange" />
            <span>Property Display Settings</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
            Configure property categories, supported Pune localities, pagination, default sort orders, and card buttons.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover shadow-md hover:shadow-glow transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish</span>
            </>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-rose-800 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Categories Manager */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-orange" />
              <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-orange" />
                <span>Supported Property Categories ({formData.categories.length})</span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add category (e.g. Penthouse)..."
                className="bg-brand-grey border border-gray-200 rounded-xl py-1.5 px-3 text-xs"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="p-1.5 rounded-xl bg-brand-orange text-white hover:bg-brand-orange-hover"
                title="Add Category"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-grey text-xs font-bold text-brand-charcoal border border-gray-200"
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(cat)}
                  className="text-gray-400 hover:text-rose-600"
                  title="Remove category"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Section 2: Supported Pune Localities */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-orange" />
              <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-orange" />
                <span>Supported Pune Localities &amp; Areas ({formData.locations.length})</span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Add locality (e.g. Koregaon Park)..."
                className="bg-brand-grey border border-gray-200 rounded-xl py-1.5 px-3 text-xs"
              />
              <button
                type="button"
                onClick={handleAddLocation}
                className="p-1.5 rounded-xl bg-brand-orange text-white hover:bg-brand-orange-hover"
                title="Add Locality"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.locations.map((loc) => (
              <span
                key={loc}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 text-xs font-medium text-gray-700 border border-gray-200"
              >
                <span>{loc}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveLocation(loc)}
                  className="text-gray-400 hover:text-rose-600 font-bold"
                  title="Remove locality"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Section 3: Listing Pagination & Sorting defaults */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
            <span>Listing Defaults &amp; Pagination</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Properties Per Page
              </label>
              <select
                value={formData.itemsPerPage}
                onChange={(e) => setFormData({ ...formData, itemsPerPage: Number(e.target.value) })}
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              >
                <option value={6}>6 listings / page</option>
                <option value={9}>9 listings / page (Default)</option>
                <option value={12}>12 listings / page</option>
                <option value={18}>18 listings / page</option>
                <option value={24}>24 listings / page</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Default Sort Order
              </label>
              <select
                value={formData.defaultSort}
                onChange={(e) => setFormData({ ...formData, defaultSort: e.target.value as any })}
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="area">Area: Largest First</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Property Code Prefix
              </label>
              <input
                type="text"
                value={formData.propertyCodePrefix}
                onChange={(e) => setFormData({ ...formData, propertyCodePrefix: e.target.value })}
                placeholder="KR-PUN-"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">e.g. KR-PUN-00123</span>
            </div>
          </div>
        </div>

        {/* Section 4: Property Card Badges & Action Buttons */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <Tag className="w-4 h-4 text-brand-orange" />
            <span>Card Badges &amp; Quick Action Buttons</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Show Verified Badge */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, showVerifiedBadge: !formData.showVerifiedBadge })}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-3 ${
                formData.showVerifiedBadge ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-brand-charcoal block">Verified Badge</span>
                <span className="text-[10px] text-gray-400">Green &quot;Verified&quot; seal on photos</span>
              </div>
              <ShieldCheck className={`w-5 h-5 ${formData.showVerifiedBadge ? 'text-emerald-600' : 'text-gray-400'}`} />
            </button>

            {/* Show Negotiable Badge */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, showPriceNegotiable: !formData.showPriceNegotiable })}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-3 ${
                formData.showPriceNegotiable ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-brand-charcoal block">Price Negotiable Badge</span>
                <span className="text-[10px] text-gray-400">Displays if property is negotiable</span>
              </div>
              <Tag className={`w-5 h-5 ${formData.showPriceNegotiable ? 'text-amber-600' : 'text-gray-400'}`} />
            </button>

            {/* Show RERA Badge */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, showReraBadge: !formData.showReraBadge })}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-3 ${
                formData.showReraBadge ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-brand-charcoal block">RERA Number Badge</span>
                <span className="text-[10px] text-gray-400">Show MahaRERA registered badge</span>
              </div>
              <ShieldCheck className={`w-5 h-5 ${formData.showReraBadge ? 'text-blue-600' : 'text-gray-400'}`} />
            </button>

            {/* Show Call Button */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, showContactAdvisorButton: !formData.showContactAdvisorButton })}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-3 ${
                formData.showContactAdvisorButton ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-brand-charcoal block">Call Advisor Button</span>
                <span className="text-[10px] text-gray-400">Quick phone dial link on card</span>
              </div>
              <Phone className={`w-5 h-5 ${formData.showContactAdvisorButton ? 'text-brand-orange' : 'text-gray-400'}`} />
            </button>

            {/* Show WhatsApp Button */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, showWhatsAppButton: !formData.showWhatsAppButton })}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-3 ${
                formData.showWhatsAppButton ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-brand-charcoal block">WhatsApp Button</span>
                <span className="text-[10px] text-gray-400">Instant WhatsApp chat on card</span>
              </div>
              <MessageCircle className={`w-5 h-5 ${formData.showWhatsAppButton ? 'text-emerald-600' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-500">
            Property display preferences update public property catalog, filter bars, and card action buttons.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover shadow-md hover:shadow-glow transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save &amp; Publish</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
