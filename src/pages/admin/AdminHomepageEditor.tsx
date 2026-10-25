import React, { useState } from 'react';
import {
  Home,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Star,
  Users,
  Award,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { HomepageContentSettings, WhyChooseUsItem, StatItem, TestimonialItem } from '../../types/settings';

export const AdminHomepageEditor: React.FC = () => {
  const { settings, updateSetting } = useSiteSettings();
  const [formData, setFormData] = useState<HomepageContentSettings>({ ...settings.homepage_content });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New testimonial form state
  const [newTestimonial, setNewTestimonial] = useState<TestimonialItem>({
    name: '',
    location: '',
    text: '',
    rating: 5,
  });

  // New Why Choose Us state
  const [newWhyPoint, setNewWhyPoint] = useState<WhyChooseUsItem>({
    title: '',
    description: '',
  });

  const handleAddWhyPoint = () => {
    if (!newWhyPoint.title.trim() || !newWhyPoint.description.trim()) return;
    setFormData((prev) => ({
      ...prev,
      whyChooseUs: [...prev.whyChooseUs, { ...newWhyPoint }],
    }));
    setNewWhyPoint({ title: '', description: '' });
  };

  const handleRemoveWhyPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs.filter((_, i) => i !== index),
    }));
  };

  const handleAddTestimonial = () => {
    if (!newTestimonial.name.trim() || !newTestimonial.text.trim()) return;
    setFormData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, { ...newTestimonial }],
    }));
    setNewTestimonial({ name: '', location: '', text: '', rating: 5 });
  };

  const handleRemoveTestimonial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await updateSetting('homepage_content', formData);
      setSuccessMsg('Homepage content updated and published live!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save homepage content.');
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
            <Home className="w-7 h-7 text-brand-orange" />
            <span>Homepage Content Editor</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
            Manage your homepage text, action buttons, trust indicators, why choose us features, and client testimonials.
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
        {/* Section 1: Hero Headlines & CTA Buttons */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <span>Hero Headlines &amp; Call-to-Action Buttons</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Main Headline
              </label>
              <input
                type="text"
                required
                value={formData.heroHeading}
                onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Sub-Headline Description
              </label>
              <textarea
                rows={2}
                required
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Primary CTA */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
              <span className="text-xs font-bold text-brand-charcoal block">Primary Button (Orange Highlight)</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Button Label</label>
                  <input
                    type="text"
                    value={formData.ctaPrimaryText}
                    onChange={(e) => setFormData({ ...formData, ctaPrimaryText: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Link Destination</label>
                  <input
                    type="text"
                    value={formData.ctaPrimaryLink}
                    onChange={(e) => setFormData({ ...formData, ctaPrimaryLink: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
              <span className="text-xs font-bold text-brand-charcoal block">Secondary Button (Transparent Overlay)</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Button Label</label>
                  <input
                    type="text"
                    value={formData.ctaSecondaryText}
                    onChange={(e) => setFormData({ ...formData, ctaSecondaryText: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Link Destination</label>
                  <input
                    type="text"
                    value={formData.ctaSecondaryLink}
                    onChange={(e) => setFormData({ ...formData, ctaSecondaryLink: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Trust Badges (3 Badges) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <Award className="w-4 h-4 text-brand-orange" />
            <span>Hero Trust Indicators (3 Badges)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {formData.trustIndicators.map((item, idx) => (
              <div key={idx}>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Indicator #{idx + 1}</label>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const updated = [...formData.trustIndicators];
                    updated[idx] = e.target.value;
                    setFormData({ ...formData, trustIndicators: updated });
                  }}
                  className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-brand-charcoal"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Why Choose Keshavan Realty */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-orange" />
              <span>Why Choose Keshavan Realty Features ({formData.whyChooseUs.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.whyChooseUs.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 relative group">
                <button
                  type="button"
                  onClick={() => handleRemoveWhyPoint(idx)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="text-xs font-bold text-brand-charcoal">{item.title}</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Add Why Point */}
          <div className="p-4 rounded-2xl bg-brand-grey/60 border border-gray-200 space-y-3">
            <span className="text-xs font-bold text-brand-charcoal block">Add New Feature Card</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Card Title (e.g. Title Clarity)..."
                  value={newWhyPoint.title}
                  onChange={(e) => setNewWhyPoint({ ...newWhyPoint, title: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
                />
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Description summary..."
                  value={newWhyPoint.description}
                  onChange={(e) => setNewWhyPoint({ ...newWhyPoint, description: e.target.value })}
                  className="flex-1 bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddWhyPoint}
                  className="px-4 py-2 bg-brand-orange text-white rounded-xl text-xs font-bold hover:bg-brand-orange-hover"
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Verified Client Testimonials */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-orange" />
              <span>Verified Client Testimonials ({formData.testimonials.length})</span>
            </h3>
            <span className="text-[11px] text-gray-400">Genuine customer reviews</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {formData.testimonials.map((t, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 relative group space-y-2">
                <button
                  type="button"
                  onClick={() => handleRemoveTestimonial(idx)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-gray-700 italic leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <h4 className="text-xs font-bold text-brand-charcoal">{t.name}</h4>
                  <span className="text-[10px] text-brand-orange font-semibold block">{t.location}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Testimonial */}
          <div className="p-4 rounded-2xl bg-brand-grey/60 border border-gray-200 space-y-3">
            <span className="text-xs font-bold text-brand-charcoal block">Add Genuine Client Review</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Client Name (e.g. Rahul Patil)"
                value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
              />
              <input
                type="text"
                placeholder="Property/Locality (e.g. Bought 2 BHK in Wakad)"
                value={newTestimonial.location}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
              />
              <select
                value={newTestimonial.rating}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
              >
                <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                <option value={4}>4 Stars ⭐⭐⭐⭐</option>
              </select>
            </div>

            <div className="flex gap-2">
              <textarea
                rows={2}
                placeholder="Client review feedback text..."
                value={newTestimonial.text}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                className="flex-1 bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs"
              />
              <button
                type="button"
                onClick={handleAddTestimonial}
                className="px-5 py-2 bg-brand-orange text-white rounded-xl text-xs font-bold hover:bg-brand-orange-hover self-end"
              >
                Add Review
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-500">
            Published homepage content updates immediately for all visitors without code changes or redeployments.
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
