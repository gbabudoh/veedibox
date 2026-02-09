"use client";

import { motion } from "framer-motion";
import { 
  Play, Plus, Heart
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FAVORITES = [
  { id: "3", title: "Neon Redirection", genre: "Sci-Fi Thriller", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000" },
  { id: "4", title: "The Last Analog", genre: "Documentary", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000" },
  { id: "5", title: "Cyber Horizon", genre: "Action", image: "https://images.unsplash.com/photo-1535016120720-40c6874c3b13?q=80&w=2000" },
];

export default function ViewerFavoritesPage() {
  return (
    <main className="flex-1 p-12 overflow-y-auto w-full relative text-white">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">My <span className="text-primary italic">Watchlist.</span></h1>
        <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Saved premieres and upcoming releases.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {FAVORITES.map((movie, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={movie.id}
            className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary/50 transition-all"
          >
             <Image src={movie.image} alt={movie.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
             
             <div className="absolute top-4 right-4">
                <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-primary border border-primary/20">
                    <Heart size={14} fill="currentColor" />
                </div>
             </div>

             <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-black uppercase tracking-tighter mb-1 text-glow">{movie.title}</h3>
                <p className="text-[10px] font-mono opacity-60 mb-4">{movie.genre}</p>
                
                <Link href={`/premieres/${movie.id}`}>
                    <button className="w-full bg-white text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all delay-100 flex items-center justify-center gap-2 hover:bg-primary hover:text-white">
                        <Play size={12} fill="currentColor" /> Watch Trailer
                    </button>
                </Link>
             </div>
          </motion.div>
        ))}

        {/* Add New Slot */}
        <Link href="/premieres" className="aspect-[2/3] rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center opacity-40 hover:opacity-100 group">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus size={24} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Discover More</span>
        </Link>
      </div>
    </main>
  );
}
