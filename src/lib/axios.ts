import { ErrorResponse } from "@/types/apiType";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

// Initialize Next Cookie Store
const cookieStore = await cookies();

// Base URL dari Environment Variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Buat instance axios dengan konfigurasi dasar
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor untuk menambahkan token Authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = cookieStore.get("token")?.value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor untuk menangani error global jika diperlukan
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    const customError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || "Server error",
      originalError: error.response?.data,
    };

    return Promise.reject(customError);
  }
);

export default apiClient;
