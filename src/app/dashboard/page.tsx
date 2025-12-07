"use client";

import { useQuery } from "@tanstack/react-query";
import { barangService } from "@/services/barangService";
import { stokService } from "@/services/stokService";
import { transactionService } from "@/services/transactionService";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TransactionChart } from "@/components/dashboard/transaction-chart";

export default function DashboardPage() {
  // 1. Fetch Barang (for Total Barang)
  const { data: barangData, isLoading: loadingBarang } = useQuery({
    queryKey: ["barang", "dashboard"],
    queryFn: () => barangService.getAll({ limit: 1 }), // We just need the total count from meta
  });

  // 2. Fetch Stok (for Total Stok)
  const { data: stokData, isLoading: loadingStok } = useQuery({
    queryKey: ["stok", "dashboard"],
    queryFn: stokService.getAll,
  });

  // 3. Fetch Pembelian (for Total Purchase & Recent Activity)
  const { data: pembelianData, isLoading: loadingPembelian } = useQuery({
    queryKey: ["pembelian", "dashboard"],
    queryFn: transactionService.getAllPembelian,
  });

  // 4. Fetch Penjualan (for Total Sales & Recent Activity)
  const { data: penjualanData, isLoading: loadingPenjualan } = useQuery({
    queryKey: ["penjualan", "dashboard"],
    queryFn: transactionService.getPenjualan,
  });

  const isLoading =
    loadingBarang || loadingStok || loadingPembelian || loadingPenjualan;

  // --- Aggregation Logic ---

  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Total Barang
    const totalBarang = barangData?.meta?.total || 0;

    // Total Stok
    const totalStok =
      stokData?.data?.reduce((sum, item) => sum + item.stok_akhir, 0) || 0;

    // Total Pembelian (This Month)
    const totalPembelian =
      pembelianData?.data
        ?.filter((item) => {
          const date = new Date(item.header.created_at);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        })
        .reduce((sum, item) => sum + item.header.total, 0) || 0;

    // Total Penjualan (This Month)
    const totalPenjualan =
      penjualanData?.data
        ?.filter((item) => {
          const date = new Date(item.header.created_at);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        })
        .reduce((sum, item) => sum + item.header.total, 0) || 0;

    return {
      totalBarang,
      totalStok,
      totalPembelian,
      totalPenjualan,
    };
  }, [barangData, stokData, pembelianData, penjualanData]);

  const chartData = useMemo(() => {
    const days = 7;
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const displayDate = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });

      // Sum Pembelian
      const dailyPembelian =
        pembelianData?.data
          ?.filter((item) => item.header.created_at.startsWith(dateStr))
          .reduce((sum, item) => sum + item.header.total, 0) || 0;

      // Sum Penjualan
      const dailyPenjualan =
        penjualanData?.data
          ?.filter((item) => item.header.created_at.startsWith(dateStr))
          .reduce((sum, item) => sum + item.header.total, 0) || 0;

      data.push({
        date: displayDate,
        pembelian: dailyPembelian,
        penjualan: dailyPenjualan,
      });
    }
    return data;
  }, [pembelianData, penjualanData]);

  const recentActivity = useMemo(() => {
    const purchases =
      pembelianData?.data?.map((p) => ({
        id: p.header.id,
        type: "pembelian" as const,
        no_faktur: p.header.no_faktur,
        date: p.header.created_at,
        party_name: p.header.supplier,
        total: p.header.total,
      })) || [];

    const sales =
      penjualanData?.data?.map((s) => ({
        id: s.header.id,
        type: "penjualan" as const,
        no_faktur: s.header.no_faktur,
        date: s.header.created_at,
        party_name: s.header.customer,
        total: s.header.total,
      })) || [];

    // Combine and sort by date desc
    return [...purchases, ...sales]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [pembelianData, penjualanData]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Ringkasan aktivitas gudang dan transaksi bulan ini.
        </p>
      </div>

      <SummaryCards summary={summary} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity activities={recentActivity} />
        <TransactionChart data={chartData} />
      </div>
    </div>
  );
}
