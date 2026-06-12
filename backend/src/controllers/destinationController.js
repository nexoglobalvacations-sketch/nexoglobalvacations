const Destination = require('../models/Destination');

/**
 * @desc    Get all destinations
 * @route   GET /api/destinations
 * @access  Public
 */
const getDestinations = async (req, res) => {
  try {
    const { type, isFeatured } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

    const destinations = await Destination.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    console.error('Get Destinations Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Create new destination
 * @route   POST /api/destinations
 * @access  Private (Admin)
 */
const createDestination = async (req, res) => {
  try {
    const destExists = await Destination.findOne({ name: req.body.name });
    if (destExists) {
      return res.status(400).json({ success: false, error: 'Destination already exists' });
    }

    const destination = await Destination.create(req.body);

    res.status(201).json({
      success: true,
      data: destination
    });
  } catch (error) {
    console.error('Create Destination Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update destination
 * @route   PUT /api/destinations/:id
 * @access  Private (Admin)
 */
const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!destination) {
      return res.status(404).json({ success: false, error: 'Destination not found' });
    }

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (error) {
    console.error('Update Destination Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete destination
 * @route   DELETE /api/destinations/:id
 * @access  Private (Admin)
 */
const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ success: false, error: 'Destination not found' });
    }

    await Destination.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete Destination Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination
};
