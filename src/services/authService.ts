import apiClient from "@/lib/axios";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/authType";

export const authService = {
  // Login User
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  // Register User (Admin Only)
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<{
      status: string;
      user: RegisterResponse;
    }>("/auth/register", data);
    return response.data;
  },

  logout: () => {
    return true;
  },
};
