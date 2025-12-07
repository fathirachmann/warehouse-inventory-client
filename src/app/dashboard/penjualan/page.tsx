"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";
import { PenjualanResponse } from "@/types/transaksiType";
import { Modal } from "@/components/ui/modal";
import { PenjualanForm } from "@/components/penjualan/penjualan-form";
import { PenjualanDetail } from "@/components/penjualan/penjualan-detail";
import { Plus, Search, Eye, Loader2 } from "lucide-react";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { useDebounce } from "@uidotdev/usehooks";

export default function PenjualanPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPenjualan, setSelectedPenjualan] =
    useState<PenjualanResponse | null>(null);

  // Fetch Data
  const { data, isLoading } = useQuery({
    queryKey: ["penjualan"],
    queryFn: transactionService.getPenjualan,
  });

  // Client-side filtering
  const filteredData = data?.data?.filter(
    (item) =>
      item.header.no_faktur
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      item.header.customer.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Penjualan Barang
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Kelola transaksi penjualan barang keluar (Outbound).
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Tambah Penjualan
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 shadow-sm">
        <Search className="h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Cari no faktur atau customer..."
          className="flex-1 text-sm outline-none placeholder:text-zinc-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">No. Faktur</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filteredData?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500">
                    Tidak ada data penjualan.
                  </td>
                </tr>
              ) : (
                filteredData?.map((item) => (
                  <tr key={item.header.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-3 font-medium text-zinc-900">
                      {item.header.no_faktur}
                    </td>
                    <td className="px-6 py-3 text-zinc-600">
                      {formatDateTime(item.header.created_at)}
                    </td>
                    <td className="px-6 py-3 text-zinc-900">
                      {item.header.customer}
                    </td>
                    <td className="px-6 py-3 font-medium text-zinc-900">
                      {formatRupiah(item.header.total)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.header.status === "selesai"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.header.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-zinc-600">
                      {item.header.user?.full_name ||
                        item.header.user?.username ||
                        "-"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => setSelectedPenjualan(item)}
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Tambah Penjualan Baru"
        className="max-w-4xl"
      >
        <PenjualanForm
          onSuccess={() => setIsCreateOpen(false)}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedPenjualan}
        onClose={() => setSelectedPenjualan(null)}
        title="Detail Penjualan"
        className="max-w-3xl"
      >
        {selectedPenjualan && (
          <PenjualanDetail
            data={selectedPenjualan}
            onClose={() => setSelectedPenjualan(null)}
          />
        )}
      </Modal>
    </div>
  );
}
