import React from 'react';
import { FiAward, FiShield, FiHeart, FiMap } from 'react-icons/fi';

const WhyChooseUs = () => {
  const points = [
    {
      icon: <FiAward className="h-8 w-8 text-gold" />,
      title: 'Bespoke Curated Travel',
      desc: 'Every luxury package is hand-selected and tailored by travel specialists to create your absolute dream itinerary.'
    },
    {
      icon: <FiShield className="h-8 w-8 text-gold" />,
      title: 'Premium Comfort Stays',
      desc: 'We verify each hotel property locally, selecting only highly certified 4-Star and 5-Star partners.'
    },
    {
      icon: <FiHeart className="h-8 w-8 text-gold" />,
      title: 'Hassle-Free Booking',
      desc: 'All terminal transfers, VIP monument darshans, private cabs, and flight assists are fully pre-scheduled.'
    },
    {
      icon: <FiMap className="h-8 w-8 text-gold" />,
      title: 'Local Travel Expertise',
      desc: 'With multi-lingual private drivers and professional local tour guides, you explore like a VIP resident.'
    }
  ];

  return (
    <section className="bg-white py-20 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif text-primary">
            Why Travel With <span className="font-bold">TT Company</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest mt-2">
            The Gold Standard in Bespoke Tourism
          </p>
          <div className="h-1 w-24 bg-gold mx-auto mt-4 rounded-full" />
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl hover:bg-pearl hover:shadow-premium transition-all border border-transparent hover:border-black/5 group text-center space-y-4"
            >
              <div className="inline-flex p-4 bg-pearl rounded-full group-hover:bg-primary transition-colors">
                {pt.icon}
              </div>
              <h3 className="text-lg font-serif font-bold text-primary group-hover:text-gold transition-colors">
                {pt.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
