const FAQ = require('../models/FAQ');

/**
 * @desc    Get all FAQs
 * @route   GET /api/faqs
 * @access  Public
 */
const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    console.error('Get FAQs Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Create FAQ
 * @route   POST /api/faqs
 * @access  Private (Admin)
 */
const createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    console.error('Create FAQ Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update FAQ
 * @route   PUT /api/faqs/:id
 * @access  Private (Admin)
 */
const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!faq) {
      return res.status(404).json({ success: false, error: 'FAQ not found' });
    }

    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    console.error('Update FAQ Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete FAQ
 * @route   DELETE /api/faqs/:id
 * @access  Private (Admin)
 */
const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ success: false, error: 'FAQ not found' });
    }

    await FAQ.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete FAQ Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
};
