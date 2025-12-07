import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiType";
import { MstokResponse, HistoryStokResponse } from "@/types/stokType";

export const stokService = {
  // GET All Stok
  getAll: async () => {
    const response = await apiClient.get<{ data: MstokResponse[] }>("/stok");
    return response.data;
  },

  // GET Stok by Barang ID
  getByBarangId: async (barangId: number) => {
    const response = await apiClient.get<MstokResponse>(`/stok/${barangId}`);
    return response.data;
  },

  // GET All History Stok
  getAllHistory: async () => {
    const response = await apiClient.get<{ data: HistoryStokResponse[] }>(
      "/history-stok"
    );
    return response.data;
  },

  // GET History Stok by Barang ID
  getHistoryByBarangId: async (barangId: number) => {
    const response = await apiClient.get<{ data: HistoryStokResponse[] }>(
      `/history-stok/${barangId}`
    );
    return response.data;
  },
};
