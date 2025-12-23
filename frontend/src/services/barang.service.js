import api from './api';

export const barangService = {
  // ==================== KATEGORI BARANG ====================
  /**
   * Get all kategori barang
   */
  getAllKategori: async () => {
    return api.get('/barang/kategori');
  },

  /**
   * Create kategori barang (Pemilik only)
   */
  createKategori: async (data) => {
    return api.post('/barang/kategori', data);
  },

  /**
   * Update kategori barang (Pemilik only)
   */
  updateKategori: async (id, data) => {
    return api.put(`/barang/kategori/${id}`, data);
  },

  /**
   * Delete kategori barang (Pemilik only)
   */
  deleteKategori: async (id) => {
    return api.delete(`/barang/kategori/${id}`);
  },

  // ==================== NAMA BARANG ====================
  /**
   * Get all nama barang
   */
  getAllNamaBarang: async (kategoriId) => {
    return api.get('/barang/nama', { params: { kategoriId } });
  },

  /**
   * Create nama barang (Pemilik only)
   */
  createNamaBarang: async (data) => {
    return api.post('/barang/nama', data);
  },

  /**
   * Update nama barang (Pemilik only)
   */
  updateNamaBarang: async (id, data) => {
    return api.put(`/barang/nama/${id}`, data);
  },

  /**
   * Delete nama barang (Pemilik only)
   */
  deleteNamaBarang: async (id) => {
    return api.delete(`/barang/nama/${id}`);
  },

  /**
   * Get all barang
   */
  getAll: async (params = {}) => {
    return api.get('/barang', { params });
  },

  /**
   * Get barang by ID
   */
  getById: async (id) => {
    return api.get(`/barang/${id}`);
  },

  /**
   * Create barang (Pemilik only)
   */
  create: async (data) => {
    return api.post('/barang', data);
  },

  /**
   * Update barang (Pemilik only)
   */
  update: async (id, data) => {
    return api.put(`/barang/${id}`, data);
  },

  /**
   * Delete barang (Pemilik only)
   */
  delete: async (id) => {
    return api.delete(`/barang/${id}`);
  },

  // ==================== INVENTORI ====================
  /**
   * Get inventori by kamar
   */
  getInventoriByKamar: async (kamarId) => {
    return api.get(`/barang/inventori/${kamarId}`);
  },

  /**
   * Add inventori to kamar (Pemilik only)
   */
  addInventori: async (data) => {
    return api.post('/barang/inventori', data);
  },

  /**
   * Update inventori (Pemilik only)
   */
  updateInventori: async (id, data) => {
    return api.put(`/barang/inventori/${id}`, data);
  },

  /**
   * Delete inventori (Pemilik only)
   */
  deleteInventori: async (id) => {
    return api.delete(`/barang/inventori/${id}`);
  },
};

export default barangService;
