const { z } = require('zod');

const createKategoriBarangSchema = z.object({
  namaKategori: z.string().min(2, 'Nama kategori minimal 2 karakter').max(255)
});

const updateKategoriBarangSchema = z.object({
  namaKategori: z.string().min(2, 'Nama kategori minimal 2 karakter').max(255)
});

const createNamaBarangSchema = z.object({
  kategoriId: z.number().int().positive('Kategori ID wajib diisi'),
  namaBarang: z.string().min(1, 'Nama barang wajib diisi').max(255)
});

const createBarangSchema = z.object({
  namaBarangId: z.number().int().positive('Nama barang ID wajib diisi'),
  kategoriId: z.number().int().positive('Kategori ID wajib diisi'),
  kamarId: z.number().int().positive('Kamar ID wajib diisi'),
  jumlah: z.number().int().min(1).default(1),
  kondisi: z.string().optional(),
  keterangan: z.string().optional()
});

const updateBarangSchema = z.object({
  namaBarangId: z.number().int().positive().optional(),
  kategoriId: z.number().int().positive().optional(),
  kamarId: z.number().int().positive().optional(),
  jumlah: z.number().int().min(1).optional(),
  kondisi: z.string().optional(),
  keterangan: z.string().optional()
});

const createInventoriSchema = z.object({
  kamarId: z.number().int().positive('Kamar ID wajib diisi'),
  barangId: z.number().int().positive('Barang ID wajib diisi'),
  jumlah: z.number().int().min(1).default(1),
  kondisi: z.string().optional(),
  catatan: z.string().optional()
});

const updateInventoriSchema = z.object({
  jumlah: z.number().int().min(1).optional(),
  kondisi: z.string().optional(),
  catatan: z.string().optional()
});

module.exports = {
  createKategoriBarangSchema,
  updateKategoriBarangSchema,
  createNamaBarangSchema,
  createBarangSchema,
  updateBarangSchema,
  createInventoriSchema,
  updateInventoriSchema
};
