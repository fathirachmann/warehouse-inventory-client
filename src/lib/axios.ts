import axios, { AxiosError } from "axios";
import { ErrorResponse } from "@/types/apiType";

// Base URL diambil dari environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor untuk menangani error global jika diperlukan
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    // Backend mengirimkan { error, message }, kita fokus ke message
    const message =
      error.response?.data?.message ?? "Terjadi kesalahan pada server";

    return Promise.reject({
      status: error.response?.status ?? 500,
      message,
    });
  }
);

export default apiClient;
