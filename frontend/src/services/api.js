import axios from 'axios';

// Set up base Axios client
// Uses Vite dev proxy '/api' during local development
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const baseURL = (rawBaseURL.endsWith('/') && rawBaseURL.length > 1)
  ? rawBaseURL.slice(0, -1)
  : rawBaseURL;

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically inject JWT token
API.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('tt_admin_token');
    const userToken = localStorage.getItem('tt_user_token');

    if (config.url.startsWith('/admin') && adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers['Authorization'] = `Bearer ${userToken}`;
    } else if (adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Endpoints Services
const apiService = {
  // Admin Auth
  admin: {
    login: (credentials) => API.post('/admin/login', credentials),
    register: (details) => API.post('/admin/register', details),
    getMe: () => API.get('/admin/me'),
    googleLogin: (tokenData) => API.post('/admin/google-login', tokenData)
  },

  // Traveler Auth
  userAuth: {
    login: (credentials) => API.post('/users/login', credentials),
    register: (details) => API.post('/users/register', details),
    getMe: () => API.get('/users/me'),
    googleLogin: (tokenData) => API.post('/users/google-login', tokenData)
  },

  // Packages
  packages: {
    getAll: (params) => API.get('/packages', { params }),
    getBySlug: (slug) => API.get(`/packages/${slug}`),
    create: (data) => API.post('/packages', data),
    update: (id, data) => API.put(`/packages/${id}`, data),
    delete: (id) => API.delete(`/packages/${id}`),
    uploadImages: (formData) => API.post('/packages/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Destinations
  destinations: {
    getAll: (params) => API.get('/destinations', { params }),
    create: (data) => API.post('/destinations', data),
    update: (id, data) => API.put(`/destinations/${id}`, data),
    delete: (id) => API.delete(`/destinations/${id}`)
  },

  // Sections (Curated Homepage Sections)
  sections: {
    getAll: () => API.get('/sections'),
    create: (data) => API.post('/sections', data),
    update: (id, data) => API.put(`/sections/${id}`, data),
    delete: (id) => API.delete(`/sections/${id}`)
  },

  // Inquiries
  inquiries: {
    submit: (data) => API.post('/inquiries', data),
    getMyInquiries: () => API.get('/inquiries/my-inquiries'),
    getAll: () => API.get('/inquiries'),
    updateStatus: (id, status) => API.put(`/inquiries/${id}`, { status }),
    delete: (id) => API.delete(`/inquiries/${id}`)
  },

  // FAQs
  faqs: {
    getAll: () => API.get('/faqs'),
    create: (data) => API.post('/faqs', data),
    update: (id, data) => API.put(`/faqs/${id}`, data),
    delete: (id) => API.delete(`/faqs/${id}`)
  },

  // Testimonials
  testimonials: {
    getAll: () => API.get('/testimonials'),
    create: (data) => API.post('/testimonials', data),
    submitTraveler: (data) => API.post('/testimonials/traveler', data),
    update: (id, data) => API.put(`/testimonials/${id}`, data),
    delete: (id) => API.delete(`/testimonials/${id}`)
  }
};

export default apiService;
