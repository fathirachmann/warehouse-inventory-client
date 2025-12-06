// Definisi tipe data untuk stok dan history stok
export interface Stok {
  id: number;
  barang_id: number;
  stok_akhir: number;
  updated_at: string;
  barang: {
    kode_barang: string;
    nama_barang: string;
    satuan: string;
    harga_jual: number;
  };
}

// Definisi tipe data untuk history stok
export interface HistoryStok {
  id: number;
  barang_id: number;
  user_id: number;
  jenis_transaksi: "masuk" | "keluar" | "adjustment";
  jumlah: number;
  stok_sebelum: number;
  stok_sesudah: number;
  keterangan: string;
  created_at: string;
  barang: {
    kode_barang: string;
    nama_barang: string;
  };
  user: {
    username: string;
    full_name: string;
  };
}
