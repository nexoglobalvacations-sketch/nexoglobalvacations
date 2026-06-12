const express = require('express');
const router = express.Router();
const {
  getSections,
  createSection,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getSections);
router.post('/', protect, createSection);
router.put('/:id', protect, updateSection);
router.delete('/:id', protect, deleteSection);

module.exports = router;
