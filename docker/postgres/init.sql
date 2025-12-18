-- =====================================================
-- KOST MANAGEMENT SYSTEM - DATABASE INITIALIZATION
-- =====================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: This file is for initial database setup.
-- Schema will be managed by Prisma migrations.
-- You can add seed data here if needed.

-- Example: Create admin user (password: admin123)
-- The password hash is for 'admin123' using bcrypt with 12 rounds
-- In production, change this password immediately!

-- INSERT INTO users (name, email, password, role, is_active, email_verified_at, created_at, updated_at)
-- VALUES (
--   'Admin',
--   'admin@kostmanagement.com',
--   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.qhK9ypVxVlGKXa',
--   'PEMILIK',
--   true,
--   NOW(),
--   NOW(),
--   NOW()
-- );

-- Setelah menjalankan Prisma migrate, Anda bisa menambahkan data awal di sini
