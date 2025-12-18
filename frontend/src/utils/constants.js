// API URL
export const API_URL = import.meta.env.VITE_API_URL || '/api';

// Roles
export const ROLES = {
  PEMILIK: 'PEMILIK',
  PENGHUNI: 'PENGHUNI',
};

// Room status
export const KAMAR_STATUS = {
  TERSEDIA: 'TERSEDIA',
  TERISI: 'TERISI',
  PERBAIKAN: 'PERBAIKAN',
};

export const KAMAR_STATUS_LABELS = {
  TERSEDIA: 'Tersedia',
  TERISI: 'Terisi',
  PERBAIKAN: 'Dalam Perbaikan',
};

export const KAMAR_STATUS_COLORS = {
  TERSEDIA: 'success',
  TERISI: 'warning',
  PERBAIKAN: 'danger',
};

// Rental status
export const SEWA_STATUS = {
  AKTIF: 'AKTIF',
  SELESAI: 'SELESAI',
  DIBATALKAN: 'DIBATALKAN',
};

export const SEWA_STATUS_LABELS = {
  AKTIF: 'Aktif',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Dibatalkan',
};

// Tagihan status
export const TAGIHAN_STATUS = {
  BELUM_LUNAS: 'BELUM_LUNAS',
  LUNAS: 'LUNAS',
  JATUH_TEMPO: 'JATUH_TEMPO',
};

export const TAGIHAN_STATUS_LABELS = {
  BELUM_LUNAS: 'Belum Lunas',
  LUNAS: 'Lunas',
  JATUH_TEMPO: 'Jatuh Tempo',
};

export const TAGIHAN_STATUS_COLORS = {
  BELUM_LUNAS: 'warning',
  LUNAS: 'success',
  JATUH_TEMPO: 'danger',
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
  CANCEL: 'CANCEL',
};

export const PAYMENT_STATUS_LABELS = {
  PENDING: 'Menunggu Pembayaran',
  SUCCESS: 'Berhasil',
  FAILED: 'Gagal',
  EXPIRED: 'Kadaluarsa',
  CANCEL: 'Dibatalkan',
};

export const PAYMENT_STATUS_COLORS = {
  PENDING: 'warning',
  SUCCESS: 'success',
  FAILED: 'danger',
  EXPIRED: 'danger',
  CANCEL: 'info',
};

// Laporan status
export const LAPORAN_STATUS = {
  DIAJUKAN: 'DIAJUKAN',
  DIPROSES: 'DIPROSES',
  SELESAI: 'SELESAI',
  DITOLAK: 'DITOLAK',
};

export const LAPORAN_STATUS_LABELS = {
  DIAJUKAN: 'Diajukan',
  DIPROSES: 'Sedang Diproses',
  SELESAI: 'Selesai',
  DITOLAK: 'Ditolak',
};

export const LAPORAN_STATUS_COLORS = {
  DIAJUKAN: 'info',
  DIPROSES: 'warning',
  SELESAI: 'success',
  DITOLAK: 'danger',
};

// Priority
export const PRIORITAS = {
  RENDAH: 'RENDAH',
  NORMAL: 'NORMAL',
  TINGGI: 'TINGGI',
  URGENT: 'URGENT',
};

export const PRIORITAS_LABELS = {
  RENDAH: 'Rendah',
  NORMAL: 'Normal',
  TINGGI: 'Tinggi',
  URGENT: 'Mendesak',
};

export const PRIORITAS_COLORS = {
  RENDAH: 'info',
  NORMAL: 'primary',
  TINGGI: 'warning',
  URGENT: 'danger',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
