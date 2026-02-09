"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Activity, ChevronRight, Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PremiereCard } from "../components/ui/PremiereCard";
import { TicketFlow } from "../components/ui/TicketFlow";

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  color?: string;
}

const BOX_OFFICE_DATA = [
  {
    id: "1",
    title: "Midnight Symphony",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000",
    status: "live" as const,
    genre: "Sci-Fi • Thriller",
    ticketsSold: "12.4k",
    revenue: "$124,000"
  },
  {
    id: "3",
    title: "Neon Redirection",
    image: "https://images.unsplash.com/photo-1574267432553-4b2026662e8b?q=80&w=2000",
    status: "exclusive" as const,
    genre: "Action • Cyberpunk",
    ticketsSold: "8.2k",
    revenue: "$82,000"
  },
  {
    id: "6",
    title: "Urban Pulse",
    image: "https://images.unsplash.com/photo-1514525253344-a8130a4ea86d?q=80&w=2000",
    status: "live" as const,
    genre: "Documentary • Music",
    ticketsSold: "5.1k",
    revenue: "$51,000"
  }
];

const MetricCard = ({ icon: Icon, label, value, trend, color = "primary" }: MetricCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 border border-white/5 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${color}/20 transition-colors`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl bg-${color}/20 flex items-center justify-center`}>
        <Icon className={`text-${color}`} size={24} />
      </div>
      <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-full uppercase tracking-widest">
        <TrendingUp size={10} /> {trend}
      </div>
    </div>
    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-1">{label}</p>
    <h3 className="text-3xl font-black tracking-tighter text-glow">{value}</h3>
  </motion.div>
);

export default function BoxOfficePage() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [activeMovie, setActiveMovie] = useState("Midnight Symphony");
  const [liveCounter, setLiveCounter] = useState(25740);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const openTicketModal = (movieTitle: string) => {
    setActiveMovie(movieTitle);
    setIsTicketModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white pb-20">
      {/* Navigation moved to global Layout */}

      {/* Hero: Live Box Office Status */}
      <div className="pt-32 pb-20 px-6 md:px-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 px-4 py-2 rounded-full mb-8">
            <Activity className="text-primary animate-pulse" size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Virtual Box Office</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
            Global <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-accent text-glow">Momentum.</span>
          </h1>

          <div className="flex flex-col md:flex-row justify-center items-center gap-12 mt-16">
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40 mb-4">Total Tickets Sold</p>
              <div className="text-5xl md:text-7xl font-black tracking-tighter text-glow tabular-nums">
                {liveCounter.toLocaleString()}
              </div>
            </div>
            <div className="h-20 w-px bg-white/10 hidden md:block" />
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40 mb-4">Direct Creator Earnings</p>
              <div className="text-5xl md:text-7xl font-black tracking-tighter text-glow">
                $257.4k
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard icon={Users} label="Active Viewers" value="8,241" trend="+12%" />
            <MetricCard icon={DollarSign} label="Avg. Contribution" value="$10.42" trend="+3%" color="accent" />
            <MetricCard icon={Star} label="Avg. Rating" value="4.92" trend="+0.5%" />
            <MetricCard icon={Activity} label="Stream Quality" value="4K / HDR" trend="Stable" color="accent" />
          </div>
        </div>
      </div>

      {/* Featured Performance Catalog */}
      <div className="px-6 md:px-12 py-20 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 px-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Current <span className="text-primary italic">Leaders.</span></h2>
              <p className="mt-4 text-foreground/60 text-lg">Independent films outperforming the subscription giants.</p>
            </div>
            <Link href="/premieres" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {BOX_OFFICE_DATA.map((movie) => (
              <div key={movie.id} className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl -z-10" />
                <PremiereCard 
                  title={movie.title}
                  image={movie.image}
                  status={movie.status}
                  genre={movie.genre}
                  onClick={() => openTicketModal(movie.title)}
                />
                <div className="mt-8 flex justify-between items-center px-2">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Tickets Sold</p>
                    <p className="text-2xl font-black tracking-tighter">{movie.ticketsSold}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Gross Revenue</p>
                    <p className="text-2xl font-black tracking-tighter text-primary">{movie.revenue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Ticker */}
          <div className="mt-24 glass-card p-6 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary thermal-glow" />
            <div className="flex items-center gap-8 animate-marquee whitespace-nowrap overflow-hidden">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                <ArrowUpRight size={14} className="text-green-500" /> New Ticket Sold: &quot;Midnight Symphony&quot; (Paris, FR)
              </span>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                <ArrowUpRight size={14} className="text-green-500" /> &quot;Urban Pulse&quot; trending in Documentary
              </span>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                <ArrowUpRight size={14} className="text-green-500" /> New Exclusive: &quot;Silent Canvas&quot; unlocking in 4 days
              </span>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                <ArrowUpRight size={14} className="text-green-500" /> Direct-to-Consumer: $2M+ distributed to local creators
              </span>
            </div>
          </div>
        </div>
      </div>

      <TicketFlow 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)} 
        movieTitle={activeMovie}
      />
    </div>
  );
}
