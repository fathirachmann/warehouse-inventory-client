import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { formatRupiah, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: number;
  type: "pembelian" | "penjualan";
  no_faktur: string;
  date: string;
  party_name: string;
  total: number;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.length === 0 ? (
            <div className="text-center text-sm text-zinc-500">
              Tidak ada aktivitas
            </div>
          ) : (
            activities.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border",
                    item.type === "pembelian"
                      ? "border-orange-200 bg-orange-50 text-orange-600"
                      : "border-blue-200 bg-blue-50 text-blue-600"
                  )}
                >
                  {item.type === "pembelian" ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {item.party_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.no_faktur} • {formatDateTime(item.date)}
                  </p>
                </div>
                <div
                  className={cn(
                    "ml-auto font-medium",
                    item.type === "pembelian"
                      ? "text-orange-600"
                      : "text-blue-600"
                  )}
                >
                  {item.type === "pembelian" ? "-" : "+"}
                  {formatRupiah(item.total)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
