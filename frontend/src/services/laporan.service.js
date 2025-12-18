import api from './api';

export const laporanService = {
  /**
   * Get all laporan
   */
  getAll: async (params = {}) => {
    return api.get('/laporan', { params });
  },

  /**
   * Get laporan by ID
   */
  getById: async (id) => {
    return api.get(`/laporan/${id}`);
  },

  /**
   * Create laporan (Penghuni)
   */
  create: async (data) => {
    return api.post('/laporan', data);
  },

  /**
   * Update laporan
   */
  update: async (id, data) => {
    return api.put(`/laporan/${id}`, data);
  },

  /**
   * Update laporan status (Pemilik only)
   */
  updateStatus: async (id, status, tanggalSelesai = null) => {
    const data = { status };
    if (tanggalSelesai) {
      data.tanggalSelesai = tanggalSelesai;
    }
    return api.patch(`/laporan/${id}/status`, data);
  },

  /**
   * Delete laporan
   */
  delete: async (id) => {
    return api.delete(`/laporan/${id}`);
  },

  /**
   * Get laporan summary (Pemilik only)
   */
  getSummary: async () => {
    return api.get('/laporan/summary');
  },
};

export default laporanService;
