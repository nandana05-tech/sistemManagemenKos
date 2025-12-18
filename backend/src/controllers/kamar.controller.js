const kamarService = require('../services/kamar.service');
const { success, created } = require('../utils/response');

// ==================== KATEGORI KAMAR ====================

/**
 * Get all kategori kamar
 * GET /api/kamar/kategori
 */
const getAllKategori = async (req, res, next) => {
  try {
    const kategori = await kamarService.getAllKategori();
    return success(res, 'Berhasil mendapatkan daftar kategori', kategori);
  } catch (error) {
    next(error);
  }
};

/**
 * Create kategori kamar
 * POST /api/kamar/kategori
 */
const createKategori = async (req, res, next) => {
  try {
    const kategori = await kamarService.createKategori(req.body);
    return created(res, 'Kategori berhasil dibuat', kategori);
  } catch (error) {
    next(error);
  }
};

/**
 * Update kategori kamar
 * PUT /api/kamar/kategori/:id
 */
const updateKategori = async (req, res, next) => {
  try {
    const kategori = await kamarService.updateKategori(req.params.id, req.body);
    return success(res, 'Kategori berhasil diupdate', kategori);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete kategori kamar
 * DELETE /api/kamar/kategori/:id
 */
const deleteKategori = async (req, res, next) => {
  try {
    const result = await kamarService.deleteKategori(req.params.id);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

// ==================== KAMAR ====================

/**
 * Get all kamar
 * GET /api/kamar
 */
const getAllKamar = async (req, res, next) => {
  try {
    const result = await kamarService.getAllKamar(req.query);
    return success(res, 'Berhasil mendapatkan daftar kamar', result.kamar, result.meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get kamar by ID
 * GET /api/kamar/:id
 */
const getKamarById = async (req, res, next) => {
  try {
    const kamar = await kamarService.getKamarById(req.params.id);
    return success(res, 'Berhasil mendapatkan data kamar', kamar);
  } catch (error) {
    next(error);
  }
};

/**
 * Create kamar
 * POST /api/kamar
 */
const createKamar = async (req, res, next) => {
  try {
    const kamar = await kamarService.createKamar(req.body);
    return created(res, 'Kamar berhasil dibuat', kamar);
  } catch (error) {
    next(error);
  }
};

/**
 * Update kamar
 * PUT /api/kamar/:id
 */
const updateKamar = async (req, res, next) => {
  try {
    const kamar = await kamarService.updateKamar(req.params.id, req.body);
    return success(res, 'Kamar berhasil diupdate', kamar);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete kamar
 * DELETE /api/kamar/:id
 */
const deleteKamar = async (req, res, next) => {
  try {
    const result = await kamarService.deleteKamar(req.params.id);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Update kamar status
 * PATCH /api/kamar/:id/status
 */
const updateKamarStatus = async (req, res, next) => {
  try {
    const kamar = await kamarService.updateKamarStatus(req.params.id, req.body.status);
    return success(res, 'Status kamar berhasil diupdate', kamar);
  } catch (error) {
    next(error);
  }
};

/**
 * Upload kamar photos
 * POST /api/kamar/:id/photos
 */
const uploadKamarPhotos = async (req, res, next) => {
  try {
    const photos = await kamarService.addKamarPhotos(req.params.id, req.files);
    return created(res, 'Foto berhasil diupload', photos);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete kamar photo
 * DELETE /api/kamar/photos/:photoId
 */
const deleteKamarPhoto = async (req, res, next) => {
  try {
    const result = await kamarService.deleteKamarPhoto(req.params.photoId);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

// ==================== FASILITAS ====================

/**
 * Add fasilitas to kamar
 * POST /api/kamar/:id/fasilitas
 */
const addFasilitas = async (req, res, next) => {
  try {
    const fasilitas = await kamarService.addFasilitas({
      ...req.body,
      kamarId: parseInt(req.params.id)
    });
    return created(res, 'Fasilitas berhasil ditambahkan', fasilitas);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete fasilitas
 * DELETE /api/kamar/fasilitas/:fasilitasId
 */
const deleteFasilitas = async (req, res, next) => {
  try {
    const result = await kamarService.deleteFasilitas(req.params.fasilitasId);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Book a room (Penghuni self-service)
 * POST /api/kamar/:id/book
 */
const bookKamar = async (req, res, next) => {
  try {
    const bookingService = require('../services/booking.service');
    const result = await bookingService.createBooking(
      req.user.id,
      req.params.id,
      req.body.durasiSewa
    );
    return created(res, 'Booking berhasil dibuat', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Kategori
  getAllKategori,
  createKategori,
  updateKategori,
  deleteKategori,
  // Kamar
  getAllKamar,
  getKamarById,
  createKamar,
  updateKamar,
  deleteKamar,
  updateKamarStatus,
  uploadKamarPhotos,
  deleteKamarPhoto,
  // Fasilitas
  addFasilitas,
  deleteFasilitas,
  // Booking
  bookKamar
};
