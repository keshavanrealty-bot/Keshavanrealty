import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  MessageSquare,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { businessConfig } from '../config/business';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { generateWhatsAppLink, validateIndianPhone } from '../utils/formatters';
import { enquiryService } from '../services/enquiryService';

export const Contact: React.FC = () => {
  const { settings } = useSiteSettings();
  const bInfo = settings.business_info || businessConfig;
  const crmSettings = settings.enquiry_crm;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: 'General Property Enquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const whatsappHref = generateWhatsAppLink(
    bInfo.whatsapp || businessConfig.whatsapp,
    crmSettings?.defaultWhatsAppMessage ||
      'Hello Keshavan Realty, I would like to enquire about properties in Pune.'
  );

  const mapEmbedUrl = (() => {
    if (bInfo.mapsLink && bInfo.mapsLink.includes('output=embed')) {
      return bInfo.mapsLink;
    }
    const query = encodeURIComponent(bInfo.officeAddress || 'Charoli, Pune, Maharashtra 412105');
    return `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!formData.phone.trim() || !validateIndianPhone(formData.phone)) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage('Please enter your message or property requirement.');
      return;
    }

    setLoading(true);
    try {
      const response = await enquiryService.submitPropertyEnquiry({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        enquiryType: 'General Enquiry',
        message: `[Subject: ${formData.subject}] ${formData.message}`,
      });
      setSuccessMessage(crmSettings?.customerAckMessage || response.message);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-grey/30 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
            Reach Out to Us
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-brand-charcoal tracking-tight">
            Contact {bInfo.name || 'Keshavan Realty'}
          </h1>
          <p className="text-sm text-brand-grey-text leading-relaxed">
            Have questions about buying, renting, or commercial opportunities in Pune? Our property
            desk is ready to assist you.
          </p>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-brand-charcoal text-base">Phone Consultation</h3>
              <p className="text-xs text-brand-grey-text">
                Speak directly with our Pune property advisor.
              </p>
            </div>
            <a
              href={`tel:${bInfo.phone}`}
              className="text-xs font-bold text-brand-orange hover:underline block pt-2"
            >
              {bInfo.displayPhone || bInfo.phone}
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-brand-charcoal text-base">WhatsApp Quick Chat</h3>
              <p className="text-xs text-brand-grey-text">
                Send instant property links and requirement notes.
              </p>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-600 hover:underline block pt-2"
            >
              Chat on WhatsApp &rarr;
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-brand-charcoal text-base">Email Us</h3>
              <p className="text-xs text-brand-grey-text">
                Send detailed briefs, brochures, or business inquiries.
              </p>
            </div>
            <a
              href={`mailto:${bInfo.email}`}
              className="text-xs font-bold text-brand-charcoal hover:text-brand-orange truncate block pt-2"
            >
              {bInfo.email}
            </a>
          </div>

          {/* Working Hours Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-brand-charcoal text-base">Office Hours</h3>
              <div className="text-xs text-brand-grey-text space-y-1">
                <p>Mon - Fri: {bInfo.workingHours?.weekdays || '9:30 AM - 7:30 PM'}</p>
                <p>Sat: {bInfo.workingHours?.saturday || '10:00 AM - 6:00 PM'}</p>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 font-medium pt-2 block">
              Sunday: {bInfo.workingHours?.sunday || 'Site Visits by Prior Appointment'}
            </span>
          </div>
        </div>

        {/* Main Grid: Contact Form & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-card">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-display font-bold text-brand-charcoal">
                Send a Message
              </h2>
              <p className="text-xs text-brand-grey-text">
                Fill in your details below and a Keshavan Realty representative will reach out to
                you within 24 business hours.
              </p>
            </div>

            {successMessage ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950">Message Sent!</h4>
                <p className="text-xs text-emerald-800">{successMessage}</p>
                <button
                  onClick={() => {
                    setSuccessMessage(null);
                    setFormData({
                      fullName: '',
                      phone: '',
                      email: '',
                      subject: 'General Property Enquiry',
                      message: '',
                    });
                  }}
                  className="text-xs font-bold text-emerald-700 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

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
                    placeholder="e.g. Anand Deshmukh"
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-3 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-brand-orange" />
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 font-medium text-xs">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="95525 37074"
                        className="w-full bg-brand-grey border border-gray-200 rounded-r-xl py-3 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-orange" />
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="anand@example.com"
                      className="w-full bg-brand-grey border border-gray-200 rounded-xl py-3 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-brand-orange" />
                    Subject / Area of Interest
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-3 px-3.5 text-xs sm:text-sm text-brand-charcoal"
                  >
                    <option value="General Property Enquiry">General Property Enquiry</option>
                    <option value="Residential Buying (Wakad / Baner / Ravet)">
                      Residential Buying (Wakad / Baner / Ravet)
                    </option>
                    <option value="Residential Rental Search">Residential Rental Search</option>
                    <option value="Commercial Office / Shop Inquiry">
                      Commercial Office / Shop Inquiry
                    </option>
                    <option value="Industrial Land / PEB Sheds">Industrial Land / PEB Sheds</option>
                    <option value="Plot Investment in Talegaon / Charholi">
                      Plot Investment in Talegaon / Charholi
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-brand-orange" />
                    Your Requirement or Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you are looking for (e.g. 2 BHK in Wakad under ₹90 Lakh)..."
                    className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange resize-none"
                  />
                </div>

                {crmSettings?.privacyText && (
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    {crmSettings.privacyText}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-all shadow-md hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to {bInfo.name || 'Keshavan Realty'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Office Location & Map (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-card space-y-4">
              <div className="flex items-center gap-2 text-brand-orange">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-brand-charcoal text-base">Our Pune Office</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                {bInfo.officeAddress}
              </p>
              <div className="pt-2 text-xs text-brand-grey-text space-y-1">
                <p>
                  <strong>City:</strong> {bInfo.city || businessConfig.city},{' '}
                  {bInfo.state || businessConfig.state}, {bInfo.country || businessConfig.country}
                </p>
                <p>
                  <strong>Phone:</strong> {bInfo.displayPhone || bInfo.phone}
                </p>
                <p>
                  <strong>Email:</strong> {bInfo.email}
                </p>
                {bInfo.reraNumber && (
                  <p>
                    <strong>MahaRERA:</strong> {bInfo.reraNumber}
                  </p>
                )}
              </div>
              {bInfo.mapsLink && (
                <a
                  href={bInfo.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:underline pt-2"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Google Maps Embed */}
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-card aspect-[4/3] relative group">
              <iframe
                title="Pune Office Location"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-brand-charcoal shadow-sm pointer-events-none">
                {bInfo.city || 'Pune'}, Maharashtra
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
