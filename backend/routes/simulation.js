const express = require('express');
const router = express.Router();
const { generateSimulation, getHistory, getSimulation, deleteSimulation, compareSimulations } = require('../controllers/simulationController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateSimulation);
router.post('/compare', protect, compareSimulations);
router.get('/history/:userId', protect, getHistory);
router.get('/:id', protect, getSimulation);
router.delete('/:id', protect, deleteSimulation);

module.exports = router;
