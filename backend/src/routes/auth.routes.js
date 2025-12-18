const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateZod } = require('../middlewares/validate.middleware');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
} = require('../validations/auth.validation');

// Public routes
router.post('/register', validateZod(registerSchema), authController.register);
router.post('/login', validateZod(loginSchema), authController.login);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', validateZod(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateZod(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.use(authenticate);
router.get('/me', authController.getMe);
router.post('/change-password', validateZod(changePasswordSchema), authController.changePassword);
router.post('/logout', authController.logout);

module.exports = router;
