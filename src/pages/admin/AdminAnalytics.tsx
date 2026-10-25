import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Building,
  CheckCircle2,
  Users,
  TrendingUp,
  Tag,
  KeyRound,
  FileEdit,
  Star,
  MapPin,
  Calendar,
  Loader2,
  RotateCcw,
  Clock,
  ArrowUpRight,
  ClipboardList,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { propertyService } from '../../services/propertyService';

export const AdminAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    draftProperties: 0,
    soldProperties: 0,
    rentedProperties: 0,
    featuredProperties: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    contactedEnquiries: 0,
    interestedEnquiries: 0,
    convertedEnquiries: 0,
    closedEnquiries: 0,
    totalSubmissions: 0,
  });

  const [categoryBreakdown, setCategoryBreakdown] = useState<{ [cat: string]: number }>({});
  const [locationBreakdown, setLocationBreakdown] = useState<{ [loc: string]: number }>({});
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // 1. Fetch properties
      const { data: propRows } = await supabase.from('properties').select('status, featured, property_type, locality');
      const props = propRows || [];

      // 2. Fetch enquiries
      const { data: enqRows } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      const enqs = enqRows || [];

      // 3. Fetch owner submissions
      const { data: subRows } = await supabase.from('owner_submissions').select('id');
      const subs = subRows || [];

      // Calculate totals
      const totalProps = props.length;
      const availProps = props.filter((p) => p.status === 'available').length;
      const draftProps = props.filter((p) => p.status === 'draft').length;
      const soldProps = props.filter((p) => p.status === 'sold').length;
      const rentedProps = props.filter((p) => p.status === 'rented').length;
      const featProps = props.filter((p) => p.featured).length;

      const totalEnq = enqs.length;
      const newEnq = enqs.filter((e) => e.status === 'new').length;
      const contactedEnq = enqs.filter((e) => e.status === 'contacted').length;
      const interestedEnq = enqs.filter((e) => e.status === 'interested').length;
      const convertedEnq = enqs.filter((e) => e.status === 'converted').length;
      const closedEnq = enqs.filter((e) => e.status === 'closed').length;

      // Category breakdown from properties
      const catCount: { [cat: string]: number } = {};
      props.forEach((p) => {
        const cat = p.property_type || 'Unspecified';
        catCount[cat] = (catCount[cat] || 0) + 1;
      });

      // Location breakdown from properties
      const locCount: { [loc: string]: number } = {};
      props.forEach((p) => {
        const loc = p.locality || 'Pune';
        locCount[loc] = (locCount[loc] || 0) + 1;
      });

      setStats({
        totalProperties: totalProps,
        availableProperties: availProps,
        draftProperties: draftProps,
        soldProperties: soldProps,
        rentedProperties: rentedProps,
        featuredProperties: featProps,
        totalEnquiries: totalEnq,
        newEnquiries: newEnq,
        contactedEnquiries: contactedEnq,
        interestedEnquiries: interestedEnq,
        convertedEnquiries: convertedEnq,
        closedEnquiries: closedEnq,
        totalSubmissions: subs.length,
      });

      setCategoryBreakdown(catCount);
      setLocationBreakdown(locCount);
      setRecentLeads(enqs.slice(0, 6));
    } catch (e) {
      console.warn('Error fetching analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const conversionRate =
    stats.totalEnquiries > 0
      ? ((stats.convertedEnquiries / stats.totalEnquiries) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-charcoal tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-brand-orange" />
            <span>Analytics &amp; Business Insights</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
            Real-time business performance analytics calculated strictly from live PostgreSQL records.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center space-y-3 bg-white rounded-3xl border border-gray-200">
          <Loader2 className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-semibold">Aggregating live database metrics...</p>
        </div>
      ) : (
        <>
          {/* Top KPI Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Total Catalog</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal font-display">
                  {stats.totalProperties}
                </span>
                <Building className="w-4 h-4 text-brand-orange" />
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">{stats.availableProperties} Available</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Customer Leads</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal font-display">
                  {stats.totalEnquiries}
                </span>
                <Users className="w-4 h-4 text-brand-orange" />
              </div>
              <span className="text-[11px] text-rose-600 font-semibold">{stats.newEnquiries} New Leads</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Conversion Rate</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">
                  {conversionRate}%
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-[11px] text-gray-400 font-medium">{stats.convertedEnquiries} Closed Won</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Owner Submissions</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal font-display">
                  {stats.totalSubmissions}
                </span>
                <ClipboardList className="w-4 h-4 text-brand-orange" />
              </div>
              <span className="text-[11px] text-blue-600 font-semibold">List Your Property</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Sold &amp; Rented</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal font-display">
                  {stats.soldProperties + stats.rentedProperties}
                </span>
                <Tag className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-[11px] text-purple-700 font-medium">Completed Deals</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Featured Listings</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-display">
                  {stats.featuredProperties}
                </span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <span className="text-[11px] text-gray-400 font-medium">Homepage Spotlight</span>
            </div>
          </div>

          {/* Breakdown Sections: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Category Distribution */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-brand-charcoal text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-brand-orange" />
                  <span>Properties by Category</span>
                </h3>
                <span className="text-xs text-gray-400 font-medium">{Object.keys(categoryBreakdown).length} types</span>
              </div>

              <div className="space-y-3">
                {Object.entries(categoryBreakdown).map(([cat, count]) => {
                  const pct = stats.totalProperties > 0 ? ((count / stats.totalProperties) * 100).toFixed(0) : '0';

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-gray-700">{cat}</span>
                        <span className="text-gray-500 font-semibold">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-brand-orange rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pune Localities Distribution */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-brand-charcoal text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-orange" />
                  <span>Properties by Pune Micro-Market</span>
                </h3>
                <span className="text-xs text-gray-400 font-medium">{Object.keys(locationBreakdown).length} areas</span>
              </div>

              <div className="space-y-3">
                {Object.entries(locationBreakdown).slice(0, 8).map(([loc, count]) => {
                  const pct = stats.totalProperties > 0 ? ((count / stats.totalProperties) * 100).toFixed(0) : '0';

                  return (
                    <div key={loc} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-gray-700">{loc}</span>
                        <span className="text-gray-500 font-semibold">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-brand-charcoal rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lead Pipeline Distribution */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-charcoal text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
              <Clock className="w-4 h-4 text-brand-orange" />
              <span>Lead Pipeline Status Distribution</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">New / Unhandled</span>
                <span className="text-2xl font-extrabold text-rose-700 font-display mt-1 block">{stats.newEnquiries}</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Contacted</span>
                <span className="text-2xl font-extrabold text-blue-700 font-display mt-1 block">{stats.contactedEnquiries}</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Interested</span>
                <span className="text-2xl font-extrabold text-amber-700 font-display mt-1 block">{stats.interestedEnquiries}</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Converted (Won)</span>
                <span className="text-2xl font-extrabold text-emerald-700 font-display mt-1 block">{stats.convertedEnquiries}</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Closed</span>
                <span className="text-2xl font-extrabold text-gray-700 font-display mt-1 block">{stats.closedEnquiries}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
