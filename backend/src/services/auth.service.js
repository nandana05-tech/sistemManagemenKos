const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { generateToken } = require('../utils/helpers');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

/**
 * Register new user
 */
const register = async (data) => {
  // Check if email exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw { statusCode: 409, message: 'Email sudah terdaftar' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Generate verification token
  const verificationToken = generateToken();

  // Create user
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      noTelepon: data.noTelepon,
      role: 'PENGHUNI',
      isActive: false,
      verificationToken
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  // Send verification email
  try {
    await sendVerificationEmail(user.email, user.name, verificationToken);
  } catch (error) {
    // Log error but don't fail registration
    console.error('Failed to send verification email:', error);
  }

  return user;
};

/**
 * Login user
 */
const login = async (email, password) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email, deletedAt: null }
  });

  if (!user) {
    throw { statusCode: 401, message: 'Email atau password salah' };
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw { statusCode: 401, message: 'Email atau password salah' };
  }

  if (!user.isActive) {
    throw { statusCode: 401, message: 'Akun belum diaktivasi. Silakan cek email Anda' };
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // Update user token
  await prisma.user.update({
    where: { id: user.id },
    data: { token }
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      fotoProfil: user.fotoProfil
    },
    token
  };
};

/**
 * Verify email
 */
const verifyEmail = async (token) => {
  if (!token) {
    throw { statusCode: 400, message: 'Token verifikasi tidak ditemukan' };
  }

  const user = await prisma.user.findFirst({
    where: { verificationToken: token }
  });

  if (!user) {
    throw { statusCode: 400, message: 'Token verifikasi tidak valid atau sudah digunakan' };
  }

  if (user.isActive) {
    return { message: 'Email sudah diverifikasi sebelumnya' };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isActive: true,
      verificationToken: null
    }
  });

  return { message: 'Email berhasil diverifikasi' };
};

/**
 * Forgot password
 */
const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email, deletedAt: null }
  });

  if (!user) {
    // Don't reveal if email exists
    return { message: 'Jika email terdaftar, Anda akan menerima link reset password' };
  }

  const resetToken = generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: expiresAt
    }
  });

  await sendPasswordResetEmail(user.email, user.name, resetToken);

  return { message: 'Link reset password telah dikirim ke email Anda' };
};

/**
 * Reset password
 */
const resetPassword = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiresAt: { gt: new Date() }
    }
  });

  if (!user) {
    throw { statusCode: 400, message: 'Token tidak valid atau sudah kadaluarsa' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
      token: null // Invalidate all sessions
    }
  });

  return { message: 'Password berhasil direset' };
};

/**
 * Change password
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw { statusCode: 400, message: 'Password saat ini salah' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  return { message: 'Password berhasil diubah' };
};

/**
 * Logout user
 */
const logout = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { token: null }
  });

  return { message: 'Berhasil logout' };
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  logout
};
