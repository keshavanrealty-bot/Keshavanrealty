import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Save,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Share2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { settingsService } from '../../services/settingsService';
import { BusinessInfoSettings } from '../../types/settings';
import { validateIndianPhone } from '../../utils/formatters';

export const AdminBusinessInfo: React.FC = () => {
  const { settings, updateSetting } = useSiteSettings();
  const [formData, setFormData] = useState<BusinessInfoSettings>({ ...settings.business_info });
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Logo upload handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setErrorMsg(null);
    try {
      const url = await settingsService.uploadSiteAsset(file, 'branding');
      setFormData((prev) => ({ ...prev, logoUrl: url } as any));
      // Also update appearance settings logoUrl
      await updateSetting('appearance', { ...settings.appearance, logoUrl: url });
      setSuccessMsg('New logo uploaded and published!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Favicon upload handler
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFavicon(true);
    setErrorMsg(null);
    try {
      const url = await settingsService.uploadSiteAsset(file, 'branding');
      await updateSetting('appearance', { ...settings.appearance, faviconUrl: url });
      setSuccessMsg('New favicon uploaded and published!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload favicon.');
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg('Business name cannot be empty.');
      setSaving(false);
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid business email address.');
      setSaving(false);
      return;
    }

    if (!formData.phone.trim() || !validateIndianPhone(formData.phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian primary phone number.');
      setSaving(false);
      return;
    }

    try {
      await updateSetting('business_info', formData);
      setSuccessMsg('Business information updated and published successfully across website!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save business information.');
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
            <Building2 className="w-7 h-7 text-brand-orange" />
            <span>Business Information</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
            Manage your company details, official contact numbers, office location, and legal credentials.
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
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish</span>
            </>
          )}
        </button>
      </div>

      {/* Alerts */}
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
        {/* Section 1: Brand Identity & Logos */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
            <span>Company Brand &amp; Logos</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Business Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Brand Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Business Summary / About Snippet
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
            />
          </div>

          {/* Logo & Favicon upload cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Logo */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-brand-charcoal border border-brand-orange/40 p-2 flex items-center justify-center shrink-0">
                  <img
                    src={settings.appearance.logoUrl || '/keshavan-logo.png'}
                    alt="Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-charcoal">Official Logo</h4>
                  <span className="text-[11px] text-gray-400 block">Header &amp; Footer primary logo</span>
                </div>
              </div>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:border-brand-orange text-brand-charcoal shadow-sm transition-colors">
                {uploadingLogo ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-brand-orange" />
                )}
                <span>Replace</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
              </label>
            </div>

            {/* Favicon */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
                  <img
                    src={settings.appearance.faviconUrl || '/keshavan-logo.png'}
                    alt="Favicon"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-charcoal">Website Favicon</h4>
                  <span className="text-[11px] text-gray-400 block">Browser tab icon</span>
                </div>
              </div>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:border-brand-orange text-brand-charcoal shadow-sm transition-colors">
                {uploadingFavicon ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-brand-orange" />
                )}
                <span>Replace</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/x-icon,image/svg+xml"
                  className="hidden"
                  onChange={handleFaviconUpload}
                  disabled={uploadingFavicon}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Numbers & WhatsApp */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
            <span>Primary Contact Numbers &amp; Email</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-orange" />
                Primary Phone Number (Callable)
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+919552537074"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Used in tel: links across website</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-orange" />
                Display Phone (Formatted for Humans)
              </label>
              <input
                type="text"
                required
                value={formData.displayPhone}
                onChange={(e) => setFormData({ ...formData, displayPhone: e.target.value })}
                placeholder="+91 95525 37074"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Displayed visibly in header &amp; footer</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp Number (Numeric)
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="919552537074"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">With country code (91) without + symbol</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-orange" />
                Official Business Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="keshavanrealty@gmail.com"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Office Address & Google Map */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
            <span>Office Location &amp; Map Coordinates</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  Complete Office Address
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.officeAddress}
                  onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                  placeholder="Charoli, Pune, Maharashtra 412105"
                  className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-brand-orange" />
                  Google Maps Embed URL
                </label>
                <input
                  type="text"
                  value={formData.mapsLink}
                  onChange={(e) => setFormData({ ...formData, mapsLink: e.target.value })}
                  placeholder="https://maps.google.com/maps?q=Charoli%2C%20Pune%2C%20Maharashtra%20412105&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 font-mono"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Embed iframe source URL for Contact page</span>
              </div>
            </div>

            {/* Live Map Preview */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 aspect-[4/3] relative">
              <iframe
                title="Office Location Preview"
                src={formData.mapsLink}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                className="w-full h-full"
              />
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-brand-charcoal shadow-sm">
                Live Map Preview
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Business Working Hours */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
            <span>Business Hours &amp; Weekly Schedule</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-orange" />
                Monday – Friday
              </label>
              <input
                type="text"
                value={formData.workingHours.weekdays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    workingHours: { ...formData.workingHours, weekdays: e.target.value },
                  })
                }
                placeholder="9:30 AM – 7:30 PM"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-orange" />
                Saturday
              </label>
              <input
                type="text"
                value={formData.workingHours.saturday}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    workingHours: { ...formData.workingHours, saturday: e.target.value },
                  })
                }
                placeholder="10:00 AM – 6:30 PM"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-orange" />
                Sunday
              </label>
              <input
                type="text"
                value={formData.workingHours.sunday}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    workingHours: { ...formData.workingHours, sunday: e.target.value },
                  })
                }
                placeholder="By Appointment Only"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Social Media Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
            <span>Social Media Channels</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-pink-600" />
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.instagram || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                  })
                }
                placeholder="https://instagram.com/keshavanrealty"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.socialLinks.facebook || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                  })
                }
                placeholder="https://facebook.com/keshavanrealty"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-sky-600" />
                LinkedIn Company Page
              </label>
              <input
                type="url"
                value={formData.socialLinks.linkedin || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                  })
                }
                placeholder="https://linkedin.com/company/keshavanrealty"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-slate-800" />
                Twitter / X Profile
              </label>
              <input
                type="url"
                value={formData.socialLinks.twitter || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                  })
                }
                placeholder="https://twitter.com/keshavanrealty"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-red-600" />
                YouTube Channel
              </label>
              <input
                type="url"
                value={formData.socialLinks.youtube || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                  })
                }
                placeholder="https://youtube.com/@keshavanrealty"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Legal & MahaRERA Compliance */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
            <span>MahaRERA &amp; Legal Disclaimers</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
                MahaRERA Agent / Advisory Registration Number
              </label>
              <input
                type="text"
                value={formData.reraNumber || ''}
                onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                placeholder="e.g. A52100000000"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Company Registration / Jurisdiction
              </label>
              <input
                type="text"
                value={formData.companyRegistration || ''}
                onChange={(e) => setFormData({ ...formData, companyRegistration: e.target.value })}
                placeholder="Pune, Maharashtra, India"
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Website Footer RERA Disclaimer
            </label>
            <textarea
              rows={2}
              value={formData.reraDisclaimer}
              onChange={(e) => setFormData({ ...formData, reraDisclaimer: e.target.value })}
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
            />
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-500">
            Changes save to PostgreSQL and publish immediately across the public website.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover shadow-md hover:shadow-glow transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
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
