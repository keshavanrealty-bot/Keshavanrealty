import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  CheckCircle2,
  Trash2,
  Building,
  RotateCcw,
  Loader2,
  ExternalLink,
  ClipboardList,
  MapPin,
  IndianRupee,
} from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { EnquiryRecord } from '../../types/property';
import { generateWhatsAppLink } from '../../utils/formatters';

export const AdminEnquiries: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<'enquiries' | 'submissions'>('enquiries');
  
  // Enquiries State
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSection === 'enquiries') {
        const data = await enquiryService.getEnquiries(statusFilter, searchQuery);
        setEnquiries(data);
      } else {
        const subs = await enquiryService.getOwnerSubmissions(statusFilter, searchQuery);
        setSubmissions(subs);
      }
    } catch (e) {
      console.warn('Failed to load enquiries/submissions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSection, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  // Enquiry Status Change
  const handleEnquiryStatusChange = async (
    enquiryId: string,
    newStatus: 'new' | 'contacted' | 'interested' | 'converted' | 'closed'
  ) => {
    try {
      await enquiryService.updateEnquiry(enquiryId, { status: newStatus });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
      setActionSuccess('Enquiry status updated.');
      setTimeout(() => setActionSuccess(null), 2500);
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // Submission Status Change
  const handleSubmissionStatusChange = async (
    subId: string,
    newStatus: 'pending_review' | 'verified' | 'listed' | 'rejected'
  ) => {
    try {
      await enquiryService.updateOwnerSubmission(subId, { status: newStatus });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === subId ? { ...s, status: newStatus } : s))
      );
      setActionSuccess('Property submission status updated.');
      setTimeout(() => setActionSuccess(null), 2500);
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleNotesChange = async (enquiryId: string, notes: string) => {
    try {
      if (activeSection === 'enquiries') {
        await enquiryService.updateEnquiry(enquiryId, { adminNotes: notes });
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, adminNotes: notes } : e))
        );
      } else {
        await enquiryService.updateOwnerSubmission(enquiryId, { adminNotes: notes });
        setSubmissions((prev) =>
          prev.map((s) => (s.id === enquiryId ? { ...s, adminNotes: notes } : s))
        );
      }
    } catch (err: any) {
      console.warn('Error saving notes:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      if (activeSection === 'enquiries') {
        await enquiryService.deleteEnquiry(id);
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      } else {
        await enquiryService.deleteOwnerSubmission(id);
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      }
      setActionSuccess('Record deleted successfully.');
      setTimeout(() => setActionSuccess(null), 2500);
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const enquiryFilterTabs = [
    { key: 'all', label: 'All Inquiries' },
    { key: 'new', label: 'New / Unhandled' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'interested', label: 'Interested' },
    { key: 'converted', label: 'Converted' },
    { key: 'closed', label: 'Closed' },
  ];

  const submissionFilterTabs = [
    { key: 'all', label: 'All Submissions' },
    { key: 'pending_review', label: 'Pending Review' },
    { key: 'verified', label: 'Verified' },
    { key: 'listed', label: 'Listed' },
    { key: 'rejected', label: 'Rejected' },
  ];

  const currentTabs = activeSection === 'enquiries' ? enquiryFilterTabs : submissionFilterTabs;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Section Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-charcoal tracking-tight">
            Customer Inquiries &amp; Property Leads
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
            Review customer requirements, manage owner submissions, or initiate instant calls and WhatsApp chats.
          </p>
        </div>

        {/* Section Segmented Control */}
        <div className="flex items-center p-1 bg-white border border-gray-200 rounded-2xl shadow-sm shrink-0">
          <button
            onClick={() => {
              setActiveSection('enquiries');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'enquiries'
                ? 'bg-brand-charcoal text-white shadow-sm'
                : 'text-gray-500 hover:text-brand-charcoal'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Buyer/Tenant Inquiries</span>
          </button>
          <button
            onClick={() => {
              setActiveSection('submissions');
              setStatusFilter('all');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'submissions'
                ? 'bg-brand-orange text-white shadow-sm'
                : 'text-gray-500 hover:text-brand-charcoal'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Owner Submissions</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-100">
          {currentTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                statusFilter === tab.key
                  ? activeSection === 'enquiries'
                    ? 'bg-brand-charcoal text-white shadow-sm'
                    : 'bg-brand-orange text-white shadow-sm'
                  : 'bg-brand-grey text-gray-600 hover:text-brand-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone or locality..."
              className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-xs text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <button
            onClick={() => fetchData()}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 self-end sm:self-auto"
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-gray-200">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-semibold">
              Loading {activeSection === 'enquiries' ? 'customer inquiries' : 'owner property submissions'}...
            </p>
          </div>
        ) : activeSection === 'enquiries' ? (
          /* Buyer/Tenant Inquiries */
          enquiries.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-gray-200">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
              <h4 className="text-base font-bold text-brand-charcoal">No customer inquiries found</h4>
              <p className="text-xs text-gray-400">
                When customers submit enquiries from property details pages or contact forms, they appear here.
              </p>
            </div>
          ) : (
            enquiries.map((enq) => {
              const whatsappUrl = generateWhatsAppLink(
                enq.phone,
                `Hello ${enq.customerName}, this is Keshavan Realty regarding your enquiry for "${enq.propertyTitle || 'Pune property'}".`
              );

              return (
                <div
                  key={enq.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:border-brand-orange/40 transition-all space-y-4"
                >
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-brand-orange-light text-brand-orange font-bold flex items-center justify-center shrink-0">
                        {enq.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-charcoal text-sm">{enq.customerName}</h3>
                        <span className="text-[11px] text-gray-400">
                          Received on{' '}
                          {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={enq.status}
                        onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value as any)}
                        className={`text-xs font-bold rounded-xl py-1.5 px-3 border cursor-pointer ${
                          enq.status === 'new'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : enq.status === 'contacted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : enq.status === 'interested'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : enq.status === 'converted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        <option value="new">New / Unhandled</option>
                        <option value="contacted">Contacted</option>
                        <option value="interested">Interested</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>

                      <button
                        onClick={() => handleDelete(enq.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Message & Property (8 cols) */}
                    <div className="md:col-span-8 space-y-3">
                      {enq.propertyTitle && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-grey text-xs font-medium text-brand-charcoal border border-gray-200">
                          <Building className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                          <span>Property: {enq.propertyTitle}</span>
                          {enq.propertyId && (
                            <Link
                              to={`/properties/${enq.propertyId}`}
                              target="_blank"
                              className="text-brand-orange hover:underline ml-1"
                            >
                              <ExternalLink className="w-3 h-3 inline" />
                            </Link>
                          )}
                        </div>
                      )}

                      <div className="p-3.5 rounded-2xl bg-brand-grey/50 border border-gray-100 text-xs sm:text-sm text-gray-800 leading-relaxed">
                        &ldquo;{enq.message}&rdquo;
                      </div>

                      {enq.preferredDate && (
                        <div className="flex items-center gap-1.5 text-xs text-brand-charcoal font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                          <span>Preferred Visit Date: {enq.preferredDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Contact Actions (4 cols) */}
                    <div className="md:col-span-4 bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Quick Contact Actions
                      </span>

                      <div className="flex flex-col gap-2">
                        {/* Direct Phone Call */}
                        <a
                          href={`tel:${enq.phone}`}
                          className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-brand-orange text-xs font-bold text-brand-charcoal transition-colors shadow-sm"
                        >
                          <span className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-brand-orange" />
                            <span>+91 {enq.phone}</span>
                          </span>
                          <span className="text-[10px] text-brand-orange uppercase">Call</span>
                        </a>

                        {/* WhatsApp Direct */}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors shadow-sm"
                        >
                          <span className="flex items-center gap-2">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Chat</span>
                          </span>
                          <span className="text-[10px] uppercase">Chat &rarr;</span>
                        </a>

                        {/* Email if available */}
                        {enq.email && (
                          <a
                            href={`mailto:${enq.email}`}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-xs font-medium text-gray-700 truncate"
                          >
                            <Mail className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                            <span className="truncate">{enq.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Private Notes */}
                  <div className="pt-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Internal Advisory Notes (Private)
                    </label>
                    <input
                      type="text"
                      defaultValue={enq.adminNotes || ''}
                      onBlur={(e) => handleNotesChange(enq.id, e.target.value)}
                      placeholder="Type private followup notes here and click outside to save..."
                      className="w-full bg-white border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-700 focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>
                </div>
              );
            })
          )
        ) : (
          /* Owner Listing Submissions */
          submissions.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-gray-200">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto" />
              <h4 className="text-base font-bold text-brand-charcoal">No owner property submissions found</h4>
              <p className="text-xs text-gray-400">
                When property owners submit listings via &quot;List Your Property&quot;, they appear here for verification.
              </p>
            </div>
          ) : (
            submissions.map((sub) => {
              const whatsappUrl = generateWhatsAppLink(
                sub.contactNumber,
                `Hello ${sub.ownerName}, this is Keshavan Realty regarding your property submission in ${sub.location}.`
              );

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:border-brand-orange/40 transition-all space-y-4"
                >
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-brand-orange font-bold flex items-center justify-center shrink-0">
                        {sub.ownerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-brand-charcoal text-sm">{sub.ownerName}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-charcoal text-white">
                            {sub.listingType}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-orange-light text-brand-orange">
                            {sub.propertyCategory}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          Submitted on{' '}
                          {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={sub.status}
                        onChange={(e) => handleSubmissionStatusChange(sub.id, e.target.value as any)}
                        className={`text-xs font-bold rounded-xl py-1.5 px-3 border cursor-pointer ${
                          sub.status === 'pending_review'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : sub.status === 'verified'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : sub.status === 'listed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-600 border-rose-200'
                        }`}
                      >
                        <option value="pending_review">Pending Review</option>
                        <option value="verified">Verified</option>
                        <option value="listed">Listed in Properties</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Submission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Property Specs (8 cols) */}
                    <div className="md:col-span-8 space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-brand-grey/60 p-2.5 rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-400 block font-semibold">Location / Area</span>
                          <span className="font-bold text-brand-charcoal flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                            {sub.location}
                          </span>
                        </div>
                        <div className="bg-brand-grey/60 p-2.5 rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-400 block font-semibold">Expected Price</span>
                          <span className="font-bold text-brand-charcoal flex items-center gap-1 mt-0.5">
                            <IndianRupee className="w-3.5 h-3.5 text-brand-orange" />
                            {sub.expectedPrice}
                          </span>
                        </div>
                        <div className="bg-brand-grey/60 p-2.5 rounded-xl border border-gray-100">
                          <span className="text-[10px] text-gray-400 block font-semibold">Property Area</span>
                          <span className="font-bold text-brand-charcoal mt-0.5 block">
                            {sub.propertyArea} {sub.areaUnit}
                          </span>
                        </div>
                      </div>

                      {sub.fullAddress && (
                        <p className="text-xs text-gray-600">
                          <strong>Address:</strong> {sub.fullAddress}
                        </p>
                      )}

                      {sub.description && (
                        <div className="p-3 rounded-2xl bg-brand-grey/40 border border-gray-100 text-xs text-gray-700 leading-relaxed">
                          {sub.description}
                        </div>
                      )}
                    </div>

                    {/* Contact Actions (4 cols) */}
                    <div className="md:col-span-4 bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Contact Owner
                      </span>

                      <div className="flex flex-col gap-2">
                        <a
                          href={`tel:${sub.contactNumber}`}
                          className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-brand-orange text-xs font-bold text-brand-charcoal transition-colors shadow-sm"
                        >
                          <span className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-brand-orange" />
                            <span>+91 {sub.contactNumber}</span>
                          </span>
                          <span className="text-[10px] text-brand-orange uppercase">Call</span>
                        </a>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors shadow-sm"
                        >
                          <span className="flex items-center gap-2">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Chat</span>
                          </span>
                          <span className="text-[10px] uppercase">Chat &rarr;</span>
                        </a>

                        {sub.email && (
                          <a
                            href={`mailto:${sub.email}`}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-xs font-medium text-gray-700 truncate"
                          >
                            <Mail className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                            <span className="truncate">{sub.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Private Notes */}
                  <div className="pt-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Internal Verification Notes (Private)
                    </label>
                    <input
                      type="text"
                      defaultValue={sub.adminNotes || ''}
                      onBlur={(e) => handleNotesChange(sub.id, e.target.value)}
                      placeholder="Type private verification/followup notes here..."
                      className="w-full bg-white border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-700 focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>
                </div>
              );
            })
          )
        )}
      </div>
    </div>
  );
};
