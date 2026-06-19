import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg('Server connection failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center px-4 relative overflow-hidden pt-20">
      {/* Decorative backdrop shapes */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-gold/10 filter blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary-light/20 filter blur-3xl" />
      
      {/* Login Card */}
      <div className="w-full max-w-md bg-primary-dark/80 border border-gold/15 shadow-premium rounded-3xl p-8 sm:p-10 relative z-10 glassmorphism-dark">
        <div className="text-center space-y-2 mb-8">
          <span className="text-2xl font-bold font-serif tracking-widest text-gold uppercase">
            Nexo Global
          </span>
          <h2 className="text-xl font-serif text-white font-semibold">
            Admin Portal Access
          </h2>
          <p className="text-xs text-gray-400">Sign in to manage luxury tour packages and client leads</p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-3 px-4 rounded-xl mb-6 text-left">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs text-left">
          {/* Email */}
          <div className="space-y-1">
            <label className="font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ttcompany.com"
              className="w-full bg-primary/40 border border-gold/15 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-gold placeholder-gray-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="font-bold text-gray-400 uppercase tracking-wider block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-primary/40 border border-gold/15 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-gold placeholder-gray-500"
            />
          </div>

          {/* Action submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold text-primary hover:bg-gold-light font-bold py-4 rounded-xl shadow-lg transition-all focus:outline-none cursor-pointer active:translate-y-0.5"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] text-gray-500">
          Authorized personnel only. Sessions are fully encrypted and audited.
        </div>
      </div>
    </div>
  );
};

export default Login;
