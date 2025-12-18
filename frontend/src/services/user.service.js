import api from './api';

export const userService = {
  /**
   * Get all users (Pemilik only)
   */
  getAll: async (params = {}) => {
    return api.get('/users', { params });
  },

  /**
   * Get user by ID
   */
  getById: async (id) => {
    return api.get(`/users/${id}`);
  },

  /**
   * Create new user (Pemilik only)
   */
  create: async (data) => {
    return api.post('/users', data);
  },

  /**
   * Update user (Pemilik only)
   */
  update: async (id, data) => {
    return api.put(`/users/${id}`, data);
  },

  /**
   * Update profile (own profile)
   */
  updateProfile: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Delete user (Pemilik only)
   */
  delete: async (id) => {
    return api.delete(`/users/${id}`);
  },

  /**
   * Toggle user active status (Pemilik only)
   */
  toggleStatus: async (id) => {
    return api.patch(`/users/${id}/toggle-status`);
  },

  /**
   * Get user's riwayat sewa (Pemilik only)
   */
  getRiwayatSewa: async (id) => {
    return api.get(`/users/${id}/riwayat-sewa`);
  },
};

export default userService;
