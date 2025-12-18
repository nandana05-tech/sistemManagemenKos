const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { paginate, paginationMeta } = require('../utils/response');
const { exclude } = require('../utils/helpers');

/**
 * Get all users (Pemilik only)
 */
const getAllUsers = async (query = {}) => {
  const { page = 1, limit = 10, search, role, isActive } = query;
  const pagination = paginate(page, limit);

  const where = {
    deletedAt: null,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }),
    ...(role && { role }),
    ...(isActive !== undefined && { isActive: isActive === 'true' })
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      ...pagination,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        noTelepon: true,
        role: true,
        isActive: true,
        fotoProfil: true,
        createdAt: true
      }
    }),
    prisma.user.count({ where })
  ]);

  return {
    users,
    meta: paginationMeta(total, page, limit)
  };
};

/**
 * Get user by ID
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id), deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      noTelepon: true,
      role: true,
      isActive: true,
      fotoProfil: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    throw { statusCode: 404, message: 'User tidak ditemukan' };
  }

  return user;
};

/**
 * Create new user (Pemilik only)
 */
const createUser = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw { statusCode: 409, message: 'Email sudah terdaftar' };
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      isActive: data.isActive ?? true,
      emailVerifiedAt: data.isActive ? new Date() : null
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  });

  return user;
};

/**
 * Update user (Pemilik only)
 */
const updateUser = async (id, data) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id), deletedAt: null }
  });

  if (!user) {
    throw { statusCode: 404, message: 'User tidak ditemukan' };
  }

  // Check email uniqueness if email is being updated
  if (data.email && data.email !== user.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingEmail) {
      throw { statusCode: 409, message: 'Email sudah digunakan' };
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      noTelepon: true,
      role: true,
      isActive: true,
      fotoProfil: true,
      updatedAt: true
    }
  });

  return updatedUser;
};

/**
 * Update profile (own profile)
 */
const updateProfile = async (userId, data, file) => {
  const updateData = { ...data };

  if (file) {
    updateData.fotoProfil = `/uploads/profiles/${file.filename}`;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      noTelepon: true,
      role: true,
      fotoProfil: true,
      updatedAt: true
    }
  });

  return user;
};

/**
 * Delete user (soft delete)
 */
const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id), deletedAt: null }
  });

  if (!user) {
    throw { statusCode: 404, message: 'User tidak ditemukan' };
  }

  await prisma.user.update({
    where: { id: parseInt(id) },
    data: { deletedAt: new Date() }
  });

  return { message: 'User berhasil dihapus' };
};

/**
 * Toggle user active status
 */
const toggleUserStatus = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id), deletedAt: null }
  });

  if (!user) {
    throw { statusCode: 404, message: 'User tidak ditemukan' };
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { isActive: !user.isActive },
    select: {
      id: true,
      name: true,
      isActive: true
    }
  });

  return updatedUser;
};

/**
 * Get user's riwayat sewa (Pemilik only)
 */
const getUserRiwayatSewa = async (id) => {
  const riwayatSewa = await prisma.riwayatSewa.findMany({
    where: { 
      userId: parseInt(id),
      status: 'AKTIF'
    },
    include: {
      kamar: {
        select: {
          id: true,
          namaKamar: true,
          hargaPerBulan: true
        }
      }
    },
    orderBy: { tanggalMulai: 'desc' }
  });

  return riwayatSewa;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateProfile,
  deleteUser,
  toggleUserStatus,
  getUserRiwayatSewa
};
