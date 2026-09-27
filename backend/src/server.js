require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
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
const startKeepAlive = require('./utils/keepAlive');

const app = express();

// Initialize DB Connection
connectDB();

// Security and Sanitization Middlewares
app.use(helmet());
app.use(mongoSanitize());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiters
const generalLimiter = process.env.NODE_ENV === 'production'
  ? rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: 'Too many requests from this IP, please try again after 15 minutes'
      }
    })
  : (req, res, next) => next();

const authLimiter = process.env.NODE_ENV === 'production'
  ? rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 20, // Limit each IP to 20 auth requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: 'Too many authentication attempts, please try again after 15 minutes'
      }
    })
  : (req, res, next) => next();

// Health check endpoints (placed before rate limiters to avoid being throttled)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Apply general rate limiting to all api endpoints
app.use('/api', generalLimiter);

// Route Mountings
app.use('/api/admin', authLimiter, adminRoutes);
app.use('/api/users', authLimiter, userRoutes);
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
  startKeepAlive();
});

// Graceful rejection catches
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // server.close(() => process.exit(1)); // Optional: close server
});
