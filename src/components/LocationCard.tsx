import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

interface LocationCardProps {
  name: string;
  tagline: string;
  image: string;
}

export const LocationCard: React.FC<LocationCardProps> = ({ name, tagline, image }) => {
  return (
    <Link
      to={`/properties?location=${encodeURIComponent(name)}`}
      className="group relative rounded-2xl overflow-hidden aspect-[4/3] p-4 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <img
        src={image}
        alt={`${name}, Pune`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-transparent group-hover:from-brand-charcoal/90 transition-colors" />

      <div className="relative z-10 flex justify-end">
        <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-brand-orange transition-colors">
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-1 text-xs text-brand-orange font-semibold mb-0.5">
          <MapPin className="w-3 h-3" />
          <span>Pune</span>
        </div>
        <h4 className="text-base font-bold text-white group-hover:text-brand-orange transition-colors">
          {name}
        </h4>
        <p className="text-[11px] text-gray-300 line-clamp-1">{tagline}</p>
      </div>
    </Link>
  );
};
