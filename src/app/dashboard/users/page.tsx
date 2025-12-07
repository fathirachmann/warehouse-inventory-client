"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { RegisterRequest } from "@/types/authType";
import { RegisterForm } from "@/components/auth/register-form";
import { useAuth } from "@/hooks/useAuth";
import { Users } from "lucide-react";

export default function UsersPage() {
  const { isAdmin, loading } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      setSuccessMessage("Staff berhasil didaftarkan!");
      setErrorMessage(null);
      // Reset form logic could be added here if we lifted state up or used a ref
    },
    onError: (error: any) => {
      setSuccessMessage(null);
      setErrorMessage(
        typeof error?.message === "string"
          ? error.message
          : "Gagal mendaftarkan staff"
      );
    },
  });

  if (loading) return <div className="p-6">Memuat...</div>;

  if (!isAdmin) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold text-red-600">Akses Ditolak</h2>
        <p className="text-zinc-600">
          Hanya admin yang dapat mengakses halaman ini.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Manajemen User</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Daftarkan staff baru untuk mengakses sistem.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-zinc-100 pb-4">
          <div className="rounded-full bg-zinc-100 p-2">
            <Users className="h-5 w-5 text-zinc-600" />
          </div>
          <div>
            <h2 className="font-medium text-zinc-900">Form Registrasi Staff</h2>
            <p className="text-xs text-zinc-500">
              Staff baru akan memiliki akses terbatas.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <RegisterForm
          onSubmit={(data) => mutation.mutate(data)}
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
}
