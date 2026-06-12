const express = require('express');
const router = express.Router();
const {
  getPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
  uploadImages
} = require('../controllers/packageController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/', getPackages);
router.get('/:slug', getPackageBySlug);

// Protected Admin routes
router.post('/', protect, createPackage);
router.put('/:id', protect, updatePackage);
router.delete('/:id', protect, deletePackage);

// Image uploading route (supports single upload as 'image' or multiple as 'images')
router.post('/upload', protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), (req, res, next) => {
  // Consolidate req.file / req.files for the controller
  if (req.files) {
    if (req.files.image && req.files.image[0]) {
      req.file = req.files.image[0];
    } else if (req.files.images) {
      req.files = req.files.images;
    }
  }
  next();
}, uploadImages);

module.exports = router;
