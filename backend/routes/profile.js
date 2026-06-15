const express = require('express');
const router = express.Router();
const { createProfile, getProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createProfile);
router.put('/update/:userId', protect, createProfile);
router.get('/:userId', protect, getProfile);

module.exports = router;
