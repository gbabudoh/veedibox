"use client";

import { motion } from "framer-motion";
import { 
  Plus, Eye, MoreVertical, Search, Filter
} from "lucide-react";
import { CinemaButton } from "@/app/components/ui/CinemaButton";

const MY_MOVIES = [
  { id: "1", title: "Midnight Symphony", status: "Premiering", sales: "1,240", views: "8.2k", date: "Feb 28" },
  { id: "2", title: "Neon Redirection", status: "Coming Soon", sales: "0", views: "1.5k", date: "Mar 12" },
  { id: "3", title: "Virtual Horizon", status: "Box Office", sales: "840", views: "4.1k", date: "Jan 15" },
];

export default function CreatorMoviesPage() {
  return (
    <main className="flex-1 p-12 overflow-y-auto w-full relative">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">My <span className="text-primary italic">Movies.</span></h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Manage your premieres and catalog</p>
        </div>
        <CinemaButton className="px-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
          <Plus size={16} /> New Project
        </CinemaButton>
      </header>
      
      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search titles..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-white/20"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="glass-card overflow-hidden border border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Release Date</th>
              <th className="px-6 py-4">Total Sales</th>
              <th className="px-6 py-4">Views</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {MY_MOVIES.map((movie, idx) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={movie.id} 
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-6 py-6 font-bold flex items-center gap-3">
                  <div className="w-10 h-14 bg-white/5 rounded overflow-hidden">
                    {/* Placeholder poster */}
                    <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
                  </div>
                  {movie.title}
                </td>
                <td className="px-6 py-6">
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    movie.status === 'Premiering' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/40'
                  }`}>
                    {movie.status}
                  </span>
                </td>
                <td className="px-6 py-6 text-white/60">{movie.date}</td>
                <td className="px-6 py-6 font-mono font-bold">{movie.sales}</td>
                <td className="px-6 py-6 opacity-60 flex items-center gap-2">
                  <Eye size={14} /> {movie.views}
                </td>
                <td className="px-6 py-6 text-right">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
