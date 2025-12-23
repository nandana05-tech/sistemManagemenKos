const prisma = require('../config/database');
const { paginate, paginationMeta } = require('../utils/response');

// ==================== KATEGORI BARANG ====================

/**
 * Get all kategori barang
 */
const getAllKategoriBarang = async () => {
  const kategori = await prisma.kategoriBarang.findMany({
    orderBy: { namaKategori: 'asc' },
    include: {
      _count: { select: { barang: true, namaBarang: true } }
    }
  });
  return kategori;
};

/**
 * Create kategori barang
 */
const createKategoriBarang = async (data) => {
  const kategori = await prisma.kategoriBarang.create({ data });
  return kategori;
};

/**
 * Update kategori barang
 */
const updateKategoriBarang = async (id, data) => {
  const kategori = await prisma.kategoriBarang.update({
    where: { id: parseInt(id) },
    data
  });
  return kategori;
};

/**
 * Delete kategori barang
 */
const deleteKategoriBarang = async (id) => {
  const barangCount = await prisma.barang.count({
    where: { kategoriId: parseInt(id) }
  });

  if (barangCount > 0) {
    throw { statusCode: 400, message: 'Kategori tidak dapat dihapus karena masih memiliki barang' };
  }

  await prisma.kategoriBarang.delete({
    where: { id: parseInt(id) }
  });

  return { message: 'Kategori berhasil dihapus' };
};

// ==================== NAMA BARANG ====================

/**
 * Get all nama barang
 */
const getAllNamaBarang = async (kategoriId) => {
  const where = kategoriId ? { kategoriId: parseInt(kategoriId) } : {};
  
  const namaBarang = await prisma.namaBarang.findMany({
    where,
    orderBy: { namaBarang: 'asc' },
    include: { kategori: { select: { namaKategori: true } } }
  });
  return namaBarang;
};

/**
 * Create nama barang
 */
const createNamaBarang = async (data) => {
  const namaBarang = await prisma.namaBarang.create({
    data,
    include: { kategori: { select: { namaKategori: true } } }
  });
  return namaBarang;
};

/**
 * Update nama barang
 */
const updateNamaBarang = async (id, data) => {
  const namaBarang = await prisma.namaBarang.update({
    where: { id: parseInt(id) },
    data,
    include: { kategori: { select: { namaKategori: true } } }
  });
  return namaBarang;
};

/**
 * Delete nama barang
 */
const deleteNamaBarang = async (id) => {
  // Check if nama barang is being used by any barang
  const barangCount = await prisma.barang.count({
    where: { namaBarangId: parseInt(id) }
  });

  if (barangCount > 0) {
    throw { statusCode: 400, message: 'Nama barang tidak dapat dihapus karena masih digunakan oleh barang lain' };
  }

  await prisma.namaBarang.delete({
    where: { id: parseInt(id) }
  });
  return { message: 'Nama barang berhasil dihapus' };
};

// ==================== BARANG ====================

/**
 * Get all barang with inventori
 * Penghuni only sees items in their rented kamar
 */
const getAllBarang = async (query = {}, user = null) => {
  const { page = 1, limit = 10, kategoriId, kondisi } = query;
  const pagination = paginate(page, limit);

  // Build base where clause
  let where = {
    ...(kategoriId && { kategoriId: parseInt(kategoriId) }),
    ...(kondisi && { kondisi })
  };

  // For PENGHUNI, filter by their active rental's kamar
  let kamarIdFilter = null;
  if (user && user.role === 'PENGHUNI') {
    // Get user's active rental kamar
    const activeRental = await prisma.riwayatSewa.findFirst({
      where: { userId: user.id, status: 'AKTIF' },
      select: { kamarId: true }
    });
    
    if (activeRental) {
      kamarIdFilter = activeRental.kamarId;
    } else {
      // No active rental, return empty result
      return {
        barang: [],
        meta: paginationMeta(0, page, limit)
      };
    }
  }

  // Build inventori filter
  const inventoriWhere = kamarIdFilter ? { kamarId: kamarIdFilter } : {};

  const [barang, total] = await Promise.all([
    prisma.barang.findMany({
      where: kamarIdFilter ? {
        ...where,
        inventori: { some: { kamarId: kamarIdFilter } }
      } : where,
      ...pagination,
      orderBy: { createdAt: 'desc' },
      include: {
        namaBarang: true,
        kategori: { select: { namaKategori: true } },
        inventori: {
          where: inventoriWhere,
          take: 1,
          include: { kamar: { select: { id: true, namaKamar: true } } }
        }
      }
    }),
    prisma.barang.count({ 
      where: kamarIdFilter ? {
        ...where,
        inventori: { some: { kamarId: kamarIdFilter } }
      } : where 
    })
  ]);

  // Flatten inventori data for easier frontend usage
  const barangWithInventori = barang.map(b => ({
    ...b,
    kamar: b.inventori?.[0]?.kamar || null,
    jumlah: b.inventori?.[0]?.jumlah || 1,
    keterangan: b.inventori?.[0]?.catatan || null
  }));

  return {
    barang: barangWithInventori,
    meta: paginationMeta(total, page, limit)
  };
};

/**
 * Get barang by ID
 */
const getBarangById = async (id) => {
  const barang = await prisma.barang.findUnique({
    where: { id: parseInt(id) },
    include: {
      namaBarang: {
        include: { kategori: { select: { namaKategori: true } } }
      },
      kategori: { select: { id: true, namaKategori: true } },
      inventori: {
        include: { kamar: { select: { id: true, namaKamar: true } } }
      }
    }
  });
  return barang;
};

/**
 * Create barang and add to inventory
 */
const createBarang = async (data) => {
  const { namaBarangId, kategoriId, kondisi, kamarId, jumlah, keterangan } = data;
  
  // Transaction: create barang and add to inventory
  const result = await prisma.$transaction(async (tx) => {
    // Create barang
    const barang = await tx.barang.create({
      data: {
        namaBarangId,
        kategoriId,
        kondisi: kondisi || 'BAIK'
      },
      include: {
        namaBarang: true,
        kategori: { select: { namaKategori: true } }
      }
    });

    // Add to inventory if kamarId provided
    if (kamarId) {
      await tx.inventoriKamar.create({
        data: {
          kamarId,
          barangId: barang.id,
          jumlah: jumlah || 1,
          kondisi: kondisi || 'BAIK',
          catatan: keterangan || null
        }
      });
    }

    return barang;
  });

  return result;
};

/**
 * Update barang and its inventory
 */
const updateBarang = async (id, data) => {
  const { namaBarangId, kategoriId, kondisi, kamarId, jumlah, keterangan } = data;
  
  // Only include fields that exist in Barang model
  const barangData = {};
  if (namaBarangId !== undefined) barangData.namaBarangId = namaBarangId;
  if (kategoriId !== undefined) barangData.kategoriId = kategoriId;
  if (kondisi !== undefined) barangData.kondisi = kondisi;

  const result = await prisma.$transaction(async (tx) => {
    // Update barang if there's data to update
    const barang = Object.keys(barangData).length > 0 
      ? await tx.barang.update({
          where: { id: parseInt(id) },
          data: barangData,
          include: {
            namaBarang: true,
            kategori: { select: { namaKategori: true } }
          }
        })
      : await tx.barang.findUnique({
          where: { id: parseInt(id) },
          include: {
            namaBarang: true,
            kategori: { select: { namaKategori: true } }
          }
        });

    // Update inventory if kamarId provided
    if (kamarId) {
      // Check if inventory entry exists
      const existingInventory = await tx.inventoriKamar.findFirst({
        where: { barangId: parseInt(id) }
      });

      if (existingInventory) {
        await tx.inventoriKamar.update({
          where: { id: existingInventory.id },
          data: {
            kamarId,
            jumlah: jumlah || existingInventory.jumlah,
            kondisi: kondisi || existingInventory.kondisi,
            catatan: keterangan || existingInventory.catatan
          }
        });
      } else {
        await tx.inventoriKamar.create({
          data: {
            kamarId,
            barangId: parseInt(id),
            jumlah: jumlah || 1,
            kondisi: kondisi || 'BAIK',
            catatan: keterangan || null
          }
        });
      }
    }

    return barang;
  });

  return result;
};

/**
 * Delete barang (with cascade delete of inventori)
 */
const deleteBarang = async (id) => {
  // Use transaction to delete inventori first, then barang
  await prisma.$transaction(async (tx) => {
    // Delete all inventori for this barang first
    await tx.inventoriKamar.deleteMany({
      where: { barangId: parseInt(id) }
    });

    // Then delete the barang
    await tx.barang.delete({
      where: { id: parseInt(id) }
    });
  });

  return { message: 'Barang berhasil dihapus' };
};

// ==================== INVENTORI KAMAR ====================

/**
 * Get inventori by kamar
 */
const getInventoriByKamar = async (kamarId) => {
  const inventori = await prisma.inventoriKamar.findMany({
    where: { kamarId: parseInt(kamarId) },
    include: {
      barang: {
        include: {
          namaBarang: true,
          kategori: { select: { namaKategori: true } }
        }
      }
    }
  });
  return inventori;
};

/**
 * Add inventori to kamar
 */
const addInventori = async (data) => {
  // Check if barang already exists in kamar
  const existing = await prisma.inventoriKamar.findFirst({
    where: {
      kamarId: data.kamarId,
      barangId: data.barangId
    }
  });

  if (existing) {
    // Update jumlah if exists
    const inventori = await prisma.inventoriKamar.update({
      where: { id: existing.id },
      data: { jumlah: existing.jumlah + (data.jumlah || 1) },
      include: { barang: { include: { namaBarang: true } } }
    });
    return inventori;
  }

  const inventori = await prisma.inventoriKamar.create({
    data,
    include: { barang: { include: { namaBarang: true } } }
  });
  return inventori;
};

/**
 * Update inventori
 */
const updateInventori = async (id, data) => {
  const inventori = await prisma.inventoriKamar.update({
    where: { id: parseInt(id) },
    data,
    include: { barang: { include: { namaBarang: true } } }
  });
  return inventori;
};

/**
 * Delete inventori
 */
const deleteInventori = async (id) => {
  await prisma.inventoriKamar.delete({
    where: { id: parseInt(id) }
  });
  return { message: 'Inventori berhasil dihapus' };
};

module.exports = {
  // Kategori Barang
  getAllKategoriBarang,
  createKategoriBarang,
  updateKategoriBarang,
  deleteKategoriBarang,
  // Nama Barang
  getAllNamaBarang,
  createNamaBarang,
  updateNamaBarang,
  deleteNamaBarang,
  // Barang
  getAllBarang,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
  // Inventori
  getInventoriByKamar,
  addInventori,
  updateInventori,
  deleteInventori
};
