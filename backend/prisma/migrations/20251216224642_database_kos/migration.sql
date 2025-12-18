-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PEMILIK', 'PENGHUNI');

-- CreateEnum
CREATE TYPE "StatusKamar" AS ENUM ('TERSEDIA', 'TERISI', 'PERBAIKAN');

-- CreateEnum
CREATE TYPE "StatusSewa" AS ENUM ('AKTIF', 'SELESAI', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "StatusTagihan" AS ENUM ('BELUM_LUNAS', 'LUNAS', 'JATUH_TEMPO');

-- CreateEnum
CREATE TYPE "StatusPayment" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'EXPIRED', 'CANCEL');

-- CreateEnum
CREATE TYPE "Prioritas" AS ENUM ('RENDAH', 'NORMAL', 'TINGGI', 'URGENT');

-- CreateEnum
CREATE TYPE "StatusLaporan" AS ENUM ('DIAJUKAN', 'DIPROSES', 'SELESAI', 'DITOLAK');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "no_telepon" VARCHAR(50),
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PENGHUNI',
    "token" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" VARCHAR(255),
    "email_verified_at" TIMESTAMP(3),
    "reset_password_token" VARCHAR(255),
    "reset_password_expires_at" TIMESTAMP(3),
    "foto_profil" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori_kamar" (
    "id" SERIAL NOT NULL,
    "id_kost" INTEGER,
    "nama_kategori" VARCHAR(255) NOT NULL,
    "deskripsi" TEXT,
    "harga_dasar" DECIMAL(15,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_kamar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kamar" (
    "id" SERIAL NOT NULL,
    "nomor_kamar" VARCHAR(50),
    "nama_kamar" VARCHAR(255) NOT NULL,
    "kategori_id" INTEGER,
    "harga_per_bulan" DECIMAL(15,2),
    "harga_per_harian" DECIMAL(15,2),
    "luas_kamar" INTEGER,
    "status" "StatusKamar" NOT NULL DEFAULT 'TERSEDIA',
    "deskripsi" TEXT,
    "stok_kamar" INTEGER DEFAULT 1,
    "lantai" INTEGER,
    "fasilitas_kamar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "kamar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fasilitas_kamar" (
    "id" SERIAL NOT NULL,
    "kamar_id" INTEGER NOT NULL,
    "nama_fasilitas" VARCHAR(255) NOT NULL,
    "jumlah" INTEGER DEFAULT 1,
    "kondisi" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fasilitas_kamar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foto_kamar" (
    "id" SERIAL NOT NULL,
    "kamar_id" INTEGER NOT NULL,
    "foto" TEXT NOT NULL,
    "caption" VARCHAR(255),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "urutan" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foto_kamar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "riwayat_sewa" (
    "id" SERIAL NOT NULL,
    "kode_sewa" VARCHAR(100) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "kamar_id" INTEGER NOT NULL,
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_berakhir" DATE NOT NULL,
    "durasi_bulan" INTEGER,
    "harga_sewa" DECIMAL(15,2),
    "deposit" DECIMAL(15,2),
    "status" "StatusSewa" NOT NULL DEFAULT 'AKTIF',
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "riwayat_sewa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tagihan" (
    "id" SERIAL NOT NULL,
    "nomor_tagihan" VARCHAR(100) NOT NULL,
    "riwayat_sewa_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "jenis_tagihan" VARCHAR(50),
    "nominal" DECIMAL(15,2) NOT NULL,
    "tanggal_jatuh_tempo" DATE NOT NULL,
    "status" "StatusTagihan" NOT NULL DEFAULT 'BELUM_LUNAS',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tagihan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "kode_pembayaran" VARCHAR(100) NOT NULL,
    "tagihan_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "riwayat_sewa_id" INTEGER NOT NULL,
    "payment_method" VARCHAR(100),
    "payment_gateway" VARCHAR(100),
    "gross_amount" DECIMAL(15,2) NOT NULL,
    "status" "StatusPayment" NOT NULL DEFAULT 'PENDING',
    "transaction_id" VARCHAR(255),
    "va_number" VARCHAR(255),
    "bank" VARCHAR(50),
    "snap_token" TEXT,
    "snap_redirect_url" TEXT,
    "paid_at" TIMESTAMP(3),
    "verified_by" INTEGER,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori_barang" (
    "id" SERIAL NOT NULL,
    "nama_kategori" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kategori_barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nama_barang" (
    "id" SERIAL NOT NULL,
    "id_kategori" INTEGER NOT NULL,
    "nama_barang" VARCHAR(255) NOT NULL,

    CONSTRAINT "nama_barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barang" (
    "id" SERIAL NOT NULL,
    "id_nama_barang" INTEGER NOT NULL,
    "kategori_id" INTEGER NOT NULL,
    "kondisi" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventori_kamar" (
    "id" SERIAL NOT NULL,
    "kamar_id" INTEGER NOT NULL,
    "barang_id" INTEGER NOT NULL,
    "jumlah" INTEGER DEFAULT 1,
    "kondisi" VARCHAR(50),
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventori_kamar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laporan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "kamar_id" INTEGER NOT NULL,
    "jenis_laporan" VARCHAR(100),
    "judul" VARCHAR(255) NOT NULL,
    "isi_laporan" TEXT,
    "prioritas" "Prioritas" NOT NULL DEFAULT 'NORMAL',
    "status" "StatusLaporan" NOT NULL DEFAULT 'DIAJUKAN',
    "tanggal_selesai" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laporan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_kamar_nama_kategori_key" ON "kategori_kamar"("nama_kategori");

-- CreateIndex
CREATE UNIQUE INDEX "kamar_nama_kamar_key" ON "kamar"("nama_kamar");

-- CreateIndex
CREATE UNIQUE INDEX "riwayat_sewa_kode_sewa_key" ON "riwayat_sewa"("kode_sewa");

-- CreateIndex
CREATE UNIQUE INDEX "tagihan_nomor_tagihan_key" ON "tagihan"("nomor_tagihan");

-- CreateIndex
CREATE UNIQUE INDEX "payment_kode_pembayaran_key" ON "payment"("kode_pembayaran");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_barang_nama_kategori_key" ON "kategori_barang"("nama_kategori");

-- AddForeignKey
ALTER TABLE "kamar" ADD CONSTRAINT "kamar_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "kategori_kamar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fasilitas_kamar" ADD CONSTRAINT "fasilitas_kamar_kamar_id_fkey" FOREIGN KEY ("kamar_id") REFERENCES "kamar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foto_kamar" ADD CONSTRAINT "foto_kamar_kamar_id_fkey" FOREIGN KEY ("kamar_id") REFERENCES "kamar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_sewa" ADD CONSTRAINT "riwayat_sewa_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_sewa" ADD CONSTRAINT "riwayat_sewa_kamar_id_fkey" FOREIGN KEY ("kamar_id") REFERENCES "kamar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tagihan" ADD CONSTRAINT "tagihan_riwayat_sewa_id_fkey" FOREIGN KEY ("riwayat_sewa_id") REFERENCES "riwayat_sewa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tagihan" ADD CONSTRAINT "tagihan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_tagihan_id_fkey" FOREIGN KEY ("tagihan_id") REFERENCES "tagihan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_riwayat_sewa_id_fkey" FOREIGN KEY ("riwayat_sewa_id") REFERENCES "riwayat_sewa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nama_barang" ADD CONSTRAINT "nama_barang_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "kategori_barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang" ADD CONSTRAINT "barang_id_nama_barang_fkey" FOREIGN KEY ("id_nama_barang") REFERENCES "nama_barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang" ADD CONSTRAINT "barang_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "kategori_barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventori_kamar" ADD CONSTRAINT "inventori_kamar_kamar_id_fkey" FOREIGN KEY ("kamar_id") REFERENCES "kamar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventori_kamar" ADD CONSTRAINT "inventori_kamar_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan" ADD CONSTRAINT "laporan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan" ADD CONSTRAINT "laporan_kamar_id_fkey" FOREIGN KEY ("kamar_id") REFERENCES "kamar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
