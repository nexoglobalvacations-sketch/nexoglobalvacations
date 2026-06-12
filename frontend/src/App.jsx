import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserAuthProvider, useUserAuth } from './context/UserAuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatButtons from './components/common/FloatButtons';

// User Portal Pages
import Home from './pages/user/Home';
import AllPackages from './pages/user/AllPackages';
import PackageDetails from './pages/user/PackageDetails';
import CategoryPage from './pages/user/CategoryPage';
import AboutUs from './pages/user/AboutUs';
import ContactUs from './pages/user/ContactUs';
import FAQsPage from './pages/user/FAQsPage';
import InquiryPage from './pages/user/InquiryPage';
import Login from './pages/user/Login';
import UserLoginSignup from './pages/user/UserLoginSignup';
import UserDashboard from './pages/user/UserDashboard';
import DestinationsPage from './pages/user/DestinationsPage';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Secure Route Guard Helper Component (Admin)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center text-white">
        <div className="font-serif text-lg font-bold text-gold tracking-widest animate-pulse">
          VERIFYING ACCESS...
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Secure Route Guard Helper Component (Traveler)
const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUserAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center text-primary">
        <div className="font-serif text-lg font-bold text-gold tracking-widest animate-pulse">
          LOADING PORTAL...
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/user/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserAuthProvider>
          <div className="flex flex-col min-h-screen bg-pearl font-sans text-primary">
            {/* Header Navigation */}
            <Navbar />

            {/* Main Views Container */}
            <main className="flex-grow">
              <Routes>
                {/* User Portal Endpoints */}
                <Route path="/" element={<Home />} />
                <Route path="/packages" element={<AllPackages />} />
                <Route path="/packages/:slug" element={<PackageDetails />} />
                <Route path="/category/:catName" element={<CategoryPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/faqs" element={<FAQsPage />} />
                <Route path="/inquiry" element={<InquiryPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user/login" element={<UserLoginSignup />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                
                {/* Traveler Protected Dashboard */}
                <Route
                  path="/user/dashboard"
                  element={
                    <UserProtectedRoute>
                      <UserDashboard />
                    </UserProtectedRoute>
                  }
                />

                {/* Admin Portal Guarded Endpoints */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Persistent Floating Quick CTAs (WhatsApp, Enquire, Scroll-top) */}
            <FloatButtons />

            {/* Footer Navigation */}
            <Footer />
          </div>
        </UserAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
