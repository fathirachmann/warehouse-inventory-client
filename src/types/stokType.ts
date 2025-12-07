import { UserSimpleResponse } from "./authType";
import { BarangSimpleResponse, BarangStokResponse } from "./barangType";

// Definisi tipe data untuk stok dan history stok
export interface MstokResponse {
  id: number;
  barang_id: number;
  stok_akhir: number;
  updated_at: string;
  barang: BarangStokResponse;
}

// Definisi tipe data untuk history stok
export interface HistoryStokResponse {
  id: number;
  barang_id: number;
  user_id: number;
  jenis_transaksi: "masuk" | "keluar" | "adjustment";
  jumlah: number;
  stok_sebelum: number;
  stok_sesudah: number;
  keterangan: string;
  created_at: string;
  barang: BarangSimpleResponse;
  user: UserSimpleResponse;
}
