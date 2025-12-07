"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterRequest } from "@/types/authType";

const registerSchema = z.object({
  username: z.string().min(4, "Username minimal 4 karakter"),
  email: z.string().email("Format email tidak valid"),
  full_name: z.string().min(1, "Nama lengkap wajib diisi"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Harus mengandung huruf besar")
    .regex(/[a-z]/, "Harus mengandung huruf kecil")
    .regex(/[0-9]/, "Harus mengandung angka")
    .regex(/[^A-Za-z0-9]/, "Harus mengandung simbol"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => void;
  isSubmitting: boolean;
}

export function RegisterForm({ onSubmit, isSubmitting }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      full_name: "",
      password: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-700">Username</label>
        <input
          {...register("username")}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="johndoe"
        />
        {errors.username && (
          <p className="text-xs text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-700">
          Nama Lengkap
        </label>
        <input
          {...register("full_name")}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="John Doe"
        />
        {errors.full_name && (
          <p className="text-xs text-red-600">{errors.full_name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-zinc-700">Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="********"
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:bg-zinc-400"
        >
          {isSubmitting ? "Mendaftarkan..." : "Daftarkan Staff"}
        </button>
      </div>
    </form>
  );
}
