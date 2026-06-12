import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiCompass } from 'react-icons/fi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const Hero = () => {
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=1920&q=80',
      title: 'Timeless Spiritual Odysseys',
      subtitle: 'Experience the divine aarti and ancient ghats'
    },
    {
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1920&q=80',
      title: 'Serene Tropical Paradises',
      subtitle: 'Cruise backwaters in premium custom houseboats'
    },
    {
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
      title: 'Sun-Kissed Golden Coastlines',
      subtitle: 'Indulge in deluxe beachside boutique retreats'
    },
    {
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80',
      title: 'Majestic Mountain Retreats',
      subtitle: 'Explore cobalt blue lakes and highest peaks'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    let query = '';
    if (destination) query += `search=${destination}`;
    if (category) query += `${query ? '&' : ''}category=${category}`;
    navigate(`/packages?${query}`);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-primary-dark">
      {/* Background Slider */}
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1500}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full">
            {/* Slide Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[5000ms]"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Dark Mask Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary/45 to-transparent" />
            
            {/* Slide Typography */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-gold uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mb-4 drop-shadow-md"
              >
                {slide.subtitle}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-white text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-wide max-w-4xl leading-tight mb-8 drop-shadow-lg"
              >
                {slide.title}
              </motion.h1>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Floating search form matching reference screenshot perfectly */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-20">
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onSubmit={handleSearch}
          className="glassmorphism rounded-[2.5rem] shadow-premium p-4 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 border border-white/20"
        >
          {/* Where to Input */}
          <div className="flex items-center space-x-3 w-full md:w-auto px-4 py-2 border-r border-gray-200/50 last:border-0">
            <FiMapPin className="text-gold h-5 w-5 flex-shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Where To?</span>
              <input
                type="text"
                placeholder="Any Destination..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-transparent text-primary font-bold text-sm focus:outline-none placeholder-gray-400 w-full md:w-44"
              />
            </div>
          </div>

          {/* Category Input */}
          <div className="flex items-center space-x-3 w-full md:w-auto px-4 py-2 md:border-r border-gray-200/50 last:border-0">
            <FiCompass className="text-gold h-5 w-5 flex-shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Experience</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-primary font-bold text-sm focus:outline-none w-full md:w-44 cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="Honeymoon">Honeymoon</option>
                <option value="Spiritual">Spiritual</option>
                <option value="Beaches">Beaches</option>
                <option value="Mountains">Mountains</option>
                <option value="Adventure">Adventure</option>
                <option value="Luxury">Luxury</option>
                <option value="Group Tours">Group Tours</option>
              </select>
            </div>
          </div>

          {/* Search Journeys Action Button */}
          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center space-x-3 bg-[#1A1A1A] hover:bg-black text-white font-semibold rounded-full px-8 py-5 shadow-lg hover:shadow-goldGlow transition-all transform active:scale-95 cursor-pointer focus:outline-none"
          >
            <span className="text-xs uppercase tracking-widest">Search Journeys</span>
            <FiSearch className="h-4 w-4 text-gold" />
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Hero;
