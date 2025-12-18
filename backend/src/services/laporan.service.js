const prisma = require('../config/database');
const { paginate, paginationMeta } = require('../utils/response');

/**
 * Get all laporan
 */
const getAllLaporan = async (query = {}, userId = null, role = null) => {
  const { page = 1, limit = 10, status, prioritas, kamarId } = query;
  const pagination = paginate(page, limit);

  const where = {
    ...(role === 'PENGHUNI' && { userId }),
    ...(status && { status }),
    ...(prioritas && { prioritas }),
    ...(kamarId && { kamarId: parseInt(kamarId) })
  };

  const [laporan, total] = await Promise.all([
    prisma.laporan.findMany({
      where,
      ...pagination,
      orderBy: [
        { prioritas: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        user: { select: { id: true, name: true, email: true } },
        kamar: { select: { id: true, namaKamar: true, nomorKamar: true } }
      }
    }),
    prisma.laporan.count({ where })
  ]);

  return {
    laporan,
    meta: paginationMeta(total, page, limit)
  };
};

/**
 * Get laporan by ID
 */
const getLaporanById = async (id) => {
  const laporan = await prisma.laporan.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: { select: { id: true, name: true, email: true, noTelepon: true } },
      kamar: true
    }
  });

  if (!laporan) {
    throw { statusCode: 404, message: 'Laporan tidak ditemukan' };
  }

  return laporan;
};

/**
 * Create laporan (Penghuni)
 */
const createLaporan = async (data, userId) => {
  // Verify user has active rental for this kamar
  const activeRental = await prisma.riwayatSewa.findFirst({
    where: {
      userId,
      kamarId: data.kamarId,
      status: 'AKTIF'
    }
  });

  if (!activeRental) {
    throw { statusCode: 403, message: 'Anda tidak menyewa kamar ini' };
  }

  const laporan = await prisma.laporan.create({
    data: {
      ...data,
      userId
    },
    include: {
      user: { select: { id: true, name: true } },
      kamar: { select: { id: true, namaKamar: true } }
    }
  });

  return laporan;
};

/**
 * Update laporan
 */
const updateLaporan = async (id, data, userId = null, role = null) => {
  const laporan = await prisma.laporan.findUnique({
    where: { id: parseInt(id) }
  });

  if (!laporan) {
    throw { statusCode: 404, message: 'Laporan tidak ditemukan' };
  }

  // If penghuni, can only update their own laporan
  if (role === 'PENGHUNI' && laporan.userId !== userId) {
    throw { statusCode: 403, message: 'Anda tidak memiliki akses ke laporan ini' };
  }

  // Penghuni can only update if status is DIAJUKAN
  if (role === 'PENGHUNI' && laporan.status !== 'DIAJUKAN') {
    throw { statusCode: 400, message: 'Laporan tidak dapat diubah karena sudah diproses' };
  }

  if (data.tanggalSelesai) {
    data.tanggalSelesai = new Date(data.tanggalSelesai);
  }

  const updated = await prisma.laporan.update({
    where: { id: parseInt(id) },
    data,
    include: {
      user: { select: { id: true, name: true } },
      kamar: { select: { id: true, namaKamar: true } }
    }
  });

  return updated;
};

/**
 * Update laporan status (Pemilik only)
 */
const updateLaporanStatus = async (id, status, tanggalSelesai = null) => {
  const data = { status };

  if (status === 'SELESAI') {
    data.tanggalSelesai = tanggalSelesai ? new Date(tanggalSelesai) : new Date();
  }

  const laporan = await prisma.laporan.update({
    where: { id: parseInt(id) },
    data,
    include: {
      user: { select: { id: true, name: true } },
      kamar: { select: { id: true, namaKamar: true } }
    }
  });

  return laporan;
};

/**
 * Delete laporan
 */
const deleteLaporan = async (id, userId = null, role = null) => {
  const laporan = await prisma.laporan.findUnique({
    where: { id: parseInt(id) }
  });

  if (!laporan) {
    throw { statusCode: 404, message: 'Laporan tidak ditemukan' };
  }

  // If penghuni, can only delete their own laporan with status DIAJUKAN
  if (role === 'PENGHUNI') {
    if (laporan.userId !== userId) {
      throw { statusCode: 403, message: 'Anda tidak memiliki akses ke laporan ini' };
    }
    if (laporan.status !== 'DIAJUKAN') {
      throw { statusCode: 400, message: 'Laporan tidak dapat dihapus karena sudah diproses' };
    }
  }

  await prisma.laporan.delete({
    where: { id: parseInt(id) }
  });

  return { message: 'Laporan berhasil dihapus' };
};

/**
 * Get laporan summary
 */
const getLaporanSummary = async () => {
  const [total, diajukan, diproses, selesai, ditolak] = await Promise.all([
    prisma.laporan.count(),
    prisma.laporan.count({ where: { status: 'DIAJUKAN' } }),
    prisma.laporan.count({ where: { status: 'DIPROSES' } }),
    prisma.laporan.count({ where: { status: 'SELESAI' } }),
    prisma.laporan.count({ where: { status: 'DITOLAK' } })
  ]);

  const byPrioritas = await prisma.laporan.groupBy({
    by: ['prioritas'],
    _count: { prioritas: true },
    where: { status: { in: ['DIAJUKAN', 'DIPROSES'] } }
  });

  return {
    total,
    diajukan,
    diproses,
    selesai,
    ditolak,
    byPrioritas
  };
};

module.exports = {
  getAllLaporan,
  getLaporanById,
  createLaporan,
  updateLaporan,
  updateLaporanStatus,
  deleteLaporan,
  getLaporanSummary
};
