const Inquiry = require('../models/Inquiry');

/**
 * @desc    Get all inquiries
 * @route   GET /api/inquiries
 * @access  Private (Admin)
 */
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .populate('package');

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Get Inquiries Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Create new inquiry
 * @route   POST /api/inquiries
 * @access  Public
 */
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, travelersCount, travelDate, packageId, message } = req.body;

    if (!name || !email || !phone || !travelersCount || !travelDate || !message) {
      return res.status(400).json({ success: false, error: 'Please fill in all required fields' });
    }

    const inquiryData = {
      name,
      email,
      phone,
      travelersCount: Number(travelersCount),
      travelDate: new Date(travelDate),
      message,
      user: req.user._id // Map to traveler account
    };

    if (packageId) {
      inquiryData.package = packageId;
    }

    const inquiry = await Inquiry.create(inquiryData);

    res.status(201).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Create Inquiry Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get all inquiries for the logged-in traveler user
 * @route   GET /api/inquiries/my-inquiries
 * @access  Private (User)
 */
const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('package');

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Get My Inquiries Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update inquiry status
 * @route   PUT /api/inquiries/:id
 * @access  Private (Admin)
 */
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'processing', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status type' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('package');

    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Update Inquiry Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete inquiry
 * @route   DELETE /api/inquiries/:id
 * @access  Private (Admin)
 */
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    await Inquiry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete Inquiry Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getInquiries,
  createInquiry,
  getMyInquiries,
  updateInquiryStatus,
  deleteInquiry
};
