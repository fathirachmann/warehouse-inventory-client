import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiType";
import {
  BarangRequest,
  BarangResponse,
  CreatedBarangResponse,
  DeleteBarangResponse,
} from "@/types/barangType";

export const barangService = {
  // GET All Barang (Search & Pagination)
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await apiClient.get<ApiResponse<BarangResponse[]>>(
      "/barang",
      {
        params,
      }
    );
    return response.data;
  },

  // GET Detail Barang
  getById: async (id: number) => {
    const response = await apiClient.get<BarangResponse>(`/barang/${id}`);
    return response.data;
  },

  // POST Create Barang
  create: async (data: BarangRequest) => {
    const response = await apiClient.post<CreatedBarangResponse>(
      "/barang",
      data
    );
    return response.data;
  },

  // PUT Update Barang
  update: async (id: number, data: BarangRequest) => {
    const response = await apiClient.put<BarangResponse>(`/barang/${id}`, data);
    return response.data;
  },

  // DELETE Barang
  delete: async (id: number) => {
    const response = await apiClient.delete<DeleteBarangResponse>(
      `/barang/${id}`
    );
    return response.data;
  },
};
