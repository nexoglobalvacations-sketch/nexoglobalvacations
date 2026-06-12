import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import apiService from '../../services/api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ExploreStates = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await apiService.destinations.getAll();
        if (response.data?.success) {
          setDestinations(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading || destinations.length === 0) return null;

  const states = destinations.filter((d) => d.type === 'state');
  const countries = destinations.filter((d) => d.type === 'country');

  const handleDestClick = (destName) => {
    navigate(`/packages?destination=${encodeURIComponent(destName)}`);
  };

  return (
    <div className="py-20 bg-[#F4F6F9] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* 1. Explore States Section */}
        {states.length > 0 && (
          <section className="space-y-10">
            {/* Header row with heading and Explore All Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 text-left border-b border-black/5 pb-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-serif text-primary">
                  Explore <span className="font-bold text-primary-light">States in India</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest mt-2">
                  Handpicked weekend escapes and journeys designed for you
                </p>
                <div className="h-1 w-20 bg-gold mt-3 rounded-full" />
              </div>
              <button
                onClick={() => navigate('/destinations?type=state')}
                className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-dark transition-colors border-b border-gold/30 hover:border-gold-dark pb-1 cursor-pointer"
              >
                Explore All States
              </button>
            </div>

            {/* Slider for India States */}
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }}
              className="py-4 px-2"
            >
              {states.map((state) => (
                <SwiperSlide key={state._id} className="h-auto">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleDestClick(state.name)}
                    className="relative h-72 rounded-2xl overflow-hidden shadow-premium group cursor-pointer"
                  >
                    <img
                      src={state.image}
                      alt={state.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[600ms] ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-left">
                      <h3 className="text-xl font-serif font-bold text-white group-hover:text-gold transition-colors">
                        {state.name}
                      </h3>
                      <p className="text-xs text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity line-clamp-1">
                        {state.description}
                      </p>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

        {/* 2. Explore Countries Section */}
        {countries.length > 0 && (
          <section className="space-y-10">
            {/* Header row with heading and Explore All Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 text-left border-b border-black/5 pb-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-serif text-primary">
                  Explore <span className="font-bold text-primary-light">Beyond India</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest mt-2">
                  Exotic global gateways curated for your bucket list
                </p>
                <div className="h-1 w-20 bg-gold mt-3 rounded-full" />
              </div>
              <button
                onClick={() => navigate('/destinations?type=country')}
                className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-dark transition-colors border-b border-gold/30 hover:border-gold-dark pb-1 cursor-pointer"
              >
                Explore All International
              </button>
            </div>

            {/* Slider for International Destinations */}
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }}
              className="py-4 px-2"
            >
              {countries.map((country) => (
                <SwiperSlide key={country._id} className="h-auto">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleDestClick(country.name)}
                    className="relative h-72 rounded-2xl overflow-hidden shadow-premium group cursor-pointer"
                  >
                    <img
                      src={country.image}
                      alt={country.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[600ms] ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-left">
                      <h3 className="text-xl font-serif font-bold text-white group-hover:text-gold transition-colors">
                        {country.name}
                      </h3>
                      <p className="text-xs text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity line-clamp-1">
                        {country.description}
                      </p>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

      </div>
    </div>
  );
};

export default ExploreStates;

