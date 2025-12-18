const express = require('express');
const router = express.Router();
const tagihanController = require('../controllers/tagihan.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { isPemilik, isAuthenticated } = require('../middlewares/role.middleware');
const { validateZod } = require('../middlewares/validate.middleware');
const {
  createTagihanSchema,
  updateTagihanSchema
} = require('../validations/tagihan.validation');

// All routes require authentication
router.use(authenticate);

// Summary - accessible by all
router.get('/summary', isAuthenticated, tagihanController.getTagihanSummary);

// Generate monthly tagihan - Pemilik only
router.post('/generate', isPemilik, tagihanController.generateMonthlyTagihan);

// CRUD operations
router.get('/', isAuthenticated, tagihanController.getAllTagihan);
router.get('/:id', isAuthenticated, tagihanController.getTagihanById);
router.post('/', isPemilik, validateZod(createTagihanSchema), tagihanController.createTagihan);
router.put('/:id', isPemilik, validateZod(updateTagihanSchema), tagihanController.updateTagihan);
router.delete('/:id', isPemilik, tagihanController.deleteTagihan);

module.exports = router;
