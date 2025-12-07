import { PembelianResponse } from "@/types/transaksiType";
import { formatDateTime, formatRupiah } from "@/lib/format";

interface PembelianDetailProps {
  data: PembelianResponse;
  onClose: () => void;
}

export function PembelianDetail({ data, onClose }: PembelianDetailProps) {
  const { header, details } = data;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-2 gap-4 rounded-lg bg-zinc-50 p-4 text-sm">
        <div>
          <div className="text-zinc-500">No. Faktur</div>
          <div className="font-medium text-zinc-900">{header.no_faktur}</div>
        </div>
        <div>
          <div className="text-zinc-500">Tanggal</div>
          <div className="font-medium text-zinc-900">
            {formatDateTime(header.created_at)}
          </div>
        </div>
        <div>
          <div className="text-zinc-500">Supplier</div>
          <div className="font-medium text-zinc-900">{header.supplier}</div>
        </div>
        <div>
          <div className="text-zinc-500">Dibuat Oleh</div>
          <div className="font-medium text-zinc-900">
            {header.user?.full_name || header.user?.username || "-"}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-900">
          Detail Barang
        </h3>
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-2 font-medium">Barang</th>
                <th className="px-4 py-2 font-medium text-right">Qty</th>
                <th className="px-4 py-2 font-medium text-right">Harga</th>
                <th className="px-4 py-2 font-medium text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {details.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2">
                    <div className="font-medium text-zinc-900">
                      {item.barang.nama_barang}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {item.barang.kode_barang}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right text-zinc-900">
                    {item.qty} {item.barang.satuan}
                  </td>
                  <td className="px-4 py-2 text-right text-zinc-600">
                    {formatRupiah(item.harga)}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-zinc-900">
                    {formatRupiah(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-zinc-50">
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right font-bold">
                  Total
                </td>
                <td className="px-4 py-2 text-right font-bold text-zinc-900">
                  {formatRupiah(header.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
