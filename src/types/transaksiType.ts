// Base item detail untuk form input
export interface TransaksiDetailItem {
  barang_id: number;
  qty: number;
  harga: number;
}

// ------ Type untuk Pembelian ------

// Type untuk Request Pembelian
export interface CreatePembelianRequest {
  supplier: string;
  details: TransaksiDetailItem[];
}

// Type untuk Detail Pembelian
export interface PembelianDetail {
  id: number;
  barang_id: number;
  qty: number;
  harga: number;
  subtotal: number;
  barang: {
    kode_barang: string;
    nama_barang: string;
    satuan: string;
  };
}

// Type untuk Header Pembelian
export interface PembelianHeader {
  id: number;
  no_faktur: string;
  supplier: string;
  total: number;
  user_id: number;
  status: string;
  created_at: string;
  user: {
    username: string;
    full_name: string;
  };
}

// Type untuk Response Pembelian
export interface PembelianResponse {
  header: PembelianHeader;
  details: PembelianDetail[];
}

// ------ Type untuk Penjualan ------

// Definisi tipe data untuk request penjualan
export interface CreatePenjualanRequest {
  customer: string;
  details: TransaksiDetailItem[];
}

// Definisi tipe data untuk detail penjualan
export interface PenjualanDetail {
  id: number;
  barang_id: number;
  qty: number;
  harga: number;
  subtotal: number;
  barang: {
    kode_barang: string;
    nama_barang: string;
    satuan: string;
  };
}

// Definisi tipe data untuk header penjualan
export interface PenjualanHeader {
  id: number;
  no_faktur: string;
  customer: string;
  total: number;
  user_id: number;
  status: string;
  created_at: string;
  user: {
    username: string;
    full_name: string;
  };
}

// Definisi tipe data untuk response penjualan
export interface PenjualanResponse {
  header: PenjualanHeader;
  details: PenjualanDetail[];
}
