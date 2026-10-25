import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Loader2,
  MapPin,
  Building,
} from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import { Property, PropertyCategory, PropertyStatus, ListingType } from '../../types/property';
import { formatIndianPrice } from '../../utils/formatters';

export const AdminProperties: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteModalProp, setDeleteModalProp] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyService.getProperties(
        {
          status: statusFilter === 'all' ? undefined : (statusFilter as PropertyStatus),
          category: categoryFilter === 'all' ? undefined : (categoryFilter as PropertyCategory),
          searchQuery: searchQuery.trim() || undefined,
        },
        'newest',
        { isAdmin: true, limit: 100 }
      );
      setProperties(response.data);
    } catch (e) {
      console.warn('Failed to fetch properties:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  // Quick Status Change directly from table
  const handleStatusChange = async (propertyId: string, newStatus: PropertyStatus) => {
    try {
      await propertyService.updateProperty(propertyId, { status: newStatus });
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
      );
      setActionSuccess(`Status updated to ${newStatus}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // Quick Featured Toggle
  const handleToggleFeatured = async (property: Property) => {
    try {
      const updatedVal = !property.featured;
      await propertyService.updateProperty(property.id, { featured: updatedVal });
      setProperties((prev) =>
        prev.map((p) => (p.id === property.id ? { ...p, featured: updatedVal } : p))
      );
      setActionSuccess(`Featured status ${updatedVal ? 'enabled' : 'disabled'}`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(`Error toggling featured: ${err.message}`);
    }
  };

  // Safe Delete with Storage Cleanup
  const handleConfirmDelete = async () => {
    if (!deleteModalProp) return;
    setIsDeleting(true);
    try {
      await propertyService.deleteProperty(deleteModalProp.id);
      setProperties((prev) => prev.filter((p) => p.id !== deleteModalProp.id));
      setDeleteModalProp(null);
      setActionSuccess(`Property "${deleteModalProp.title}" deleted.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(`Failed to delete property: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const categories = propertyService.getCategories();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-charcoal tracking-tight">
            Manage Properties
          </h2>
          <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
            Browse, filter, edit, publish, and delete live listings in your Supabase database.
          </p>
        </div>

        <Link
          to="/admin/properties/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, locality or ID..."
            className="w-full bg-brand-grey border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-xs sm:text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-orange/40"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-brand-grey border border-gray-200 text-brand-charcoal text-xs rounded-xl py-2 px-3 font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available (Public)</option>
            <option value="draft">Draft (Hidden)</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-brand-grey border border-gray-200 text-brand-charcoal text-xs rounded-xl py-2 px-3 font-semibold"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.title} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <button
            onClick={() => fetchProperties()}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
            title="Refresh Table"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-semibold">Loading properties from Supabase...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Building className="w-12 h-12 text-gray-300 mx-auto" />
            <h4 className="text-base font-bold text-brand-charcoal">No properties match your filter</h4>
            <p className="text-xs text-gray-400">
              Try resetting your filters or add a new property to your database.
            </p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-brand-orange hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-grey/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Thumbnail + Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-14 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-brand-charcoal truncate max-w-xs sm:max-w-sm hover:text-brand-orange">
                            <Link to={`/admin/properties/${property.id}/edit`}>
                              {property.title}
                            </Link>
                          </h4>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {property.propertyCode || property.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-gray-700 font-medium whitespace-nowrap">
                      {property.propertyType}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-orange shrink-0" />
                        <span>{property.location}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-brand-charcoal whitespace-nowrap">
                      {formatIndianPrice(property.price, property.listingType as any)}
                    </td>

                    {/* Listing Type (Buy/Rent) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          property.listingType === 'buy' || property.listingType === 'sale'
                            ? 'bg-brand-charcoal text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {property.listingType === 'buy' || property.listingType === 'sale' ? 'Sale' : 'Rent'}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={property.status}
                        onChange={(e) =>
                          handleStatusChange(property.id, e.target.value as PropertyStatus)
                        }
                        className={`text-[11px] font-bold rounded-lg py-1 px-2 border cursor-pointer ${
                          property.status === 'available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : property.status === 'draft'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : property.status === 'sold'
                            ? 'bg-purple-50 text-purple-700 border-purple-300'
                            : property.status === 'rented'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-gray-100 text-gray-600 border-gray-300'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="draft">Draft</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>

                    {/* Featured Star Toggle */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(property)}
                        className={`p-1.5 rounded-full transition-colors ${
                          property.featured
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                        title={property.featured ? 'Featured on Homepage' : 'Mark as Featured'}
                      >
                        <Star className={`w-4 h-4 ${property.featured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          to={`/properties/${property.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                          title="View on Public Site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/properties/${property.id}/edit`}
                          className="p-1.5 rounded-lg bg-brand-orange-light text-brand-orange hover:bg-brand-orange hover:text-white transition-colors"
                          title="Edit Property"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteModalProp(property)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-brand-charcoal">Delete Property?</h3>
              <p className="text-xs text-brand-grey-text leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <strong className="text-brand-charcoal">&ldquo;{deleteModalProp.title}&rdquo;</strong>?
                This will delete the database record and clean up its associated storage photos.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalProp(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
