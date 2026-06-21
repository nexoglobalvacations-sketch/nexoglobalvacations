import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { FiMail, FiLock, FiUser, FiPhone, FiCompass } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';

const UserLoginSignup = () => {
  const { login, register, googleLogin, isAuthenticated, loading } = useUserAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  // Screen toggle: 'login' | 'signup'
  const [mode, setMode] = useState('login');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password || (mode === 'signup' && (!name || !phone))) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      let result;
      if (mode === 'login') {
        result = await login(email, password);
      } else {
        result = await register(name, email, password, phone);
      }

      if (result.success) {
        // Success redirects inside useEffect
      } else {
        setErrorMsg(result.error || 'Authentication failed. Please verify your details.');
      }
    } catch (err) {
      setErrorMsg('Server connection failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setSubmitting(true);
      setErrorMsg('');
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
        // Redirect handled by useEffect
      } else {
        setErrorMsg(result.error || 'Google Login failed.');
      }
    } catch (err) {
      setErrorMsg('Server connection failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pearl flex pt-20">
      
      {/* 1. Left Graphic Panel (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 relative bg-primary-dark overflow-hidden text-left">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 hover:scale-100 transition-transform duration-10000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-dark via-primary-dark/40 to-transparent" />
        <div className="absolute bottom-16 left-16 right-16 space-y-4 z-10">
          <FiCompass className="h-10 w-10 text-gold animate-spin-slow" />
          <h2 className="text-white text-4xl sm:text-5xl font-serif font-bold leading-tight">
            Draft Your Dream Bespoke Voyage
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm max-w-md leading-relaxed">
            Create an account or sign in to save premium, custom-designed travel itineraries, log preferences, and receive real-time scheduling tracking direct from our Delhi planners.
          </p>
          <div className="h-0.5 w-16 bg-gold mt-4 rounded-full" />
        </div>
      </div>

      {/* 2. Right Form Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-16 bg-white text-left">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gold uppercase tracking-widest">
              Traveler Gateway
            </span>
            <h1 className="text-3xl font-serif text-primary font-bold">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs text-gray-400">
              {mode === 'login' 
                ? 'Sign in to access your inquiries ledger and active tracks' 
                : 'Register to unlock luxury customized itineraries'}
            </p>
          </div>

          {/* Errors display */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-xs py-3 px-4 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            
            {mode === 'signup' && (
              <>
                {/* Name */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Full Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-3 text-gold h-4 w-4" />
                    <input
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full bg-pearl border border-gray-200 pl-11 pr-4 py-3 rounded-xl text-primary focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Phone Number *</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-3 text-gold h-4 w-4" />
                    <input
                      type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-pearl border border-gray-200 pl-11 pr-4 py-3 rounded-xl text-primary focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="font-bold text-gray-500 uppercase tracking-wider block">Email Address *</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3 text-gold h-4 w-4" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-pearl border border-gray-200 pl-11 pr-4 py-3 rounded-xl text-primary focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="font-bold text-gray-500 uppercase tracking-wider block">Password *</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3 text-gold h-4 w-4" />
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-pearl border border-gray-200 pl-11 pr-4 py-3 rounded-xl text-primary focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Action CTA */}
            <button
              type="submit" disabled={submitting}
              className="w-full bg-gold hover:bg-gold-light text-primary font-bold py-3.5 rounded-xl shadow-lg transition-all focus:outline-none cursor-pointer text-xs"
            >
              {submitting 
                ? 'Validating parameters...' 
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-3 text-gray-400 text-[10px] uppercase font-bold tracking-wider">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Login Button */}
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setErrorMsg('Google Sign-In failed')}
                theme="outline"
                shape="rectangular"
                width="384"
              />
            </div>
          </form>

          {/* Mode Switcher Toggle */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setErrorMsg('');
              }}
              className="text-xs text-primary font-bold hover:text-gold transition-colors focus:outline-none"
            >
              {mode === 'login' 
                ? "New to Nexo Global? Create Traveler Account" 
                : "Already registered? Access Traveler Portal"}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default UserLoginSignup;
