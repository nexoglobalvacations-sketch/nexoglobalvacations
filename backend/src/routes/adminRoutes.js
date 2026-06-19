const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getMe,
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', protect, registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, getMe);

module.exports = router;
