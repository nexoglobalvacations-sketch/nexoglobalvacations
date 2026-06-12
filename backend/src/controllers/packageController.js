const Package = require('../models/Package');
const Destination = require('../models/Destination');
const { uploadToCloudinary } = require('../utils/cloudinaryHelper');

/**
 * @desc    Get all packages with query filters
 * @route   GET /api/packages
 * @access  Public
 */
const getPackages = async (req, res) => {
  try {
    const {
      destination,
      destType,
      category,
      maxPrice,
      duration,
      search,
      isFeatured,
      isPublished
    } = req.query;

    const query = {};

    // Filter by published status (default is true unless admin asks otherwise)
    if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true';
    } else {
      query.isPublished = true;
    }

    // Filter by featured
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    // Search term in name, overview or category
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { overview: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price (budget limit)
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    // Filter by duration search
    if (duration) {
      query.duration = { $regex: duration, $options: 'i' };
    }

    // Filter by destination name or object id
    if (destination) {
      // Check if it's a valid mongoose ID, otherwise find Destination by name regex
      const isMongoId = destination.match(/^[0-9a-fA-F]{24}$/);
      if (isMongoId) {
        query.destination = destination;
      } else {
        const matchingDests = await Destination.find({
          name: { $regex: destination, $options: 'i' }
        });
        const destIds = matchingDests.map(d => d._id);
        query.destination = { $in: destIds };
      }
    }

    // Filter by destination type (e.g. state or country)
    if (destType) {
      const matchingDests = await Destination.find({
        type: destType
      });
      const destIds = matchingDests.map(d => d._id);
      query.destination = { $in: destIds };
    }

    const packages = await Package.find(query).populate('destination');

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    console.error('Get Packages Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get single package by slug
 * @route   GET /api/packages/:slug
 * @access  Public
 */
const getPackageBySlug = async (req, res) => {
  try {
    const package = await Package.findOne({ slug: req.params.slug }).populate('destination');

    if (!package) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Get Package By Slug Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Create new package
 * @route   POST /api/packages
 * @access  Private (Admin)
 */
const createPackage = async (req, res) => {
  try {
    // Generate clean slug from name if not provided
    if (req.body.name && !req.body.slug) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Verify slug uniqueness
    const slugExists = await Package.findOne({ slug: req.body.slug });
    if (slugExists) {
      return res.status(400).json({
        success: false,
        error: `A package with name "${req.body.name}" or slug already exists.`
      });
    }

    const package = await Package.create(req.body);

    res.status(201).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Create Package Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update package
 * @route   PUT /api/packages/:id
 * @access  Private (Admin)
 */
const updatePackage = async (req, res) => {
  try {
    let package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    // Handle slug updates if name changes
    if (req.body.name && req.body.name !== package.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    package = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Update Package Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete package
 * @route   DELETE /api/packages/:id
 * @access  Private (Admin)
 */
const deletePackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    await Package.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete Package Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Upload image(s) to Cloudinary
 * @route   POST /api/upload
 * @access  Private (Admin)
 */
const uploadImages = async (req, res) => {
  try {
    if (!req.file && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    // If single file uploaded
    if (req.file) {
      const url = await uploadToCloudinary(req.file.buffer, 'packages/thumbnails');
      return res.status(200).json({
        success: true,
        urls: [url]
      });
    }

    // If multiple files uploaded
    if (req.files) {
      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer, 'packages/gallery')
      );
      const urls = await Promise.all(uploadPromises);
      return res.status(200).json({
        success: true,
        urls: urls
      });
    }
  } catch (error) {
    console.error('Media Upload Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
  uploadImages
};
