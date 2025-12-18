const userService = require('../services/user.service');
const { success, created } = require('../utils/response');

/**
 * Get all users (Pemilik only)
 * GET /api/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);
    return success(res, 'Berhasil mendapatkan daftar user', result.users, result.meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return success(res, 'Berhasil mendapatkan data user', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new user (Pemilik only)
 * POST /api/users
 */
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return created(res, 'User berhasil dibuat', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user (Pemilik only)
 * PUT /api/users/:id
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return success(res, 'User berhasil diupdate', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update own profile
 * PUT /api/users/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body, req.file);
    return success(res, 'Profil berhasil diupdate', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (Pemilik only)
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle user active status (Pemilik only)
 * PATCH /api/users/:id/toggle-status
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await userService.toggleUserStatus(req.params.id);
    return success(res, `Status user ${user.isActive ? 'diaktifkan' : 'dinonaktifkan'}`, user);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's riwayat sewa (Pemilik only)
 * GET /api/users/:id/riwayat-sewa
 */
const getUserRiwayatSewa = async (req, res, next) => {
  try {
    const riwayatSewa = await userService.getUserRiwayatSewa(req.params.id);
    return success(res, 'Berhasil mendapatkan riwayat sewa', riwayatSewa);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateProfile,
  deleteUser,
  toggleUserStatus,
  getUserRiwayatSewa
};
