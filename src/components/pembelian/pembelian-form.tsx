"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";
import { BeliHeaderRequest } from "@/types/transaksiType";
import { BarangResponse } from "@/types/barangType";
import { Modal } from "@/components/ui/modal";
import { BarangSelector } from "./barang-selector";
import { Plus, Trash2, Loader2 } from "lucide-react";

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
    onError: (err: any) => {
      setError(err.message || "Gagal membuat transaksi pembelian");
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
                          Rp {(item.qty * item.harga).toLocaleString("id-ID")}
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
                Rp {total.toLocaleString("id-ID")}
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
            className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
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
