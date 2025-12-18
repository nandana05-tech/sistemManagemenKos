import { create } from 'zustand';
import { kamarService } from '../../services/kamar.service';

export const useKamarStore = create((set, get) => ({
  // State
  kamar: [],
  selectedKamar: null,
  kategori: [],
  isLoading: false,
  error: null,
  meta: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all kamar
  fetchKamar: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await kamarService.getAll(params);
      set({
        kamar: response.data,
        meta: response.meta,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Fetch kamar by ID
  fetchKamarById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await kamarService.getById(id);
      set({ selectedKamar: response.data, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Fetch all kategori
  fetchKategori: async () => {
    try {
      const response = await kamarService.getAllKategori();
      set({ kategori: response.data });
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Create kamar
  createKamar: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await kamarService.create(data);
      const currentKamar = get().kamar;
      set({
        kamar: [response.data, ...currentKamar],
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Update kamar
  updateKamar: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await kamarService.update(id, data);
      const currentKamar = get().kamar;
      set({
        kamar: currentKamar.map(k => k.id === id ? response.data : k),
        selectedKamar: response.data,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Update kamar status
  updateKamarStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await kamarService.updateStatus(id, status);
      const currentKamar = get().kamar;
      set({
        kamar: currentKamar.map(k => k.id === parseInt(id) ? { ...k, status } : k),
        selectedKamar: get().selectedKamar ? { ...get().selectedKamar, status } : null,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Delete kamar
  deleteKamar: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await kamarService.delete(id);
      const currentKamar = get().kamar;
      set({
        kamar: currentKamar.filter(k => k.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Clear selected
  clearSelected: () => set({ selectedKamar: null }),
}));

export default useKamarStore;
