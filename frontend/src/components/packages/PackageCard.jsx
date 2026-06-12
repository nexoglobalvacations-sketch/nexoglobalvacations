import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiMapPin, FiArrowRight } from 'react-icons/fi';

const PackageCard = ({ pack }) => {
  if (!pack) return null;

  const {
    name,
    slug,
    price,
    duration,
    destination,
    thumbnail,
    category
  } = pack;

  // Derive location name safely (destination could be a populated object or a simple string)
  const locationName = typeof destination === 'object' && destination !== null
    ? destination.name
    : (destination || 'India');

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white rounded-2xl overflow-hidden shadow-premium hover:shadow-goldGlow border border-black/5 flex flex-col h-full group"
    >
      {/* Thumbnail Block */}
      <div className="h-64 overflow-hidden relative">
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[600ms] ease-out"
          loading="lazy"
        />
        {/* Category Label */}
        <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gold/20 shadow-md">
          {category}
        </div>
        {/* Duration Overlay Badge */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-primary text-[10px] font-bold px-3 py-1.5 rounded-md border border-gold/15 shadow flex items-center space-x-1">
          <FiClock className="text-gold" />
          <span>{duration}</span>
        </div>
      </div>

      {/* Info Block */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div className="space-y-2">
          {/* Destination */}
          <div className="flex items-center space-x-1.5 text-xs text-gray-400 font-semibold tracking-wide uppercase">
            <FiMapPin className="text-gold" />
            <span>{locationName}</span>
          </div>
          {/* Title */}
          <h3 className="text-lg font-serif font-bold text-primary group-hover:text-gold transition-colors line-clamp-2">
            {name}
          </h3>
        </div>

        {/* Pricing & CTA */}
        <div className="border-t border-gray-100 pt-5 mt-5 flex items-center justify-between">
          <div className="text-left">
            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Starting From</span>
            <span className="text-lg font-bold text-primary">
              ₹{price?.toLocaleString('en-IN') || 'TBA'}
            </span>
          </div>

          <Link
            to={`/packages/${slug}`}
            className="flex items-center space-x-1 bg-pearl border border-gold/20 hover:bg-primary hover:text-white hover:border-primary text-primary font-bold text-xs px-4 py-2.5 rounded-full shadow-sm transition-all group-hover:shadow focus:outline-none"
          >
            <span>Explore</span>
            <FiArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;
