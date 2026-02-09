"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, 
  ChevronLeft, Activity, Heart, MessageCircle, 
  Settings, Share2, SkipForward, Landmark, Award, TrendingUp, Users
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const WATCH_DATA = {
  id: "1",
  title: "Midnight Symphony",
  director: "David Sterling",
  runtime: "2h 15m",
  liveViewers: "8,241",
  status: "Premiere Live",
  description: "In a world where music is the only currency, a renegade composer must orchestrate the ultimate heist to restore harmony to the silent city."
};

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  console.log("Watching movie ID:", id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(true);
  const [applause, setApplause] = useState<number[]>([]);

  // Handle idle controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const addApplause = () => {
    const id = Date.now();
    setApplause(prev => [...prev, id]);
    setTimeout(() => {
      setApplause(prev => prev.filter(a => a !== id));
    }, 2000);
  };

  return (
    <motion.div 
      layout
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="min-h-screen bg-black text-white selection:bg-primary selection:text-white overflow-hidden flex flex-col"
    >
      {/* Theater Mode Ambient Glow */}
      <AnimatePresence>
        {isTheaterMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/4 -left-1/4 w-full h-full bg-primary/40 rounded-full blur-[200px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, -5, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-accent/30 rounded-full blur-[200px]" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Controls */}
      <motion.div 
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : -20 }}
        className="fixed top-0 left-0 w-full z-50 p-6 md:p-10 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent"
      >
        <Link href="/premieres" className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-all">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Gallery</span>
        </Link>

        <div className="flex flex-col items-center">
          <h1 className="text-lg md:text-2xl font-black tracking-tighter uppercase text-glow">{WATCH_DATA.title}</h1>
          <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.3em]">{WATCH_DATA.status} • {WATCH_DATA.liveViewers} Viewers</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Share2 size={18} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </motion.div>

      {/* Main Player Area */}
      <motion.div 
        layout
        className="flex-1 relative flex items-center justify-center py-20 px-4 md:px-12 z-10"
      >
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative w-full max-w-7xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-zinc-900 shadow-primary/10"
        >
          {/* Mock Video Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full relative">
              <Image 
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000" 
                alt="Movie Frame" 
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>

          {/* Player Overlay Controls */}
          <div className="absolute inset-0 flex items-center justify-center group/player">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-24 h-24 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 ${!showControls && isPlaying ? 'opacity-0' : 'opacity-100'}`}
            >
              {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
            </motion.button>
          </div>

          {/* Applause Layer */}
          <div className="absolute bottom-32 right-12 z-20">
            <AnimatePresence>
              {applause.map(id => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, y: -100, scale: [0.5, 1.5, 1] }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-0 right-0 text-primary"
                >
                  <Heart size={32} fill="currentColor" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom Controls */}
          <motion.div 
            animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
            className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black/90 to-transparent"
          >
            {/* Playback Progress */}
            <div className="relative w-full h-1.5 bg-white/20 rounded-full mb-6 cursor-pointer group/progress">
              <div className="absolute top-0 left-0 h-full bg-primary thermal-glow rounded-full w-[32%]" />
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg" style={{ left: `32%` }} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-primary transition-colors">
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                <div className="flex items-center gap-3 group/volume">
                  <button onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                  <div className="w-20 h-1 bg-white/20 rounded-full relative overflow-hidden hidden md:block">
                     <div className="absolute top-0 left-0 h-full bg-white opacity-60 w-[80%]" />
                  </div>
                </div>
                <div className="text-xs font-bold opacity-60 tabular-nums">
                  42:12 / 2:15:00
                </div>
              </div>

              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${isTheaterMode ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                >
                  <Landmark size={20} /> <span className="hidden md:inline">Theater Mode</span>
                </button>
                <button className="text-white/40 hover:text-white transition-colors">
                   <Maximize size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Engagement Rail (Mobile/Tablet Friendly Sidebar) */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="px-6 md:px-12 pb-12 z-20"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-4">
              <Activity className="text-primary animate-pulse" size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Live Premiere Interaction</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">{WATCH_DATA.title}</h2>
            <p className="text-foreground/60 text-sm max-w-2xl leading-relaxed">{WATCH_DATA.description}</p>
          </div>

          <div className="flex items-center gap-4">
             <motion.button 
               whileTap={{ scale: 0.9 }}
               onClick={addApplause}
               className="flex items-center gap-3 bg-primary border border-primary/20 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20"
             >
               <Heart size={18} fill="currentColor" /> Applaud
             </motion.button>
             <button className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
               <MessageCircle size={18} /> Chat
             </button>
          </div>
        </div>

        {/* Real-time Ticker during watch */}
        <div className="mt-12 glass-card p-4 border border-white/5 rounded-full relative overflow-hidden">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap overflow-hidden scrollbar-hide">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
              <TrendingUp size={12} className="text-green-500" /> New ticket sold in Tokyo, Japan
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
              <Users size={12} className="text-primary" /> Live Viewers: 8,241 and counting
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
              <Award size={12} className="text-accent" /> Trending #1 in Digital Premieres
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
              <SkipForward size={12} className="text-primary" /> Up Next: Director&apos;s Q&A Session
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

