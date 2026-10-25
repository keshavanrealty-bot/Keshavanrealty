import { useState, useEffect, useCallback } from 'react';
import { propertyService } from '../services/propertyService';
import { Property, PropertyFilterParams, PropertySortOption } from '../types/property';

export function useProperties(
  initialFilters?: PropertyFilterParams,
  initialSort: PropertySortOption = 'newest'
) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilterParams>(initialFilters || {});
  const [sort, setSort] = useState<PropertySortOption>(initialSort);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await propertyService.getProperties(filters, sort);
      setProperties(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError(err?.message || 'Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const updateFilters = (newFilters: Partial<PropertyFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return {
    properties,
    total,
    loading,
    error,
    filters,
    sort,
    setSort,
    updateFilters,
    setFilters,
    resetFilters,
    refetch: fetchProperties,
  };
}
