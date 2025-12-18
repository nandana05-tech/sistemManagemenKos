const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { isPemilik } = require('../middlewares/role.middleware');
const { uploadProfilePhoto } = require('../middlewares/upload.middleware');
const { validateZod } = require('../middlewares/validate.middleware');
const {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema
} = require('../validations/user.validation');

// All routes require authentication
router.use(authenticate);

// Profile routes (accessible by all authenticated users)
router.put('/profile', uploadProfilePhoto, validateZod(updateProfileSchema), userController.updateProfile);

// Pemilik only routes
router.get('/', isPemilik, userController.getAllUsers);
router.get('/:id', isPemilik, userController.getUserById);
router.get('/:id/riwayat-sewa', isPemilik, userController.getUserRiwayatSewa);
router.post('/', isPemilik, validateZod(createUserSchema), userController.createUser);
router.put('/:id', isPemilik, validateZod(updateUserSchema), userController.updateUser);
router.delete('/:id', isPemilik, userController.deleteUser);
router.patch('/:id/toggle-status', isPemilik, userController.toggleUserStatus);

module.exports = router;
