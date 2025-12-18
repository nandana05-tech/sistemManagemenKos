import api from './api';

export const tagihanService = {
  /**
   * Get all tagihan
   */
  getAll: async (params = {}) => {
    return api.get('/tagihan', { params });
  },

  /**
   * Get tagihan by ID
   */
  getById: async (id) => {
    return api.get(`/tagihan/${id}`);
  },

  /**
   * Create tagihan (Pemilik only)
   */
  create: async (data) => {
    return api.post('/tagihan', data);
  },

  /**
   * Update tagihan (Pemilik only)
   */
  update: async (id, data) => {
    return api.put(`/tagihan/${id}`, data);
  },

  /**
   * Delete tagihan (Pemilik only)
   */
  delete: async (id) => {
    return api.delete(`/tagihan/${id}`);
  },

  /**
   * Generate monthly tagihan (Pemilik only)
   */
  generateMonthly: async () => {
    return api.post('/tagihan/generate');
  },

  /**
   * Get tagihan summary
   */
  getSummary: async () => {
    return api.get('/tagihan/summary');
  },
};

export default tagihanService;
