const express = require('express');
const router = express.Router();
const kamarController = require('../controllers/kamar.controller');
const { authenticate, optionalAuth } = require('../middlewares/auth.middleware');
const { isPemilik } = require('../middlewares/role.middleware');
const { uploadRoomPhotos } = require('../middlewares/upload.middleware');
const { validateZod } = require('../middlewares/validate.middleware');
const {
  createKategoriKamarSchema,
  updateKategoriKamarSchema,
  createKamarSchema,
  updateKamarSchema,
  createFasilitasSchema
} = require('../validations/kamar.validation');

// ==================== KATEGORI ROUTES ====================
// Public: view kategori
router.get('/kategori', kamarController.getAllKategori);

// Pemilik only: manage kategori
router.post('/kategori', authenticate, isPemilik, validateZod(createKategoriKamarSchema), kamarController.createKategori);
router.put('/kategori/:id', authenticate, isPemilik, validateZod(updateKategoriKamarSchema), kamarController.updateKategori);
router.delete('/kategori/:id', authenticate, isPemilik, kamarController.deleteKategori);

// ==================== FASILITAS ROUTES ====================
router.delete('/fasilitas/:fasilitasId', authenticate, isPemilik, kamarController.deleteFasilitas);

// ==================== PHOTO ROUTES ====================
router.delete('/photos/:photoId', authenticate, isPemilik, kamarController.deleteKamarPhoto);

// ==================== KAMAR ROUTES ====================
// Public/Optional auth: view kamar
router.get('/', optionalAuth, kamarController.getAllKamar);
router.get('/:id', optionalAuth, kamarController.getKamarById);

// Pemilik only: manage kamar
router.post('/', authenticate, isPemilik, validateZod(createKamarSchema), kamarController.createKamar);
router.put('/:id', authenticate, isPemilik, validateZod(updateKamarSchema), kamarController.updateKamar);
router.delete('/:id', authenticate, isPemilik, kamarController.deleteKamar);
router.patch('/:id/status', authenticate, isPemilik, kamarController.updateKamarStatus);
router.post('/:id/photos', authenticate, isPemilik, uploadRoomPhotos, kamarController.uploadKamarPhotos);
router.post('/:id/fasilitas', authenticate, isPemilik, kamarController.addFasilitas);

// ==================== BOOKING ROUTES ====================
// Penghuni: book a room
router.post('/:id/book', authenticate, kamarController.bookKamar);

module.exports = router;
