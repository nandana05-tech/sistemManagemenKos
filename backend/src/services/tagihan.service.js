const prisma = require('../config/database');
const { paginate, paginationMeta } = require('../utils/response');
const { generateCode } = require('../utils/helpers');

/**
 * Get all tagihan with filters
 */
const getAllTagihan = async (query = {}, userId = null, role = null) => {
  const { page = 1, limit = 10, status, userId: filterUserId } = query;
  const pagination = paginate(page, limit);

  const where = {
    // If penghuni, only show their own tagihan
    ...(role === 'PENGHUNI' && { userId }),
    // If pemilik filtering by user
    ...(role === 'PEMILIK' && filterUserId && { userId: parseInt(filterUserId) }),
    ...(status && { status })
  };

  const [tagihan, total] = await Promise.all([
    prisma.tagihan.findMany({
      where,
      ...pagination,
      orderBy: { tanggalJatuhTempo: 'asc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        riwayatSewa: {
          include: { kamar: { select: { id: true, namaKamar: true } } }
        },
        payment: { select: { id: true, status: true, paidAt: true } }
      }
    }),
    prisma.tagihan.count({ where })
  ]);

  return {
    tagihan,
    meta: paginationMeta(total, page, limit)
  };
};

/**
 * Get tagihan by ID
 */
const getTagihanById = async (id) => {
  const tagihan = await prisma.tagihan.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: { select: { id: true, name: true, email: true, noTelepon: true } },
      riwayatSewa: {
        include: { kamar: true }
      },
      payment: true
    }
  });

  if (!tagihan) {
    throw { statusCode: 404, message: 'Tagihan tidak ditemukan' };
  }

  return tagihan;
};

/**
 * Create tagihan
 */
const createTagihan = async (data) => {
  const nomorTagihan = generateCode('TGH');

  const tagihan = await prisma.tagihan.create({
    data: {
      ...data,
      nomorTagihan,
      tanggalJatuhTempo: new Date(data.tanggalJatuhTempo)
    },
    include: {
      user: { select: { id: true, name: true } },
      riwayatSewa: { include: { kamar: { select: { namaKamar: true } } } }
    }
  });

  return tagihan;
};

/**
 * Update tagihan
 */
const updateTagihan = async (id, data) => {
  if (data.tanggalJatuhTempo) {
    data.tanggalJatuhTempo = new Date(data.tanggalJatuhTempo);
  }

  const tagihan = await prisma.tagihan.update({
    where: { id: parseInt(id) },
    data,
    include: {
      user: { select: { id: true, name: true } },
      riwayatSewa: { include: { kamar: { select: { namaKamar: true } } } }
    }
  });

  return tagihan;
};

/**
 * Delete tagihan (cascade delete pending payments)
 */
const deleteTagihan = async (id) => {
  // Get tagihan to check status
  const tagihan = await prisma.tagihan.findUnique({
    where: { id: parseInt(id) }
  });

  if (!tagihan) {
    throw { statusCode: 404, message: 'Tagihan tidak ditemukan' };
  }

  // Only allow deletion for unpaid tagihan
  if (tagihan.status === 'LUNAS') {
    throw { statusCode: 400, message: 'Tagihan yang sudah lunas tidak dapat dihapus' };
  }

  // Use transaction to delete payments first, then tagihan
  await prisma.$transaction(async (tx) => {
    // Delete all payments for this tagihan first
    await tx.payment.deleteMany({
      where: { tagihanId: parseInt(id) }
    });

    // Then delete the tagihan
    await tx.tagihan.delete({
      where: { id: parseInt(id) }
    });
  });

  return { message: 'Tagihan berhasil dihapus' };
};

/**
 * Generate monthly tagihan for active rentals
 */
const generateMonthlyTagihan = async () => {
  const activeRentals = await prisma.riwayatSewa.findMany({
    where: { status: 'AKTIF' },
    include: {
      user: true,
      kamar: true
    }
  });

  const currentMonth = new Date();
  const dueDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 10); // Due on 10th

  const results = [];

  for (const rental of activeRentals) {
    // Check if tagihan already exists for this month
    const existingTagihan = await prisma.tagihan.findFirst({
      where: {
        riwayatSewaId: rental.id,
        tanggalJatuhTempo: {
          gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
          lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        }
      }
    });

    if (!existingTagihan) {
      const tagihan = await prisma.tagihan.create({
        data: {
          nomorTagihan: generateCode('TGH'),
          riwayatSewaId: rental.id,
          userId: rental.userId,
          jenisTagihan: 'SEWA_BULANAN',
          nominal: rental.hargaSewa || rental.kamar.hargaPerBulan,
          tanggalJatuhTempo: dueDate,
          keterangan: `Tagihan sewa bulan ${currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`
        }
      });
      results.push(tagihan);
    }
  }

  return {
    message: `${results.length} tagihan berhasil di-generate`,
    tagihan: results
  };
};

/**
 * Get tagihan summary for dashboard
 */
const getTagihanSummary = async (userId = null, role = null) => {
  const where = role === 'PENGHUNI' ? { userId } : {};

  const [total, belumLunas, lunas, jatuhTempo] = await Promise.all([
    prisma.tagihan.count({ where }),
    prisma.tagihan.count({ where: { ...where, status: 'BELUM_LUNAS' } }),
    prisma.tagihan.count({ where: { ...where, status: 'LUNAS' } }),
    prisma.tagihan.count({
      where: {
        ...where,
        status: 'BELUM_LUNAS',
        tanggalJatuhTempo: { lt: new Date() }
      }
    })
  ]);

  const totalNominal = await prisma.tagihan.aggregate({
    where: { ...where, status: 'BELUM_LUNAS' },
    _sum: { nominal: true }
  });

  return {
    total,
    belumLunas,
    lunas,
    jatuhTempo,
    totalNominalBelumLunas: totalNominal._sum.nominal || 0
  };
};

module.exports = {
  getAllTagihan,
  getTagihanById,
  createTagihan,
  updateTagihan,
  deleteTagihan,
  generateMonthlyTagihan,
  getTagihanSummary
};
