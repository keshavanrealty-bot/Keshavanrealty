import React, { useState } from 'react';
import {
  Palette,
  Save,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Eye,
  Megaphone,
  LayoutTemplate,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { settingsService } from '../../services/settingsService';
import { AppearanceSettings } from '../../types/settings';

export const AdminAppearance: React.FC = () => {
  const { settings, updateSetting } = useSiteSettings();
  const [formData, setFormData] = useState<AppearanceSettings>({ ...settings.appearance });
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingDefaultImage, setUploadingDefaultImage] = useState(false);
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    setErrorMsg(null);
    try {
      const url = await settingsService.uploadSiteAsset(file, 'banners');
      setFormData((prev) => ({
        ...prev,
        heroBanners: [...prev.heroBanners, url],
      }));
      setSuccessMsg('Hero banner uploaded!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload banner.');
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleRemoveBanner = (index: number) => {
    if (formData.heroBanners.length <= 1) {
      alert('You must keep at least one hero banner image.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      heroBanners: prev.heroBanners.filter((_, i) => i !== index),
    }));
  };

  const handleAddBannerUrl = () => {
    if (!newBannerUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      heroBanners: [...prev.heroBanners, newBannerUrl.trim()],
    }));
    setNewBannerUrl('');
  };

  const handleDefaultImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDefaultImage(true);
    setErrorMsg(null);
    try {
      const url = await settingsService.uploadSiteAsset(file, 'banners');
      setFormData((prev) => ({ ...prev, defaultPropertyImage: url }));
      setSuccessMsg('Default property image updated!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload image.');
    } finally {
      setUploadingDefaultImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await updateSetting('appearance', formData);
      setSuccessMsg('Appearance and branding settings saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save appearance settings.');
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
            <Palette className="w-7 h-7 text-brand-orange" />
            <span>Appearance &amp; Branding</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
            Customize website headlines, hero photographic banners, promo announcements, and homepage section displays.
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
        {/* Section 1: Hero Headlines & Taglines */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
            <span>Hero Headline &amp; Tagline</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Homepage Hero Main Headline
              </label>
              <input
                type="text"
                required
                value={formData.heroHeading}
                onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                placeholder="Find Your Perfect Property in Pune"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Website Tagline
              </label>
              <input
                type="text"
                required
                value={formData.websiteTagline}
                onChange={(e) => setFormData({ ...formData, websiteTagline: e.target.value })}
                placeholder="Trust | Transparency | Value"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Homepage Hero Subtitle
            </label>
            <textarea
              rows={2}
              required
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
            />
          </div>
        </div>

        {/* Section 2: Hero Background Banners */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-orange" />
              <span>Hero Photographic Banners ({formData.heroBanners.length})</span>
            </h3>

            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-orange text-white hover:bg-brand-orange-hover shadow-sm transition-colors self-start sm:self-auto">
              {uploadingBanner ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Upload New Banner</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleBannerUpload}
                disabled={uploadingBanner}
              />
            </label>
          </div>

          {/* Banners Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {formData.heroBanners.map((img, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 aspect-[16/9]"
              >
                <img src={img} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-3">
                  <span className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBanner(idx)}
                    className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow"
                    title="Remove banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add banner via URL */}
          <div className="flex gap-2 pt-2">
            <input
              type="url"
              value={newBannerUrl}
              onChange={(e) => setNewBannerUrl(e.target.value)}
              placeholder="Or paste high-resolution image URL (https://images.unsplash.com/...)"
              className="flex-1 bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs"
            />
            <button
              type="button"
              onClick={handleAddBannerUrl}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-brand-charcoal text-xs font-bold rounded-xl"
            >
              Add URL
            </button>
          </div>
        </div>

        {/* Section 3: Promotional Announcement Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-orange" />
              <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-brand-orange" />
                <span>Top Promotional Banner</span>
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  promoBanner: {
                    ...formData.promoBanner,
                    enabled: !formData.promoBanner.enabled,
                  },
                })
              }
              className="flex items-center gap-2 text-xs font-bold text-gray-700"
            >
              <span>{formData.promoBanner.enabled ? 'Enabled' : 'Disabled'}</span>
              {formData.promoBanner.enabled ? (
                <ToggleRight className="w-7 h-7 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-gray-400" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Badge Text
              </label>
              <input
                type="text"
                value={formData.promoBanner.badge || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    promoBanner: { ...formData.promoBanner, badge: e.target.value },
                  })
                }
                placeholder="e.g. New Launch / Limited Offer"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Announcement Message
              </label>
              <input
                type="text"
                value={formData.promoBanner.text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    promoBanner: { ...formData.promoBanner, text: e.target.value },
                  })
                }
                placeholder="New Luxury Residential Projects Launched in Wakad & Hinjawadi — Book a Site Visit Today!"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Destination Link
            </label>
            <input
              type="text"
              value={formData.promoBanner.link}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  promoBanner: { ...formData.promoBanner, link: e.target.value },
                })
              }
              placeholder="/properties?category=Flat+%2F+Apartment"
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
            />
          </div>
        </div>

        {/* Section 4: Homepage Section Visibility Toggles */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <LayoutTemplate className="w-4 h-4 text-brand-orange" />
            <span>Homepage Section Visibility Controls</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'heroSearch', label: 'Advanced Property Search' },
              { key: 'categoryCards', label: 'Explore 8 Categories' },
              { key: 'featuredProperties', label: 'Featured Properties Grid' },
              { key: 'splitPromo', label: 'Promo Banner / List Property' },
              { key: 'puneLocations', label: 'Popular Pune Locations' },
              { key: 'whyChooseUs', label: 'Why Choose Keshavan Realty' },
              { key: 'testimonials', label: 'Client Testimonials' },
              { key: 'faqAccordion', label: 'Frequently Asked Questions' },
            ].map((sec) => {
              const k = sec.key as keyof typeof formData.sectionVisibility;
              const isVisible = formData.sectionVisibility[k];

              return (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      sectionVisibility: {
                        ...formData.sectionVisibility,
                        [k]: !isVisible,
                      },
                    })
                  }
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
                    isVisible
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900 shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                  }`}
                >
                  <span className="text-xs font-bold">{sec.label}</span>
                  {isVisible ? (
                    <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      Visible
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      Hidden
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Brand Color Codes & Default Media */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
            <span>Brand Colors &amp; Fallback Property Media</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-center">
            {/* Primary Orange */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Primary Brand Orange
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-gray-200 p-0.5"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-32 bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Dark Charcoal */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Dark Charcoal Surface
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-gray-200 p-0.5"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-32 bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Default Property Fallback Image */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Fallback Property Photo
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={formData.defaultPropertyImage}
                  alt="Default property"
                  className="w-12 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                />
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-brand-grey border border-gray-200 hover:border-brand-orange text-brand-charcoal transition-colors">
                  {uploadingDefaultImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-brand-orange" />
                  )}
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleDefaultImageUpload}
                    disabled={uploadingDefaultImage}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-500">
            Appearance settings update client styling and live layout sections dynamically.
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
