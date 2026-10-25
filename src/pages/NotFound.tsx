import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-brand-grey/40 px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 text-center space-y-5 shadow-card">
        <div className="text-6xl font-display font-extrabold text-brand-orange">404</div>
        <h1 className="text-2xl font-bold text-brand-charcoal">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-brand-grey-text leading-relaxed">
          The property page or section you are looking for doesn&apos;t exist, has been moved, or the
          link was mistyped.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-charcoal hover:bg-brand-orange transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
          <Link
            to="/properties"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-brand-charcoal bg-brand-grey hover:bg-gray-200 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Browse Properties</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
