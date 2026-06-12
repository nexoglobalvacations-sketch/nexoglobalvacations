import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import apiService from '../../services/api';

import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiService.testimonials.getAll();
        if (response.data?.success) {
          setTestimonials(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading || testimonials.length === 0) return null;

  return (
    <section className="bg-pearl py-20 border-b border-black/5 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif text-primary">
            What Our <span className="font-bold">Travelers Say</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest mt-2">
            Real Stories from Real Luxury Journeys
          </p>
          <div className="h-1 w-24 bg-gold mx-auto mt-4 rounded-full" />
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-12"
        >
          {testimonials.map((test) => (
            <SwiperSlide key={test._id} className="focus:outline-none">
              <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-premium border border-black/5 space-y-6 max-w-3xl mx-auto relative">
                
                {/* Quote Icon */}
                <FaQuoteLeft className="text-gold/25 h-16 w-16 absolute -top-4 -left-2" />
                
                {/* Review */}
                <p className="text-gray-600 text-base sm:text-lg italic leading-relaxed relative z-10">
                  "{test.review}"
                </p>

                {/* Rating stars */}
                <div className="flex justify-center space-x-1">
                  {Array.from({ length: test.rating }).map((_, idx) => (
                    <FaStar key={idx} className="text-gold h-4 w-4" />
                  ))}
                </div>

                {/* Profile Card */}
                <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-100 w-fit mx-auto">
                  <img
                    src={test.image}
                    alt={test.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-gold shadow-md"
                  />
                  <div className="text-left">
                    <h4 className="font-serif font-bold text-primary">{test.name}</h4>
                    <span className="text-xs text-gray-400 font-semibold">{test.role}</span>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default Testimonials;
