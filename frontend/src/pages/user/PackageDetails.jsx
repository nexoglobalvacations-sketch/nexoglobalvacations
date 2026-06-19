import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiClock, FiMapPin, FiCheck, FiX, FiMail, FiPhone, FiCalendar, FiUsers, FiCompass } from 'react-icons/fi';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import apiService from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useUserAuth } from '../../context/UserAuthContext';
import TravelerAuthModal from '../../components/common/TravelerAuthModal';

const PackageDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const loc = useLocation();
  const { user, isAuthenticated } = useUserAuth();
  
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hotels'); // 'hotels' | 'transport' | 'meals'
  const [expandedDay, setExpandedDay] = useState(1); // First day expanded by default

  // Inquiry Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);
  const [travelersCount, setTravelersCount] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await apiService.packages.getBySlug(slug);
        if (response.data?.success) {
          setPack(response.data.data);
          // Auto fill initial inquiry text
          setMessage(`Hi Nexo Global Vacations, I'm interested in booking the "${response.data.data.name}" tour package. Please share availability.`);
        } else {
          navigate('/packages');
        }
      } catch (err) {
        console.error('Failed to load package details:', err);
        navigate('/packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !travelDate) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        email,
        phone,
        travelersCount: Number(travelersCount),
        travelDate,
        packageId: pack._id,
        message
      };

      const response = await apiService.inquiries.submit(payload);
      if (response.data?.success) {
        alert('Thank you for your inquiry! Our travel coordinator will contact you shortly.');
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setTravelersCount(1);
        setTravelDate('');
      }
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const triggerWhatsApp = () => {
    if (!pack) return;
    const phoneNumber = '919999946509';
    const text = encodeURIComponent(
      `Hello Nexo Global Vacations! I am interested in booking the "${pack.name}" package (${pack.duration}) starting from ₹${pack.price}. Please guide me on next steps.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <SkeletonLoader count={1} />
      </div>
    );
  }

  if (!pack) return null;

  return (
    <div className="bg-pearl pb-20">
      
      {/* 1. Fullscreen Hero Banner Overlay */}
      <div className="relative h-[65vh] w-full overflow-hidden bg-primary-dark">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${pack.heroBanner || pack.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/45 to-transparent" />
        
        {/* Banner Details Overlay */}
        <div className="absolute inset-0 flex flex-col items-start justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="space-y-4 max-w-3xl text-left">
            <span className="bg-gold text-primary font-bold text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full border border-gold-light/20 shadow-md">
              {pack.category} Package
            </span>
            <h1 className="text-white text-3xl sm:text-5xl font-serif font-bold tracking-wide drop-shadow-md">
              {pack.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
              <span className="flex items-center space-x-1.5">
                <FiClock className="text-gold h-4 w-4" />
                <span>{pack.duration}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <FiMapPin className="text-gold h-4 w-4" />
                <span>{pack.destination?.name || 'India'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Page Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Side: Package timeline, Overview, Inclusions, hotel details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Overview Block */}
          <section className="bg-white p-8 rounded-3xl border border-black/5 shadow-premium space-y-4 text-left">
            <h2 className="text-2xl font-serif text-primary font-bold">Tour Overview</h2>
            <div className="h-0.5 w-12 bg-gold" />
            <p className="text-sm text-gray-500 leading-relaxed">
              {pack.overview}
            </p>
          </section>

          {/* Day-Wise Itinerary (Accordion Style) */}
          <section className="bg-white p-8 rounded-3xl border border-black/5 shadow-premium space-y-6 text-left">
            <div>
              <h2 className="text-2xl font-serif text-primary font-bold">Day-Wise Itinerary</h2>
              <div className="h-0.5 w-12 bg-gold mt-2" />
            </div>

            <div className="space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-[19px] before:w-[2px] before:bg-gold/20">
              {pack.itinerary && pack.itinerary.map((dayPlan) => (
                <div
                  key={dayPlan._id || dayPlan.day}
                  className={`relative pl-12 transition-all`}
                >
                  {/* Timeline circular dot marker */}
                  <button
                    onClick={() => setExpandedDay(expandedDay === dayPlan.day ? -1 : dayPlan.day)}
                    className={`absolute left-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border focus:outline-none transition-all shadow-sm ${
                      expandedDay === dayPlan.day
                        ? 'bg-primary text-white border-primary'
                        : 'bg-pearl text-gold border-gold/20 hover:border-gold'
                    }`}
                  >
                    {dayPlan.day}
                  </button>

                  {/* Day Content */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setExpandedDay(expandedDay === dayPlan.day ? -1 : dayPlan.day)}
                      className="w-full text-left font-serif font-bold text-lg text-primary hover:text-gold transition-colors focus:outline-none"
                    >
                      Day {dayPlan.day}: {dayPlan.title}
                    </button>

                    {/* Expanded details */}
                    {expandedDay === dayPlan.day && (
                      <div className="bg-pearl p-5 rounded-2xl border border-black/5 space-y-4 animate-fade-in text-sm text-gray-600">
                        {/* Day Activities */}
                        <div className="space-y-2">
                          <span className="block font-bold text-[10px] text-gray-400 uppercase tracking-widest">Activities of the Day</span>
                          <ul className="space-y-1.5 pl-4 list-disc">
                            {dayPlan.activities.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Lodging & Meals grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-gray-200/50">
                          {dayPlan.accommodation && (
                            <div>
                              <span className="block font-bold text-[9px] text-gray-400 uppercase tracking-widest">Lodging</span>
                              <span className="font-semibold text-primary">{dayPlan.accommodation}</span>
                            </div>
                          )}
                          {dayPlan.meals && (
                            <div>
                              <span className="block font-bold text-[9px] text-gray-400 uppercase tracking-widest">Meals</span>
                              <span className="font-semibold text-primary">{dayPlan.meals}</span>
                            </div>
                          )}
                          {dayPlan.transport && (
                            <div>
                              <span className="block font-bold text-[9px] text-gray-400 uppercase tracking-widest">Transit</span>
                              <span className="font-semibold text-primary">{dayPlan.transport}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Included / Excluded Columns */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            {/* Inclusions */}
            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-premium space-y-4">
              <h3 className="text-xl font-serif text-primary font-bold flex items-center space-x-2">
                <FiCheck className="text-emerald-500 h-6 w-6" />
                <span>Inclusions</span>
              </h3>
              <div className="h-0.5 w-12 bg-gold" />
              <ul className="space-y-2.5 text-sm text-gray-500">
                {pack.included && pack.included.map((inc, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <FiCheck className="text-emerald-500 h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-premium space-y-4">
              <h3 className="text-xl font-serif text-primary font-bold flex items-center space-x-2">
                <FiX className="text-red-500 h-6 w-6" />
                <span>Exclusions</span>
              </h3>
              <div className="h-0.5 w-12 bg-gold" />
              <ul className="space-y-2.5 text-sm text-gray-500">
                {pack.excluded && pack.excluded.map((exc, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <FiX className="text-red-500 h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Tabs for Hotel / Transport / Meal details */}
          <section className="bg-white p-8 rounded-3xl border border-black/5 shadow-premium space-y-6 text-left">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-100 pb-2 space-x-8">
              {['hotels', 'transport', 'meals'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-serif font-bold text-md capitalize border-b-2 transition-all focus:outline-none cursor-pointer ${
                    activeTab === tab
                      ? 'border-gold text-primary'
                      : 'border-transparent text-gray-400 hover:text-primary'
                  }`}
                >
                  {tab} Details
                </button>
              ))}
            </div>

            {/* Tab Content Panels */}
            <div className="text-sm text-gray-500 leading-relaxed min-h-[100px] flex items-center">
              {activeTab === 'hotels' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-primary">Luxury Stays Configured</h4>
                  <p>{pack.hotelDetails || 'Premium boutique and heritage properties equipped with modern facilities.'}</p>
                </div>
              )}
              {activeTab === 'transport' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-primary">Dedicated Fleet Logistics</h4>
                  <p>{pack.transportDetails || 'Private AC SUV / Sedan transit cars with professional multi-lingual chauffeurs.'}</p>
                </div>
              )}
              {activeTab === 'meals' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-primary">Authentic Culinary Boards</h4>
                  <p>{pack.mealDetails || 'Buffet breakfasts and customized dinners featuring regional Sattvik or Goan choices.'}</p>
                </div>
              )}
            </div>
          </section>

          {/* Visual Journey Gallery */}
          {pack.gallery && pack.gallery.length > 0 && (
            <section className="bg-white p-8 rounded-3xl border border-black/5 shadow-premium space-y-6 text-left">
              <div>
                <h2 className="text-2xl font-serif text-primary font-bold">Visual Journey Gallery</h2>
                <div className="h-0.5 w-12 bg-gold mt-2" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {pack.gallery.map((imgUrl, i) => (
                  <div key={i} className="h-44 rounded-2xl overflow-hidden shadow-sm group">
                    <img
                      src={imgUrl}
                      alt={`Visual ${i}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Package Specific FAQs */}
          {pack.faq && pack.faq.length > 0 && (
            <section className="bg-white p-8 rounded-3xl border border-black/5 shadow-premium space-y-6 text-left">
              <div>
                <h2 className="text-2xl font-serif text-primary font-bold">Package FAQs</h2>
                <div className="h-0.5 w-12 bg-gold mt-2" />
              </div>

              <div className="space-y-4 divide-y divide-gray-100">
                {pack.faq.map((fq, i) => (
                  <div key={i} className="pt-4 first:pt-0 space-y-1">
                    <h4 className="font-bold text-primary text-sm flex items-center space-x-1">
                      <span className="text-gold">Q.</span>
                      <span>{fq.question}</span>
                    </h4>
                    <p className="text-xs text-gray-500 pl-4">{fq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Side: Sticky Inquiry form & Price guides */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6 text-left">
            
            {/* Price banner */}
            <div className="bg-primary text-white p-8 rounded-3xl border border-gold/15 shadow-premium relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-light/45 via-primary to-transparent opacity-60" />
              <div className="relative z-10 space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-gold">Package Value</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold">₹{pack.price?.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-gray-300">/ person (Starting Price)</span>
                </div>
                <div className="h-px bg-white/10 my-3" />
                <button
                  onClick={triggerWhatsApp}
                  className="w-full flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 rounded-full shadow-lg transition-colors focus:outline-none"
                >
                  <FaWhatsapp className="h-5 w-5" />
                  <span>Inquire via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Quick Inquiry Form Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/5 shadow-premium space-y-5">
              <div className="border-b border-gray-100 pb-3 flex items-center space-x-2">
                <FiMail className="text-gold h-5 w-5" />
                <h3 className="font-serif font-bold text-lg text-primary">Enquire for Booking</h3>
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs text-left">
                {/* Name */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9999946509"
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Date & Count row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                      <FiCalendar className="text-gold" />
                      <span>Travel Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-pearl border border-gray-200 px-3 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                      <FiUsers className="text-gold" />
                      <span>Travelers *</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={travelersCount}
                      onChange={(e) => setTravelersCount(e.target.value)}
                      className="w-full bg-pearl border border-gray-200 px-3 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                    <FiCompass className="text-gold" />
                    <span>Special Requirements</span>
                  </label>
                  <textarea
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Submit button */}
                {isAuthenticated ? (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center space-x-2 bg-gold text-primary font-bold py-3.5 rounded-xl shadow hover:bg-gold-light active:translate-y-0.5 transition-all focus:outline-none cursor-pointer disabled:opacity-50 text-xs"
                  >
                    <FaTelegramPlane className="h-4 w-4" />
                    <span>{submitting ? 'Submitting...' : 'Send Inquiry'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-gold text-primary font-bold py-3.5 rounded-xl shadow hover:bg-gold-light active:translate-y-0.5 transition-all focus:outline-none cursor-pointer text-xs"
                  >
                    <FiCompass className="h-4 w-4 animate-spin-slow" />
                    <span>Sign In to Send Inquiry</span>
                  </button>
                )}
              </form>
            </div>

          </div>
        </div>

      </div>

      {/* Floating Auth Modal */}
      <TravelerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

    </div>
  );
};

export default PackageDetails;
