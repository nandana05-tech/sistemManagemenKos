const tagihanService = require('../services/tagihan.service');
const { success, created } = require('../utils/response');

/**
 * Get all tagihan
 * GET /api/tagihan
 */
const getAllTagihan = async (req, res, next) => {
  try {
    const result = await tagihanService.getAllTagihan(req.query, req.user.id, req.user.role);
    return success(res, 'Berhasil mendapatkan daftar tagihan', result.tagihan, result.meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get tagihan by ID
 * GET /api/tagihan/:id
 */
const getTagihanById = async (req, res, next) => {
  try {
    const tagihan = await tagihanService.getTagihanById(req.params.id);
    return success(res, 'Berhasil mendapatkan data tagihan', tagihan);
  } catch (error) {
    next(error);
  }
};

/**
 * Create tagihan (Pemilik only)
 * POST /api/tagihan
 */
const createTagihan = async (req, res, next) => {
  try {
    const tagihan = await tagihanService.createTagihan(req.body);
    return created(res, 'Tagihan berhasil dibuat', tagihan);
  } catch (error) {
    next(error);
  }
};

/**
 * Update tagihan (Pemilik only)
 * PUT /api/tagihan/:id
 */
const updateTagihan = async (req, res, next) => {
  try {
    const tagihan = await tagihanService.updateTagihan(req.params.id, req.body);
    return success(res, 'Tagihan berhasil diupdate', tagihan);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete tagihan (Pemilik only)
 * DELETE /api/tagihan/:id
 */
const deleteTagihan = async (req, res, next) => {
  try {
    const result = await tagihanService.deleteTagihan(req.params.id);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Generate monthly tagihan (Pemilik only)
 * POST /api/tagihan/generate
 */
const generateMonthlyTagihan = async (req, res, next) => {
  try {
    const result = await tagihanService.generateMonthlyTagihan();
    return success(res, result.message, result.tagihan);
  } catch (error) {
    next(error);
  }
};

/**
 * Get tagihan summary for dashboard
 * GET /api/tagihan/summary
 */
const getTagihanSummary = async (req, res, next) => {
  try {
    const summary = await tagihanService.getTagihanSummary(req.user.id, req.user.role);
    return success(res, 'Berhasil mendapatkan summary tagihan', summary);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTagihan,
  getTagihanById,
  createTagihan,
  updateTagihan,
  deleteTagihan,
  generateMonthlyTagihan,
  getTagihanSummary
};
