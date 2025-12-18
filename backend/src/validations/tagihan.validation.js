const { z } = require('zod');

const createTagihanSchema = z.object({
  riwayatSewaId: z.number().int().positive('Riwayat sewa ID wajib diisi'),
  userId: z.number().int().positive('User ID wajib diisi'),
  jenisTagihan: z.string().optional(),
  nominal: z.number().positive('Nominal harus positif'),
  tanggalJatuhTempo: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Format tanggal tidak valid'
  }),
  keterangan: z.string().optional()
});

const updateTagihanSchema = z.object({
  jenisTagihan: z.string().optional(),
  nominal: z.number().positive().optional(),
  tanggalJatuhTempo: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Format tanggal tidak valid'
  }).optional(),
  status: z.enum(['BELUM_LUNAS', 'LUNAS', 'JATUH_TEMPO']).optional(),
  keterangan: z.string().optional()
});

const createRiwayatSewaSchema = z.object({
  userId: z.number().int().positive('User ID wajib diisi'),
  kamarId: z.number().int().positive('Kamar ID wajib diisi'),
  tanggalMulai: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Format tanggal mulai tidak valid'
  }),
  tanggalBerakhir: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Format tanggal berakhir tidak valid'
  }),
  hargaSewa: z.number().positive('Harga sewa harus positif').optional(),
  deposit: z.number().min(0).optional(),
  catatan: z.string().optional()
});

const updateRiwayatSewaSchema = z.object({
  tanggalMulai: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Format tanggal mulai tidak valid'
  }).optional(),
  tanggalBerakhir: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Format tanggal berakhir tidak valid'
  }).optional(),
  hargaSewa: z.number().positive().optional(),
  deposit: z.number().min(0).optional(),
  status: z.enum(['AKTIF', 'SELESAI', 'DIBATALKAN']).optional(),
  catatan: z.string().optional()
});

module.exports = {
  createTagihanSchema,
  updateTagihanSchema,
  createRiwayatSewaSchema,
  updateRiwayatSewaSchema
};
