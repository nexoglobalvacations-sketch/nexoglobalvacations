const Testimonial = require('../models/Testimonial');

/**
 * @desc    Get all testimonials
 * @route   GET /api/testimonials
 * @access  Public
 */
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    console.error('Get Testimonials Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Create testimonial
 * @route   POST /api/testimonials
 * @access  Private (Admin)
 */
const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Create Testimonial Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update testimonial
 * @route   PUT /api/testimonials/:id
 * @access  Private (Admin)
 */
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Update Testimonial Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete testimonial
 * @route   DELETE /api/testimonials/:id
 * @access  Private (Admin)
 */
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete Testimonial Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Create testimonial by a traveler
 * @route   POST /api/testimonials/traveler
 * @access  Private (User)
 */
const createTravelerTestimonial = async (req, res) => {
  try {
    const { review, rating } = req.body;
    if (!review || !rating) {
      return res.status(400).json({ success: false, error: 'Please supply review text and rating' });
    }

    const name = req.user.name;
    const role = 'Verified Traveler';
    const image = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

    const testimonial = await Testimonial.create({
      name,
      role,
      review,
      rating: Number(rating),
      image
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Create Traveler Testimonial Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  createTravelerTestimonial
};
