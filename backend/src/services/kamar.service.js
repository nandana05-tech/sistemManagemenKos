const prisma = require('../config/database');
const { paginate, paginationMeta } = require('../utils/response');

// ==================== KATEGORI KAMAR ====================

/**
 * Get all kategori kamar
 */
const getAllKategori = async () => {
  const kategori = await prisma.kategoriKamar.findMany({
    orderBy: { namaKategori: 'asc' },
    include: {
      _count: { select: { kamar: true } }
    }
  });
  return kategori;
};

/**
 * Create kategori kamar
 */
const createKategori = async (data) => {
  const kategori = await prisma.kategoriKamar.create({ data });
  return kategori;
};

/**
 * Update kategori kamar
 */
const updateKategori = async (id, data) => {
  const kategori = await prisma.kategoriKamar.update({
    where: { id: parseInt(id) },
    data
  });
  return kategori;
};

/**
 * Delete kategori kamar
 */
const deleteKategori = async (id) => {
  // Check if kategori has rooms
  const roomCount = await prisma.kamar.count({
    where: { kategoriId: parseInt(id) }
  });

  if (roomCount > 0) {
    throw { statusCode: 400, message: 'Kategori tidak dapat dihapus karena masih memiliki kamar' };
  }

  await prisma.kategoriKamar.delete({
    where: { id: parseInt(id) }
  });

  return { message: 'Kategori berhasil dihapus' };
};

// ==================== KAMAR ====================

/**
 * Get all kamar with filters
 */
const getAllKamar = async (query = {}) => {
  const { page = 1, limit = 10, search, status, kategoriId, minPrice, maxPrice } = query;
  const pagination = paginate(page, limit);

  const where = {
    deletedAt: null,
    ...(search && {
      OR: [
        { namaKamar: { contains: search, mode: 'insensitive' } },
        { nomorKamar: { contains: search, mode: 'insensitive' } }
      ]
    }),
    ...(status && { status }),
    ...(kategoriId && { kategoriId: parseInt(kategoriId) }),
    ...(minPrice && { hargaPerBulan: { gte: parseFloat(minPrice) } }),
    ...(maxPrice && { hargaPerBulan: { lte: parseFloat(maxPrice) } })
  };

  const [kamar, total] = await Promise.all([
    prisma.kamar.findMany({
      where,
      ...pagination,
      orderBy: { createdAt: 'desc' },
      include: {
        kategori: { select: { namaKategori: true } },
        fotoKamar: { where: { isPrimary: true }, take: 1 },
        _count: { select: { riwayatSewa: true } }
      }
    }),
    prisma.kamar.count({ where })
  ]);

  return {
    kamar,
    meta: paginationMeta(total, page, limit)
  };
};

/**
 * Get kamar by ID
 */
const getKamarById = async (id) => {
  const kamar = await prisma.kamar.findUnique({
    where: { id: parseInt(id), deletedAt: null },
    include: {
      kategori: true,
      fotoKamar: { orderBy: { urutan: 'asc' } },
      fasilitasDetail: true,
      inventori: {
        include: {
          barang: {
            include: { namaBarang: true }
          }
        }
      },
      // Include rental history with user info
      riwayatSewa: {
        orderBy: { tanggalMulai: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, noTelepon: true } }
        }
      }
    }
  });

  if (!kamar) {
    throw { statusCode: 404, message: 'Kamar tidak ditemukan' };
  }

  return kamar;
};

/**
 * Create kamar
 */
const createKamar = async (data) => {
  // Extract fasilitas from data
  const { fasilitas, ...kamarData } = data;
  
  const kamar = await prisma.kamar.create({
    data: {
      ...kamarData,
      // Create fasilitas if provided
      ...(fasilitas && fasilitas.length > 0 && {
        fasilitasDetail: {
          create: fasilitas.map(f => ({
            namaFasilitas: f.namaFasilitas,
            kondisi: f.kondisi || 'Baik'
          }))
        }
      })
    },
    include: { kategori: true, fasilitasDetail: true }
  });
  return kamar;
};

/**
 * Update kamar
 */
const updateKamar = async (id, data) => {
  // Extract fasilitas from data
  const { fasilitas, ...kamarData } = data;
  
  // Start transaction for kamar and fasilitas update
  const kamar = await prisma.$transaction(async (tx) => {
    // Get current kamar to check status change
    const currentKamar = await tx.kamar.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentKamar) {
      throw { statusCode: 404, message: 'Kamar tidak ditemukan' };
    }

    // Handle status sync BEFORE updating kamar
    // If kamar is being set to TERSEDIA and currently not TERSEDIA
    const newStatus = kamarData.status;
    if (newStatus && currentKamar.status !== newStatus) {
      console.log(`Status change detected: ${currentKamar.status} -> ${newStatus}`);
      
      if (newStatus === 'TERSEDIA') {
        // Set all active rentals to SELESAI
        const updateResult = await tx.riwayatSewa.updateMany({
          where: { 
            kamarId: parseInt(id), 
            status: 'AKTIF' 
          },
          data: { 
            status: 'SELESAI',
            tanggalBerakhir: new Date()
          }
        });
        console.log(`Updated ${updateResult.count} active rentals to SELESAI`);
      }
    }

    // Update kamar data
    const updatedKamar = await tx.kamar.update({
      where: { id: parseInt(id) },
      data: kamarData,
      include: { kategori: true, fasilitasDetail: true }
    });

    // Handle fasilitas update if provided
    if (fasilitas !== undefined) {
      // Delete existing fasilitas (use fasilitasKamar - the model name)
      await tx.fasilitasKamar.deleteMany({
        where: { kamarId: parseInt(id) }
      });

      // Create new fasilitas if any
      if (fasilitas && fasilitas.length > 0) {
        await tx.fasilitasKamar.createMany({
          data: fasilitas.map(f => ({
            kamarId: parseInt(id),
            namaFasilitas: f.namaFasilitas,
            kondisi: f.kondisi || 'Baik'
          }))
        });
      }
    }

    // Return updated kamar with new fasilitas
    return await tx.kamar.findUnique({
      where: { id: parseInt(id) },
      include: { kategori: true, fasilitasDetail: true }
    });
  });

  return kamar;
};

/**
 * Delete kamar (soft delete)
 */
const deleteKamar = async (id) => {
  // Check active rentals
  const activeRental = await prisma.riwayatSewa.findFirst({
    where: { kamarId: parseInt(id), status: 'AKTIF' }
  });

  if (activeRental) {
    throw { statusCode: 400, message: 'Kamar tidak dapat dihapus karena sedang disewa' };
  }

  await prisma.kamar.update({
    where: { id: parseInt(id) },
    data: { deletedAt: new Date() }
  });

  return { message: 'Kamar berhasil dihapus' };
};

/**
 * Update kamar status (with rental sync)
 */
const updateKamarStatus = async (id, status) => {
  // Use transaction to sync kamar and rental status
  const result = await prisma.$transaction(async (tx) => {
    // Get current kamar status
    const currentKamar = await tx.kamar.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentKamar) {
      throw { statusCode: 404, message: 'Kamar tidak ditemukan' };
    }

    // If changing to TERSEDIA, set all active rentals to SELESAI
    if (status === 'TERSEDIA' && currentKamar.status !== 'TERSEDIA') {
      const updateResult = await tx.riwayatSewa.updateMany({
        where: { 
          kamarId: parseInt(id), 
          status: 'AKTIF' 
        },
        data: { 
          status: 'SELESAI',
          tanggalBerakhir: new Date()
        }
      });
      console.log(`Status sync: Updated ${updateResult.count} active rentals to SELESAI`);
    }

    // Update kamar status
    const kamar = await tx.kamar.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { 
        kategori: true, 
        fasilitasDetail: true,
        riwayatSewa: {
          orderBy: { tanggalMulai: 'desc' },
          take: 5,
          include: { user: { select: { id: true, name: true } } }
        }
      }
    });

    return kamar;
  });

  return result;
};

/**
 * Add kamar photos
 */
const addKamarPhotos = async (kamarId, files) => {
  const photos = files.map((file, index) => ({
    kamarId: parseInt(kamarId),
    foto: `/uploads/rooms/${file.filename}`,
    isPrimary: index === 0,
    urutan: index
  }));

  await prisma.fotoKamar.createMany({ data: photos });

  return prisma.fotoKamar.findMany({
    where: { kamarId: parseInt(kamarId) },
    orderBy: { urutan: 'asc' }
  });
};

/**
 * Delete kamar photo
 */
const deleteKamarPhoto = async (photoId) => {
  await prisma.fotoKamar.delete({
    where: { id: parseInt(photoId) }
  });
  return { message: 'Foto berhasil dihapus' };
};

// ==================== FASILITAS KAMAR ====================

/**
 * Add fasilitas to kamar
 */
const addFasilitas = async (data) => {
  const fasilitas = await prisma.fasilitasKamar.create({ data });
  return fasilitas;
};

/**
 * Delete fasilitas
 */
const deleteFasilitas = async (id) => {
  await prisma.fasilitasKamar.delete({
    where: { id: parseInt(id) }
  });
  return { message: 'Fasilitas berhasil dihapus' };
};

module.exports = {
  // Kategori
  getAllKategori,
  createKategori,
  updateKategori,
  deleteKategori,
  // Kamar
  getAllKamar,
  getKamarById,
  createKamar,
  updateKamar,
  deleteKamar,
  updateKamarStatus,
  addKamarPhotos,
  deleteKamarPhoto,
  // Fasilitas
  addFasilitas,
  deleteFasilitas
};
