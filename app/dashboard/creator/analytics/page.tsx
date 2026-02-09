"use client";

import { BarChart3 } from "lucide-react";

export default function CreatorAnalyticsPage() {
  return (
    <main className="flex-1 p-12 overflow-y-auto w-full relative flex items-center justify-center">
      <div className="text-center opacity-40">
        <BarChart3 size={48} className="mx-auto mb-4" />
        <h1 className="text-2xl font-black uppercase tracking-widest">Analytics Module</h1>
        <p className="text-sm font-medium uppercase tracking-widest mt-2">Coming Soon</p>
      </div>
    </main>
  );
}
