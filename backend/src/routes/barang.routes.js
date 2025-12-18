const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barang.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { isPemilik, isAuthenticated } = require('../middlewares/role.middleware');
const { validateZod } = require('../middlewares/validate.middleware');
const {
  createKategoriBarangSchema,
  updateKategoriBarangSchema,
  createNamaBarangSchema,
  createBarangSchema,
  updateBarangSchema,
  createInventoriSchema,
  updateInventoriSchema
} = require('../validations/barang.validation');

// All routes require authentication
router.use(authenticate);

// ==================== KATEGORI BARANG ====================
router.get('/kategori', isAuthenticated, barangController.getAllKategoriBarang);
router.post('/kategori', isPemilik, validateZod(createKategoriBarangSchema), barangController.createKategoriBarang);
router.put('/kategori/:id', isPemilik, validateZod(updateKategoriBarangSchema), barangController.updateKategoriBarang);
router.delete('/kategori/:id', isPemilik, barangController.deleteKategoriBarang);

// ==================== NAMA BARANG ====================
router.get('/nama', isAuthenticated, barangController.getAllNamaBarang);
router.post('/nama', isPemilik, validateZod(createNamaBarangSchema), barangController.createNamaBarang);
router.delete('/nama/:id', isPemilik, barangController.deleteNamaBarang);

// ==================== INVENTORI ====================
router.get('/inventori/:kamarId', isAuthenticated, barangController.getInventoriByKamar);
router.post('/inventori', isPemilik, validateZod(createInventoriSchema), barangController.addInventori);
router.put('/inventori/:id', isPemilik, validateZod(updateInventoriSchema), barangController.updateInventori);
router.delete('/inventori/:id', isPemilik, barangController.deleteInventori);

// ==================== BARANG ====================
router.get('/', isAuthenticated, barangController.getAllBarang);
router.get('/:id', isAuthenticated, barangController.getBarangById);
router.post('/', isPemilik, validateZod(createBarangSchema), barangController.createBarang);
router.put('/:id', isPemilik, validateZod(updateBarangSchema), barangController.updateBarang);
router.delete('/:id', isPemilik, barangController.deleteBarang);

module.exports = router;
