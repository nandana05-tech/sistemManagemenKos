import { create } from 'zustand';
import { userService } from '../../services/user.service';

export const useUserStore = create((set, get) => ({
  // State
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  meta: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all users
  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getAll(params);
      set({
        users: response.data,
        meta: response.meta,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Fetch user by ID
  fetchUserById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getById(id);
      set({ selectedUser: response.data, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Create user
  createUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.create(data);
      const currentUsers = get().users;
      set({
        users: [response.data, ...currentUsers],
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Update user
  updateUser: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.update(id, data);
      const currentUsers = get().users;
      set({
        users: currentUsers.map(u => u.id === id ? response.data : u),
        selectedUser: response.data,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await userService.delete(id);
      const currentUsers = get().users;
      set({
        users: currentUsers.filter(u => u.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Toggle user status
  toggleUserStatus: async (id) => {
    try {
      const response = await userService.toggleStatus(id);
      const currentUsers = get().users;
      set({
        users: currentUsers.map(u => u.id === id ? { ...u, isActive: response.data.isActive } : u),
      });
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Clear selected
  clearSelected: () => set({ selectedUser: null }),
}));

export default useUserStore;
