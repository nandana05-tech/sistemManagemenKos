import api from './api';

export const kamarService = {
  // ==================== KATEGORI ====================
  /**
   * Get all kategori kamar
   */
  getAllKategori: async () => {
    return api.get('/kamar/kategori');
  },

  /**
   * Create kategori kamar (Pemilik only)
   */
  createKategori: async (data) => {
    return api.post('/kamar/kategori', data);
  },

  /**
   * Update kategori kamar (Pemilik only)
   */
  updateKategori: async (id, data) => {
    return api.put(`/kamar/kategori/${id}`, data);
  },

  /**
   * Delete kategori kamar (Pemilik only)
   */
  deleteKategori: async (id) => {
    return api.delete(`/kamar/kategori/${id}`);
  },

  // ==================== KAMAR ====================
  /**
   * Get all kamar
   */
  getAll: async (params = {}) => {
    return api.get('/kamar', { params });
  },

  /**
   * Get kamar by ID
   */
  getById: async (id) => {
    return api.get(`/kamar/${id}`);
  },

  /**
   * Create kamar (Pemilik only)
   */
  create: async (data) => {
    return api.post('/kamar', data);
  },

  /**
   * Update kamar (Pemilik only)
   */
  update: async (id, data) => {
    return api.put(`/kamar/${id}`, data);
  },

  /**
   * Delete kamar (Pemilik only)
   */
  delete: async (id) => {
    return api.delete(`/kamar/${id}`);
  },

  /**
   * Update kamar status (Pemilik only)
   */
  updateStatus: async (id, status) => {
    return api.patch(`/kamar/${id}/status`, { status });
  },

  /**
   * Upload kamar photos (Pemilik only)
   */
  uploadPhotos: async (id, files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('fotoKamar', file);
    });
    return api.post(`/kamar/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Delete kamar photo (Pemilik only)
   */
  deletePhoto: async (photoId) => {
    return api.delete(`/kamar/photos/${photoId}`);
  },

  // ==================== FASILITAS ====================
  /**
   * Add fasilitas to kamar (Pemilik only)
   */
  addFasilitas: async (kamarId, data) => {
    return api.post(`/kamar/${kamarId}/fasilitas`, data);
  },

  /**
   * Delete fasilitas (Pemilik only)
   */
  deleteFasilitas: async (fasilitasId) => {
    return api.delete(`/kamar/fasilitas/${fasilitasId}`);
  },

  // ==================== BOOKING ====================
  /**
   * Book a room (Penghuni self-service)
   */
  bookRoom: async (kamarId, durasiSewa) => {
    return api.post(`/kamar/${kamarId}/book`, { durasiSewa });
  },
};

export default kamarService;
