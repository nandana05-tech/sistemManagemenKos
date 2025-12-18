import { create } from 'zustand';
import { tagihanService } from '../../services/tagihan.service';

export const useTagihanStore = create((set, get) => ({
  // State
  tagihan: [],
  selectedTagihan: null,
  summary: null,
  isLoading: false,
  error: null,
  meta: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all tagihan
  fetchTagihan: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tagihanService.getAll(params);
      set({
        tagihan: response.data,
        meta: response.meta,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Fetch tagihan by ID
  fetchTagihanById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tagihanService.getById(id);
      set({ selectedTagihan: response.data, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Fetch summary
  fetchSummary: async () => {
    try {
      const response = await tagihanService.getSummary();
      set({ summary: response.data });
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Create tagihan
  createTagihan: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tagihanService.create(data);
      const currentTagihan = get().tagihan;
      set({
        tagihan: [response.data, ...currentTagihan],
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Update tagihan
  updateTagihan: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tagihanService.update(id, data);
      const currentTagihan = get().tagihan;
      set({
        tagihan: currentTagihan.map(t => t.id === id ? response.data : t),
        selectedTagihan: response.data,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Delete tagihan
  deleteTagihan: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await tagihanService.delete(id);
      const currentTagihan = get().tagihan;
      set({
        tagihan: currentTagihan.filter(t => t.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Generate monthly tagihan
  generateMonthly: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await tagihanService.generateMonthly();
      // Refresh tagihan list
      await get().fetchTagihan();
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Clear selected
  clearSelected: () => set({ selectedTagihan: null }),
}));

export default useTagihanStore;
