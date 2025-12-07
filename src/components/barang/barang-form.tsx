"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarangRequest, BarangResponse } from "@/types/barangType";

const barangSchema = z.object({
  nama_barang: z.string().min(1, "Nama barang wajib diisi"),
  deskripsi: z.string(),
  satuan: z.string().min(1, "Satuan wajib diisi"),
  harga_beli: z.coerce.number().min(0, "Harga beli tidak boleh negatif"),
  harga_jual: z.coerce.number().min(0, "Harga jual tidak boleh negatif"),
});

interface BarangFormProps {
  initialData?: BarangResponse | null;
  onSubmit: (data: BarangRequest) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function BarangForm({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}: BarangFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(barangSchema),
    defaultValues: {
      nama_barang: "",
      deskripsi: "",
      satuan: "",
      harga_beli: 0,
      harga_jual: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nama_barang: initialData.nama_barang,
        deskripsi: initialData.deskripsi,
        satuan: initialData.satuan,
        harga_beli: initialData.harga_beli,
        harga_jual: initialData.harga_jual,
      });
    } else {
      reset({
        nama_barang: "",
        deskripsi: "",
        satuan: "",
        harga_beli: 0,
        harga_jual: 0,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-700">Nama Barang</label>
        <input
          {...register("nama_barang")}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="Contoh: Paracetamol 500mg"
        />
        {errors.nama_barang && (
          <p className="text-xs text-red-600">{errors.nama_barang.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-700">Deskripsi</label>
        <textarea
          {...register("deskripsi")}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="Keterangan tambahan..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700">Satuan</label>
          <input
            {...register("satuan")}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder="Pcs, Box, Strip"
          />
          {errors.satuan && (
            <p className="text-xs text-red-600">{errors.satuan.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700">
            Harga Beli
          </label>
          <input
            type="number"
            {...register("harga_beli")}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
          {errors.harga_beli && (
            <p className="text-xs text-red-600">{errors.harga_beli.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700">
            Harga Jual
          </label>
          <input
            type="number"
            {...register("harga_jual")}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
          {errors.harga_jual && (
            <p className="text-xs text-red-600">{errors.harga_jual.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:bg-zinc-400"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
