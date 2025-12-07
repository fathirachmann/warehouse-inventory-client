"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";
import { BeliHeaderRequest } from "@/types/transaksiType";
import { ErrorResponse } from "@/types/apiType";
import { BarangResponse } from "@/types/barangType";
import { Modal } from "@/components/ui/modal";
import { BarangSelector } from "./barang-selector";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/format";

interface PembelianFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface CartItem {
  barang: BarangResponse;
  qty: number;
  harga: number; // Harga beli (editable)
}

export function PembelianForm({ onSuccess, onCancel }: PembelianFormProps) {
  const queryClient = useQueryClient();
  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState<CartItem[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: (data: BeliHeaderRequest) =>
      transactionService.createPembelian(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pembelian"] });
      queryClient.invalidateQueries({ queryKey: ["stok"] }); // Stok changes
      queryClient.invalidateQueries({ queryKey: ["barang"] }); // Barang prices might change? No, but good to refresh
      onSuccess();
    },
    onError: (err: ErrorResponse) => {
      setError((err.message as string) || "Gagal membuat transaksi pembelian");
      setIsConfirmOpen(false); // Close confirm on error to show error message
    },
  });

  const handleAddItem = (barang: BarangResponse) => {
    // Check if already exists
    const exists = items.find((i) => i.barang.id === barang.id);
    if (exists) {
      alert("Barang sudah ada di daftar");
      return;
    }

    setItems([
      ...items,
      {
        barang,
        qty: 1,
        harga: barang.harga_beli, // Default to current buy price
      },
    ]);
    setIsSelectorOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleUpdateItem = (
    index: number,
    field: "qty" | "harga",
    value: number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!supplier.trim()) {
      setError("Nama supplier wajib diisi");
      return;
    }
    if (items.length === 0) {
      setError("Daftar barang tidak boleh kosong");
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    const payload: BeliHeaderRequest = {
      supplier,
      details: items.map((item) => ({
        barang_id: item.barang.id,
        qty: item.qty,
        harga: item.harga,
      })),
    };

    createMutation.mutate(payload);
  };

  const total = items.reduce((sum, item) => sum + item.qty * item.harga, 0);

  if (isConfirmOpen) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-zinc-900">
          Konfirmasi Pembelian
        </h3>

        {/* Summary details */}
        <div className="rounded-md bg-zinc-50 p-4 text-sm border border-zinc-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-zinc-500">Supplier</div>
              <div className="font-medium text-zinc-900">{supplier}</div>
            </div>
            <div>
              <div className="text-zinc-500">Total Item</div>
              <div className="font-medium text-zinc-900">{items.length}</div>
            </div>
          </div>
        </div>

        {/* Items Table Preview */}
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
              {items.map((item) => (
                <tr key={item.barang.id}>
                  <td className="px-4 py-2">
                    <div className="font-medium text-zinc-900">
                      {item.barang.nama_barang}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right text-zinc-900">
                    {item.qty} {item.barang.satuan}
                  </td>
                  <td className="px-4 py-2 text-right text-zinc-600">
                    {formatRupiah(item.harga)}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-zinc-900">
                    {formatRupiah(item.qty * item.harga)}
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
                  {formatRupiah(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsConfirmOpen(false)}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            disabled={createMutation.isPending}
          >
            Kembali
          </button>
          <button
            onClick={handleConfirm}
            disabled={createMutation.isPending}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {createMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Konfirmasi & Simpan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">
            Nama Supplier
          </label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder="PT. Supplier Jaya"
            required
          />
        </div>

        {/* Items List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700">
              Daftar Barang
            </label>
            <button
              type="button"
              onClick={() => setIsSelectorOpen(true)}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-3 w-3" />
              Tambah Barang
            </button>
          </div>

          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
            {items.length === 0 ? (
              <div className="text-center text-sm text-zinc-500">
                Belum ada barang yang ditambahkan.
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.barang.id}
                    className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-3 sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-zinc-900">
                        {item.barang.nama_barang}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {item.barang.kode_barang}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-20">
                        <label className="mb-1 block text-[10px] text-zinc-500">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) =>
                            handleUpdateItem(
                              index,
                              "qty",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
                        />
                      </div>
                      <div className="w-32">
                        <label className="mb-1 block text-[10px] text-zinc-500">
                          Harga Beli (@)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={item.harga}
                          onChange={(e) =>
                            handleUpdateItem(
                              index,
                              "harga",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full rounded border border-zinc-300 px-2 py-1 text-sm"
                        />
                      </div>
                      <div className="w-32 text-right">
                        <label className="mb-1 block text-[10px] text-zinc-500">
                          Subtotal
                        </label>
                        <div className="text-sm font-medium text-zinc-900">
                          {formatRupiah(item.qty * item.harga)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="mt-4 rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex justify-end border-t border-zinc-200 pt-4">
            <div className="text-right">
              <span className="text-sm text-zinc-500">Total Pembelian</span>
              <div className="text-xl font-bold text-zinc-900">
                {formatRupiah(total)}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-zinc-200 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            disabled={createMutation.isPending}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending || items.length === 0}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {createMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Simpan Transaksi
          </button>
        </div>
      </form>

      {/* Nested Modal for Selector */}
      <Modal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        title="Pilih Barang"
      >
        <BarangSelector
          onSelect={handleAddItem}
          onClose={() => setIsSelectorOpen(false)}
        />
      </Modal>
    </div>
  );
}
