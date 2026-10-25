import React, { useState } from 'react';
import {
  MessageSquare,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageCircle,
  Shield,
  Send,
  HelpCircle,
  Info,
  Clock,
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { EnquiryCrmSettings } from '../../types/settings';

export const AdminCrmSettings: React.FC = () => {
  const { settings, updateSetting } = useSiteSettings();
  const [formData, setFormData] = useState<EnquiryCrmSettings>({ ...settings.enquiry_crm });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await updateSetting('enquiry_crm', formData);
      setSuccessMsg('CRM and Enquiry settings updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save CRM settings.');
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
            <MessageSquare className="w-7 h-7 text-brand-orange" />
            <span>Enquiry &amp; CRM Settings</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
            Configure default customer messaging templates, lead pipeline statuses, and privacy consent disclaimers.
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
        {/* Section 1: WhatsApp Default Message Template */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Lead &amp; Click-to-Chat Templates</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Default General WhatsApp Message
            </label>
            <input
              type="text"
              required
              value={formData.defaultWhatsAppMessage}
              onChange={(e) => setFormData({ ...formData, defaultWhatsAppMessage: e.target.value })}
              placeholder="Hello Keshavan Realty, I would like to enquire about properties in Pune."
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">
              Pre-filled in customer&apos;s WhatsApp when clicking WhatsApp buttons from navigation, footer, or contact page.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Customer Instant Acknowledgement Message
            </label>
            <textarea
              rows={2}
              required
              value={formData.customerAckMessage}
              onChange={(e) => setFormData({ ...formData, customerAckMessage: e.target.value })}
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">
              Shown to the customer upon submitting any enquiry or contact form on the website.
            </span>
          </div>
        </div>

        {/* Section 2: Lead Status Workflow */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <Clock className="w-4 h-4 text-brand-orange" />
            <span>Lead Status Lifecycle Pipeline</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {formData.leadStatuses.map((st) => (
              <div
                key={st.key}
                className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-brand-charcoal block">{st.label}</span>
                  <span className="text-[10px] text-gray-400 font-mono">key: {st.key}</span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    st.color === 'rose'
                      ? 'bg-rose-100 text-rose-700'
                      : st.color === 'blue'
                      ? 'bg-blue-100 text-blue-700'
                      : st.color === 'amber'
                      ? 'bg-amber-100 text-amber-700'
                      : st.color === 'purple'
                      ? 'bg-purple-100 text-purple-700'
                      : st.color === 'emerald'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {st.color}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Privacy & Customer Consent */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-brand-charcoal flex items-center gap-2 border-b border-gray-100 pb-3">
            <Shield className="w-4 h-4 text-brand-orange" />
            <span>Customer Privacy Disclaimer</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Form Privacy Text
            </label>
            <textarea
              rows={2}
              required
              value={formData.privacyText}
              onChange={(e) => setFormData({ ...formData, privacyText: e.target.value })}
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal"
            />
          </div>
        </div>

        {/* Section 4: Integration Status Disclosure */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
            <Info className="w-4 h-4 text-brand-orange" />
            <span>External Notification Integration Status</span>
          </div>
          <p>
            - <strong>WhatsApp Direct Chat:</strong> Operational out-of-the-box via WhatsApp universal links (`wa.me`) with zero third-party subscription requirements.
          </p>
          <p>
            - <strong>Supabase Enquiries Database:</strong> Operational. All submissions are stored with Row Level Security in `public.enquiries` and visible instantly in the Admin Enquiries dashboard.
          </p>
          <p>
            - <strong>Email Alerts:</strong> To receive automated transactional email notifications to `keshavanrealty@gmail.com` when new enquiries arrive, configure custom SMTP credentials in your Supabase Auth / Database webhook settings (e.g. Resend or SendGrid).
          </p>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <span className="text-xs text-gray-500">
            CRM settings apply directly to customer modals, contact forms, and lead tracking.
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
