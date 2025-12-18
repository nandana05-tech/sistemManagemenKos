const laporanService = require('../services/laporan.service');
const { success, created } = require('../utils/response');

/**
 * Get all laporan
 * GET /api/laporan
 */
const getAllLaporan = async (req, res, next) => {
  try {
    const result = await laporanService.getAllLaporan(req.query, req.user.id, req.user.role);
    return success(res, 'Berhasil mendapatkan daftar laporan', result.laporan, result.meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get laporan by ID
 * GET /api/laporan/:id
 */
const getLaporanById = async (req, res, next) => {
  try {
    const laporan = await laporanService.getLaporanById(req.params.id);
    return success(res, 'Berhasil mendapatkan data laporan', laporan);
  } catch (error) {
    next(error);
  }
};

/**
 * Create laporan (Penghuni)
 * POST /api/laporan
 */
const createLaporan = async (req, res, next) => {
  try {
    const laporan = await laporanService.createLaporan(req.body, req.user.id);
    return created(res, 'Laporan berhasil dibuat', laporan);
  } catch (error) {
    next(error);
  }
};

/**
 * Update laporan
 * PUT /api/laporan/:id
 */
const updateLaporan = async (req, res, next) => {
  try {
    const laporan = await laporanService.updateLaporan(
      req.params.id, 
      req.body, 
      req.user.id, 
      req.user.role
    );
    return success(res, 'Laporan berhasil diupdate', laporan);
  } catch (error) {
    next(error);
  }
};

/**
 * Update laporan status (Pemilik only)
 * PATCH /api/laporan/:id/status
 */
const updateLaporanStatus = async (req, res, next) => {
  try {
    const laporan = await laporanService.updateLaporanStatus(
      req.params.id,
      req.body.status,
      req.body.tanggalSelesai
    );
    return success(res, 'Status laporan berhasil diupdate', laporan);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete laporan
 * DELETE /api/laporan/:id
 */
const deleteLaporan = async (req, res, next) => {
  try {
    const result = await laporanService.deleteLaporan(req.params.id, req.user.id, req.user.role);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Get laporan summary (Pemilik only)
 * GET /api/laporan/summary
 */
const getLaporanSummary = async (req, res, next) => {
  try {
    const summary = await laporanService.getLaporanSummary();
    return success(res, 'Berhasil mendapatkan summary laporan', summary);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLaporan,
  getLaporanById,
  createLaporan,
  updateLaporan,
  updateLaporanStatus,
  deleteLaporan,
  getLaporanSummary
};
