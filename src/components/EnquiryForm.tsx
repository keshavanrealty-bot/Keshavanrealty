import React, { useState } from 'react';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Phone,
  User,
  Mail,
  HelpCircle,
  Calendar,
  Loader2,
} from 'lucide-react';
import { enquiryService } from '../services/enquiryService';
import { EnquirySubmission } from '../types/property';
import { validateIndianPhone } from '../utils/formatters';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface EnquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
  defaultEnquiryType?: 'Site Visit' | 'Price Details' | 'Floor Plan' | 'General Enquiry';
  onSuccess?: () => void;
  className?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  propertyId,
  propertyTitle,
  defaultEnquiryType = 'Site Visit',
  onSuccess,
  className = '',
}) => {
  const { settings } = useSiteSettings();
  const crmSettings = settings.enquiry_crm;

  const [formData, setFormData] = useState<EnquirySubmission>({
    propertyId: propertyId || '',
    propertyTitle: propertyTitle || '',
    fullName: '',
    phone: '',
    email: '',
    enquiryType: defaultEnquiryType,
    message: propertyTitle
      ? `Hello Keshavan Realty, I would like to schedule a site visit / request price breakup for ${propertyTitle} (ID: ${propertyId}).`
      : 'Hello Keshavan Realty, I would like more information about available properties in Pune.',
    preferredDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const isPhoneValid = !formData.phone || validateIndianPhone(formData.phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage('Please enter your mobile phone number.');
      return;
    }

    if (!validateIndianPhone(formData.phone)) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage('Please provide a brief message or question.');
      return;
    }

    setLoading(true);
    try {
      const response = await enquiryService.submitPropertyEnquiry(formData);
      setSuccessMessage(crmSettings?.customerAckMessage || response.message);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Something went wrong while submitting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setFormData((prev) => ({
      ...prev,
      fullName: '',
      phone: '',
      email: '',
      message: propertyTitle
        ? `Hello Keshavan Realty, I would like to schedule a site visit for ${propertyTitle}.`
        : 'Hello Keshavan Realty, I would like more information.',
    }));
  };

  if (successMessage) {
    return (
      <div className={`bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 ${className}`}>
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-emerald-950">Enquiry Submitted Successfully!</h4>
        <p className="text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
          {successMessage}
        </p>
        <div className="pt-2">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-emerald-700 underline hover:text-emerald-900"
          >
            Send Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-card ${className}`}>
      <div className="mb-5">
        <h3 className="text-xl font-display font-bold text-brand-charcoal">
          {propertyTitle ? 'Enquire About This Property' : 'Get in Touch with Our Advisors'}
        </h3>
        <p className="text-xs text-brand-grey-text mt-1">
          {propertyId ? (
            <span>
              Property Ref:{' '}
              <strong className="text-brand-charcoal font-mono">{propertyId}</strong> &bull; Verified
              Assistance
            </span>
          ) : (
            'Fill out the form below and our Pune team will get back to you shortly.'
          )}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-brand-orange" />
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Rajesh Patil"
            className="w-full bg-brand-grey border border-gray-200 rounded-xl py-3 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all"
          />
        </div>

        {/* Mobile Phone (+91 Indian Phone) */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-brand-orange" />
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 font-medium text-xs sm:text-sm">
              +91
            </span>
            <input
              type="tel"
              required
              value={formData.phone}
              onBlur={() => setPhoneTouched(true)}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="95525 37074"
              maxLength={14}
              className={`w-full bg-brand-grey border rounded-r-xl py-3 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-orange/40 transition-all ${
                phoneTouched && !isPhoneValid
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-gray-200 focus:border-brand-orange'
              }`}
            />
          </div>
          {phoneTouched && !isPhoneValid && (
            <span className="text-[11px] text-rose-600 mt-1 block">
              Please enter a valid 10-digit Indian phone number.
            </span>
          )}
        </div>

        {/* Email Address (Optional) */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-brand-orange" />
            Email Address <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="rajesh@example.com"
            className="w-full bg-brand-grey border border-gray-200 rounded-xl py-3 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all"
          />
        </div>

        {/* Enquiry Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-brand-orange" />
              Enquiry Type
            </label>
            <select
              value={formData.enquiryType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  enquiryType: e.target.value as any,
                })
              }
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-3 px-3 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
            >
              <option value="Site Visit">Schedule Site Visit</option>
              <option value="Price Details">Detailed Price Breakup</option>
              <option value="Floor Plan">Request Floor Plan / Brochure</option>
              <option value="General Enquiry">General Consultation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-orange" />
              Preferred Visit Date
            </label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-brand-charcoal"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Your Message <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover active:scale-[0.99] transition-all shadow-md hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Enquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Enquiry</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-gray-400">
          {crmSettings?.privacyText || 'Your details are protected. No spam or unauthorized sharing.'}
        </p>
      </form>
    </div>
  );
};
