const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { unauthorized } = require('../utils/response');

/**
 * Authenticate JWT token middleware
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res, 'Token tidak ditemukan');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        fotoProfil: true
      }
    });

    if (!user) {
      return unauthorized(res, 'User tidak ditemukan');
    }

    if (!user.isActive) {
      return unauthorized(res, 'Akun belum diaktivasi');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return unauthorized(res, 'Token tidak valid');
    }
    if (error.name === 'TokenExpiredError') {
      return unauthorized(res, 'Token sudah kadaluarsa');
    }
    return unauthorized(res, 'Autentikasi gagal');
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        deletedAt: null,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

module.exports = { authenticate, optionalAuth };
