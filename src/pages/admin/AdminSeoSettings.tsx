import React, { useState } from 'react';
import {
  Search,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Upload,
  Share2,
  LineChart,
  HelpCircle,
  Info,
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { settingsService } from '../../services/settingsService';
import { SeoSettings } from '../../types/settings';

export const AdminSeoSettings: React.FC = () => {
  const { settings, updateSetting } = useSiteSettings();
  const [formData, setFormData] = useState<SeoSettings>({ ...settings.seo_settings });
  const [saving, setSaving] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingOg(true);
    setErrorMsg(null);
    try {
      const url = await settingsService.uploadSiteAsset(file, 'branding');
      setFormData((prev) => ({ ...prev, ogImage: url }));
      setSuccessMsg('Social sharing image uploaded!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload preview image.');
    } finally {
      setUploadingOg(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate Google Analytics format if provided
    const ga = formData.googleAnalyticsId?.trim();
    if (ga && !ga.startsWith('G-')) {
      setErrorMsg('Google Analytics ID must follow the standard Google format starting with G- (e.g. G-ABC123XYZ).');
      setSaving(false);
      return;
    }

    try {
      await updateSetting('seo_settings', formData);
      setSuccessMsg('SEO and Google tracking settings successfully saved!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save SEO settings.');
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
            <Search className="w-7 h-7 text-brand-orange" />
            <span>SEO &amp; Google Integrations</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
            Configure website search engine meta titles, descriptions, social sharing banners, and Google Analytics tracking.
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
        {/* Section 1: Global Meta Titles & Descriptions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <Globe className="w-4 h-4 text-brand-orange" />
            <span>Website Meta Titles &amp; Descriptions</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Default Website Title
              </label>
              <input
                type="text"
                required
                value={formData.siteTitle}
                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                placeholder="Keshavan Realty | Premium Properties in Pune"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Homepage SEO Title
              </label>
              <input
                type="text"
                required
                value={formData.homepageTitle}
                onChange={(e) => setFormData({ ...formData, homepageTitle: e.target.value })}
                placeholder="Keshavan Realty | Buy, Rent & Invest in Pune Real Estate"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Default Meta Description (Google Search Snippet)
            </label>
            <textarea
              rows={3}
              required
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">
              Optimal length: 150 - 160 characters. Current length: {formData.metaDescription.length} characters.
            </span>
          </div>

          {/* SERP Search Preview */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1 font-sans">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Google SERP Result Preview
            </span>
            <div className="text-xs text-emerald-700 truncate">https://keshavanrealty.com</div>
            <div className="text-sm font-bold text-blue-700 hover:underline cursor-pointer truncate">
              {formData.homepageTitle || formData.siteTitle}
            </div>
            <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {formData.metaDescription}
            </div>
          </div>
        </div>

        {/* Section 2: Property Pages SEO Templates */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <Globe className="w-4 h-4 text-brand-orange" />
            <span>Property Page SEO Templates</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Property Title Template
              </label>
              <input
                type="text"
                required
                value={formData.propertyTitleTemplate}
                onChange={(e) => setFormData({ ...formData, propertyTitleTemplate: e.target.value })}
                placeholder="{title} in {locality}, Pune | Keshavan Realty"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Available tags: {'{title}'}, {'{locality}'}, {'{category}'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Property Description Template
              </label>
              <input
                type="text"
                required
                value={formData.propertyDescriptionTemplate}
                onChange={(e) => setFormData({ ...formData, propertyDescriptionTemplate: e.target.value })}
                placeholder="{title} available for {listingType} in {locality}, Pune. Price: {price}."
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Available tags: {'{title}'}, {'{locality}'}, {'{price}'}, {'{listingType}'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: OpenGraph & Social Sharing Image */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <Share2 className="w-4 h-4 text-brand-orange" />
            <span>Social Sharing OpenGraph Preview (WhatsApp, LinkedIn, Twitter)</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-48 h-28 rounded-2xl bg-brand-charcoal border border-gray-200 overflow-hidden flex items-center justify-center p-2 shrink-0">
              <img src={formData.ogImage} alt="Social Share Preview" className="max-h-full max-w-full object-contain" />
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  OpenGraph Image URL
                </label>
                <input
                  type="text"
                  value={formData.ogImage}
                  onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                  className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono"
                />
              </div>

              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:border-brand-orange text-brand-charcoal shadow-sm transition-colors">
                {uploadingOg ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-brand-orange" />
                )}
                <span>Upload Social Share Image</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleOgUpload}
                  disabled={uploadingOg}
                />
              </label>
              <span className="text-[10px] text-gray-400 block">Recommended dimension: 1200 x 630 px.</span>
            </div>
          </div>
        </div>

        {/* Section 4: Google Analytics & Search Console */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <LineChart className="w-4 h-4 text-brand-orange" />
            <span>Google Analytics 4 &amp; Google Search Console</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                value={formData.googleAnalyticsId || ''}
                onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Found in your Google Analytics Admin &rarr; Data Streams. Automatically embeds the official gtag script.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Google Search Console Verification Code
              </label>
              <input
                type="text"
                value={formData.googleSearchConsole || ''}
                onChange={(e) => setFormData({ ...formData, googleSearchConsole: e.target.value })}
                placeholder="google-site-verification=..."
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                HTML tag verification token for Search Console domain property ownership.
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-600 flex items-start gap-3">
            <Info className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
            <p>
              Once your Google Analytics Measurement ID is saved, the Google gtag library automatically initializes on all public pages, collecting visitor traffic, page views, and inquiry conversions.
            </p>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-500">
            SEO settings inject directly into dynamic document heads, OpenGraph meta tags, and Google script tags.
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
