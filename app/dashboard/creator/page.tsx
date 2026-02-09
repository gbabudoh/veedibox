"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, Users, DollarSign, Play, Star, Plus, 
  MoreVertical, Calendar, Eye
} from "lucide-react";
import { CinemaButton } from "@/app/components/ui/CinemaButton";
import Link from "next/link";
import { useSession } from "next-auth/react";

const STATS = [
  { label: "Total Revenue", value: "$42,500", trend: "+12.5%", icon: DollarSign, color: "text-primary" },
  { label: "Ticket Sales", value: "3,421", trend: "+8.2%", icon: BarChart3, color: "text-accent" },
  { label: "Active Viewers", value: "842", trend: "+24%", icon: Users, color: "text-primary" },
  { label: "Avg. Rating", value: "4.9", trend: "+0.1", icon: Star, color: "text-accent" },
];

const MY_MOVIES = [
  { id: "1", title: "Midnight Symphony", status: "Premiering", sales: "1,240", views: "8.2k", date: "Feb 28" },
  { id: "2", title: "Neon Redirection", status: "Coming Soon", sales: "0", views: "1.5k", date: "Mar 12" },
  { id: "3", title: "Virtual Horizon", status: "Box Office", sales: "840", views: "4.1k", date: "Jan 15" },
];

export default function CreatorDashboard() {
  const { data: session } = useSession();

  return (
    <main className="flex-1 p-12 overflow-y-auto w-full relative">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Creator <span className="text-primary italic">Pulse.</span></h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Welcome back, {session?.user?.name || "Filmmaker"}</p>
        </div>
        <CinemaButton className="px-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
          <Plus size={16} /> Launch Premiere
        </CinemaButton>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {STATS.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label} 
            className="glass-card p-6 border border-white/5 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div className="text-[10px] font-black text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  {stat.trend}
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black tracking-tighter">{stat.value}</h3>
            </div>
            
            <div className="absolute bottom-4 right-4 opacity-20 group-hover:scale-110 transition-transform pointer-events-none">
              <stat.icon size={64} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Tabs/Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Premieres List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
              <Play size={18} className="text-primary" /> Active Management
            </h2>
            <Link href="/dashboard/creator/movies" className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">View All</Link>
          </div>

          <div className="glass-card overflow-hidden border border-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  <th className="px-6 py-4">Premiere Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tickets</th>
                  <th className="px-6 py-4">Engagement</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {MY_MOVIES.map((movie) => (
                  <tr key={movie.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-6 font-bold">{movie.title}</td>
                    <td className="px-6 py-6">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        movie.status === 'Premiering' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/40'
                      }`}>
                        {movie.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 font-mono font-bold">{movie.sales}</td>
                    <td className="px-6 py-6 opacity-60 flex items-center gap-2">
                      <Eye size={14} /> {movie.views}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
            <Calendar size={18} className="text-accent" /> Live Ticker
          </h2>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="glass-card p-4 border border-white/5 flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 thermal-glow" />
                <div>
                  <p className="text-xs font-bold mb-1">New Ticket Purchase</p>
                  <p className="text-[10px] opacity-40">User VBX-2940 bought a seat for &quot;Midnight Symphony&quot;</p>
                  <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-black text-primary">+$19.99</span>
                      <span className="text-[9px] opacity-20">•</span>
                      <span className="text-[9px] opacity-20">2 mins ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full glass-card p-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all border border-white/5">
            Full Activity Log
          </button>
        </div>
      </div>
    </main>
  );
}
