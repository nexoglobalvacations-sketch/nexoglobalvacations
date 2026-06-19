import React from 'react';
import StatsCounter from '../../components/home/StatsCounter';
import WhyChooseUs from '../../components/home/WhyChooseUs';

const AboutUs = () => {
  return (
    <div className="bg-pearl pb-20">
      
      {/* Hero Banner */}
      <div className="relative h-[45vh] w-full overflow-hidden bg-primary-dark">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl sm:text-6xl font-serif font-bold tracking-wide">
            Our Journey
          </h1>
          <p className="text-gold uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mt-4">
            Crafting luxury, bespoke travel since 2014
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
        <div className="space-y-6">
          <span className="text-gold font-bold text-xs uppercase tracking-widest">About Nexo Global Vacations</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary leading-tight">
            We Create Memories That Remain Eternal
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Nexo Global Vacations was founded with a singular, clear vision: to redefine bespoke travel for the global explorer. We specialize in planning luxury experiences across India and exotic international regions. From high-altitude monastical trails in Ladakh to the tranquil, palm-fringed lagoons of Alleppey and deep spiritual journeys through Varanasi, we design tours that excite the spirit.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Our team handles all travel logistics locally, booking only highly verified boutique hotels, reliable private transport drivers, and premium cruise ferries.
          </p>
        </div>

        <div className="h-96 rounded-3xl overflow-hidden shadow-premium border border-black/5 relative">
          <img
            src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80"
            alt="Narrative Image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Counters & Why Choose Us */}
      <div className="mt-20">
        <StatsCounter />
      </div>
      <WhyChooseUs />

    </div>
  );
};

export default AboutUs;
