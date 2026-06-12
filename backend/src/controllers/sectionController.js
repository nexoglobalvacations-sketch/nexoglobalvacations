const Section = require('../models/Section');

/**
 * @desc    Get all homepage sections
 * @route   GET /api/sections
 * @access  Public
 */
const getSections = async (req, res) => {
  try {
    const sections = await Section.find()
      .sort({ order: 1 })
      .populate({
        path: 'packages',
        populate: { path: 'destination' } // Populate the destination inside the packages
      });

    res.status(200).json({
      success: true,
      count: sections.length,
      data: sections
    });
  } catch (error) {
    console.error('Get Sections Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Create homepage section
 * @route   POST /api/sections
 * @access  Private (Admin)
 */
const createSection = async (req, res) => {
  try {
    if (req.body.name && !req.body.slug) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const sectionExists = await Section.findOne({ slug: req.body.slug });
    if (sectionExists) {
      return res.status(400).json({ success: false, error: 'Section already exists' });
    }

    const section = await Section.create(req.body);

    res.status(201).json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Create Section Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update homepage section
 * @route   PUT /api/sections/:id
 * @access  Private (Admin)
 */
const updateSection = async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!section) {
      return res.status(404).json({ success: false, error: 'Section not found' });
    }

    res.status(200).json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Update Section Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete homepage section
 * @route   DELETE /api/sections/:id
 * @access  Private (Admin)
 */
const deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);

    if (!section) {
      return res.status(404).json({ success: false, error: 'Section not found' });
    }

    await Section.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete Section Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getSections,
  createSection,
  updateSection,
  deleteSection
};
