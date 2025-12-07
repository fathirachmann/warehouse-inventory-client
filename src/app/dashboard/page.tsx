"use client";

import { useQuery } from "@tanstack/react-query";
import { barangService } from "@/services/barangService";
import { stokService } from "@/services/stokService";
import { transactionService } from "@/services/transactionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
} from "lucide-react";
import { formatRupiah, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
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

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Barang</CardTitle>
            <Package className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalBarang}</div>
            <p className="text-xs text-zinc-500">Jenis barang terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stok</CardTitle>
            <ShoppingCart className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalStok}</div>
            <p className="text-xs text-zinc-500">Unit barang di gudang</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pembelian</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(summary.totalPembelian)}
            </div>
            <p className="text-xs text-zinc-500">Total pembelian bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penjualan</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(summary.totalPenjualan)}
            </div>
            <p className="text-xs text-zinc-500">Total penjualan bulan ini</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.length === 0 ? (
                <div className="text-center text-sm text-zinc-500">
                  Tidak ada aktivitas
                </div>
              ) : (
                recentActivity.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center"
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border",
                        item.type === "pembelian"
                          ? "border-green-200 bg-green-50"
                          : "border-blue-200 bg-blue-50"
                      )}
                    >
                      {item.type === "pembelian" ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {item.party_name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {item.no_faktur} • {formatDateTime(item.date)}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {item.type === "pembelian" ? "-" : "+"}
                      {formatRupiah(item.total)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Grafik Transaksi (7 Hari)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#71717a" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#71717a" }}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("id-ID", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(value)
                    }
                  />
                  <Tooltip
                    cursor={{ fill: "#f4f4f5" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number) => [formatRupiah(value), ""]}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={(value) => (
                      <span className="text-sm text-zinc-600 capitalize">
                        {value}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="pembelian"
                    name="Pembelian"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="penjualan"
                    name="Penjualan"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
