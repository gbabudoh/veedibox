"use client";

import { Activity } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <main className="flex-1 p-12 overflow-y-auto w-full flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Activity size={48} className="text-accent" />
      </div>
      <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Global <span className="text-accent italic font-serif">Metrics.</span></h1>
      <p className="text-white/40 text-sm font-medium uppercase tracking-widest text-center max-w-md">
        Real-time data aggregation streams are initializing. <br/>
        Please connect Google Analytics 4 API key to proceed.
      </p>
    </main>
  );
}
