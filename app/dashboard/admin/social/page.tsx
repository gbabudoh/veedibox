"use client";

import { Share2 } from "lucide-react";

export default function AdminSocialPage() {
  return (
    <main className="flex-1 p-12 overflow-y-auto w-full flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Share2 size={48} className="text-blue-500" />
      </div>
      <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Social <span className="text-blue-500 italic font-serif">Grid.</span></h1>
      <p className="text-white/40 text-sm font-medium uppercase tracking-widest text-center max-w-md">
        Twitter/X and Instagram API webhooks are pending verification. <br/>
        Configure OAuth 2.0 credentials in system settings.
      </p>
    </main>
  );
}
