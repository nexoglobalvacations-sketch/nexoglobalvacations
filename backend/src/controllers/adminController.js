const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'tt_secret_123_abc', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new admin
 * @route   POST /api/admin/register
 * @access  Public
 */
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide all details' });
    }

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ success: false, error: 'Admin email already registered' });
    }

    // Create Admin
    const admin = await Admin.create({
      name,
      email,
      password,
    });

    if (admin) {
      res.status(201).json({
        success: true,
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          token: generateToken(admin._id),
        },
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid admin data' });
    }
  } catch (error) {
    console.error('Register Admin Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Authenticate admin & return token
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Check for admin (select password explicitly)
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      },
    });
  } catch (error) {
    console.error('Login Admin Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get current logged in admin
 * @route   GET /api/admin/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    // req.admin is set by protect middleware
    res.status(200).json({
      success: true,
      data: req.admin,
    });
  } catch (error) {
    console.error('Get Admin Profile Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getMe,
};
