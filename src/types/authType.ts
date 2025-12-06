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

// Type for login request and response
export interface LoginRequest {
  email: string;
  password?: string;
}

// Type for login response
export interface LoginResponse {
  token: string;
}

// Type for register request
export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
  full_name: string;
}

// Type for register response
export interface RegisterResponse {
  username: string;
  email: string;
  full_name: string;
}
