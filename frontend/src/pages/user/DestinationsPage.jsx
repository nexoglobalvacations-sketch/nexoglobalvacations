import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiGrid, FiArrowRight, FiMapPin } from 'react-icons/fi';
import apiService from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Read query parameters
  const queryParams = new URLSearchParams(location.search);
  const destType = queryParams.get('type') || 'state'; // default to state

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const response = await apiService.destinations.getAll();
        if (response.data?.success) {
          // Filter by destination type (state or country)
          const filtered = response.data.data.filter(d => d.type === destType);
          setDestinations(filtered);
        }
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [destType]);

  const handleDestClick = (destName) => {
    navigate(`/packages?destination=${encodeURIComponent(destName)}`);
  };

  // Filter based on search query
  const filteredDests = destinations.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const titleText = destType === 'state' ? 'Indian States & Escapes' : 'Exotic Countries Beyond India';
  const subtitleText = destType === 'state' 
    ? 'Discover domestic treasures from sun-kissed beaches to majestic snow peaks' 
    : 'Curated global gateways and exotic escapes across international borders';

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-black/5 pb-8">
        <div className="text-left space-y-2 max-w-2xl">
          <span className="text-xs font-bold text-gold uppercase tracking-widest flex items-center space-x-1">
            <FiMapPin className="h-3.5 w-3.5" />
            <span>Curated Gateways</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-primary font-bold">
            {titleText}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pt-1">
            {subtitleText}
          </p>
          <div className="h-1 w-20 bg-gold mt-3 rounded-full animate-pulse" />
        </div>

        {/* 2. Real-time Search Box */}
        <div className="relative mt-6 md:mt-0 w-full md:w-72">
          <FiSearch className="absolute left-4 top-3.5 h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${destType === 'state' ? 'states' : 'countries'}...`}
            className="w-full bg-white border border-black/5 shadow-premium pl-11 pr-4 py-3 rounded-full text-xs text-primary focus:outline-none focus:border-gold transition-colors font-semibold"
          />
        </div>
      </div>

      {/* 3. Main Destinations Grid */}
      {loading ? (
        <SkeletonLoader count={8} />
      ) : filteredDests.length === 0 ? (
        <div className="bg-white border border-black/5 p-16 rounded-3xl text-center space-y-4 shadow-premium">
          <span className="text-4xl">🗺️</span>
          <h3 className="text-xl font-bold font-serif text-primary">No Destinations Found</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            We couldn't find any destinations matching "{searchQuery}". Try modifying your search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDests.map((dest, index) => (
            <motion.div
              key={dest._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              onClick={() => handleDestClick(dest.name)}
              className="bg-white rounded-3xl overflow-hidden shadow-premium border border-black/5 flex flex-col h-full group cursor-pointer"
            >
              {/* Image & Type Badge */}
              <div className="h-56 relative overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent" />
                <span className="absolute top-4 left-4 bg-gold text-primary font-bold text-[9px] uppercase px-3 py-1 rounded-full border border-gold/15 tracking-wider shadow">
                  {dest.type === 'state' ? 'State' : 'Country'}
                </span>
              </div>

              {/* Text Description Block */}
              <div className="p-6 flex-grow flex flex-col justify-between text-left space-y-3">
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-lg text-primary group-hover:text-gold transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {dest.description}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-gold text-[10px] font-bold uppercase tracking-wider group-hover:text-gold-dark transition-colors">
                  <span>Explore Packages</span>
                  <FiArrowRight className="h-4.5 w-4.5 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};

export default DestinationsPage;
