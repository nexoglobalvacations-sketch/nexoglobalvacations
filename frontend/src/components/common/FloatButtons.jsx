import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import { FiChevronUp } from 'react-icons/fi';

const FloatButtons = () => {
  const [showScroll, setShowScroll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScrollTop = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const phoneNumber = '916269489351'; // Phone number from user's screenshot
    const message = encodeURIComponent("Hello Nexo Global Vacations! I am interested in planning a customized luxury tour package. Please share details.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none z-40">
      
      {/* 1. Floating WhatsApp Button (Stays bottom-left, bounces subtly) */}
      <div className="pointer-events-auto">
        <button
          onClick={openWhatsApp}
          className="flex items-center justify-center bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:bg-[#20ba5a] transition-all transform hover:scale-110 active:scale-95 animate-float focus:outline-none"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp className="h-6 w-6" />
        </button>
      </div>

      {/* Right-Side Group: Enquire Now & Scroll to Top */}
      <div className="flex flex-col space-y-3 items-end pointer-events-auto">
        
        {/* 2. Floating Enquire Now Button (Premium blue capsule, matches screenshot) */}
        <button
          onClick={() => navigate('/inquiry')}
          className="flex items-center space-x-2 bg-primary-light text-white font-bold px-5 py-3 rounded-full shadow-premium hover:bg-primary-dark transition-all transform hover:-translate-y-1 hover:shadow-goldGlow hover:scale-105 active:translate-y-0 active:scale-95 cursor-pointer focus:outline-none"
        >
          <FaTelegramPlane className="h-4 w-4 text-gold" />
          <span className="text-sm tracking-wide">Enquire Now</span>
        </button>

        {/* 3. Scroll to Top Button (Appears after scrolling down) */}
        {showScroll && (
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center bg-gold text-primary p-3 rounded-full shadow-premium hover:bg-gold-dark hover:text-white transition-all transform hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
            title="Scroll to Top"
          >
            <FiChevronUp className="h-5 w-5" />
          </button>
        )}
      </div>

    </div>
  );
};

export default FloatButtons;
