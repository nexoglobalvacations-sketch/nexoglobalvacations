import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../../context/UserAuthContext';
import apiService from '../../services/api';
import { FiCompass, FiCalendar, FiUsers, FiClock, FiCheckCircle, FiXCircle, FiTrendingUp } from 'react-icons/fi';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const TimelineTrack = ({ status }) => {
  // Nodes: Submitted, In Review, Completed/Confirmed
  const isSubmitted = true;
  const isProcessing = ['processing', 'confirmed'].includes(status);
  const isConfirmed = status === 'confirmed';
  const isCancelled = status === 'cancelled';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
        <span>Timeline Track</span>
        {isCancelled ? (
          <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <FiXCircle />
            <span>Closed / Cancelled</span>
          </span>
        ) : isConfirmed ? (
          <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <FiCheckCircle />
            <span>Confirmed</span>
          </span>
        ) : isProcessing ? (
          <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <FiClock />
            <span>Under Review</span>
          </span>
        ) : (
          <span className="text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <FiClock />
            <span>Submitted</span>
          </span>
        )}
      </div>

      {/* Progress Line */}
      <div className="relative flex items-center justify-between py-2.5">
        <div className="absolute left-0 right-0 h-0.5 bg-gray-100 -z-10" />
        
        {/* Fill Line */}
        <div 
          className={`absolute left-0 h-0.5 -z-10 transition-all duration-500 ${
            isConfirmed ? 'w-full bg-emerald-500' :
            isProcessing ? 'w-1/2 bg-blue-500' :
            isCancelled ? 'w-full bg-red-400' : 'w-4 bg-amber-400'
          }`} 
        />

        {/* Step 1: Submitted */}
        <div className="flex flex-col items-center">
          <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
            isCancelled ? 'bg-red-50 border-red-500 text-red-500' :
            isConfirmed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-amber-400 border-amber-400 text-primary'
          }`}>
            1
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mt-1">Submitted</span>
        </div>

        {/* Step 2: Under Review */}
        <div className="flex flex-col items-center">
          <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
            isCancelled ? 'bg-red-50 border-red-300 text-red-400' :
            isConfirmed ? 'bg-emerald-500 border-emerald-500 text-white' :
            isProcessing ? 'bg-blue-500 border-blue-500 text-white animate-pulse' : 'bg-white border-gray-200 text-gray-400'
          }`}>
            2
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mt-1">In Review</span>
        </div>

        {/* Step 3: Confirmed */}
        <div className="flex flex-col items-center">
          <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
            isCancelled ? 'bg-red-50 border-red-200 text-red-300' :
            isConfirmed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-200 text-gray-400'
          }`}>
            3
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mt-1">Confirmed</span>
        </div>

      </div>
    </div>
  );
};

const UserDashboard = () => {
  const { user, logout } = useUserAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review & Testimonial feedback states
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText) {
      alert('Please fill in your feedback review text.');
      return;
    }
    setSubmittingReview(true);
    try {
      const response = await apiService.testimonials.submitTraveler({
        review: reviewText,
        rating: Number(reviewRating)
      });
      if (response.data?.success) {
        alert('Thank you for sharing your verified review! It has been posted successfully.');
        setReviewText('');
        setReviewRating(5);
      }
    } catch (err) {
      console.error('Failed to submit testimonial:', err);
      alert('Failed to post testimonial. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchMyInquiries = async () => {
      try {
        const response = await apiService.inquiries.getMyInquiries();
        if (response.data?.success) {
          setInquiries(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load traveler inquiries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyInquiries();
    window.scrollTo(0, 0);
  }, []);

  // Compute metric cards
  const totalCount = inquiries.length;
  const inReviewCount = inquiries.filter(i => ['pending', 'processing'].includes(i.status)).length;
  const confirmedCount = inquiries.filter(i => i.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-pearl pb-20 pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
      
      {/* 1. Dashboard Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-6 mb-8 gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Traveler Dashboard</span>
          <h1 className="text-3xl sm:text-4xl font-serif text-primary font-bold">
            Namaste, {user?.name || 'Explorer'}
          </h1>
          <p className="text-xs text-gray-400">Track and review all your custom travel bookings and status</p>
        </div>
        
        <button
          onClick={logout}
          className="self-start sm:self-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-full text-xs cursor-pointer focus:outline-none transition-colors"
        >
          Sign Out
        </button>
      </div>

      {loading ? (
        <SkeletonLoader count={2} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 2. Left Metrics Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-premium space-y-4">
              <h3 className="font-serif font-bold text-md text-primary flex items-center space-x-2">
                <FiTrendingUp className="text-gold" />
                <span>Voyage Summary</span>
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-400 font-semibold">Total Requests</span>
                  <span className="font-bold text-primary text-sm">{totalCount}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-400 font-semibold">Under Review</span>
                  <span className="font-bold text-amber-500 text-sm">{inReviewCount}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 font-semibold">Confirmed Trips</span>
                  <span className="font-bold text-emerald-500 text-sm">{confirmedCount}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-primary text-white p-6 rounded-3xl border border-gold/15 shadow-premium text-left space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 h-24 w-24 rounded-full bg-gold/10 filter blur-xl" />
              <FiCompass className="h-8 w-8 text-gold animate-spin-slow" />
              <h4 className="font-serif font-bold text-md text-gold">Need Custom Help?</h4>
              <p className="text-[10px] text-gray-300 leading-relaxed">
                Connect with our Delhi office via WhatsApp to accelerate review or modify hotel / meal choices instantly.
              </p>
              <a
                href="https://wa.me/916269489351"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-gold text-primary font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-full mt-2 hover:bg-gold-light transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Feedback Review Card */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-premium text-left space-y-4">
              <h4 className="font-serif font-bold text-md text-primary">Share Your Experience</h4>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Write a verified review of your luxury travel journeys with us. It will be showcased on our homepage!
              </p>
              
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`text-lg transition-transform focus:outline-none hover:scale-110 ${
                          star <= reviewRating ? 'text-amber-400' : 'text-gray-200'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Review Message</label>
                  <textarea
                    rows="3"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe your tour comfort, guides, or highlights..."
                    className="w-full bg-pearl border border-gray-200 px-3 py-2 rounded-xl text-xs text-primary focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-primary hover:bg-primary-light text-white text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-full transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submittingReview ? 'Posting...' : 'Post Verified Review'}
                </button>
              </form>
            </div>
          </div>

          {/* 3. Right Inquiries Timelines Ledger */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-lg font-serif font-bold text-primary">Inquiries Timeline</h2>
            
            {inquiries.length === 0 ? (
              <div className="bg-white border border-black/5 p-16 rounded-3xl text-center space-y-4 shadow-premium">
                <span className="text-4xl block">🌍</span>
                <h3 className="text-md font-bold font-serif text-primary">No Inquiries Found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  You haven't requested any custom tour itineraries yet. Browse our luxury packages and submit your preferences!
                </p>
                <a
                  href="/packages"
                  className="inline-block bg-gold text-primary font-bold text-xs px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
                >
                  Explore Tour Packages
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {inquiries.map((inq) => (
                  <div key={inq._id} className="bg-white p-6 sm:p-8 rounded-3xl border border-black/5 shadow-premium space-y-6">
                    
                    {/* Inquiry Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-gray-100 pb-4 gap-2">
                      <div className="space-y-1">
                        {inq.package ? (
                          <h3 className="font-serif font-bold text-lg text-primary">{inq.package.name}</h3>
                        ) : (
                          <h3 className="font-serif font-bold text-lg text-primary italic text-gold">Custom Tailored Tour</h3>
                        )}
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400 font-semibold">
                          <span className="flex items-center space-x-1">
                            <FiCalendar />
                            <span>Date: {new Date(inq.travelDate).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <FiUsers />
                            <span>{inq.travelersCount} travelers</span>
                          </span>
                        </div>
                      </div>

                      {inq.package?.price && (
                        <div className="text-md font-bold text-primary sm:text-right">
                          ₹{inq.package.price.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Timeline Step-Tracker */}
                    <TimelineTrack status={inq.status} />

                    {/* Requirements and Message block */}
                    <div className="bg-pearl/50 p-4 rounded-2xl border border-gray-100 text-xs">
                      <span className="block font-bold text-gray-500 uppercase tracking-widest text-[9px] mb-1">Travel Specifications</span>
                      <p className="text-primary leading-relaxed">{inq.message}</p>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default UserDashboard;
