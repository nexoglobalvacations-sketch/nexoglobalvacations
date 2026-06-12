import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiYoutube, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our luxury travel newsletter!');
    e.target.reset();
  };

  return (
    <footer className="bg-primary text-gray-300 pt-16 pb-8 border-t border-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Company Brief */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-gold font-semibold tracking-wider uppercase">
              TT Company
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We design premium, hand-picked travel experiences for the modern global traveler. Explore luxury tour packages across India's spiritual hubs, tropical coastlines, and mountain retreats.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
                <FiFacebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
                <FiYoutube className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
                <FiTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold text-white uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">
              Explore Journeys
            </h4>
            <ul className="space-y-2 text-sm">
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

          {/* Contact Details (Matching Reference Screenshot) */}
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
                <span className="text-gray-400">info@ttcompany.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div>
            <h4 className="text-md font-semibold text-white uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">
              Newsletter
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Subscribe to receive updates on hand-picked weekend escapes, customized tours, and secret deals.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-dark text-white text-sm px-4 py-2.5 rounded-md border border-white/10 focus:outline-none focus:border-gold transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-gold text-primary font-bold text-sm px-4 py-2.5 rounded-md hover:bg-gold-light transition-all shadow-md active:translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} TT Company. All Rights Reserved. Designed with elegance.</p>
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
