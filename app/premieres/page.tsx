"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Search, Filter, Sparkles } from "lucide-react";
import { PremiereCard } from "../components/ui/PremiereCard";
import { TicketFlow } from "../components/ui/TicketFlow";
import { TrailerPlayer } from "../components/ui/TrailerPlayer";

const PREMIERES_DATA = [
  {
    id: "1",
    title: "Midnight Symphony",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000",
    status: "live" as const,
    genre: "Sci-Fi • Thriller",
    date: "Feb 28"
  },
  {
    id: "2",
    title: "The Silent Canvas",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000",
    status: "upcoming" as const,
    genre: "Drama • Art",
    date: "Mar 05"
  },
  {
    id: "3",
    title: "Neon Redirection",
    image: "https://images.unsplash.com/photo-1574267432553-4b2026662e8b?q=80&w=2000",
    status: "exclusive" as const,
    genre: "Action • Cyberpunk",
    date: "Mar 12"
  },
  {
    id: "4",
    title: "Beyond the Horizon",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2000",
    status: "upcoming" as const,
    genre: "Documentary • Space",
    date: "Mar 20"
  },
  {
    id: "5",
    title: "Echoes of Eternity",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000",
    status: "upcoming" as const,
    genre: "Fantasy • Adventure",
    date: "Apr 02"
  },
  {
    id: "6",
    title: "Urban Pulse",
    image: "https://images.unsplash.com/photo-1514525253344-a8130a4ea86d?q=80&w=2000",
    status: "live" as const,
    genre: "Documentary • Music",
    date: "Live Now"
  }
];

export default function PremieresPage() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isTrailerPlayerOpen, setIsTrailerPlayerOpen] = useState(false);
  const [activeMovie, setActiveMovie] = useState("Midnight Symphony");
  const [searchQuery, setSearchQuery] = useState("");

  const openTicketModal = (movieTitle: string) => {
    setActiveMovie(movieTitle);
    setIsTicketModalOpen(true);
  };

  const openTrailerModal = (movieTitle: string) => {
    setActiveMovie(movieTitle);
    setIsTrailerPlayerOpen(true);
  };

  const filteredMovies = PREMIERES_DATA.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white pb-20">
      {/* Navigation moved to global Layout */}

      {/* Hero Section */}
      <div className="pt-32 pb-12 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-primary" size={20} />
              <span className="text-xs font-black uppercase tracking-[0.5em] text-primary">Global Catalog</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-6">
              The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Premieres.</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-xl">
              Experience exclusive independent releases, live Q&As, and cinematic events from the world&apos;s most disruptive directors.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
            <input 
              type="text"
              placeholder="Search premieres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-primary transition-colors glass-card"
            />
          </div>
        </div>
      </div>

      {/* Grid Showcase */}
      <div className="px-6 md:px-12 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest overflow-x-auto pb-2 scrollbar-hide">
              <button className="text-primary border-b border-primary pb-2">All Events</button>
              <button className="opacity-40 hover:opacity-100 transition-opacity whitespace-nowrap">Live Now</button>
              <button className="opacity-40 hover:opacity-100 transition-opacity whitespace-nowrap">Coming Soon</button>
              <button className="opacity-40 hover:opacity-100 transition-opacity whitespace-nowrap">Exclusives</button>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
              <Filter size={14} /> Filter
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PremiereCard 
                  title={movie.title}
                  image={movie.image}
                  status={movie.status}
                  genre={movie.genre}
                  date={movie.date}
                  onClick={() => openTicketModal(movie.title)}
                  onTrailerClick={() => openTrailerModal(movie.title)}
                />
              </motion.div>
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="py-32 text-center opacity-30">
              <Film size={48} className="mx-auto mb-4" />
              <p className="font-bold uppercase tracking-[0.3em]">No premieres found</p>
            </div>
          )}
        </div>
      </div>

      <TicketFlow 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)} 
        movieTitle={activeMovie}
      />

      <TrailerPlayer 
        isOpen={isTrailerPlayerOpen} 
        onClose={() => setIsTrailerPlayerOpen(false)} 
        movieTitle={activeMovie}
      />
    </div>
  );
}
