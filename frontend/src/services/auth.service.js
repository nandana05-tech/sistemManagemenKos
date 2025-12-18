import api from './api';

export const authService = {
  /**
   * Register new user
   */
  register: async (data) => {
    return api.post('/auth/register', data);
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  /**
   * Verify email
   */
  verifyEmail: async (token) => {
    return api.get(`/auth/verify-email/${token}`);
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password
   */
  resetPassword: async (token, password, confirmPassword) => {
    return api.post('/auth/reset-password', { token, password, confirmPassword });
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    return api.post('/auth/change-password', { currentPassword, newPassword, confirmPassword });
  },

  /**
   * Get current user
   */
  getMe: async () => {
    return api.get('/auth/me');
  },

  /**
   * Logout
   */
  logout: async () => {
    return api.post('/auth/logout');
  },
};

export default authService;
