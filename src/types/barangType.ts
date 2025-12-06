// Definisi tipe data untuk barang
export interface Barang {
  id: number;
  kode_barang: string;
  nama_barang: string;
  deskripsi: string;
  satuan: string;
  harga_beli: number;
  harga_jual: number;
  stok?: number; // Optional karena tidak semua endpoint return stok
  created_at?: string;
  updated_at?: string;
}

// Untuk Create & Update
export interface BarangRequest {
  nama_barang: string;
  deskripsi: string;
  satuan: string;
  harga_beli: number;
  harga_jual: number;
}
