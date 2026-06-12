import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import PackageCard from '../packages/PackageCard';
import SkeletonLoader from '../common/SkeletonLoader';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Recommended = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await apiService.sections.getAll();
        if (response.data?.success) {
          setSections(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load homepage sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (sections.length === 0) return null;

  return (
    <div className="py-20 bg-pearl space-y-24">
      {sections.map((section, idx) => {
        const hasPackages = section.packages && section.packages.length > 0;
        if (!hasPackages) return null;

        // Split Section Name into normal and bold text for luxury serif heading look
        const nameParts = section.name.split(' ');
        const mainName = nameParts.slice(0, -1).join(' ') || nameParts[0];
        const lastPart = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

        return (
          <section key={section._id || idx} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-serif text-primary font-light tracking-wide leading-tight">
                  {mainName} <span className="font-bold text-primary-light">{lastPart}</span>
                </h2>
                <div className="h-1 w-20 bg-gold mt-3 rounded-full" />
              </div>
              <Link
                to="/packages"
                className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-dark transition-colors border-b border-gold/30 hover:border-gold-dark pb-1"
              >
                View All Packages
              </Link>
            </div>

            {/* Packages Swiper Carousels */}
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              className="py-4 px-2"
            >
              {section.packages.map((pack) => (
                <SwiperSlide key={pack._id} className="h-auto">
                  <PackageCard pack={pack} />
                </SwiperSlide>
              ))}
            </Swiper>

          </section>
        );
      })}
    </div>
  );
};

export default Recommended;
