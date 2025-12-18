const upload = require('../config/multer');
const { badRequest } = require('../utils/response');

/**
 * Handle multer errors
 */
const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return badRequest(res, 'Ukuran file terlalu besar. Maksimal 5MB');
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return badRequest(res, 'Field file tidak sesuai');
    }
    return badRequest(res, err.message);
  }
  next();
};

/**
 * Upload single profile photo
 */
const uploadProfilePhoto = [
  upload.single('fotoProfil'),
  handleUploadError
];

/**
 * Upload single room photo
 */
const uploadRoomPhoto = [
  upload.single('fotoKamar'),
  handleUploadError
];

/**
 * Upload multiple room photos (max 10)
 */
const uploadRoomPhotos = [
  upload.array('fotoKamar', 10),
  handleUploadError
];

/**
 * Upload report photo
 */
const uploadReportPhoto = [
  upload.single('fotoLaporan'),
  handleUploadError
];

/**
 * Upload payment proof
 */
const uploadPaymentProof = [
  upload.single('buktiPembayaran'),
  handleUploadError
];

module.exports = {
  uploadProfilePhoto,
  uploadRoomPhoto,
  uploadRoomPhotos,
  uploadReportPhoto,
  uploadPaymentProof,
  handleUploadError
};
