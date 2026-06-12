const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  activities: {
    type: [String],
    default: []
  },
  accommodation: {
    type: String,
    default: ''
  },
  meals: {
    type: String,
    default: ''
  },
  transport: {
    type: String,
    default: ''
  }
});

const PackageFAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a package name'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a starting price']
  },
  duration: {
    type: String,
    required: [true, 'Please add a package duration']
  },
  category: {
    type: String,
    required: [true, 'Please select a package category'],
    enum: [
      'Honeymoon',
      'Spiritual',
      'Beaches',
      'Mountains',
      'Adventure',
      'Luxury',
      'Wildlife',
      'International',
      'Family Trips',
      'Group Tours',
      'Custom Tours'
    ]
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: [true, 'Please link a destination']
  },
  overview: {
    type: String,
    required: [true, 'Please add a package overview']
  },
  itinerary: {
    type: [ItinerarySchema],
    default: []
  },
  included: {
    type: [String],
    default: []
  },
  excluded: {
    type: [String],
    default: []
  },
  hotelDetails: {
    type: String,
    default: ''
  },
  mealDetails: {
    type: String,
    default: ''
  },
  transportDetails: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    required: [true, 'Please add a thumbnail image URL']
  },
  heroBanner: {
    type: String,
    required: [true, 'Please add a hero banner image URL']
  },
  gallery: {
    type: [String],
    default: []
  },
  faq: {
    type: [PackageFAQSchema],
    default: []
  },
  seoMetaTitle: {
    type: String,
    default: ''
  },
  seoMetaDescription: {
    type: String,
    default: ''
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-validate hook to generate a clean slug if one doesn't exist
PackageSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Package', PackageSchema);
