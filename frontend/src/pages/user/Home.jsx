import React from 'react';
import Hero from '../../components/home/Hero';
import StatsCounter from '../../components/home/StatsCounter';
import Recommended from '../../components/home/Recommended';
import ExploreStates from '../../components/home/ExploreStates';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import Testimonials from '../../components/home/Testimonials';
import FAQAccordion from '../../components/home/FAQAccordion';

const Home = () => {
  return (
    <div className="relative overflow-hidden w-full">
      {/* 1. Fullscreen Swiper Hero & Search form */}
      <Hero />
      
      {/* 2. Stats Counters */}
      <StatsCounter />
      
      {/* 3. Custom dynamic listings (Beaches, Spirituality, Group Tours...) */}
      <Recommended />
      
      {/* 4. Explore Indian States & Exotic Countries Grid */}
      <ExploreStates />
      
      {/* 5. Why Choose Us */}
      <WhyChooseUs />
      
      {/* 6. Testimonials Swiper Carousel */}
      <Testimonials />
      
      {/* 7. Accordion FAQs */}
      <FAQAccordion />
    </div>
  );
};

export default Home;
