import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PropertyCategory } from '../types/property';

interface CategoryCardProps {
  title: PropertyCategory;
  description: string;
  image: string;
  count: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  image,
  count,
}) => {
  return (
    <Link
      to={`/properties?category=${encodeURIComponent(title)}`}
      className="group relative flex flex-col justify-between h-72 sm:h-80 rounded-3xl overflow-hidden p-6 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1.5 focus:outline-none"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/60 to-black/30 group-hover:from-brand-charcoal/95 group-hover:via-brand-charcoal/75 transition-all duration-300" />

      {/* Top Tag & Count */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
          {count} {count === 1 ? 'Listing' : 'Listings'}
        </span>
        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-all transform group-hover:rotate-45">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 space-y-2">
        <h3 className="text-xl font-display font-bold text-white group-hover:text-brand-orange transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-brand-orange transition-colors">
            <span>Explore Properties</span>
            <span>&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
};
