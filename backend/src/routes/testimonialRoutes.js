const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  createTravelerTestimonial
} = require('../controllers/testimonialController');
const { protect, protectUser } = require('../middlewares/authMiddleware');

router.get('/', getTestimonials);
router.post('/', protect, createTestimonial);
router.post('/traveler', protectUser, createTravelerTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
