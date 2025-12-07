import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiType";
import { HistoryStokResponse, MstokResponse } from "@/types/stokType";
import {
  BeliHeaderRequest,
  JualHeaderRequest,
  PembelianResponse,
  PenjualanResponse,
} from "@/types/transaksiType";

export const transactionService = {
  // --- STOK ---

  // Get All Stok
  getAllStok: async () => {
    const response = await apiClient.get<ApiResponse<MstokResponse[]>>("/stok");
    return response.data;
  },

  // Get Stok by Barang ID
  getStokByBarang: async (barangId: number) => {
    const response = await apiClient.get<ApiResponse<MstokResponse[]>>(
      `/stok/${barangId}`
    );
    // Note: Backend return array `data: [...]` walaupun by ID, jadi kita ambil elemen pertama nanti di komponen atau di sini.
    // Kita return response utuh dulu biar flexible.
    return response.data;
  },

  // --- HISTORY STOK ---

  // Get History (All)
  getHistoryStok: async (params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get<ApiResponse<HistoryStokResponse[]>>(
      "/history-stok",
      {
        params,
      }
    );
    return response.data;
  },

  // Get History by Barang
  getHistoryByBarang: async (
    barangId: number,
    params?: { page?: number; limit?: number }
  ) => {
    const response = await apiClient.get<ApiResponse<HistoryStokResponse[]>>(
      `/history-stok/${barangId}`,
      {
        params,
      }
    );
    return response.data;
  },

  // --- PEMBELIAN (INBOUND) ---

  // Get All Pembelian
  getAllPembelian: async () => {
    const response = await apiClient.get<ApiResponse<PembelianResponse[]>>(
      "/pembelian"
    );
    return response.data;
  },

  // Get Detail Pembelian
  getDetailPembelian: async (id: number) => {
    const response = await apiClient.get<PembelianResponse>(`/pembelian/${id}`);
    return response.data;
  },

  // Create Pembelian
  createPembelian: async (data: BeliHeaderRequest) => {
    const response = await apiClient.post<PembelianResponse>(
      "/pembelian",
      data
    );
    return response.data;
  },

  // --- PENJUALAN (OUTBOUND) ---

  // Get All Penjualan
  getPenjualan: async () => {
    const response = await apiClient.get<ApiResponse<PenjualanResponse[]>>(
      "/penjualan"
    );
    return response.data;
  },

  // Get Detail Penjualan
  getDetailPenjualan: async (id: number) => {
    const response = await apiClient.get<PenjualanResponse>(`/penjualan/${id}`);
    return response.data;
  },

  // Create Penjualan
  createPenjualan: async (data: JualHeaderRequest) => {
    const response = await apiClient.post<PenjualanResponse>(
      "/penjualan",
      data
    );
    return response.data;
  },
};
