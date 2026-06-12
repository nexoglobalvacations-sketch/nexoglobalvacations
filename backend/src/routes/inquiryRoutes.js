const express = require('express');
const router = express.Router();
const {
  getInquiries,
  createInquiry,
  getMyInquiries,
  updateInquiryStatus,
  deleteInquiry
} = require('../controllers/inquiryController');
const { protect, protectUser } = require('../middlewares/authMiddleware');

// Traveler routes
router.post('/', protectUser, createInquiry);
router.get('/my-inquiries', protectUser, getMyInquiries);

// Protected Admin routes
router.get('/', protect, getInquiries);
router.put('/:id', protect, updateInquiryStatus);
router.delete('/:id', protect, deleteInquiry);

module.exports = router;
