"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { barangService } from "@/services/barangService";
import { BarangResponse, BarangRequest } from "@/types/barangType";
import { ErrorResponse } from "@/types/apiType";
import { Modal } from "@/components/ui/modal";
import { BarangForm } from "@/components/barang/barang-form";
import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { useAuth } from "@/hooks/useAuth";
import { formatRupiah } from "@/lib/format";

export default function BarangPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState<BarangResponse | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [barangToDelete, setBarangToDelete] = useState<BarangResponse | null>(
    null
  );

  // Fetch Data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["barang", page, debouncedSearch],
    queryFn: () =>
      barangService.getAll({ page, limit: 10, search: debouncedSearch }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: BarangRequest) => barangService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang"] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BarangRequest }) =>
      barangService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang"] });
      setIsModalOpen(false);
      setSelectedBarang(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => barangService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang"] });
      setIsDeleteModalOpen(false);
      setBarangToDelete(null);
    },
    onError: (error: ErrorResponse) => {
      alert((error.message as string) || "Gagal menghapus barang");
    },
  });

  // Handlers
  const handleCreate = () => {
    setSelectedBarang(null);
    setIsModalOpen(true);
  };

  const handleEdit = (barang: BarangResponse) => {
    setSelectedBarang(barang);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (barang: BarangResponse) => {
    setBarangToDelete(barang);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (barangToDelete) {
      deleteMutation.mutate(barangToDelete.id);
    }
  };

  const handleSubmit = (formData: BarangRequest) => {
    if (selectedBarang) {
      updateMutation.mutate({ id: selectedBarang.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Data Barang</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Kelola daftar barang, harga, dan satuan.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" />
            Tambah Barang
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 shadow-sm">
        <Search className="h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Cari nama atau kode barang..."
          className="flex-1 text-sm outline-none placeholder:text-zinc-400"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset page on search
          }}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Kode</th>
                <th className="px-6 py-3 font-medium">Nama Barang</th>
                <th className="px-6 py-3 font-medium">Satuan</th>
                <th className="px-6 py-3 font-medium">Harga Beli</th>
                <th className="px-6 py-3 font-medium">Harga Jual</th>
                <th className="px-6 py-3 font-medium">Stok</th>
                {isAdmin && (
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 6}
                    className="py-8 text-center text-zinc-500"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 6}
                    className="py-8 text-center text-red-500"
                  >
                    Gagal memuat data.
                  </td>
                </tr>
              ) : data?.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 6}
                    className="py-8 text-center text-zinc-500"
                  >
                    Tidak ada data barang.
                  </td>
                </tr>
              ) : (
                data?.data.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-3 font-medium text-zinc-900">
                      {item.kode_barang}
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-medium text-zinc-900">
                        {item.nama_barang}
                      </div>
                      <div className="text-xs text-zinc-500 truncate max-w-[200px]">
                        {item.deskripsi}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-zinc-600">{item.satuan}</td>
                    <td className="px-6 py-3 text-zinc-600">
                      {formatRupiah(item.harga_beli)}
                    </td>
                    <td className="px-6 py-3 text-zinc-600">
                      {formatRupiah(item.harga_jual)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          (item.stok || 0) > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.stok || 0}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.meta && (
          <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4">
            <div className="text-sm text-zinc-500">
              Halaman {data.meta.page} dari{" "}
              {Math.ceil(data.meta.total / data.meta.limit)}
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <button
                disabled={page >= Math.ceil(data.meta.total / data.meta.limit)}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBarang ? "Edit Barang" : "Tambah Barang Baru"}
      >
        <BarangForm
          initialData={selectedBarang}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-600">
            Apakah Anda yakin ingin menghapus barang{" "}
            <span className="font-semibold text-zinc-900">
              {barangToDelete?.nama_barang}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
