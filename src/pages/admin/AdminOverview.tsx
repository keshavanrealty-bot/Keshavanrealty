import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  CheckCircle2,
  FileEdit,
  Tag,
  KeyRound,
  Star,
  MessageSquare,
  BellRing,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import { enquiryService } from '../../services/enquiryService';
import { AdminDashboardStats, EnquiryRecord } from '../../types/property';
import { generateWhatsAppLink } from '../../utils/formatters';

export const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalProperties: 0,
    availableProperties: 0,
    draftProperties: 0,
    soldProperties: 0,
    rentedProperties: 0,
    featuredProperties: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [statsData, enquiriesData] = await Promise.all([
          propertyService.getAdminStats(),
          enquiryService.getEnquiries('all'),
        ]);
        setStats(statsData);
        setRecentEnquiries(enquiriesData.slice(0, 5));
      } catch (e) {
        console.warn('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const statCards = [
    {
      label: 'Total Properties',
      value: stats.totalProperties,
      icon: Building,
      color: 'bg-brand-charcoal text-white',
      link: '/admin/properties',
    },
    {
      label: 'Available Listings',
      value: stats.availableProperties,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      link: '/admin/properties?status=available',
    },
    {
      label: 'Draft Properties',
      value: stats.draftProperties,
      icon: FileEdit,
      color: 'bg-amber-50 text-amber-700 border border-amber-200',
      link: '/admin/properties?status=draft',
    },
    {
      label: 'Sold Properties',
      value: stats.soldProperties,
      icon: Tag,
      color: 'bg-purple-50 text-purple-700 border border-purple-200',
      link: '/admin/properties?status=sold',
    },
    {
      label: 'Rented Properties',
      value: stats.rentedProperties,
      icon: KeyRound,
      color: 'bg-blue-50 text-blue-700 border border-blue-200',
      link: '/admin/properties?status=rented',
    },
    {
      label: 'Featured Listings',
      value: stats.featuredProperties,
      icon: Star,
      color: 'bg-brand-orange-light text-brand-orange border border-brand-orange/30',
      link: '/admin/properties',
    },
    {
      label: 'Total Enquiries',
      value: stats.totalEnquiries,
      icon: MessageSquare,
      color: 'bg-gray-100 text-gray-800 border border-gray-200',
      link: '/admin/enquiries',
    },
    {
      label: 'New Unhandled Leads',
      value: stats.newEnquiries,
      icon: BellRing,
      color: 'bg-rose-50 text-rose-700 border border-rose-200',
      link: '/admin/enquiries?status=new',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block mb-1">
            Real-time Database Dashboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-charcoal tracking-tight">
            Keshavan Realty Overview
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
            Live properties, storage, and customer leads directly synchronized with Supabase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/properties/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Property</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-brand-charcoal bg-brand-grey hover:bg-gray-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>View Inquiries</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Public Site</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className={`p-5 rounded-3xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ${card.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold">{card.label}</span>
                <Icon className="w-5 h-5 shrink-0 opacity-80" />
              </div>
              <div className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
                {loading ? '...' : card.value}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries & Quick Access */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-brand-charcoal">Recent Customer Inquiries</h3>
            <p className="text-xs text-brand-grey-text">
              Direct inquiries submitted from property details and contact forms
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
          >
            <span>View All ({stats.totalEnquiries})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-gray-400">Loading recent enquiries...</div>
        ) : recentEnquiries.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-600">No enquiries received yet</p>
            <p className="text-xs text-gray-400">
              When customers submit property inquiries on your website, they will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Property Reference</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentEnquiries.map((enq) => {
                  const whatsappLink = generateWhatsAppLink(
                    enq.phone,
                    `Hello ${enq.customerName}, this is Keshavan Realty regarding your enquiry.`
                  );

                  return (
                    <tr key={enq.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 font-bold text-brand-charcoal">{enq.customerName}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${enq.phone}`}
                            className="font-medium text-gray-700 hover:text-brand-orange flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-brand-orange" />
                            {enq.phone}
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-600 truncate max-w-xs">
                        {enq.propertyTitle || 'General Consultation'}
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                          {enq.enquiryType}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            enq.status === 'new'
                              ? 'bg-rose-100 text-rose-700'
                              : enq.status === 'contacted'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-gray-400">
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <Link
                            to="/admin/enquiries"
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                            title="Manage Enquiry"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
