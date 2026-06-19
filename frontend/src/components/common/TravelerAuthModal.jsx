import React, { useState } from 'react';
import { useUserAuth } from '../../context/UserAuthContext';
import { FiX, FiLock, FiMail, FiUser, FiPhone, FiAlertCircle } from 'react-icons/fi';

const TravelerAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useUserAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        if (!name || !email || !phone || !password) {
          setError('Please fill in all coordinates.');
          setLoading(false);
          return;
        }
        result = await register({ name, email, phone, password });
      } else {
        if (!email || !password) {
          setError('Please enter both email and password.');
          setLoading(false);
          return;
        }
        result = await login({ email, password });
      }

      if (result?.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(result?.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.error('Modal Auth Error:', err);
      setError('Connection failed. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark backdrop with blur overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Premium Glassmorphic Modal Box */}
      <div className="relative bg-[#1E1E1E]/95 text-white w-full max-w-md rounded-3xl border border-gold/25 shadow-2xl p-8 sm:p-10 transform scale-100 transition-all duration-300 animate-scale-up z-10">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors focus:outline-none"
        >
          <FiX className="h-5 w-5" />
        </button>

        {/* Modal Branding Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.25em]">Nexo Global Vacations</span>
          <h3 className="text-2xl font-serif font-bold text-white tracking-wide">
            {isSignUp ? 'Create Traveler Account' : 'Traveler Portal Access'}
          </h3>
          <p className="text-[10px] text-gray-400">
            {isSignUp 
              ? 'Join our premium travel registry to submit custom tour requests' 
              : 'Sign in to sync, track, and update your customized travel itineraries'}
          </p>
        </div>

        {/* Dynamic Alerts */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-[10px] flex items-start space-x-2 mb-6">
            <FiAlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
          
          {/* Sign Up Fields */}
          {isSignUp && (
            <>
              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold h-4 w-4" />
                  <input
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Rajesh Kumar"
                    className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Phone Number *</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold h-4 w-4" />
                  <input
                    type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </>
          )}

          {/* Common Fields */}
          <div className="space-y-1">
            <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Email Address *</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold h-4 w-4" />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh@traveler.com"
                className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Password *</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold h-4 w-4" />
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            type="submit" disabled={loading}
            className="w-full bg-gold text-primary hover:bg-gold-light font-bold py-3.5 rounded-xl shadow-goldGlow transition-all uppercase tracking-wider mt-6 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Traveler Account' : 'Sign In as Traveler'}
          </button>
        </form>

        {/* Toggle between Login / Register */}
        <div className="text-center mt-6 text-[10px] text-gray-400 border-t border-white/5 pt-4">
          {isSignUp ? (
            <p>
              Already registered with Nexo Global?{' '}
              <button 
                onClick={() => { setIsSignUp(false); setError(''); }}
                className="text-gold font-bold hover:underline focus:outline-none"
              >
                Sign In Instead
              </button>
            </p>
          ) : (
            <p>
              First time traveling with us?{' '}
              <button 
                onClick={() => { setIsSignUp(true); setError(''); }}
                className="text-gold font-bold hover:underline focus:outline-none"
              >
                Create Free Account
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default TravelerAuthModal;
