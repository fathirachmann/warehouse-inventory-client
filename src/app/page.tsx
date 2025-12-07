"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { LoginRequest } from "@/types/authType";
import { ErrorResponse } from "@/types/apiType";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email tidak boleh kosong" })
    .email({ message: "Format email tidak valid" }),
  password: z.string().min(1, { message: "Password tidak boleh kosong" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function HomePage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginRequest) => {
      return await authService.login(data);
    },
    onSuccess: (response) => {
      document.cookie = `token=${response.token}; path=/; max-age=86400; SameSite=Lax`;
      router.push("/dashboard");
    },
    onError: (error: ErrorResponse) => {
      if (error && typeof error.message === "object") {
        setFieldErrors(error.message as Record<string, string>);
        setErrorMessage(null);
      } else {
        setFieldErrors(null);
        setErrorMessage(
          typeof error?.message === "string"
            ? error.message
            : "Terjadi kesalahan saat login"
        );
      }
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutate(values);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/login-background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* White Veil & Blur */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[3px]" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm border border-white/50">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Warehouse Inventory System
          </h1>
          <p className="mt-2 text-sm text-zinc-600">PT Kreanova Pharmaret</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-800"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none ring-0 transition focus:ring-1 ${
                errors.email || fieldErrors?.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-300 focus:border-zinc-900 focus:ring-zinc-900"
              }`}
              placeholder="Masukkan email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
            {fieldErrors?.email && !errors.email && (
              <p className="text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-800"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none ring-0 transition focus:ring-1 ${
                errors.password || fieldErrors?.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-300 focus:border-zinc-900 focus:ring-zinc-900"
              }`}
              placeholder="Masukkan password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
            {fieldErrors?.password && !errors.password && (
              <p className="text-xs text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          {errorMessage && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Ask the administrator for account access.
        </p>
      </div>
    </div>
  );
}
