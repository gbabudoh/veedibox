"use client";

import { motion } from "framer-motion";
import { 
  Shield, Users, Activity, 
  Globe, Search, Filter, Trash2, Edit2, 
  CheckCircle
} from "lucide-react";
import { CinemaButton } from "@/app/components/ui/CinemaButton";

const ADMIN_STATS = [
  { label: "Total Users", value: "12,840", icon: Users, color: "text-primary" },
  { label: "Active Revenue", value: "$1.2M", icon: Activity, color: "text-accent" },
  { label: "Platform Health", value: "99.9%", icon: Shield, color: "text-primary" },
  { label: "Connected APIs", value: "12", icon: Globe, color: "text-accent" },
];

export default function AdminDashboard() {
  return (
    <main className="flex-1 p-12 overflow-y-auto w-full min-h-screen bg-black text-white">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Master <span className="text-accent italic font-serif">Controller.</span></h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest text-glow">Disrupting the industry from the core</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full text-green-500 text-[10px] font-black uppercase tracking-widest">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Platform Live
             </div>
             <CinemaButton variant="outline" className="text-xs">Export Audit</CinemaButton>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {ADMIN_STATS.map((stat, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              key={stat.label}
              className="glass-card p-6 border border-white/5 relative overflow-hidden group"
            >
              <stat.icon className={`${stat.color} mb-4`} size={24} />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <stat.icon size={60} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
           <div className="glass-card p-8 border border-white/5 min-h-[400px]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-sm font-black uppercase tracking-widest text-accent">Google Analytics Overlay</h2>
                <span className="text-[10px] font-bold opacity-40">Live Feed</span>
              </div>
              <div className="flex flex-col items-center justify-center h-64 text-white/20">
                <Activity size={48} className="mb-4 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest">Waiting for API Handshake...</p>
              </div>
           </div>

           <div className="glass-card p-8 border border-white/5 min-h-[400px]">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-sm font-black uppercase tracking-widest text-primary">Matomo Health Check</h2>
                <span className="text-[10px] font-bold opacity-40">Internal Analytics</span>
              </div>
              <div className="flex flex-col items-center justify-center h-64 text-white/20">
                <Shield size={48} className="mb-4 opacity-20" /> {/* Changed from Database to Shield as Database was removed */}
                <p className="text-[10px] font-black uppercase tracking-widest">Encrypting Local Data Stream...</p>
              </div>
           </div>
        </div>

        {/* User Discovery Table */}
        <div className="glass-card border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
             <h2 className="text-sm font-black uppercase tracking-widest">Global User Base</h2>
             <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                  <input type="text" placeholder="Search accounts..." className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-[10px] focus:outline-none focus:border-accent w-64" />
                </div>
                <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                  <Filter size={14} className="text-white/40" />
                </button>
             </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-white/20 border-b border-white/5">
                <th className="px-6 py-4">User Identity</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Creation Date</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4 text-right">Administrative</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold">
              {[1, 2, 3, 4, 5].map((u) => (
                <tr key={u} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800" />
                      <div>
                        <p>Filmmaker_{u}</p>
                        <p className="opacity-40 font-mono text-[9px]">creator_{u}@veedibox.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-accent underline underline-offset-4 decoration-accent/30 decoration-2">CREATOR</span>
                  </td>
                  <td className="px-6 py-4 opacity-40">Feb 09, 2026</td>
                  <td className="px-6 py-4">
                    <CheckCircle size={14} className="text-green-500" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 hover:bg-accent/10 hover:text-accent rounded-lg transition-colors"><Edit2 size={12} /></button>
                       <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 flex items-center justify-center gap-4 bg-white/[0.01]">
             <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Page 1 of 420</span>
          </div>
        </div>
      </main>
  );
}
