import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  RotateCcw,
  Home,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyFilters } from '../components/PropertyFilters';
import { useProperties } from '../hooks/useProperties';
import { useSiteSettings } from '../context/SiteSettingsContext';
import {
  Property,
  PropertyCategory,
  CategoryGroup,
  ListingType,
  PropertySortOption,
} from '../types/property';

interface PropertiesPageProps {
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onQuickEnquire: (property: Property) => void;
}

export const Properties: React.FC<PropertiesPageProps> = ({
  wishlistIds,
  onToggleWishlist,
  onQuickEnquire,
}) => {
  const { settings } = useSiteSettings();
  const defaultPageLimit = settings.property_display?.itemsPerPage || 9;
  const defaultSortOrder = (settings.property_display?.defaultSort || 'newest') as PropertySortOption;

  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pageSize, setPageSize] = useState(defaultPageLimit);

  // Initialize hook
  const {
    properties,
    total,
    loading,
    filters,
    sort,
    setSort,
    updateFilters,
    setFilters,
    resetFilters,
  } = useProperties();

  // Apply default sort from site settings on initial mount if not already customized
  useEffect(() => {
    if (defaultSortOrder && sort === 'newest' && defaultSortOrder !== 'newest') {
      setSort(defaultSortOrder);
    }
  }, [defaultSortOrder, setSort]);

  useEffect(() => {
    if (defaultPageLimit && defaultPageLimit !== 9) {
      setPageSize(defaultPageLimit);
    }
  }, [defaultPageLimit]);

  // Parse URL search params on mount or when searchParams change
  useEffect(() => {
    const newFilters: any = {};

    const type = searchParams.get('type') as ListingType | null;
    if (type) newFilters.listingType = type;

    const group = searchParams.get('group') as CategoryGroup | null;
    if (group) newFilters.categoryGroup = group;

    const category = searchParams.get('category') as PropertyCategory | null;
    if (category) newFilters.category = category;

    const location = searchParams.get('location');
    if (location) newFilters.location = location;

    const minPrice = searchParams.get('minPrice');
    if (minPrice) newFilters.minPrice = Number(minPrice);

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) newFilters.maxPrice = Number(maxPrice);

    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms) newFilters.bedrooms = bedrooms === 'any' ? 'any' : Number(bedrooms);

    const q = searchParams.get('q');
    if (q) newFilters.searchQuery = q;

    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, [searchParams, setFilters]);

  const handleSearchText = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('query') as string;
    updateFilters({ searchQuery: q });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as PropertySortOption);
  };

  // Visible sliced properties for "Load More"
  const visibleProperties = properties.slice(0, pageSize);
  const hasMore = pageSize < properties.length;

  return (
    <div className="min-h-screen bg-brand-grey/40 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-brand-grey-text">
          <Link to="/" className="hover:text-brand-orange flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-brand-charcoal font-semibold">Properties in Pune</span>
          {filters.location && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-brand-orange font-semibold">{filters.location}</span>
            </>
          )}
        </nav>

        {/* Page Heading & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-brand-charcoal tracking-tight">
              Explore Properties in Pune
            </h1>
            <p className="text-xs sm:text-sm text-brand-grey-text mt-1">
              Showing <span className="font-bold text-brand-charcoal">{total}</span> verified
              properties matching your criteria
            </p>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchText} className="relative w-full md:w-80">
            <input
              type="text"
              name="query"
              defaultValue={filters.searchQuery || ''}
              placeholder="Search by area, title or ID..."
              className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-brand-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange shadow-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Action Controls Bar (Mobile Filter Toggle, Sorting, View Toggle) */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-3 sm:p-4 shadow-sm flex items-center justify-between gap-3 flex-wrap">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-charcoal hover:bg-brand-orange transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters ({total})</span>
          </button>

          {/* Active Filter summary tags */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap text-xs">
            {filters.listingType && filters.listingType !== 'all' && (
              <span className="bg-brand-grey px-3 py-1 rounded-full text-brand-charcoal font-medium border border-gray-200 flex items-center gap-1">
                Type: {filters.listingType === 'buy' ? 'For Sale' : 'For Rent'}
                <button
                  onClick={() => updateFilters({ listingType: 'all' })}
                  className="hover:text-rose-500 font-bold ml-1"
                >
                  &times;
                </button>
              </span>
            )}
            {filters.category && filters.category !== 'all' && (
              <span className="bg-brand-grey px-3 py-1 rounded-full text-brand-charcoal font-medium border border-gray-200 flex items-center gap-1">
                Category: {filters.category}
                <button
                  onClick={() => updateFilters({ category: 'all' })}
                  className="hover:text-rose-500 font-bold ml-1"
                >
                  &times;
                </button>
              </span>
            )}
            {filters.location && (
              <span className="bg-brand-grey px-3 py-1 rounded-full text-brand-charcoal font-medium border border-gray-200 flex items-center gap-1">
                Loc: {filters.location}
                <button
                  onClick={() => updateFilters({ location: undefined })}
                  className="hover:text-rose-500 font-bold ml-1"
                >
                  &times;
                </button>
              </span>
            )}
            {filters.searchQuery && (
              <span className="bg-brand-orange-light px-3 py-1 rounded-full text-brand-orange font-medium border border-brand-orange/30 flex items-center gap-1">
                &ldquo;{filters.searchQuery}&rdquo;
                <button
                  onClick={() => updateFilters({ searchQuery: undefined })}
                  className="hover:text-rose-500 font-bold ml-1"
                >
                  &times;
                </button>
              </span>
            )}
          </div>

          {/* Right Sort & View Controls */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              <label htmlFor="sort-select" className="text-xs font-semibold text-gray-500 hidden sm:block">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={handleSortChange}
                className="bg-brand-grey border border-gray-200 text-brand-charcoal text-xs rounded-xl py-2 px-3 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="area-asc">Area: Smallest First</option>
                <option value="area-desc">Area: Largest First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-brand-grey p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-brand-charcoal shadow-sm'
                    : 'text-gray-400 hover:text-brand-charcoal'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-brand-charcoal shadow-sm'
                    : 'text-gray-400 hover:text-brand-charcoal'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Sidebar + Results) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (4 Cols) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24">
            <PropertyFilters
              filters={filters}
              onFilterChange={updateFilters}
              onReset={resetFilters}
              totalResults={total}
            />
          </aside>

          {/* Results Column (8 Cols) */}
          <main className="lg:col-span-8 space-y-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-3xl p-4 border border-gray-200 animate-pulse space-y-4"
                  >
                    <div className="aspect-[16/10] bg-gray-200 rounded-2xl" />
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-brand-orange-light text-brand-orange rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-brand-charcoal">
                  No Properties Match Your Search
                </h3>
                <p className="text-xs sm:text-sm text-brand-grey-text max-w-md mx-auto leading-relaxed">
                  We couldn&apos;t find properties matching the selected filters. Try broadening your
                  budget, choosing a different location, or clearing all active filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors shadow"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 gap-6'
                      : 'grid grid-cols-1 gap-6'
                  }
                >
                  {visibleProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      isWishlisted={wishlistIds.includes(property.id)}
                      onToggleWishlist={onToggleWishlist}
                      onQuickEnquire={onQuickEnquire}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setPageSize((prev) => prev + 6)}
                      className="px-8 py-3 rounded-full text-xs font-bold text-brand-charcoal bg-white border border-gray-200 hover:bg-brand-charcoal hover:text-white transition-all shadow-sm"
                    >
                      Load More Properties ({properties.length - visibleProperties.length} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-md bg-white h-full overflow-y-auto p-4 shadow-2xl">
              <PropertyFilters
                filters={filters}
                onFilterChange={updateFilters}
                onReset={resetFilters}
                totalResults={total}
                isMobile={true}
                onCloseMobile={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
