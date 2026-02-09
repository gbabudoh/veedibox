"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  Shield, Users, Activity, Database, Share2, Lock 
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar Navigation */}
      <div className="w-72 border-r border-white/5 flex flex-col p-8 glass-card rounded-none h-screen sticky top-0">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-accent rounded-lg electric-glow flex items-center justify-center">
            <Shield className="text-white" size={16} />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase">Command</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link 
            href="/dashboard/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive("/dashboard/admin") 
                ? "bg-white/5 text-accent font-bold" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <Database size={20} /> Infrastructure
          </Link>
          <Link 
            href="/dashboard/admin/users" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive("/dashboard/admin/users") 
                ? "bg-white/5 text-accent font-bold" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users size={20} /> User Accounts
          </Link>
          <Link 
            href="/dashboard/admin/analytics" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive("/dashboard/admin/analytics") 
                ? "bg-white/5 text-accent font-bold" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <Activity size={20} /> Global Metrics
          </Link>
          <Link 
            href="/dashboard/admin/social" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive("/dashboard/admin/social") 
                ? "bg-white/5 text-accent font-bold" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <Share2 size={20} /> Social Integration
          </Link>
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-2">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-3 text-red-500/60 hover:text-red-500 rounded-xl transition-all w-full text-left"
          >
            <Lock size={20} /> Immediate Lockdown
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
