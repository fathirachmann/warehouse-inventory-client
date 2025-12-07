"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { RegisterRequest } from "@/types/authType";
import { ErrorResponse } from "@/types/apiType";
import { RegisterForm } from "@/components/auth/register-form";
import { useAuth } from "@/hooks/useAuth";
import { Users, ShieldAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UsersPage() {
  const { isAdmin, loading } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      setSuccessMessage("Staff berhasil didaftarkan!");
      setErrorMessage(null);
    },
    onError: (error: ErrorResponse) => {
      setSuccessMessage(null);
      setErrorMessage(
        typeof error?.message === "string"
          ? error.message
          : "Gagal mendaftarkan staff"
      );
    },
  });

  if (loading)
    return <div className="p-6 text-muted-foreground">Memuat...</div>;

  if (!isAdmin) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 bg-destructive/10 rounded-full">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-destructive">
            Akses Ditolak
          </h2>
          <p className="text-muted-foreground">
            Hanya admin yang dapat mengakses halaman ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Manajemen User</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Daftarkan staff baru untuk mengakses sistem inventory.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-t-4 border-t-primary shadow-md h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Registrasi Staff Baru</CardTitle>
                <CardDescription>
                  Isi form berikut untuk membuat akun staff baru.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {successMessage && (
              <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600 border border-green-200">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                {errorMessage}
              </div>
            )}

            <RegisterForm
              onSubmit={(data) => mutation.mutate(data)}
              isSubmitting={mutation.isPending}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Informasi Role</CardTitle>
              <CardDescription>
                Hak akses untuk setiap role user dalam sistem.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="font-semibold text-primary mb-1">Admin</div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Mengelola data barang (CRUD)</li>
                    <li>Mengelola stok (Masuk/Keluar)</li>
                    <li>Melihat laporan transaksi</li>
                    <li>Mendaftarkan user baru</li>
                  </ul>
                </div>
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="font-semibold text-primary mb-1">Staff</div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Mencatat barang masuk (Pembelian)</li>
                    <li>Mencatat barang keluar (Penjualan)</li>
                    <li>Melihat stok barang</li>
                    <li>Melihat riwayat transaksi sendiri</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
