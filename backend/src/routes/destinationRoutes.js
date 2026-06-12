const express = require('express');
const router = express.Router();
const {
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination
} = require('../controllers/destinationController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getDestinations);
router.post('/', protect, createDestination);
router.put('/:id', protect, updateDestination);
router.delete('/:id', protect, deleteDestination);

module.exports = router;
