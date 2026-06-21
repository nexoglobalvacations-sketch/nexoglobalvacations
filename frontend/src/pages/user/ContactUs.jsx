import React, { useState, useEffect } from 'react';
import { FiPhone, FiMail, FiMapPin, FiCompass } from 'react-icons/fi';
import { FaTelegramPlane } from 'react-icons/fa';
import apiService from '../../services/api';
import { useUserAuth } from '../../context/UserAuthContext';
import TravelerAuthModal from '../../components/common/TravelerAuthModal';

const ContactUs = () => {
  const { user, isAuthenticated } = useUserAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      alert('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        email,
        phone,
        travelersCount: 1, // Default for simple contact messages
        travelDate: new Date().toISOString().split('T')[0], // Today
        message
      };

      const response = await apiService.inquiries.submit(payload);
      if (response.data?.success) {
        alert('Thank you! Your message has been received, and our travel team will reach out shortly.');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }
    } catch (err) {
      console.error('Failed to submit contact request:', err);
      alert('Submission failed. Please try again.');
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
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl sm:text-6xl font-serif font-bold tracking-wide">
            Contact Us
          </h1>
          <p className="text-gold uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mt-4">
            Get in touch to draft your dream itinerary
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="text-gold font-bold text-xs uppercase tracking-widest">Connect Instantly</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary leading-tight">
              We are Here to Guide Your Wanderlust
            </h2>
            <div className="h-0.5 w-16 bg-gold" />
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            Have questions about booking dynamic honeymoon packages, spiritual routes, or customizing high-altitude treks? Contact our travel office in New Delhi or drop an enquiry message below. Our planners respond within 2 hours.
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-full border border-gold/15 shadow-sm">
                <FiMapPin className="text-gold h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-primary text-sm">Head Office</h4>
                <p className="text-xs text-gray-400 mt-1">6A First Floor, Uttam Nagar Main Rd., New Delhi - 110059</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-full border border-gold/15 shadow-sm">
                <FiPhone className="text-gold h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-primary text-sm">Call Center</h4>
                <p className="text-xs text-gray-400 mt-1">+91 62694 89351 (Open 24/7)</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-full border border-gold/15 shadow-sm">
                <FiMail className="text-gold h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-primary text-sm">Support Email</h4>
                <p className="text-xs text-gray-400 mt-1">nexoglobalvacations@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-premium space-y-6">
          <h3 className="font-serif font-bold text-xl text-primary flex items-center space-x-2">
            <FiCompass className="text-gold h-5 w-5 animate-spin-slow" />
            <span>Send Us A Message</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-500 uppercase tracking-wider">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-500 uppercase tracking-wider">Your Message *</label>
              <textarea
                rows="4"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your travel questions..."
                className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold"
              />
            </div>

            {isAuthenticated ? (
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center space-x-2 bg-gold text-primary font-bold py-3.5 rounded-xl shadow hover:bg-gold-light transition-colors cursor-pointer"
              >
                <FaTelegramPlane className="h-4 w-4" />
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 bg-gold text-primary font-bold py-3.5 rounded-xl shadow hover:bg-gold-light transition-colors cursor-pointer"
              >
                <FiCompass className="h-4 w-4 animate-spin-slow" />
                <span>Sign In to Send Message</span>
              </button>
            )}
          </form>
        </div>

      </div>

      <TravelerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default ContactUs;
