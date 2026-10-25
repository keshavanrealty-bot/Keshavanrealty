/**
 * Indian Currency and Real Estate Formatter Utilities
 */

export function formatIndianPrice(amount: number, listingType: 'buy' | 'rent' | 'sale' = 'buy'): string {
  if (!amount || isNaN(amount)) return 'Price on Request';

  if (listingType === 'rent') {
    return `₹${amount.toLocaleString('en-IN')} / mo`;
  }

  if (amount >= 10000000) {
    const cr = amount / 10000000;
    // e.g. 1.25 Cr or 2 Cr
    const formatted = cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/\.?0+$/, '');
    return `₹${formatted} Cr`;
  }

  if (amount >= 100000) {
    const lakh = amount / 100000;
    const formatted = lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2).replace(/\.?0+$/, '');
    return `₹${formatted} Lakh`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatFullIndianCurrency(amount: number): string {
  if (!amount || isNaN(amount)) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatArea(area: number, unit: string = 'sq.ft'): string {
  return `${area.toLocaleString('en-IN')} ${unit}`;
}

export function validateIndianPhone(phone: string): boolean {
  // Cleans spaces, hyphens, and +91
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '').replace(/^\+91/, '').replace(/^0/, '');
  // Must be 10 digits starting with 6, 7, 8, or 9
  return /^[6-9]\d{9}$/.test(cleanPhone);
}

export function cleanIndianPhone(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '').replace(/^\+91/, '').replace(/^0/, '');
}

export function generateWhatsAppLink(phone: string, text: string): string {
  const cleanNumber = phone.replace(/[^\d]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export function generatePropertyShareUrl(propertyId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/properties/${propertyId}`;
  }
  return `/properties/${propertyId}`;
}
