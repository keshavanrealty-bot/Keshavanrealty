import { useState, useEffect } from 'react';

const WISHLIST_STORAGE_KEY = 'keshavan_wishlist';

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const toggleWishlist = (propertyId: string) => {
    setWishlistIds((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
  };

  const isInWishlist = (propertyId: string) => wishlistIds.includes(propertyId);

  return {
    wishlistIds,
    wishlistCount: wishlistIds.length,
    toggleWishlist,
    isInWishlist,
  };
}
