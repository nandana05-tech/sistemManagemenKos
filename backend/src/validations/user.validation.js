const { z } = require('zod');

const createUserSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(255),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  noTelepon: z.string().optional(),
  role: z.enum(['PEMILIK', 'PENGHUNI']).default('PENGHUNI'),
  isActive: z.boolean().default(true)
});

const updateUserSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(255).optional(),
  email: z.string().email('Format email tidak valid').optional(),
  noTelepon: z.string().optional(),
  role: z.enum(['PEMILIK', 'PENGHUNI']).optional(),
  isActive: z.boolean().optional()
});

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(255).optional(),
  noTelepon: z.string().optional()
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema
};
