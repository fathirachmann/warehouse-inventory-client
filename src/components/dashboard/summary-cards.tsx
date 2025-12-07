import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingDown, TrendingUp } from "lucide-react";
import { formatRupiah } from "@/lib/format";

interface SummaryCardsProps {
  summary: {
    totalBarang: number;
    totalStok: number;
    totalPembelian: number;
    totalPenjualan: number;
  };
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-primary shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Barang
          </CardTitle>
          <Package className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {summary.totalBarang}
          </div>
          <p className="text-xs text-muted-foreground">
            Jenis barang terdaftar
          </p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-primary shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Stok
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {summary.totalStok}
          </div>
          <p className="text-xs text-muted-foreground">Unit barang di gudang</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-chart-2 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pembelian
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-chart-2" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatRupiah(summary.totalPembelian)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total pembelian bulan ini
          </p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-primary shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Penjualan
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatRupiah(summary.totalPenjualan)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total penjualan bulan ini
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
