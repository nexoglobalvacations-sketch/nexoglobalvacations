require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = async () => {
  // Try importing connectDB safely
  try {
    const conn = require('./config/db');
    await conn();
  } catch (error) {
    console.error('Database connection failed', error);
  }
};

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const packageRoutes = require('./routes/packageRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const faqRoutes = require('./routes/faqRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');

const app = express();

// Initialize DB Connection
connectDB();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route Mountings
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Root Endpoint for sanity check
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the TT Company Luxury Travel Website API!',
    status: 'Operational'
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Boot port listener
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful rejection catches
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // server.close(() => process.exit(1)); // Optional: close server
});
