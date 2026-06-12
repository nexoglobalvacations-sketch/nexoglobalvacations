import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCalendar, FiUsers, FiMail, FiPhone, FiCompass, FiMap } from 'react-icons/fi';
import { FaTelegramPlane } from 'react-icons/fa';
import apiService from '../../services/api';
import { useUserAuth } from '../../context/UserAuthContext';
import TravelerAuthModal from '../../components/common/TravelerAuthModal';

const InquiryPage = () => {
  const { user, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read URL query parameters for default packages if applicable
  const loc = useLocation();
  const searchParams = new URLSearchParams(loc.search);
  const defaultPackId = searchParams.get('packageId') || '';

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [travelersCount, setTravelersCount] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [packageId, setPackageId] = useState(defaultPackId);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await apiService.packages.getAll({ isPublished: true });
        if (response.data?.success) {
          setPackages(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !travelDate || !message) {
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
        message
      };

      if (packageId) {
        payload.packageId = packageId;
      }

      const response = await apiService.inquiries.submit(payload);
      if (response.data?.success) {
        alert('Thank you! Your custom tour inquiry has been submitted. Our coordinators will reach out shortly.');
        setName('');
        setEmail('');
        setPhone('');
        setTravelersCount(1);
        setTravelDate('');
        setPackageId('');
        setMessage('');
      }
    } catch (err) {
      console.error('Inquiry submission failed:', err);
      alert('Submission failed. Please check your network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-pearl pb-20">
      
      {/* Hero Banner */}
      <div className="relative h-[45vh] w-full overflow-hidden bg-primary-dark">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl sm:text-6xl font-serif font-bold tracking-wide">
            Plan Custom Journey
          </h1>
          <p className="text-gold uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mt-4">
            Bespoke itineraries crafted for you
          </p>
        </div>
      </div>

      {/* Main Form container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-black/5 shadow-premium space-y-8 text-left">
          
          <div className="border-b border-gray-100 pb-5">
            <h2 className="text-2xl font-serif text-primary font-bold">Luxury Journey Enquiry</h2>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Fill in your contact coordinates and target dates, and our professional tour designers will craft the ideal custom itinerary tailored precisely to your style.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Contact details row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-pearl border border-gray-200 px-4 py-3 rounded-xl text-primary focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                  <FiPhone className="text-gold" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9999946509"
                  className="w-full bg-pearl border border-gray-200 px-4 py-3 rounded-xl text-primary focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                <FiMail className="text-gold" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-pearl border border-gray-200 px-4 py-3 rounded-xl text-primary focus:outline-none focus:border-gold"
              />
            </div>

            {/* Package selector */}
            <div className="space-y-1">
              <label className="font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                <FiMap className="text-gold" />
                <span>Select Target Package (Optional)</span>
              </label>
              <select
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                disabled={loading}
                className="w-full bg-pearl border border-gray-200 px-4 py-3 rounded-xl text-primary focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="">-- Let Planners Recommend --</option>
                {packages.map((p) => (
                  <option key={p._id} value={p._id}>{p.name} ({p.duration})</option>
                ))}
              </select>
            </div>

            {/* Travel metrics row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                  <FiCalendar className="text-gold" />
                  <span>Preferred Travel Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-pearl border border-gray-200 px-4 py-3 rounded-xl text-primary focus:outline-none focus:border-gold cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                  <FiUsers className="text-gold" />
                  <span>Total Number of Travelers *</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(Number(e.target.value))}
                  className="w-full bg-pearl border border-gray-200 px-4 py-3 rounded-xl text-primary focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Travel Requirements */}
            <div className="space-y-1">
              <label className="font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                <FiCompass className="text-gold" />
                <span>Specify Custom Requirements *</span>
              </label>
              <textarea
                rows="5"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="List your target destinations, hotel preferences (e.g. 5-Star only), transit choices (e.g. private driver), and daily timeline..."
                className="w-full bg-pearl border border-gray-200 px-4 py-3 rounded-xl text-primary focus:outline-none focus:border-gold"
              />
            </div>

            {/* CTA action */}
            {isAuthenticated ? (
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-2 bg-[#1A1A1A] hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-goldGlow transition-colors cursor-pointer"
              >
                <FaTelegramPlane className="h-4 w-4" />
                <span>{submitting ? 'Sending Request...' : 'Submit Custom Inquiry'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 bg-gold hover:bg-gold-light text-primary font-bold py-4 rounded-xl shadow-lg transition-colors cursor-pointer text-xs"
              >
                <FiCompass className="h-4 w-4 animate-spin-slow" />
                <span>Sign In / Register to Submit Inquiry</span>
              </button>
            )}

          </form>

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

export default InquiryPage;
