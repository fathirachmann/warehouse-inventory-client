"use client";

import { Package } from "lucide-react";

export function MobileHeader() {
  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-background px-6 md:hidden">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Package className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold text-foreground">Warehouse</span>
      </div>
    </div>
  );
}
