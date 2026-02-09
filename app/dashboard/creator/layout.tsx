"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, Users, Play, Settings, LogOut, TrendingUp
} from "lucide-react";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar Navigation */}
      <div className="w-72 border-r border-white/5 flex flex-col p-8 glass-card rounded-none h-screen sticky top-0">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-primary rounded-lg thermal-glow flex items-center justify-center">
            <Play className="text-white fill-white" size={16} />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase">Studio</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link 
            href="/dashboard/creator" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive("/dashboard/creator") 
                ? "bg-white/5 text-primary font-bold" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 size={20} /> Dashboard
          </Link>
          <Link 
            href="/dashboard/creator/movies" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive("/dashboard/creator/movies") 
                ? "bg-white/5 text-primary font-bold" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <Play size={20} /> My Movies
          </Link>
          <Link 
            href="/dashboard/creator/analytics" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive("/dashboard/creator/analytics") 
                ? "bg-white/5 text-primary font-bold" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <TrendingUp size={20} /> Analytics
          </Link>
          <Link 
            href="/dashboard/creator/community" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive("/dashboard/creator/community") 
                ? "bg-white/5 text-primary font-bold" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users size={20} /> Reviews
          </Link>
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-2">
          <Link 
            href="/dashboard/creator/settings" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive("/dashboard/creator/settings") 
                ? "bg-white/5 text-primary font-bold" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings size={20} /> Settings
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-3 text-red-500/60 hover:text-red-500 rounded-xl transition-all w-full text-left"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
