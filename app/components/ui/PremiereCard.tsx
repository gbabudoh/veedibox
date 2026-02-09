"use client";

import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import Link from "next/link";
import { getOptimizedImageUrl } from "../../lib/imgproxy";

interface PremiereCardProps {
  title: string;
  image: string;
  status: "live" | "upcoming" | "exclusive";
  genre: string;
  date?: string;
  onClick?: () => void;
  onTrailerClick?: () => void;
}

export const PremiereCard = ({ 
  title, 
  image, 
  status, 
  genre, 
  date, 
  onClick, 
  onTrailerClick 
}: PremiereCardProps) => {
  const statusStyles = {
    live: "bg-primary thermal-glow",
    upcoming: "bg-zinc-800",
    exclusive: "bg-accent electric-glow"
  };

  const statusLabels = {
    live: "Live Now",
    upcoming: date || "Coming Soon",
    exclusive: "Exclusively Veedibox"
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      className="group relative aspect-[2/3] rounded-2xl overflow-hidden glass-card cursor-pointer border border-white/5"
      onClick={onClick}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${getOptimizedImageUrl(image, { width: 400, height: 600, quality: 90 })})` }}
      />
      
      {/* Dynamic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      
      {/* Status Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 ${statusStyles[status]}`}>
          {status === "live" && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
          {status === "exclusive" && <Star size={10} fill="white" />}
          {statusLabels[status]}
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">{genre}</p>
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{title}</h3>
        
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onTrailerClick?.();
            }}
            className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
          >
            <Play size={14} fill="white" /> Trailer
          </button>
          <Link 
            href="/watch/1"
            className="flex-1 bg-primary thermal-glow py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            Watch Now
          </Link>
        </div>
      </div>

      {/* Hover Light Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};
