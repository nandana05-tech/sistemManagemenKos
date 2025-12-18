const { forbidden } = require('../utils/response');

/**
 * Role-based access control middleware
 * @param  {...string} allowedRoles - Allowed roles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return forbidden(res, 'Akses ditolak');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return forbidden(res, 'Anda tidak memiliki izin untuk mengakses resource ini');
    }

    next();
  };
};

/**
 * Check if user is PEMILIK
 */
const isPemilik = authorize('PEMILIK');

/**
 * Check if user is PENGHUNI
 */
const isPenghuni = authorize('PENGHUNI');

/**
 * Check if user is PEMILIK or PENGHUNI (authenticated user)
 */
const isAuthenticated = authorize('PEMILIK', 'PENGHUNI');

module.exports = {
  authorize,
  isPemilik,
  isPenghuni,
  isAuthenticated
};
