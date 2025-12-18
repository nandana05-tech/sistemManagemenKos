const paymentService = require('../services/payment.service');
const { success, created } = require('../utils/response');

/**
 * Get all payments
 * GET /api/payment
 */
const getAllPayments = async (req, res, next) => {
  try {
    const result = await paymentService.getAllPayments(req.query, req.user.id, req.user.role);
    return success(res, 'Berhasil mendapatkan daftar pembayaran', result.payments, result.meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment by ID
 * GET /api/payment/:id
 */
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    return success(res, 'Berhasil mendapatkan data pembayaran', payment);
  } catch (error) {
    next(error);
  }
};

/**
 * Create payment (Penghuni)
 * POST /api/payment
 */
const createPayment = async (req, res, next) => {
  try {
    const result = await paymentService.createPayment(req.body.tagihanId, req.user.id);
    return created(res, 'Pembayaran berhasil dibuat', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Midtrans notification (webhook)
 * POST /api/payment/notification
 */
const handleNotification = async (req, res, next) => {
  try {
    const result = await paymentService.handleMidtransNotification(req.body);
    return success(res, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify payment manually (Pemilik only)
 * POST /api/payment/:id/verify
 */
const verifyPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.verifyPayment(req.params.id, req.user.id);
    return success(res, 'Pembayaran berhasil diverifikasi', payment);
  } catch (error) {
    next(error);
  }
};

/**
 * Check payment status from Midtrans
 * GET /api/payment/:id/status
 */
const checkPaymentStatus = async (req, res, next) => {
  try {
    const status = await paymentService.checkPaymentStatus(req.params.id);
    return success(res, 'Berhasil mendapatkan status pembayaran', status);
  } catch (error) {
    next(error);
  }
};

/**
 * Sync payment status from Midtrans API
 * GET /api/payment/sync/:orderId
 */
const syncPaymentStatus = async (req, res, next) => {
  try {
    const result = await paymentService.syncPaymentStatus(req.params.orderId);
    return success(res, result.message, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel payment
 * POST /api/payment/:id/cancel
 */
const cancelPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.cancelPayment(
      req.params.id, 
      req.user.id, 
      req.user.role
    );
    return success(res, 'Pembayaran berhasil dibatalkan', payment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  handleNotification,
  verifyPayment,
  checkPaymentStatus,
  syncPaymentStatus,
  cancelPayment
};
