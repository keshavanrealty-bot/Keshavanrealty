import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { MOCK_PROPERTIES } from '../data/properties';
import { formatIndianPrice } from '../utils/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  onToggleWishlist,
}) => {
  if (!isOpen) return null;

  const savedProperties = MOCK_PROPERTIES.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h3 className="font-bold text-brand-charcoal text-base">Saved Properties</h3>
              <p className="text-xs text-brand-grey-text">
                {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {savedProperties.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-700">No saved properties yet</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Click the heart icon on any property card to save it for quick review.
              </p>
              <Link
                to="/properties"
                onClick={onClose}
                className="inline-block mt-3 px-5 py-2 rounded-full bg-brand-charcoal text-white text-xs font-bold hover:bg-brand-orange transition-colors"
              >
                Browse Pune Properties
              </Link>
            </div>
          ) : (
            savedProperties.map((p) => (
              <div
                key={p.id}
                className="flex gap-3 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all bg-brand-grey/40"
              >
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-brand-charcoal truncate">{p.title}</h4>
                    <p className="text-[11px] text-gray-500 truncate">{p.location}, Pune</p>
                    <p className="text-xs font-extrabold text-brand-charcoal mt-1">
                      {formatIndianPrice(p.price, p.listingType)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Link
                      to={`/properties/${p.id}`}
                      onClick={onClose}
                      className="text-[11px] font-bold text-brand-orange hover:underline inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => onToggleWishlist(p.id)}
                      className="text-gray-400 hover:text-rose-600 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedProperties.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-2">
            <Link
              to="/properties"
              onClick={onClose}
              className="w-full block py-3 rounded-xl bg-brand-orange text-white text-xs font-bold text-center hover:bg-brand-orange-hover shadow transition-colors"
            >
              Continue Exploring Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
