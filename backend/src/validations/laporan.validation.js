const { z } = require('zod');

const createLaporanSchema = z.object({
  kamarId: z.number().int().positive('Kamar ID wajib diisi'),
  jenisLaporan: z.string().optional(),
  judul: z.string().min(3, 'Judul minimal 3 karakter').max(255),
  isiLaporan: z.string().optional(),
  prioritas: z.enum(['RENDAH', 'NORMAL', 'TINGGI', 'URGENT']).default('NORMAL')
});

const updateLaporanSchema = z.object({
  jenisLaporan: z.string().optional(),
  judul: z.string().min(3).max(255).optional(),
  isiLaporan: z.string().optional(),
  prioritas: z.enum(['RENDAH', 'NORMAL', 'TINGGI', 'URGENT']).optional(),
  status: z.enum(['DIAJUKAN', 'DIPROSES', 'SELESAI', 'DITOLAK']).optional(),
  tanggalSelesai: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Format tanggal tidak valid'
  }).optional()
});

const updateStatusLaporanSchema = z.object({
  status: z.enum(['DIAJUKAN', 'DIPROSES', 'SELESAI', 'DITOLAK']),
  tanggalSelesai: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Format tanggal tidak valid'
  }).optional()
});

module.exports = {
  createLaporanSchema,
  updateLaporanSchema,
  updateStatusLaporanSchema
};
