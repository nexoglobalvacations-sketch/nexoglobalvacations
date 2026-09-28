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
const defaultAllowedOrigins = [
  'https://itinearary.com',
  'https://www.itinearary.com',
  'https://itinerary.com',
  'https://www.itinerary.com',
  'https://nexoglobalvacations.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

const envOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
      .map(origin => origin.trim().replace(/\/+$/, ''))
      .filter(Boolean)
  : [];

// Deduplicate all allowed origins
const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

const isOriginAllowed = (origin) => {
  // Allow requests without Origin header (e.g. server-to-server, curl, Postman, keep-alive)
  if (!origin) return true;
  const normalized = origin.trim().replace(/\/+$/, '');
  return allowedOrigins.includes(normalized);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
  // Ensure CORS headers are attached on error responses for allowed origins
  const origin = req.headers.origin;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }

  // Handle CORS policy rejections with 403 Forbidden instead of 500
  if (err.message && err.message.includes('CORS policy')) {
    return res.status(403).json({
      success: false,
      error: err.message
    });
  }

  console.error('Unhandled Server Error:', err.stack || err);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
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
