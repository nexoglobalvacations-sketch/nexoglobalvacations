const express = require('express');
const router = express.Router();
const {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
} = require('../controllers/faqController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getFAQs);
router.post('/', protect, createFAQ);
router.put('/:id', protect, updateFAQ);
router.delete('/:id', protect, deleteFAQ);

module.exports = router;
