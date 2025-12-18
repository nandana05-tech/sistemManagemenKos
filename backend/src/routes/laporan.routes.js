const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporan.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { isPemilik, isAuthenticated } = require('../middlewares/role.middleware');
const { validateZod } = require('../middlewares/validate.middleware');
const {
  createLaporanSchema,
  updateLaporanSchema,
  updateStatusLaporanSchema
} = require('../validations/laporan.validation');

// All routes require authentication
router.use(authenticate);

// Summary - Pemilik only
router.get('/summary', isPemilik, laporanController.getLaporanSummary);

// CRUD operations
router.get('/', isAuthenticated, laporanController.getAllLaporan);
router.get('/:id', isAuthenticated, laporanController.getLaporanById);
router.post('/', isAuthenticated, validateZod(createLaporanSchema), laporanController.createLaporan);
router.put('/:id', isAuthenticated, validateZod(updateLaporanSchema), laporanController.updateLaporan);
router.delete('/:id', isAuthenticated, laporanController.deleteLaporan);

// Update status - Pemilik only
router.patch('/:id/status', isPemilik, validateZod(updateStatusLaporanSchema), laporanController.updateLaporanStatus);

module.exports = router;
