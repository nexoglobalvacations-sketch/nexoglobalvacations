import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiYoutube, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-gray-300 pt-16 pb-8 border-t border-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top: Logo and Social Links */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-8 mb-10 border-b border-white/5">
          <Link to="/" className="inline-flex transition-transform duration-300 hover:scale-105 mb-6 md:mb-0">
            <img
              src="/logo.png"
              alt="Nexo Global Vacations"
              className="h-24 w-auto object-contain"
            />
          </Link>
          <div className="flex space-x-3.5">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-400 hover:text-gold transition-all duration-300 p-2.5 bg-white/5 hover:bg-gold/10 rounded-full border border-white/5 hover:border-gold/30"
            >
              <FiFacebook className="h-5 w-5" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-400 hover:text-gold transition-all duration-300 p-2.5 bg-white/5 hover:bg-gold/10 rounded-full border border-white/5 hover:border-gold/30"
            >
              <FiInstagram className="h-5 w-5" />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-400 hover:text-gold transition-all duration-300 p-2.5 bg-white/5 hover:bg-gold/10 rounded-full border border-white/5 hover:border-gold/30"
            >
              <FiYoutube className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-400 hover:text-gold transition-all duration-300 p-2.5 bg-white/5 hover:bg-gold/10 rounded-full border border-white/5 hover:border-gold/30"
            >
              <FiTwitter className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Company Brief */}
          <div>
            <h4 className="text-md font-semibold text-white uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">
              Our Agency
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              We design premium, hand-picked travel experiences for the modern global traveler. Explore luxury tour packages across India's spiritual hubs, tropical coastlines, and mountain retreats.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold text-white uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">
              Explore Journeys
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/category/Spiritual" className="hover:text-gold transition-colors">Spiritual Tours</Link>
              </li>
              <li>
                <Link to="/category/Beaches" className="hover:text-gold transition-colors">Beach Escapes</Link>
              </li>
              <li>
                <Link to="/category/Mountains" className="hover:text-gold transition-colors">Mountain Adventures</Link>
              </li>
              <li>
                <Link to="/category/Honeymoon" className="hover:text-gold transition-colors">Honeymoon Specials</Link>
              </li>
              <li>
                <Link to="/category/Group Tours" className="hover:text-gold transition-colors">Recommended Group Tours</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-md font-semibold text-white uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <FiMapPin className="text-gold h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 leading-relaxed">
                  6A First Floor, Uttam Nagar Main Rd., New Delhi - 110059
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="text-gold h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">+91 9999946509</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="text-gold h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">info@nexoglobalvacations.com</span>
              </li>
            </ul>
          </div>

          {/* Our Promise (Trust Accreditations) */}
          <div>
            <h4 className="text-md font-semibold text-white uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">
              Our Promise
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-400">
              <li className="leading-relaxed">
                <strong className="text-gold block mb-0.5 font-medium">100% Customized Journeys</strong>
                Itineraries customized to match your exact interests and travel pace.
              </li>
              <li className="leading-relaxed">
                <strong className="text-gold block mb-0.5 font-medium">Handpicked Premium Stays</strong>
                Bespoke luxury hotels and boutique resorts handpicked by our team.
              </li>
              <li className="leading-relaxed">
                <strong className="text-gold block mb-0.5 font-medium">24/7 Dedicated Support</strong>
                Dedicated travel coordinator assistance throughout your entire trip.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} Nexo Global Vacations. All Rights Reserved. Designed with elegance.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/faqs" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/faqs" className="hover:text-gold transition-colors">Terms of Service</Link>
            <Link to="/login" className="hover:text-gold transition-colors font-semibold text-gold">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
