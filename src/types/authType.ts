// Definisi tipe data untuk user
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: "admin" | "staff";
  created_at?: string;
  updated_at?: string;
}

export interface UserSimpleResponse {
  username: string;
  full_name: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
  full_name: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
  full_name: string;
}
