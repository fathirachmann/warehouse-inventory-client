// Meta information for paginated API responses
export interface Meta {
  page: number;
  limit: number;
  total: number;
}

// Generic API response structure
export interface ApiResponse<T> {
  message?: string;
  data: T;
  meta?: Meta;
}

// Error response structure
export interface ErrorResponse {
  status?: string;
  message: string | Record<string, string>;
}
