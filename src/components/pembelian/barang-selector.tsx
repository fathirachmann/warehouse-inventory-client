"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { barangService } from "@/services/barangService";
import { BarangResponse } from "@/types/barangType";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";

interface BarangSelectorProps {
  onSelect: (barang: BarangResponse) => void;
  onClose: () => void;
}

export function BarangSelector({ onSelect, onClose }: BarangSelectorProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["barang", page, debouncedSearch],
    queryFn: () =>
      barangService.getAll({ page, limit: 5, search: debouncedSearch }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2">
        <Search className="h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Cari barang..."
          className="flex-1 text-sm outline-none placeholder:text-zinc-400"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          autoFocus
        />
      </div>

      <div className="max-h-[300px] overflow-y-auto rounded-md border border-zinc-200">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        ) : data?.data.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-500">
            Barang tidak ditemukan.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-2 font-medium">Nama</th>
                <th className="px-4 py-2 font-medium">Stok</th>
                <th className="px-4 py-2 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {data?.data.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-2">
                    <div className="font-medium text-zinc-900">
                      {item.nama_barang}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {item.kode_barang}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-zinc-600">{item.stok}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-800"
                    >
                      Pilih
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Simple Pagination */}
      {data?.meta && (
        <div className="flex justify-between items-center text-xs text-zinc-500">
          <span>Halaman {data.meta.page}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="disabled:opacity-50 hover:text-zinc-900"
            >
              Prev
            </button>
            <button
              disabled={page >= Math.ceil(data.meta.total / data.meta.limit)}
              onClick={() => setPage((p) => p + 1)}
              className="disabled:opacity-50 hover:text-zinc-900"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
