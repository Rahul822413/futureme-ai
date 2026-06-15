const express = require('express');
const router = express.Router();
const { getReport, downloadPDF, downloadCSV } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/download/pdf/:simulationId', protect, downloadPDF);
router.get('/download/csv/:simulationId', protect, downloadCSV);
router.get('/:simulationId', protect, getReport);

module.exports = router;
