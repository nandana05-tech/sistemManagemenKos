import { create } from 'zustand';
import { laporanService } from '../../services/laporan.service';

export const useLaporanStore = create((set, get) => ({
  // State
  laporan: [],
  selectedLaporan: null,
  summary: null,
  isLoading: false,
  error: null,
  meta: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all laporan
  fetchLaporan: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await laporanService.getAll(params);
      set({
        laporan: response.data,
        meta: response.meta,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Fetch laporan by ID
  fetchLaporanById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await laporanService.getById(id);
      set({ selectedLaporan: response.data, isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Fetch summary
  fetchSummary: async () => {
    try {
      const response = await laporanService.getSummary();
      set({ summary: response.data });
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Create laporan
  createLaporan: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await laporanService.create(data);
      const currentLaporan = get().laporan;
      set({
        laporan: [response.data, ...currentLaporan],
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Update laporan
  updateLaporan: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await laporanService.update(id, data);
      const currentLaporan = get().laporan;
      set({
        laporan: currentLaporan.map(l => l.id === id ? response.data : l),
        selectedLaporan: response.data,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Update laporan status
  updateStatus: async (id, status, tanggalSelesai) => {
    set({ isLoading: true, error: null });
    try {
      const response = await laporanService.updateStatus(id, status, tanggalSelesai);
      const currentLaporan = get().laporan;
      set({
        laporan: currentLaporan.map(l => l.id === id ? response.data : l),
        selectedLaporan: response.data,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Delete laporan
  deleteLaporan: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await laporanService.delete(id);
      const currentLaporan = get().laporan;
      set({
        laporan: currentLaporan.filter(l => l.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Clear selected
  clearSelected: () => set({ selectedLaporan: null }),
}));

export default useLaporanStore;
