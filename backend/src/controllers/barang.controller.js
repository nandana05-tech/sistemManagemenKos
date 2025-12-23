const barangService = require('../services/barang.service');
const { success, created } = require('../utils/response');

// ==================== KATEGORI BARANG ====================

/**
 * Get all kategori barang
 * GET /api/barang/kategori
 */
const getAllKategoriBarang = async (req, res, next) => {
  try {
    const kategori = await barangService.getAllKategoriBarang();
    return success(res, 'Berhasil mendapatkan daftar kategori barang', kategori);
  } catch (error) {
    next(error);
  }
};

/**
 * Create kategori barang
 * POST /api/barang/kategori
 */
const createKategoriBarang = async (req, res, next) => {
  try {
    const kategori = await barangService.createKategoriBarang(req.body);
    return created(res, 'Kategori barang berhasil dibuat', kategori);
  } catch (error) {
    next(error);
  }
};

/**
 * Update kategori barang
 * PUT /api/barang/kategori/:id
 */
const updateKategoriBarang = async (req, res, next) => {
  try {
    const kategori = await barangService.updateKategoriBarang(req.params.id, req.body);
    return success(res, 'Kategori barang berhasil diupdate', kategori);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete kategori barang
 * DELETE /api/barang/kategori/:id
 */
const deleteKategoriBarang = async (req, res, next) => {
  try {
    const result = await barangService.deleteKategoriBarang(req.params.id);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

// ==================== NAMA BARANG ====================

/**
 * Get all nama barang
 * GET /api/barang/nama
 */
const getAllNamaBarang = async (req, res, next) => {
  try {
    const namaBarang = await barangService.getAllNamaBarang(req.query.kategoriId);
    return success(res, 'Berhasil mendapatkan daftar nama barang', namaBarang);
  } catch (error) {
    next(error);
  }
};

/**
 * Create nama barang
 * POST /api/barang/nama
 */
const createNamaBarang = async (req, res, next) => {
  try {
    const namaBarang = await barangService.createNamaBarang(req.body);
    return created(res, 'Nama barang berhasil dibuat', namaBarang);
  } catch (error) {
    next(error);
  }
};

/**
 * Update nama barang
 * PUT /api/barang/nama/:id
 */
const updateNamaBarang = async (req, res, next) => {
  try {
    const namaBarang = await barangService.updateNamaBarang(req.params.id, req.body);
    return success(res, 'Nama barang berhasil diupdate', namaBarang);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete nama barang
 * DELETE /api/barang/nama/:id
 */
const deleteNamaBarang = async (req, res, next) => {
  try {
    const result = await barangService.deleteNamaBarang(req.params.id);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

// ==================== BARANG ====================

/**
 * Get all barang
 * GET /api/barang
 */
const getAllBarang = async (req, res, next) => {
  try {
    // Pass user info for filtering (penghuni only sees their kamar's items)
    const result = await barangService.getAllBarang(req.query, req.user);
    return success(res, 'Berhasil mendapatkan daftar barang', result.barang, result.meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get barang by ID
 * GET /api/barang/:id
 */
const getBarangById = async (req, res, next) => {
  try {
    const barang = await barangService.getBarangById(req.params.id);
    if (!barang) {
      return res.status(404).json({ success: false, message: 'Barang tidak ditemukan' });
    }
    return success(res, 'Berhasil mendapatkan detail barang', barang);
  } catch (error) {
    next(error);
  }
};

/**
 * Create barang
 * POST /api/barang
 */
const createBarang = async (req, res, next) => {
  try {
    const barang = await barangService.createBarang(req.body);
    return created(res, 'Barang berhasil dibuat', barang);
  } catch (error) {
    next(error);
  }
};

/**
 * Update barang
 * PUT /api/barang/:id
 */
const updateBarang = async (req, res, next) => {
  try {
    const barang = await barangService.updateBarang(req.params.id, req.body);
    return success(res, 'Barang berhasil diupdate', barang);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete barang
 * DELETE /api/barang/:id
 */
const deleteBarang = async (req, res, next) => {
  try {
    const result = await barangService.deleteBarang(req.params.id);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

// ==================== INVENTORI KAMAR ====================

/**
 * Get inventori by kamar
 * GET /api/barang/inventori/:kamarId
 */
const getInventoriByKamar = async (req, res, next) => {
  try {
    const inventori = await barangService.getInventoriByKamar(req.params.kamarId);
    return success(res, 'Berhasil mendapatkan inventori kamar', inventori);
  } catch (error) {
    next(error);
  }
};

/**
 * Add inventori to kamar
 * POST /api/barang/inventori
 */
const addInventori = async (req, res, next) => {
  try {
    const inventori = await barangService.addInventori(req.body);
    return created(res, 'Inventori berhasil ditambahkan', inventori);
  } catch (error) {
    next(error);
  }
};

/**
 * Update inventori
 * PUT /api/barang/inventori/:id
 */
const updateInventori = async (req, res, next) => {
  try {
    const inventori = await barangService.updateInventori(req.params.id, req.body);
    return success(res, 'Inventori berhasil diupdate', inventori);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete inventori
 * DELETE /api/barang/inventori/:id
 */
const deleteInventori = async (req, res, next) => {
  try {
    const result = await barangService.deleteInventori(req.params.id);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Kategori Barang
  getAllKategoriBarang,
  createKategoriBarang,
  updateKategoriBarang,
  deleteKategoriBarang,
  // Nama Barang
  getAllNamaBarang,
  createNamaBarang,
  updateNamaBarang,
  deleteNamaBarang,
  // Barang
  getAllBarang,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
  // Inventori
  getInventoriByKamar,
  addInventori,
  updateInventori,
  deleteInventori
};
