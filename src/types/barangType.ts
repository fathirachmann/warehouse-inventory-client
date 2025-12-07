export interface Barang {
  id: number;
  kode_barang: string;
  nama_barang: string;
  deskripsi: string;
  satuan: string;
  harga_beli: number;
  harga_jual: number;
  created_at: string;
  updated_at: string;
}

// Request Body untuk Create & Update
export interface BarangRequest {
  nama_barang: string;
  deskripsi: string;
  satuan: string;
  harga_beli: number;
  harga_jual: number;
}

// Response spesifik untuk List Barang (mengandung field 'stok')
export interface BarangResponse {
  id: number;
  kode_barang: string;
  nama_barang: string;
  deskripsi: string;
  satuan: string;
  harga_beli: number;
  harga_jual: number;
  stok?: number;
}

export interface CreatedBarangResponse {
  id: number;
  kode_barang: string;
  nama_barang: string;
  deskripsi: string;
  satuan: string;
  harga_beli: number;
  harga_jual: number;
}

export interface BarangSimpleResponse {
  kode_barang: string;
  nama_barang: string;
}

export interface BarangStokResponse {
  kode_barang: string;
  nama_barang: string;
  satuan: string;
  harga_jual: number;
}

export interface DeleteBarangResponse {
  message: string;
}
