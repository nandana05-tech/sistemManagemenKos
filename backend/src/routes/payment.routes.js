const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { isPemilik, isAuthenticated } = require('../middlewares/role.middleware');

// Midtrans notification webhook (no auth required)
router.post('/notification', paymentController.handleNotification);

// All other routes require authentication
router.use(authenticate);

// Payment operations
router.get('/', isAuthenticated, paymentController.getAllPayments);
router.get('/:id', isAuthenticated, paymentController.getPaymentById);
router.get('/:id/status', isAuthenticated, paymentController.checkPaymentStatus);
router.post('/', isAuthenticated, paymentController.createPayment);

// Cancel payment - both pemilik and penghuni can cancel
router.post('/:id/cancel', isAuthenticated, paymentController.cancelPayment);

// Pemilik only - verify payment
router.post('/:id/verify', isPemilik, paymentController.verifyPayment);

// Sync payment status from Midtrans (for redirect callback)
router.get('/sync/:orderId', isAuthenticated, paymentController.syncPaymentStatus);

module.exports = router;
