const authService = require('../services/auth.service');
const { success, created, badRequest } = require('../utils/response');

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return created(res, 'Registrasi berhasil. Silakan cek email untuk verifikasi', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return success(res, 'Login berhasil', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email
 * GET /api/auth/verify-email/:token
 */
const verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmail(req.params.token);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 * POST /api/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    return success(res, 'Berhasil mendapatkan data user', req.user);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const result = await authService.logout(req.user.id);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  logout
};
