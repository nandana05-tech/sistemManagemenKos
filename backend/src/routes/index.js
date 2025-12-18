const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const kamarRoutes = require('./kamar.routes');
const barangRoutes = require('./barang.routes');
const tagihanRoutes = require('./tagihan.routes');
const paymentRoutes = require('./payment.routes');
const laporanRoutes = require('./laporan.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/kamar', kamarRoutes);
router.use('/barang', barangRoutes);
router.use('/tagihan', tagihanRoutes);
router.use('/payment', paymentRoutes);
router.use('/laporan', laporanRoutes);

module.exports = router;
