// --- Transaksi Pembelian (models/pembelian.go) ---

export interface BeliDetailRequest {
  barang_id: number;
  qty: number;
  harga: number;
}

export interface BeliHeaderRequest {
  supplier: string;
  details: BeliDetailRequest[];
}

export interface BarangPembelianResponse {
  kode_barang: string;
  nama_barang: string;
  satuan: string;
}

export interface BeliDetailResponse {
  id: number;
  barang_id: number;
  qty: number;
  harga: number;
  subtotal: number;
  barang: BarangPembelianResponse;
}

export interface BeliHeaderResponse {
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

// Yang digunakan untuk response GET pembelian
export interface PembelianResponse {
  header: BeliHeaderResponse;
  details: BeliDetailResponse[];
}

// --- Transaksi Penjualan (models/penjualan.go) ---

export interface JualDetailRequest {
  barang_id: number;
  qty: number;
  harga: number;
}

export interface JualHeaderRequest {
  customer: string;
  details: JualDetailRequest[];
}

export interface BarangPenjualanResponse {
  kode_barang: string;
  nama_barang: string;
  satuan: string;
}

export interface JualDetailResponse {
  id: number;
  barang_id: number;
  qty: number;
  harga: number;
  subtotal: number;
  barang: BarangPenjualanResponse;
}

export interface JualHeaderResponse {
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

// Yang digunakan untuk response GET penjualan
export interface PenjualanResponse {
  header: JualHeaderResponse;
  details: JualDetailResponse[];
}
