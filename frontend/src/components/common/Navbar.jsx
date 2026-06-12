import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown, HiUser, HiBriefcase } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useUserAuth } from '../../context/UserAuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation();
  const { admin, isAuthenticated: isAdminAuthenticated, logout: adminLogout } = useAuth();
  const { user: traveler, isAuthenticated: isUserAuthenticated, logout: userLogout } = useUserAuth();

  const categories = [
    'Honeymoon',
    'Spiritual',
    'Beaches',
    'Mountains',
    'Adventure',
    'Luxury',
    'Wildlife',
    'International',
    'Family Trips',
    'Group Tours',
    'Custom Tours'
  ];

  // Dynamic scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setShowDropdown(false);
  }, [location]);

  const isHomePage = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isHomePage && !isScrolled
          ? 'bg-transparent text-white border-b border-white/10'
          : 'bg-primary text-white shadow-premium'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold font-serif tracking-widest text-gold uppercase">
                TT Company
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`hover:text-gold transition-colors text-sm font-medium ${
                location.pathname === '/' ? 'text-gold' : ''
              }`}
            >
              Home
            </Link>
            
            {/* Categories Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                onMouseEnter={() => setShowDropdown(true)}
                className="flex items-center space-x-1 hover:text-gold transition-colors text-sm font-medium focus:outline-none"
              >
                <span>Explore</span>
                <HiChevronDown className={`h-4 w-4 transform transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories Menu List */}
              {showDropdown && (
                <div
                  onMouseLeave={() => setShowDropdown(false)}
                  className="absolute left-0 mt-2 w-56 rounded-md bg-primary-dark border border-gold/15 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="py-2 grid grid-cols-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/category/${cat}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gold/10 hover:text-gold transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/packages"
              className={`hover:text-gold transition-colors text-sm font-medium ${
                location.pathname === '/packages' ? 'text-gold' : ''
              }`}
            >
              All Packages
            </Link>
            <Link
              to="/about"
              className={`hover:text-gold transition-colors text-sm font-medium ${
                location.pathname === '/about' ? 'text-gold' : ''
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`hover:text-gold transition-colors text-sm font-medium ${
                location.pathname === '/contact' ? 'text-gold' : ''
              }`}
            >
              Contact Us
            </Link>
            <Link
              to="/faqs"
              className={`hover:text-gold transition-colors text-sm font-medium ${
                location.pathname === '/faqs' ? 'text-gold' : ''
              }`}
            >
              FAQs
            </Link>
          </div>

          {/* User / Admin Portal CTA */}
          <div className="hidden md:flex items-center space-x-6">
            {isAdminAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center space-x-1.5 bg-gold text-primary font-bold px-5 py-2 rounded-full hover:bg-gold-light transition-all shadow-goldGlow hover:-translate-y-0.5 transform text-xs"
                >
                  <HiBriefcase className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={adminLogout}
                  className="text-xs text-gray-300 hover:text-white underline cursor-pointer focus:outline-none"
                >
                  Logout
                </button>
              </div>
            ) : isUserAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/user/dashboard"
                  className="flex items-center space-x-1.5 bg-gold text-primary font-bold px-5 py-2 rounded-full hover:bg-gold-light transition-all shadow-goldGlow hover:-translate-y-0.5 transform text-xs"
                >
                  <HiUser className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="text-right">
                  <span className="text-[10px] text-gold font-bold block max-w-[100px] truncate">{traveler?.name}</span>
                  <button
                    onClick={userLogout}
                    className="text-[9px] text-gray-400 hover:text-white block underline cursor-pointer focus:outline-none ml-auto"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/user/login"
                  className="flex items-center space-x-1 text-gray-300 hover:text-gold transition-colors"
                >
                  <HiUser className="h-4 w-4" />
                  <span className="text-xs font-semibold">Traveler Sign In</span>
                </Link>
                <span className="text-gray-600">|</span>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition-colors text-[10px] uppercase font-bold tracking-wider"
                >
                  Admin
                </Link>
              </div>
            )}
          </div>

          {/* Mobile responsive toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-gold focus:outline-none"
            >
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gold/10 hover:text-gold"
            >
              Home
            </Link>
            
            {/* Experience links on Mobile */}
            <div className="pl-3 py-1 font-semibold text-gold text-xs uppercase tracking-wider">
              Explore
            </div>
            <div className="pl-4 grid grid-cols-2 gap-1 pb-2">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${cat}`}
                  className="block py-1 text-sm text-gray-300 hover:text-white"
                >
                  {cat}
                </Link>
              ))}
            </div>

            <Link
              to="/packages"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gold/10 hover:text-gold"
            >
              All Packages
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gold/10 hover:text-gold"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gold/10 hover:text-gold"
            >
              Contact Us
            </Link>
            <Link
              to="/faqs"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gold/10 hover:text-gold"
            >
              FAQs
            </Link>

            {isAdminAuthenticated ? (
              <div className="pt-4 border-t border-white/10 px-3 space-y-2">
                <Link
                  to="/admin/dashboard"
                  className="block text-center bg-gold text-primary font-bold py-2 rounded-md hover:bg-gold-light"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={adminLogout}
                  className="block w-full text-center text-sm text-gray-400 font-bold hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : isUserAuthenticated ? (
              <div className="pt-4 border-t border-white/10 px-3 space-y-2">
                <Link
                  to="/user/dashboard"
                  className="block text-center bg-gold text-primary font-bold py-2 rounded-md hover:bg-gold-light"
                >
                  My Dashboard ({traveler?.name})
                </Link>
                <button
                  onClick={userLogout}
                  className="block w-full text-center text-sm text-gray-400 font-bold hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/10 px-3 space-y-3">
                <Link
                  to="/user/login"
                  className="block text-center bg-gold text-primary font-bold py-2 rounded-md hover:bg-gold-light text-sm"
                >
                  Traveler Sign In
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-1 text-xs text-gray-400 hover:text-white"
                >
                  <HiUser className="h-4 w-4" />
                  <span>Admin Portal Access</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
