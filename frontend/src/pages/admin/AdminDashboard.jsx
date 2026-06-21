import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import {
  FiBriefcase, FiMail, FiMapPin, FiHelpCircle, FiMessageSquare,
  FiPlus, FiEdit2, FiTrash2, FiLogOut, FiCheckCircle, FiClock,
  FiXCircle, FiGrid, FiEye, FiSettings, FiFolderPlus
} from 'react-icons/fi';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'packages' | 'destinations' | 'faqs' | 'testimonials' | 'sections'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Common listing states
  const [leads, setLeads] = useState([]);
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Common Modals/Editor States
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [destModalOpen, setDestModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);

  // Custom delete confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const triggerConfirm = (title, message, onConfirmAction) => {
    setConfirmModal({
      isOpen: true,
      title: title || 'Are you sure?',
      message: message || 'Do you really want to proceed?',
      onConfirm: () => {
        onConfirmAction();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Current editing records
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [editingDestId, setEditingDestId] = useState(null);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [editingTestId, setEditingTestId] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);

  // Package Form Fields
  const [packageName, setPackageName] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [packageDuration, setPackageDuration] = useState('');
  const [packageCategory, setPackageCategory] = useState('Beaches');
  const [packageDestination, setPackageDestination] = useState('');
  const [packageOverview, setPackageOverview] = useState('');
  const [packageIncluded, setPackageIncluded] = useState('');
  const [packageExcluded, setPackageExcluded] = useState('');
  const [packageHotelDetails, setPackageHotelDetails] = useState('');
  const [packageMealDetails, setPackageMealDetails] = useState('');
  const [packageTransportDetails, setPackageTransportDetails] = useState('');
  const [packageThumbnail, setPackageThumbnail] = useState('');
  const [packageHero, setPackageHero] = useState('');
  const [packageItinerary, setPackageItinerary] = useState([{ day: 1, title: '', activities: [''], accommodation: '', meals: '', transport: '' }]);
  const [packageFaqs, setPackageFaqs] = useState([{ question: '', answer: '' }]);
  const [packagePublished, setPackagePublished] = useState(true);
  const [packageGallery, setPackageGallery] = useState([]);

  // Destination Form Fields
  const [destName, setDestName] = useState('');
  const [destType, setDestType] = useState('state');
  const [destDesc, setDestDesc] = useState('');
  const [destImage, setDestImage] = useState('');
  const [destFeatured, setDestFeatured] = useState(true);

  // FAQ Form Fields
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('Booking');
  const [faqOrder, setFaqOrder] = useState(1);

  // Testimonial Form Fields
  const [testName, setTestName] = useState('');
  const [testRole, setTestRole] = useState('');
  const [testReview, setTestReview] = useState('');
  const [testRating, setTestRating] = useState(5);
  const [testImage, setTestImage] = useState('');

  // Homepage Section Form Fields
  const [sectionName, setSectionName] = useState('');
  const [sectionSlug, setSectionSlug] = useState('');
  const [sectionBanner, setSectionBanner] = useState('');
  const [sectionOrder, setSectionOrder] = useState(1);
  const [selectedPackIds, setSelectedPackIds] = useState([]);

  // Fetch metrics data dynamically
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [inqRes, packRes, destRes, faqRes, testRes, secRes] = await Promise.all([
        apiService.inquiries.getAll(),
        apiService.packages.getAll(),
        apiService.destinations.getAll(),
        apiService.faqs.getAll(),
        apiService.testimonials.getAll(),
        apiService.sections.getAll()
      ]);

      if (inqRes.data?.success) setLeads(inqRes.data.data);
      if (packRes.data?.success) setPackages(packRes.data.data);
      if (destRes.data?.success) setDestinations(destRes.data.data);
      if (faqRes.data?.success) setFaqs(faqRes.data.data);
      if (testRes.data?.success) setTestimonials(testRes.data.data);
      if (secRes.data?.success) setSections(secRes.data.data);

    } catch (err) {
      console.error('Failed to load dashboard parameters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // 1. INQUIRIES/LEADS HANDLERS
  const handleLeadStatusChange = async (id, status) => {
    try {
      const response = await apiService.inquiries.updateStatus(id, status);
      if (response.data?.success) {
        setLeads(leads.map((l) => (l._id === id ? { ...l, status } : l)));
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const handleLeadDelete = (id) => {
    triggerConfirm(
      'Delete Lead / Inquiry',
      'Are you sure you want to permanently delete this lead? This action cannot be undone.',
      async () => {
        try {
          const response = await apiService.inquiries.delete(id);
          if (response.data?.success) {
            setLeads(leads.filter((l) => l._id !== id));
          }
        } catch (err) {
          console.error('Failed to delete lead:', err);
        }
      }
    );
  };

  // 2. PACKAGES HANDLERS
  const handlePackageReset = () => {
    setEditingPackageId(null);
    setPackageName('');
    setPackagePrice('');
    setPackageDuration('');
    setPackageCategory('Beaches');
    setPackageDestination(destinations[0]?.name || '');
    setPackageOverview('');
    setPackageIncluded('');
    setPackageExcluded('');
    setPackageHotelDetails('');
    setPackageMealDetails('');
    setPackageTransportDetails('');
    setPackageThumbnail('');
    setPackageHero('');
    setPackageItinerary([{ day: 1, title: '', activities: [''], accommodation: '', meals: '', transport: '' }]);
    setPackageFaqs([{ question: '', answer: '' }]);
    setPackagePublished(true);
    setPackageGallery([]);
  };

  const handleOpenPackageCreate = () => {
    handlePackageReset();
    setPackageModalOpen(true);
  };

  const handleOpenPackageEdit = (pack) => {
    setEditingPackageId(pack._id);
    setPackageName(pack.name || '');
    setPackagePrice(pack.price || '');
    setPackageDuration(pack.duration || '');
    setPackageCategory(pack.category || 'Beaches');
    setPackageDestination(typeof pack.destination === 'object' ? pack.destination?.name : pack.destination || '');
    setPackageOverview(pack.overview || '');
    setPackageIncluded(pack.included?.join(', ') || '');
    setPackageExcluded(pack.excluded?.join(', ') || '');
    setPackageHotelDetails(pack.hotelDetails || '');
    setPackageMealDetails(pack.mealDetails || '');
    setPackageTransportDetails(pack.transportDetails || '');
    setPackageThumbnail(pack.thumbnail || '');
    setPackageHero(pack.heroBanner || '');
    setPackageItinerary(pack.itinerary && pack.itinerary.length > 0 ? pack.itinerary : [{ day: 1, title: '', activities: [''], accommodation: '', meals: '', transport: '' }]);
    setPackageFaqs(pack.faq && pack.faq.length > 0 ? pack.faq : [{ question: '', answer: '' }]);
    setPackagePublished(pack.isPublished !== false);
    setPackageGallery(pack.gallery && pack.gallery.length > 0 ? pack.gallery : []);
    setPackageModalOpen(true);
  };

  const handleItineraryChange = (idx, field, value) => {
    const updated = [...packageItinerary];
    updated[idx][field] = value;
    setPackageItinerary(updated);
  };

  const handleItineraryActivityChange = (dayIdx, actIdx, value) => {
    const updated = [...packageItinerary];
    updated[dayIdx].activities[actIdx] = value;
    setPackageItinerary(updated);
  };

  const handleAddItineraryDay = () => {
    setPackageItinerary([
      ...packageItinerary,
      { day: packageItinerary.length + 1, title: '', activities: [''], accommodation: '', meals: '', transport: '' }
    ]);
  };

  const handleRemoveItineraryDay = (idx) => {
    if (packageItinerary.length <= 1) return;
    const updated = packageItinerary.filter((_, i) => i !== idx).map((dayPlan, i) => ({ ...dayPlan, day: i + 1 }));
    setPackageItinerary(updated);
  };

  const handleAddItineraryActivity = (dayIdx) => {
    const updated = [...packageItinerary];
    updated[dayIdx].activities.push('');
    setPackageItinerary(updated);
  };

  const handleRemoveItineraryActivity = (dayIdx, actIdx) => {
    const updated = [...packageItinerary];
    if (updated[dayIdx].activities.length <= 1) return;
    updated[dayIdx].activities = updated[dayIdx].activities.filter((_, i) => i !== actIdx);
    setPackageItinerary(updated);
  };

  const handlePackageFaqChange = (idx, field, value) => {
    const updated = [...packageFaqs];
    updated[idx][field] = value;
    setPackageFaqs(updated);
  };

  const handleAddPackageFaq = () => {
    setPackageFaqs([...packageFaqs, { question: '', answer: '' }]);
  };

  const handleRemovePackageFaq = (idx) => {
    setPackageFaqs(packageFaqs.filter((_, i) => i !== idx));
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    if (!packageName || !packagePrice || !packageDuration) {
      alert('Please fill in required fields.');
      return;
    }

    // Resolve Destination ID based on select box
    const selectedDest = destinations.find(d => d.name === packageDestination);
    const destVal = selectedDest ? selectedDest._id : packageDestination || null;

    const payload = {
      name: packageName,
      price: Number(packagePrice),
      duration: packageDuration,
      category: packageCategory,
      destination: destVal,
      overview: packageOverview,
      included: packageIncluded.split(',').map(s => s.trim()).filter(Boolean),
      excluded: packageExcluded.split(',').map(s => s.trim()).filter(Boolean),
      hotelDetails: packageHotelDetails,
      mealDetails: packageMealDetails,
      transportDetails: packageTransportDetails,
      thumbnail: packageThumbnail,
      heroBanner: packageHero,
      gallery: packageGallery.filter(Boolean),
      itinerary: packageItinerary,
      faq: packageFaqs.filter(fq => fq.question),
      isPublished: packagePublished
    };

    try {
      let response;
      if (editingPackageId) {
        response = await apiService.packages.update(editingPackageId, payload);
      } else {
        response = await apiService.packages.create(payload);
      }

      if (response.data?.success) {
        alert('Package saved successfully!');
        setPackageModalOpen(false);
        loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to save package:', err);
      alert('Save operation failed. Verify form inputs.');
    }
  };

  const handlePackageDelete = (id) => {
    triggerConfirm(
      'Delete Package',
      'Are you sure you want to permanently delete this package? All associated data will be lost.',
      async () => {
        try {
          const response = await apiService.packages.delete(id);
          if (response.data?.success) {
            setPackages(packages.filter((p) => p._id !== id));
          }
        } catch (err) {
          console.error('Failed to delete package:', err);
        }
      }
    );
  };

  const handleGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      alert('Uploading images to Cloudinary, please wait...');
      const response = await apiService.packages.uploadImages(formData);
      if (response.data?.success && response.data?.urls) {
        setPackageGallery([...packageGallery, ...response.data.urls]);
        alert('All images uploaded successfully!');
      } else {
        alert('Upload failed: ' + (response.data?.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please check backend connection or file size limit.');
    }
  };

  const handleAddGalleryUrl = (url) => {
    if (!url) return;
    setPackageGallery([...packageGallery, url]);
  };

  const handleRemoveGalleryImage = (idx) => {
    setPackageGallery(packageGallery.filter((_, i) => i !== idx));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      alert('Uploading thumbnail to Cloudinary, please wait...');
      const response = await apiService.packages.uploadImages(formData);
      if (response.data?.success && response.data?.urls?.[0]) {
        setPackageThumbnail(response.data.urls[0]);
        alert('Thumbnail uploaded successfully!');
      } else {
        alert('Upload failed: ' + (response.data?.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Thumbnail upload failed:', err);
      alert('Thumbnail upload failed. Please check backend connection.');
    }
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      alert('Uploading hero banner to Cloudinary, please wait...');
      const response = await apiService.packages.uploadImages(formData);
      if (response.data?.success && response.data?.urls?.[0]) {
        setPackageHero(response.data.urls[0]);
        alert('Hero banner uploaded successfully!');
      } else {
        alert('Upload failed: ' + (response.data?.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Hero banner upload failed:', err);
      alert('Hero banner upload failed. Please check backend connection.');
    }
  };

  // 3. DESTINATIONS HANDLERS
  const handleDestImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      alert('Uploading destination image to Cloudinary, please wait...');
      const response = await apiService.packages.uploadImages(formData);
      if (response.data?.success && response.data?.urls?.[0]) {
        setDestImage(response.data.urls[0]);
        alert('Destination image uploaded successfully!');
      } else {
        alert('Upload failed: ' + (response.data?.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Destination upload failed:', err);
      alert('Upload failed. Please check backend connection.');
    }
  };

  const handleOpenDestCreate = () => {
    setEditingDestId(null);
    setDestName('');
    setDestType('state');
    setDestDesc('');
    setDestImage('');
    setDestFeatured(true);
    setDestModalOpen(true);
  };

  const handleOpenDestEdit = (dest) => {
    setEditingDestId(dest._id);
    setDestName(dest.name || '');
    setDestType(dest.type || 'state');
    setDestDesc(dest.description || '');
    setDestImage(dest.image || '');
    setDestFeatured(dest.isFeatured !== false);
    setDestModalOpen(true);
  };

  const handleDestSubmit = async (e) => {
    e.preventDefault();
    if (!destName || !destImage) {
      alert('Please fill in required fields.');
      return;
    }

    const payload = {
      name: destName,
      type: destType,
      description: destDesc,
      image: destImage,
      isFeatured: destFeatured
    };

    try {
      let response;
      if (editingDestId) {
        response = await apiService.destinations.update(editingDestId, payload);
      } else {
        response = await apiService.destinations.create(payload);
      }

      if (response.data?.success) {
        alert('Destination saved!');
        setDestModalOpen(false);
        loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to save destination:', err);
    }
  };

  const handleDestDelete = (id) => {
    triggerConfirm(
      'Delete Destination',
      'Are you sure you want to delete this destination? Packages associated with this destination may be affected.',
      async () => {
        try {
          const response = await apiService.destinations.delete(id);
          if (response.data?.success) {
            setDestinations(destinations.filter((d) => d._id !== id));
          }
        } catch (err) {
          console.error('Failed to delete destination:', err);
        }
      }
    );
  };

  // 4. FAQS HANDLERS
  const handleOpenFaqCreate = () => {
    setEditingFaqId(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('Booking');
    setFaqOrder(faqs.length + 1);
    setFaqModalOpen(true);
  };

  const handleOpenFaqEdit = (faq) => {
    setEditingFaqId(faq._id);
    setFaqQuestion(faq.question || '');
    setFaqAnswer(faq.answer || '');
    setFaqCategory(faq.category || 'Booking');
    setFaqOrder(faq.order || 1);
    setFaqModalOpen(true);
  };

  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) return;

    const payload = { question: faqQuestion, answer: faqAnswer, category: faqCategory, order: Number(faqOrder) };
    try {
      let response;
      if (editingFaqId) {
        response = await apiService.faqs.update(editingFaqId, payload);
      } else {
        response = await apiService.faqs.create(payload);
      }

      if (response.data?.success) {
        setFaqModalOpen(false);
        loadDashboardData();
      }
    } catch (err) {
      console.error('FAQ save failed:', err);
    }
  };

  const handleFaqDelete = (id) => {
    triggerConfirm(
      'Delete FAQ',
      'Are you sure you want to delete this FAQ? It will be removed from the public FAQ section.',
      async () => {
        try {
          const response = await apiService.faqs.delete(id);
          if (response.data?.success) {
            setFaqs(faqs.filter(f => f._id !== id));
          }
        } catch (err) {
          console.error('FAQ delete failed:', err);
        }
      }
    );
  };

  // 5. TESTIMONIALS HANDLERS
  const handleTestImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      alert('Uploading traveler avatar to Cloudinary, please wait...');
      const response = await apiService.packages.uploadImages(formData);
      if (response.data?.success && response.data?.urls?.[0]) {
        setTestImage(response.data.urls[0]);
        alert('Traveler avatar uploaded successfully!');
      } else {
        alert('Upload failed: ' + (response.data?.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Testimonial upload failed:', err);
      alert('Upload failed. Please check backend connection.');
    }
  };

  const handleOpenTestCreate = () => {
    setEditingTestId(null);
    setTestName('');
    setTestRole('');
    setTestReview('');
    setTestRating(5);
    setTestImage('https://images.unsplash.com/photo-1494790108377-be9c29b29330');
    setTestModalOpen(true);
  };

  const handleOpenTestEdit = (t) => {
    setEditingTestId(t._id);
    setTestName(t.name || '');
    setTestRole(t.role || '');
    setTestReview(t.review || '');
    setTestRating(t.rating || 5);
    setTestImage(t.image || '');
    setTestModalOpen(true);
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    if (!testName || !testReview) return;

    const payload = { name: testName, role: testRole, review: testReview, rating: Number(testRating), image: testImage };
    try {
      let response;
      if (editingTestId) {
        response = await apiService.testimonials.update(editingTestId, payload);
      } else {
        response = await apiService.testimonials.create(payload);
      }
      if (response.data?.success) {
        setTestModalOpen(false);
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestDelete = (id) => {
    triggerConfirm(
      'Delete Testimonial',
      'Are you sure you want to delete this testimonial? It will no longer display on the home reviews section.',
      async () => {
        try {
          const response = await apiService.testimonials.delete(id);
          if (response.data?.success) {
            setTestimonials(testimonials.filter((t) => t._id !== id));
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  // 6. DYNAMIC HOMEPAGE SECTIONS HANDLERS
  const handleOpenSectionCreate = () => {
    setEditingSectionId(null);
    setSectionName('');
    setSectionSlug('');
    setSectionBanner('');
    setSectionOrder(sections.length + 1);
    setSelectedPackIds([]);
    setSectionModalOpen(true);
  };

  const handleOpenSectionEdit = (sec) => {
    setEditingSectionId(sec._id);
    setSectionName(sec.name || '');
    setSectionSlug(sec.slug || '');
    setSectionBanner(sec.bannerImage || '');
    setSectionOrder(sec.order || 1);
    setSelectedPackIds(sec.packages?.map(p => p._id || p) || []);
    setSectionModalOpen(true);
  };

  const handleSectionPackageToggle = (id) => {
    if (selectedPackIds.includes(id)) {
      setSelectedPackIds(selectedPackIds.filter(pid => pid !== id));
    } else {
      setSelectedPackIds([...selectedPackIds, id]);
    }
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    if (!sectionName) return;

    const payload = {
      name: sectionName,
      slug: sectionSlug || sectionName.toLowerCase().replace(/\s+/g, '-'),
      bannerImage: sectionBanner || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      order: Number(sectionOrder),
      packages: selectedPackIds
    };

    try {
      let response;
      if (editingSectionId) {
        response = await apiService.sections.update(editingSectionId, payload);
      } else {
        response = await apiService.sections.create(payload);
      }

      if (response.data?.success) {
        alert('Home Section saved successfully!');
        setSectionModalOpen(false);
        loadDashboardData();
      }
    } catch (err) {
      console.error('Section save failed:', err);
    }
  };

  const handleSectionDelete = (id) => {
    triggerConfirm(
      'Delete Home Section',
      'Are you sure you want to delete this homepage slider section? It will be removed from the traveler view.',
      async () => {
        try {
          const response = await apiService.sections.delete(id);
          if (response.data?.success) {
            setSections(sections.filter(s => s._id !== id));
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-pearl flex pt-20">
      
      {/* 1. Left Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex w-64 bg-primary text-gray-300 flex-col justify-between border-r border-gold/15 flex-shrink-0">
        <div className="p-6 space-y-6">
          <div className="border-b border-white/10 pb-4 text-left">
            <h2 className="text-xl font-bold font-serif text-gold tracking-wider uppercase">Admin Area</h2>
            <p className="text-[10px] text-gray-400 font-medium">Logged in as {admin?.name || 'Manager'}</p>
          </div>

          <nav className="flex flex-col space-y-2 text-sm text-left">
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'leads' ? 'bg-gold text-primary font-bold shadow-md' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <FiMail className="h-4 w-4" />
              <span>Inquiries / Leads</span>
              {leads.filter(l => l.status === 'pending').length > 0 && (
                <span className="bg-red-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full ml-auto">
                  {leads.filter(l => l.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'packages' ? 'bg-gold text-primary font-bold shadow-md' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <FiBriefcase className="h-4 w-4" />
              <span>Tour Packages</span>
            </button>

            <button
              onClick={() => setActiveTab('destinations')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'destinations' ? 'bg-gold text-primary font-bold shadow-md' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <FiMapPin className="h-4 w-4" />
              <span>Destinations</span>
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'sections' ? 'bg-gold text-primary font-bold shadow-md' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <FiGrid className="h-4 w-4" />
              <span>Homepage Sliders</span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'faqs' ? 'bg-gold text-primary font-bold shadow-md' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <FiHelpCircle className="h-4 w-4" />
              <span>General FAQs</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'testimonials' ? 'bg-gold text-primary font-bold shadow-md' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <FiMessageSquare className="h-4 w-4" />
              <span>Testimonials</span>
            </button>
          </nav>
        </div>

        {/* Logout CTA */}
        <div className="p-6 border-t border-white/5 text-left">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 bg-primary-light hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow transition-colors cursor-pointer"
          >
            <FiLogOut className="h-4 w-4 text-gold" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar Navigation */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex">
          {/* Backdrop blur */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Mobile Drawer Menu */}
          <aside className="relative w-64 bg-primary text-gray-300 flex flex-col justify-between border-r border-gold/15 h-full z-50 animate-fade-in shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="text-left">
                  <h2 className="text-lg font-bold font-serif text-gold tracking-wider uppercase">Admin Area</h2>
                  <p className="text-[9px] text-gray-400 font-medium">Logged in as {admin?.name || 'Manager'}</p>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-white hover:text-gold p-1 focus:outline-none"
                >
                  <FiXCircle className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col space-y-2 text-sm text-left">
                <button
                  onClick={() => { setActiveTab('leads'); setIsSidebarOpen(false); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'leads' ? 'bg-gold text-primary font-bold shadow-md' : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FiMail className="h-4 w-4" />
                  <span>Inquiries / Leads</span>
                  {leads.filter(l => l.status === 'pending').length > 0 && (
                    <span className="bg-red-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full ml-auto">
                      {leads.filter(l => l.status === 'pending').length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { setActiveTab('packages'); setIsSidebarOpen(false); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'packages' ? 'bg-gold text-primary font-bold shadow-md' : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FiBriefcase className="h-4 w-4" />
                  <span>Tour Packages</span>
                </button>

                <button
                  onClick={() => { setActiveTab('destinations'); setIsSidebarOpen(false); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'destinations' ? 'bg-gold text-primary font-bold shadow-md' : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FiMapPin className="h-4 w-4" />
                  <span>Destinations</span>
                </button>

                <button
                  onClick={() => { setActiveTab('sections'); setIsSidebarOpen(false); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'sections' ? 'bg-gold text-primary font-bold shadow-md' : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FiGrid className="h-4 w-4" />
                  <span>Homepage Sliders</span>
                </button>

                <button
                  onClick={() => { setActiveTab('faqs'); setIsSidebarOpen(false); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'faqs' ? 'bg-gold text-primary font-bold shadow-md' : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FiHelpCircle className="h-4 w-4" />
                  <span>General FAQs</span>
                </button>

                <button
                  onClick={() => { setActiveTab('testimonials'); setIsSidebarOpen(false); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'testimonials' ? 'bg-gold text-primary font-bold shadow-md' : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FiMessageSquare className="h-4 w-4" />
                  <span>Testimonials</span>
                </button>
              </nav>
            </div>

            <div className="p-6 border-t border-white/5 text-left">
              <button
                onClick={() => { logout(); setIsSidebarOpen(false); }}
                className="w-full flex items-center justify-center space-x-2 bg-primary-light hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow transition-colors cursor-pointer"
              >
                <FiLogOut className="h-4 w-4 text-gold" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 2. Main Content Board */}
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto overflow-y-auto">
        {/* Mobile Sidebar Hamburger Toggle & Title Bar */}
        <div className="md:hidden flex items-center justify-between bg-primary text-white px-4 py-3 rounded-2xl border border-gold/15 shadow-md mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-white hover:text-gold focus:outline-none transition-colors cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-serif font-bold text-gold uppercase tracking-wider text-xs">
              {activeTab === 'leads' ? 'Leads' : 
               activeTab === 'packages' ? 'Packages' : 
               activeTab === 'destinations' ? 'Destinations' : 
               activeTab === 'sections' ? 'Sliders' : 
               activeTab === 'faqs' ? 'FAQs' : 'Reviews'}
            </span>
          </div>
          <span className="text-[9px] text-gray-400 font-semibold uppercase">{admin?.name || 'Manager'}</span>
        </div>

        {loading ? (
          <div className="text-center font-serif text-lg font-semibold py-20 text-gray-400">
            Synchronizing administrative records...
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in text-left">
            
            {/* 1. LEAD / INQUIRIES TAB */}
            {activeTab === 'leads' && (
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-serif text-primary font-bold">Leads Ledger</h2>
                    <p className="text-xs text-gray-400 mt-1">Review traveler inquiry coordinates and configure statuses</p>
                  </div>
                </div>

                {leads.length === 0 ? (
                  <div className="bg-white border border-black/5 p-12 rounded-3xl text-center text-gray-400">
                    No leads recorded yet.
                  </div>
                ) : (
                  <div className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-premium">
                    <table className="w-full text-xs text-left text-primary">
                      <thead className="bg-pearl font-bold text-gray-500 uppercase border-b border-gray-100">
                        <tr>
                          <th className="px-4 md:px-6 py-4">Traveler Details</th>
                          <th className="px-6 py-4 hidden md:table-cell">Inquiry Package</th>
                          <th className="px-6 py-4 hidden sm:table-cell">Travel Metrics</th>
                          <th className="px-4 md:px-6 py-4">Status</th>
                          <th className="px-4 md:px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {leads.map((l) => (
                          <tr key={l._id} className="hover:bg-pearl/50 transition-colors">
                            <td className="px-4 md:px-6 py-4 space-y-1">
                              <span className="font-bold text-primary block text-sm">{l.name}</span>
                              <span className="text-[10px] text-gray-400 block">{l.email}</span>
                              <span className="text-[10px] text-gray-400 block">{l.phone}</span>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              {l.packageId ? (
                                <span className="font-bold text-gold text-sm block">
                                  {typeof l.packageId === 'object' ? l.packageId.name : 'Tour Package'}
                                </span>
                              ) : (
                                <span className="text-gray-400 block italic">Custom/Let Planners Choose</span>
                              )}
                              <p className="text-[10px] text-gray-500 max-w-xs line-clamp-2 mt-1">{l.message}</p>
                            </td>
                            <td className="px-6 py-4 space-y-1 hidden sm:table-cell">
                              <span className="block font-bold">Date: {l.travelDate ? new Date(l.travelDate).toLocaleDateString() : 'TBA'}</span>
                              <span className="block text-gray-400 font-semibold">{l.travelersCount} travelers</span>
                            </td>
                            <td className="px-4 md:px-6 py-4">
                              <select
                                value={l.status || 'pending'}
                                onChange={(e) => handleLeadStatusChange(l._id, e.target.value)}
                                className={`text-[10px] font-bold uppercase px-2 md:px-3 py-1.5 rounded-full focus:outline-none cursor-pointer ${
                                  l.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' :
                                  l.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                                  l.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                  'bg-amber-100 text-amber-600'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-4 md:px-6 py-4 text-right">
                              <button
                                onClick={() => handleLeadDelete(l._id)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* 2. PACKAGES TAB */}
            {activeTab === 'packages' && (
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-serif text-primary font-bold">Luxury Tour Packages</h2>
                    <p className="text-xs text-gray-400 mt-1">Configure bespoke day itineraries, prices, stay detail grids</p>
                  </div>
                  <button
                    onClick={handleOpenPackageCreate}
                    className="flex items-center space-x-2 bg-gold hover:bg-gold-light text-primary font-bold px-5 py-3 rounded-full shadow transition-all transform active:scale-95 cursor-pointer"
                  >
                    <FiPlus className="h-4 w-4" />
                    <span>Create Package</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pack) => (
                    <div key={pack._id} className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-premium flex flex-col justify-between group h-full">
                      {/* Image Thumbnail */}
                      <div className="h-44 relative overflow-hidden">
                        <img
                          src={pack.thumbnail || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
                          alt={pack.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-primary text-white font-bold text-[9px] uppercase px-3 py-1 rounded-full border border-gold/15">
                          {pack.category}
                        </div>
                      </div>

                      {/* Info & Operations */}
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="font-serif font-bold text-md text-primary line-clamp-1">{pack.name}</h3>
                          <div className="flex justify-between text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                            <span>{pack.duration}</span>
                            <span>{typeof pack.destination === 'object' ? pack.destination?.name : 'India'}</span>
                          </div>
                          <div className="text-sm font-bold text-primary">₹{pack.price?.toLocaleString()}</div>
                        </div>

                        {/* Actions row */}
                        <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenPackageEdit(pack)}
                            className="flex items-center space-x-1 text-gold hover:text-white border border-gold/20 hover:bg-gold px-3.5 py-2 rounded-full text-[10px] font-bold transition-all"
                          >
                            <FiEdit2 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handlePackageDelete(pack._id)}
                            className="flex items-center space-x-1 text-red-500 hover:text-white border border-red-500/20 hover:bg-red-500 px-3.5 py-2 rounded-full text-[10px] font-bold transition-all"
                          >
                            <FiTrash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. DESTINATIONS TAB */}
            {activeTab === 'destinations' && (
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-serif text-primary font-bold">Destinations Configurator</h2>
                    <p className="text-xs text-gray-400 mt-1">Add domestic Indian states and exotic international gates</p>
                  </div>
                  <button
                    onClick={handleOpenDestCreate}
                    className="flex items-center space-x-2 bg-gold hover:bg-gold-light text-primary font-bold px-5 py-3 rounded-full shadow transition-all active:scale-95 cursor-pointer"
                  >
                    <FiPlus className="h-4 w-4" />
                    <span>Add Destination</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {destinations.map((d) => (
                    <div key={d._id} className="relative h-60 rounded-2xl overflow-hidden shadow-premium group border border-black/5">
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-left">
                        <span className="text-[9px] bg-gold text-primary font-bold uppercase px-2 py-0.5 rounded-full mb-1 inline-block">
                          {d.type}
                        </span>
                        <h4 className="text-white font-serif font-bold text-md">{d.name}</h4>
                      </div>
                      
                      {/* Floating actions */}
                      <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenDestEdit(d)}
                          className="bg-white p-2 rounded-full text-gold shadow hover:bg-pearl"
                        >
                          <FiEdit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDestDelete(d._id)}
                          className="bg-white p-2 rounded-full text-red-500 shadow hover:bg-red-50"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. HOMEPAGE SECTIONS TAB */}
            {activeTab === 'sections' && (
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-serif text-primary font-bold">Homepage Segment Sliders</h2>
                    <p className="text-xs text-gray-400 mt-1">Link specific packages to custom curated home segments (e.g. Beaches Special)</p>
                  </div>
                  <button
                    onClick={handleOpenSectionCreate}
                    className="flex items-center space-x-2 bg-gold hover:bg-gold-light text-primary font-bold px-5 py-3 rounded-full shadow transition-all active:scale-95 cursor-pointer"
                  >
                    <FiFolderPlus className="h-4 w-4" />
                    <span>Create Homepage Slider</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sections.map((sec) => (
                    <div key={sec._id} className="bg-white p-6 rounded-3xl border border-black/5 shadow-premium flex flex-col justify-between text-left space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif font-bold text-lg text-primary">{sec.name}</h3>
                          <span className="text-[10px] bg-pearl text-gold font-bold px-3 py-1 rounded-full">Order: {sec.order}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Slug: {sec.slug}</p>
                        <div className="h-px bg-gray-100" />
                        <div className="space-y-1">
                          <span className="block font-bold text-[9px] text-gray-400 uppercase tracking-widest">Linked Packages ({sec.packages?.length || 0})</span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {sec.packages && sec.packages.map((p) => (
                              <span key={p._id || p} className="bg-pearl text-primary text-[10px] px-3 py-1 rounded-full border border-black/5 font-semibold">
                                {p.name || 'Tour package'}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleOpenSectionEdit(sec)}
                          className="flex items-center space-x-1 text-gold border border-gold/25 hover:bg-gold hover:text-white px-4 py-2 rounded-full font-bold text-[10px] transition-colors"
                        >
                          <FiEdit2 className="h-3 w-3" />
                          <span>Configure Slider</span>
                        </button>
                        <button
                          onClick={() => handleSectionDelete(sec._id)}
                          className="flex items-center space-x-1 text-red-500 border border-red-500/25 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full font-bold text-[10px] transition-colors"
                        >
                          <FiTrash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. GENERAL FAQS TAB */}
            {activeTab === 'faqs' && (
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-serif text-primary font-bold">General Accordion FAQs</h2>
                    <p className="text-xs text-gray-400 mt-1">Configure questions on policies, transfers, customizable flights</p>
                  </div>
                  <button
                    onClick={handleOpenFaqCreate}
                    className="flex items-center space-x-2 bg-gold hover:bg-gold-light text-primary font-bold px-5 py-3 rounded-full shadow transition-all active:scale-95 cursor-pointer"
                  >
                    <FiPlus className="h-4 w-4" />
                    <span>Create FAQ</span>
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-black/5 shadow-premium overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {faqs.map((faq) => (
                      <div key={faq._id} className="p-6 flex items-start justify-between hover:bg-pearl/30 transition-colors">
                        <div className="space-y-1 max-w-4xl text-left">
                          <h4 className="font-serif font-bold text-md text-primary">{faq.question}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed pr-10">{faq.answer}</p>
                          <span className="text-[9px] bg-pearl text-gold font-bold px-2 py-0.5 rounded-full inline-block mt-2">
                            Category: {faq.category} (Order: {faq.order})
                          </span>
                        </div>
                        <div className="flex space-x-1 flex-shrink-0">
                          <button
                            onClick={() => handleOpenFaqEdit(faq)}
                            className="p-2 text-gold hover:bg-gold/10 rounded-full"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleFaqDelete(faq._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 6. TESTIMONIALS TAB */}
            {activeTab === 'testimonials' && (
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-serif text-primary font-bold">Travelers Testimonials</h2>
                    <p className="text-xs text-gray-400 mt-1">Configure client profiles, comments, and star ratings</p>
                  </div>
                  <button
                    onClick={handleOpenTestCreate}
                    className="flex items-center space-x-2 bg-gold hover:bg-gold-light text-primary font-bold px-5 py-3 rounded-full shadow transition-all active:scale-95 cursor-pointer"
                  >
                    <FiPlus className="h-4 w-4" />
                    <span>Create Testimonial</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {testimonials.map((t) => (
                    <div key={t._id} className="bg-white p-6 rounded-3xl border border-black/5 shadow-premium flex flex-col justify-between text-left space-y-4">
                      <p className="text-xs italic text-gray-500">"{t.review}"</p>
                      
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                        <div className="flex items-center space-x-3">
                          <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover border border-gold" />
                          <div>
                            <h4 className="font-serif font-bold text-primary text-xs">{t.name}</h4>
                            <span className="text-[9px] text-gray-400">{t.role}</span>
                          </div>
                        </div>

                        <div className="flex space-x-1">
                          <button onClick={() => handleOpenTestEdit(t)} className="p-1.5 text-gold hover:bg-pearl rounded-full">
                            <FiEdit2 className="h-3 w-3" />
                          </button>
                          <button onClick={() => handleTestDelete(t._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full">
                            <FiTrash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* 3. DYNAMIC CRUDS MODALS */}
      {/* ============================================================== */}

      {/* A. PACKAGE CRUD EDIT MODAL */}
      {packageModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-premium border border-gold/15 max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden text-left">
            
            {/* Modal Header */}
            <div className="bg-primary text-white p-6 flex justify-between items-center border-b border-gold/15">
              <h3 className="font-serif font-bold text-lg text-gold">
                {editingPackageId ? 'Edit Luxury Package' : 'Create Bespoke Package'}
              </h3>
              <button
                onClick={() => setPackageModalOpen(false)}
                className="text-white hover:text-gold focus:outline-none"
              >
                <FiXCircle className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form onSubmit={handlePackageSubmit} className="flex-grow p-8 overflow-y-auto text-xs space-y-6">
              
              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Package Title *</label>
                  <input
                    type="text" required value={packageName} onChange={(e) => setPackageName(e.target.value)}
                    placeholder="e.g. Paradise of Kerala Tour"
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 uppercase tracking-wider">Starting Price (₹) *</label>
                    <input
                      type="number" required value={packagePrice} onChange={(e) => setPackagePrice(e.target.value)}
                      placeholder="e.g. 24999"
                      className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 uppercase tracking-wider">Duration Badge *</label>
                    <input
                      type="text" required value={packageDuration} onChange={(e) => setPackageDuration(e.target.value)}
                      placeholder="e.g. 08 D / 07 N"
                      className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Travel Style / Category *</label>
                  <select
                    value={packageCategory} onChange={(e) => setPackageCategory(e.target.value)}
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold cursor-pointer"
                  >
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Spiritual">Spiritual</option>
                    <option value="Beaches">Beaches</option>
                    <option value="Mountains">Mountains</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="International">International</option>
                    <option value="Family Trips">Family Trips</option>
                    <option value="Group Tours">Group Tours</option>
                    <option value="Custom Tours">Custom Tours</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Linked Destination *</label>
                  <select
                    value={packageDestination} onChange={(e) => setPackageDestination(e.target.value)}
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none focus:border-gold cursor-pointer"
                  >
                    <option value="">-- Let Planners Choose --</option>
                    {destinations.map((d) => (
                      <option key={d._id} value={d.name}>{d.name} ({d.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Textareas */}
              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider">Overview Text *</label>
                <textarea
                  rows="4" required value={packageOverview} onChange={(e) => setPackageOverview(e.target.value)}
                  placeholder="Detail overview of travel escape..."
                  className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                />
              </div>

              {/* Image Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 pt-4 text-left">
                {/* Thumbnail Image */}
                <div className="space-y-2">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Thumbnail Image</label>
                  <input
                    type="text" value={packageThumbnail} onChange={(e) => setPackageThumbnail(e.target.value)}
                    placeholder="Paste Thumbnail URL (https://...)"
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none text-xs"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] text-gray-400 font-bold uppercase whitespace-nowrap">Or upload:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="w-full bg-pearl border border-gray-200 px-2 py-1 rounded-lg text-primary focus:outline-none file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-primary file:text-white hover:file:bg-primary-dark file:cursor-pointer text-[10px]"
                    />
                  </div>
                  {packageThumbnail && (
                    <div className="relative h-20 w-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm mt-2">
                      <img src={packageThumbnail} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Hero Banner Image */}
                <div className="space-y-2">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Hero Banner Image</label>
                  <input
                    type="text" value={packageHero} onChange={(e) => setPackageHero(e.target.value)}
                    placeholder="Paste Hero Banner URL (https://...)"
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none text-xs"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] text-gray-400 font-bold uppercase whitespace-nowrap">Or upload:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroUpload}
                      className="w-full bg-pearl border border-gray-200 px-2 py-1 rounded-lg text-primary focus:outline-none file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-primary file:text-white hover:file:bg-primary-dark file:cursor-pointer text-[10px]"
                    />
                  </div>
                  {packageHero && (
                    <div className="relative h-20 w-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm mt-2">
                      <img src={packageHero} alt="Hero Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Visual Journey Gallery Section */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <label className="font-bold text-gray-500 uppercase tracking-wider block text-left">Visual Journey Gallery</label>
                
                {/* File Uploader Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] text-gray-400 font-semibold block mb-1">Upload Multiple Images directly to Cloudinary</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="w-full bg-pearl border border-gray-200 px-3 py-2 rounded-xl text-primary focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-gold file:text-primary hover:file:bg-gold-light file:cursor-pointer text-xs"
                    />
                  </div>
                  
                  {/* Copy-paste manual URL input */}
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] text-gray-400 font-semibold block mb-1">Or add image URL manually (Press Add / Enter)</span>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="manual-gallery-url"
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-pearl border border-gray-200 px-4 py-2 rounded-xl text-primary focus:outline-none text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddGalleryUrl(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('manual-gallery-url');
                          if (input && input.value) {
                            handleAddGalleryUrl(input.value);
                            input.value = '';
                          }
                        }}
                        className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Previews Grid */}
                {packageGallery.length > 0 && (
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] text-gray-400 font-bold block">Current Gallery Images ({packageGallery.length}) - Hover to Remove</span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 bg-pearl p-3 rounded-2xl border border-gray-200 max-h-40 overflow-y-auto">
                      {packageGallery.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 group shadow-sm bg-white">
                          <img src={imgUrl} alt={`gallery-${imgIdx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(imgIdx)}
                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center font-bold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Inclusions Exclusions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Inclusions (Comma Separated)</label>
                  <textarea
                    rows="3" value={packageIncluded} onChange={(e) => setPackageIncluded(e.target.value)}
                    placeholder="Stay at 4 Star, Daily Buffet Dinner, Airport Pickup..."
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Exclusions (Comma Separated)</label>
                  <textarea
                    rows="3" value={packageExcluded} onChange={(e) => setPackageExcluded(e.target.value)}
                    placeholder="Flight tickets, Scuba Diving charges, Personal Laundry..."
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Tabs grids inputs */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Hotels details Text</label>
                  <input
                    type="text" value={packageHotelDetails} onChange={(e) => setPackageHotelDetails(e.target.value)}
                    placeholder="Munnar: Tea County Deluxe Room..."
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Meal details Text</label>
                  <input
                    type="text" value={packageMealDetails} onChange={(e) => setPackageMealDetails(e.target.value)}
                    placeholder="Daily Buffet Breakfast and Dinner..."
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider">Transport details Text</label>
                  <input
                    type="text" value={packageTransportDetails} onChange={(e) => setPackageTransportDetails(e.target.value)}
                    placeholder="Private AC Sedan with certified driver..."
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Daywise Itinerary (Dynamic Section) */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-serif font-bold text-md text-primary">Day-Wise Itinerary Plan</h4>
                  <button
                    type="button" onClick={handleAddItineraryDay}
                    className="flex items-center space-x-1 text-gold font-bold hover:text-gold-dark cursor-pointer focus:outline-none"
                  >
                    <FiPlus />
                    <span>Add Itinerary Day</span>
                  </button>
                </div>

                {packageItinerary.map((dayPlan, dayIdx) => (
                  <div key={dayIdx} className="bg-pearl p-5 rounded-2xl border border-gray-200 space-y-4 relative">
                    {packageItinerary.length > 1 && (
                      <button
                        type="button" onClick={() => handleRemoveItineraryDay(dayIdx)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold focus:outline-none"
                      >
                        Remove Day
                      </button>
                    )}

                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="col-span-1">
                        <span className="font-bold text-gray-500">Day {dayPlan.day} Title *</span>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text" required value={dayPlan.title} onChange={(e) => handleItineraryChange(dayIdx, 'title', e.target.value)}
                          placeholder="e.g. Arrival in Cochin & Munnar Transit"
                          className="w-full bg-white border border-gray-200 px-4 py-2 rounded-xl text-primary focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    {/* Day Activities */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-500">Activities / Sights of Day</span>
                        <button
                          type="button" onClick={() => handleAddItineraryActivity(dayIdx)}
                          className="text-[10px] text-gold font-bold hover:underline"
                        >
                          + Add Activity Row
                        </button>
                      </div>
                      
                      {dayPlan.activities.map((act, actIdx) => (
                        <div key={actIdx} className="flex items-center space-x-2">
                          <input
                            type="text" required value={act} onChange={(e) => handleItineraryActivityChange(dayIdx, actIdx, e.target.value)}
                            placeholder="e.g. Visit Cheeyappara waterfall..."
                            className="w-full bg-white border border-gray-200 px-4 py-2 rounded-xl text-primary focus:outline-none text-xs"
                          />
                          {dayPlan.activities.length > 1 && (
                            <button
                              type="button" onClick={() => handleRemoveItineraryActivity(dayIdx, actIdx)}
                              className="text-red-500 font-bold text-xs hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Daily logistics */}
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text" value={dayPlan.accommodation} onChange={(e) => handleItineraryChange(dayIdx, 'accommodation', e.target.value)}
                        placeholder="Stay Lodge (e.g. Hill Valley Resort)"
                        className="bg-white border border-gray-200 px-3 py-2 rounded-xl focus:outline-none"
                      />
                      <input
                        type="text" value={dayPlan.meals} onChange={(e) => handleItineraryChange(dayIdx, 'meals', e.target.value)}
                        placeholder="Meals (e.g. Breakfast & Dinner)"
                        className="bg-white border border-gray-200 px-3 py-2 rounded-xl focus:outline-none"
                      />
                      <input
                        type="text" value={dayPlan.transport} onChange={(e) => handleItineraryChange(dayIdx, 'transport', e.target.value)}
                        placeholder="Transit (e.g. Private Sedan)"
                        className="bg-white border border-gray-200 px-3 py-2 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Package Specific FAQs (Dynamic Section) */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-serif font-bold text-md text-primary">Package Specific FAQs</h4>
                  <button
                    type="button" onClick={handleAddPackageFaq}
                    className="flex items-center space-x-1 text-gold font-bold hover:text-gold-dark cursor-pointer focus:outline-none"
                  >
                    <FiPlus />
                    <span>Add FAQ Row</span>
                  </button>
                </div>

                {packageFaqs.map((fq, idx) => (
                  <div key={idx} className="bg-pearl p-4 rounded-xl border border-gray-200 space-y-2 relative">
                    <button
                      type="button" onClick={() => handleRemovePackageFaq(idx)}
                      className="absolute top-2 right-2 text-red-500 font-bold"
                    >
                      Delete
                    </button>
                    <input
                      type="text" value={fq.question} onChange={(e) => handlePackageFaqChange(idx, 'question', e.target.value)}
                      placeholder="FAQ Question (e.g. Is ferry ticket pre-booked?)"
                      className="w-full bg-white border border-gray-200 px-4 py-2 rounded-lg"
                    />
                    <textarea
                      rows="2" value={fq.answer} onChange={(e) => handlePackageFaqChange(idx, 'answer', e.target.value)}
                      placeholder="FAQ Answer (e.g. Yes, tickets are pre-booked in executive cruise class.)"
                      className="w-full bg-white border border-gray-200 px-4 py-2 rounded-lg"
                    />
                  </div>
                ))}
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <input
                  type="checkbox" id="published" checked={packagePublished} onChange={(e) => setPackagePublished(e.target.checked)}
                  className="h-4 w-4 accent-gold cursor-pointer"
                />
                <label htmlFor="published" className="font-bold text-primary uppercase cursor-pointer select-none">Publish Immediately on Website</label>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button" onClick={() => setPackageModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-full cursor-pointer focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold text-primary hover:bg-gold-light font-bold px-8 py-3 rounded-full shadow cursor-pointer focus:outline-none"
                >
                  Save Package
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* B. DESTINATION CRUD MODAL */}
      {destModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden text-left">
            <div className="bg-primary text-white p-5 flex justify-between items-center">
              <h3 className="font-serif font-bold text-md text-gold">
                {editingDestId ? 'Edit Destination' : 'Add Destination'}
              </h3>
              <button onClick={() => setDestModalOpen(false)} className="text-white hover:text-gold focus:outline-none">
                <FiXCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDestSubmit} className="p-6 text-xs space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider block">Destination Name *</label>
                <input
                  type="text" required value={destName} onChange={(e) => setDestName(e.target.value)}
                  placeholder="e.g. Kerala, Bali, Goa..."
                  className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider block">Location Type *</label>
                <select
                  value={destType} onChange={(e) => setDestType(e.target.value)}
                  className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none cursor-pointer"
                >
                  <option value="state">Indian State</option>
                  <option value="country">International Country</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-gray-500 uppercase tracking-wider block text-xs">Scenic Image *</label>
                <input
                  type="text" required value={destImage} onChange={(e) => setDestImage(e.target.value)}
                  placeholder="Paste scenic image URL (https://...)"
                  className="w-full bg-pearl border border-gray-200 px-4 py-2 rounded-xl text-primary focus:outline-none text-[11px]"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] text-gray-400 font-bold uppercase whitespace-nowrap">Or upload:</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDestImageUpload}
                    className="w-full bg-pearl border border-gray-200 px-2 py-1 rounded-lg text-primary focus:outline-none file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-primary file:text-gold hover:file:bg-primary-dark file:cursor-pointer text-[10px]"
                  />
                </div>
                {destImage && (
                  <div className="relative h-16 w-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm mt-1">
                    <img src={destImage} alt="Destination Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider block">Brief description</label>
                <textarea
                  rows="3" value={destDesc} onChange={(e) => setDestDesc(e.target.value)}
                  placeholder="e.g. Serene tea estates and backwater channels..."
                  className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox" id="destFeatured" checked={destFeatured} onChange={(e) => setDestFeatured(e.target.checked)}
                  className="h-4 w-4 accent-gold"
                />
                <label htmlFor="destFeatured" className="font-bold text-primary uppercase select-none cursor-pointer">Feature on Homepage</label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button" onClick={() => setDestModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold text-primary font-bold px-6 py-2 rounded-full shadow cursor-pointer"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. HOMEPAGE SECTION SLIDER CRUD MODAL */}
      {sectionModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden text-left">
            <div className="bg-primary text-white p-5 flex justify-between items-center">
              <h3 className="font-serif font-bold text-md text-gold">
                {editingSectionId ? 'Configure Homepage Slider' : 'Create Homepage Slider'}
              </h3>
              <button onClick={() => setSectionModalOpen(false)} className="text-white hover:text-gold focus:outline-none">
                <FiXCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSectionSubmit} className="p-6 text-xs space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider block">Slider / Section Name *</label>
                <input
                  type="text" required value={sectionName} onChange={(e) => setSectionName(e.target.value)}
                  placeholder="e.g. Beaches Special"
                  className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Slug (Unique identifier)</label>
                  <input
                    type="text" value={sectionSlug} onChange={(e) => setSectionSlug(e.target.value)}
                    placeholder="e.g. beaches-special"
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Sort Display Order</label>
                  <input
                    type="number" min="1" value={sectionOrder} onChange={(e) => setSectionOrder(e.target.value)}
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider block">Banner Image URL</label>
                <input
                  type="text" value={sectionBanner} onChange={(e) => setSectionBanner(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                />
              </div>

              {/* Linked Packages Selector */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <label className="font-bold text-gray-500 uppercase tracking-wider block">Select Packages to show in Slider</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-100 p-3 rounded-xl bg-pearl">
                  {packages.map((pack) => (
                    <div key={pack._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`sec-pack-${pack._id}`}
                        checked={selectedPackIds.includes(pack._id)}
                        onChange={() => handleSectionPackageToggle(pack._id)}
                        className="h-3.5 w-3.5 accent-gold cursor-pointer"
                      />
                      <label htmlFor={`sec-pack-${pack._id}`} className="font-semibold text-primary cursor-pointer select-none text-[11px]">
                        {pack.name} ({pack.duration})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button" onClick={() => setSectionModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold text-primary font-bold px-6 py-2 rounded-full shadow cursor-pointer"
                >
                  Save Slider Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. GENERAL FAQS CRUD MODAL */}
      {faqModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden text-left">
            <div className="bg-primary text-white p-5 flex justify-between items-center">
              <h3 className="font-serif font-bold text-md text-gold">
                {editingFaqId ? 'Edit General FAQ' : 'Create General FAQ'}
              </h3>
              <button onClick={() => setFaqModalOpen(false)} className="text-white hover:text-gold focus:outline-none">
                <FiXCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFaqSubmit} className="p-6 text-xs space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider block">Question *</label>
                <input
                  type="text" required value={faqQuestion} onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="e.g. How do I book a customized tour package?"
                  className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider block">Answer Details *</label>
                <textarea
                  rows="4" required value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="e.g. You can submit your preferences through our dynamic Inquiry Page..."
                  className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Category Type</label>
                  <select
                    value={faqCategory} onChange={(e) => setFaqCategory(e.target.value)}
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none cursor-pointer"
                  >
                    <option value="Booking">Booking</option>
                    <option value="Services">Services</option>
                    <option value="Policies">Policies</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Sort Display Order</label>
                  <input
                    type="number" min="1" value={faqOrder} onChange={(e) => setFaqOrder(Number(e.target.value))}
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button" onClick={() => setFaqModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold text-primary font-bold px-6 py-2 rounded-full shadow cursor-pointer"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E. TESTIMONIALS CRUD MODAL */}
      {testModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden text-left">
            <div className="bg-primary text-white p-5 flex justify-between items-center">
              <h3 className="font-serif font-bold text-md text-gold">
                {editingTestId ? 'Edit Testimonial' : 'Create Testimonial'}
              </h3>
              <button onClick={() => setTestModalOpen(false)} className="text-white hover:text-gold focus:outline-none">
                <FiXCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleTestSubmit} className="p-6 text-xs space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Traveler Name *</label>
                  <input
                    type="text" required value={testName} onChange={(e) => setTestName(e.target.value)}
                    placeholder="e.g. Aishwarya Roy"
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block">Role / Designation</label>
                  <input
                    type="text" value={testRole} onChange={(e) => setTestRole(e.target.value)}
                    placeholder="e.g. Corporate HR"
                    className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider block">Star Rating (1 - 5)</label>
                <input
                  type="number" min="1" max="5" value={testRating} onChange={(e) => setTestRating(Number(e.target.value))}
                  className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-gray-500 uppercase tracking-wider block text-xs">Avatar Image</label>
                <input
                  type="text" value={testImage} onChange={(e) => setTestImage(e.target.value)}
                  placeholder="Paste avatar image URL (https://...)"
                  className="w-full bg-pearl border border-gray-200 px-4 py-2 rounded-xl text-primary focus:outline-none text-[11px]"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] text-gray-400 font-bold uppercase whitespace-nowrap">Or upload:</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTestImageUpload}
                    className="w-full bg-pearl border border-gray-200 px-2 py-1 rounded-lg text-primary focus:outline-none file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-primary file:text-gold hover:file:bg-primary-dark file:cursor-pointer text-[10px]"
                  />
                </div>
                {testImage && (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-gray-200 shadow-sm mt-1">
                    <img src={testImage} alt="Traveler Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider block">Review Comments *</label>
                <textarea
                  rows="3" required value={testReview} onChange={(e) => setTestReview(e.target.value)}
                  placeholder="Write customer review..."
                  className="w-full bg-pearl border border-gray-200 px-4 py-2.5 rounded-xl text-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button" onClick={() => setTestModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold text-primary font-bold px-6 py-2 rounded-full shadow cursor-pointer"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* F. CUSTOM DELETE CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden text-left shadow-2xl border border-gray-100 transform scale-100 transition-all duration-300">
            <div className="bg-primary text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiTrash2 className="h-5 w-5 text-red-500 animate-pulse" />
                <h3 className="font-serif font-bold text-sm text-gold">
                  {confirmModal.title}
                </h3>
              </div>
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                className="text-white hover:text-gold focus:outline-none transition-colors"
              >
                <FiXCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {confirmModal.message}
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button" 
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-full cursor-pointer text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-full shadow-lg hover:shadow-red-200 cursor-pointer text-xs transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
