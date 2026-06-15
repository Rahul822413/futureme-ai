const express = require('express');
const router = express.Router();
const { getStats, getUsers, deleteUser, getAllSimulations } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/user/:id', deleteUser);
router.get('/simulations', getAllSimulations);

module.exports = router;
