"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { stokService } from "@/services/stokService";
import { Loader2, RefreshCw, History, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";

export default function StokPage() {
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");

  const {
    data: stokData,
    isLoading: isLoadingStok,
    refetch: refetchStok,
  } = useQuery({
    queryKey: ["stok"],
    queryFn: stokService.getAll,
  });

  const {
    data: historyData,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["history-stok"],
    queryFn: stokService.getAllHistory,
    enabled: activeTab === "history",
  });

  const handleRefresh = () => {
    if (activeTab === "current") {
      refetchStok();
    } else {
      refetchHistory();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Stok Barang</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Monitoring stok barang dan riwayat perubahan.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("current")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium",
              activeTab === "current"
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
            )}
          >
            <Package className="h-4 w-4" />
            Stok Saat Ini
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium",
              activeTab === "history"
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
            )}
          >
            <History className="h-4 w-4" />
            Riwayat Perubahan
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        {activeTab === "current" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Kode Barang</th>
                  <th className="px-6 py-3 font-medium">Nama Barang</th>
                  <th className="px-6 py-3 font-medium">Satuan</th>
                  <th className="px-6 py-3 font-medium">Stok Akhir</th>
                  <th className="px-6 py-3 font-medium">Terakhir Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isLoadingStok ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memuat data stok...
                      </div>
                    </td>
                  </tr>
                ) : stokData?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      Belum ada data stok.
                    </td>
                  </tr>
                ) : (
                  stokData?.data?.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-3 font-medium text-zinc-900">
                        {item.barang.kode_barang}
                      </td>
                      <td className="px-6 py-3 text-zinc-900">
                        {item.barang.nama_barang}
                      </td>
                      <td className="px-6 py-3 text-zinc-600">
                        {item.barang.satuan}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            item.stok_akhir > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {item.stok_akhir}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-zinc-600">
                        {formatDateTime(item.updated_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Tanggal</th>
                  <th className="px-6 py-3 font-medium">Barang</th>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Jenis</th>
                  <th className="px-6 py-3 font-medium">Jumlah</th>
                  <th className="px-6 py-3 font-medium">Stok Awal</th>
                  <th className="px-6 py-3 font-medium">Stok Akhir</th>
                  <th className="px-6 py-3 font-medium">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isLoadingHistory ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-zinc-500">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memuat riwayat...
                      </div>
                    </td>
                  </tr>
                ) : historyData?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-zinc-500">
                      Belum ada riwayat transaksi.
                    </td>
                  </tr>
                ) : (
                  historyData?.data?.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-3 text-zinc-600 whitespace-nowrap">
                        {formatDateTime(item.created_at)}
                      </td>
                      <td className="px-6 py-3 text-zinc-900">
                        {item.barang.nama_barang}
                      </td>
                      <td className="px-6 py-3 text-zinc-600">
                        {item.user.full_name}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                            item.jenis_transaksi === "masuk"
                              ? "bg-blue-100 text-blue-800"
                              : item.jenis_transaksi === "keluar"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          )}
                        >
                          {item.jenis_transaksi}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-medium text-zinc-900">
                        {item.jumlah}
                      </td>
                      <td className="px-6 py-3 text-zinc-600">
                        {item.stok_sebelum}
                      </td>
                      <td className="px-6 py-3 text-zinc-600">
                        {item.stok_sesudah}
                      </td>
                      <td className="px-6 py-3 text-zinc-500 max-w-[200px] truncate">
                        {item.keterangan}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
