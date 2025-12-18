const { z } = require('zod');

const createKategoriKamarSchema = z.object({
  namaKategori: z.string().min(2, 'Nama kategori minimal 2 karakter').max(255),
  deskripsi: z.string().optional(),
  hargaDasar: z.number().positive('Harga dasar harus positif').optional()
});

const updateKategoriKamarSchema = z.object({
  namaKategori: z.string().min(2, 'Nama kategori minimal 2 karakter').max(255).optional(),
  deskripsi: z.string().optional(),
  hargaDasar: z.number().positive('Harga dasar harus positif').optional()
});

const createKamarSchema = z.object({
  nomorKamar: z.string().max(50).optional(),
  namaKamar: z.string().min(1, 'Nama kamar wajib diisi').max(255),
  kategoriId: z.number().int().positive().optional(),
  hargaPerBulan: z.number().positive('Harga per bulan harus positif').optional(),
  hargaPerHarian: z.number().positive('Harga per hari harus positif').optional(),
  luasKamar: z.number().int().positive('Luas kamar harus positif').optional(),
  status: z.enum(['TERSEDIA', 'TERISI', 'PERBAIKAN']).default('TERSEDIA'),
  deskripsi: z.string().optional(),
  stokKamar: z.number().int().min(0).default(1),
  lantai: z.number().int().min(1).optional(),
  fasilitasKamar: z.string().optional(),
  // Array of fasilitas for nested creation
  fasilitas: z.array(z.object({
    namaFasilitas: z.string().min(1, 'Nama fasilitas wajib diisi'),
    kondisi: z.string().optional()
  })).optional()
});

const updateKamarSchema = z.object({
  nomorKamar: z.string().max(50).optional(),
  namaKamar: z.string().min(1).max(255).optional(),
  kategoriId: z.number().int().positive().optional(),
  hargaPerBulan: z.number().positive().optional(),
  hargaPerHarian: z.number().positive().optional(),
  luasKamar: z.number().int().positive().optional(),
  status: z.enum(['TERSEDIA', 'TERISI', 'PERBAIKAN']).optional(),
  deskripsi: z.string().optional(),
  stokKamar: z.number().int().min(0).optional(),
  lantai: z.number().int().min(1).optional(),
  fasilitasKamar: z.string().optional(),
  // Array of fasilitas for update
  fasilitas: z.array(z.object({
    id: z.number().int().optional(), // existing fasilitas ID
    namaFasilitas: z.string().min(1, 'Nama fasilitas wajib diisi'),
    kondisi: z.string().optional()
  })).optional()
});

const createFasilitasSchema = z.object({
  kamarId: z.number().int().positive('Kamar ID wajib diisi'),
  namaFasilitas: z.string().min(1, 'Nama fasilitas wajib diisi'),
  jumlah: z.number().int().min(1).default(1),
  kondisi: z.string().optional()
});

module.exports = {
  createKategoriKamarSchema,
  updateKategoriKamarSchema,
  createKamarSchema,
  updateKamarSchema,
  createFasilitasSchema
};
