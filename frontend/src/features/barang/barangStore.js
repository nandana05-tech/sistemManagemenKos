import { create } from 'zustand';
import { barangService } from '../../services/barang.service';

export const useBarangStore = create((set, get) => ({
  // State
  barang: [],
  kategori: [],
  namaBarang: [],
  inventori: [],
  isLoading: false,
  error: null,
  meta: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // ==================== KATEGORI ====================
  fetchKategori: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await barangService.getAllKategori();
      set({ kategori: response.data || [], isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  createKategori: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await barangService.createKategori(data);
      const currentKategori = get().kategori;
      set({
        kategori: [response.data, ...currentKategori],
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  deleteKategori: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await barangService.deleteKategori(id);
      const currentKategori = get().kategori;
      set({
        kategori: currentKategori.filter(k => k.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // ==================== NAMA BARANG ====================
  fetchNamaBarang: async (kategoriId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await barangService.getAllNamaBarang(kategoriId);
      set({ namaBarang: response.data || [], isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  createNamaBarang: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await barangService.createNamaBarang(data);
      const currentNamaBarang = get().namaBarang;
      set({
        namaBarang: [response.data, ...currentNamaBarang],
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // ==================== BARANG ====================
  fetchBarang: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await barangService.getAll(params);
      set({
        barang: response.data || [],
        meta: response.meta,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  createBarang: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await barangService.create(data);
      const currentBarang = get().barang;
      set({
        barang: [response.data, ...currentBarang],
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  updateBarang: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await barangService.update(id, data);
      const currentBarang = get().barang;
      set({
        barang: currentBarang.map(b => b.id === id ? response.data : b),
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  deleteBarang: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await barangService.delete(id);
      const currentBarang = get().barang;
      set({
        barang: currentBarang.filter(b => b.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // ==================== INVENTORI ====================
  fetchInventori: async (kamarId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await barangService.getInventoriByKamar(kamarId);
      set({ inventori: response.data || [], isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  addInventori: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await barangService.addInventori(data);
      const currentInventori = get().inventori;
      set({
        inventori: [response.data, ...currentInventori],
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  updateInventori: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await barangService.updateInventori(id, data);
      const currentInventori = get().inventori;
      set({
        inventori: currentInventori.map(i => i.id === id ? response.data : i),
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  deleteInventori: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await barangService.deleteInventori(id);
      const currentInventori = get().inventori;
      set({
        inventori: currentInventori.filter(i => i.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Clear
  clearInventori: () => set({ inventori: [] }),
}));

export default useBarangStore;
