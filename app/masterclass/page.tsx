"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Star, Users, BookOpen, Clock, Award, Sparkles, Search, ChevronRight } from "lucide-react";
import Image from "next/image";

const MASTERCLASSES = [
  {
    id: "1",
    title: "Cinematic Storytelling",
    instructor: "David Sterling",
    role: "Award-winning Director",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000",
    category: "Directing",
    duration: "4h 20m",
    lessons: 12,
    rating: 4.9,
    students: "1.2k"
  },
  {
    id: "2",
    title: "The Art of Light",
    instructor: "Elena Vovk",
    role: "Master Cinematographer",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000",
    category: "Lighting",
    duration: "3h 45m",
    lessons: 8,
    rating: 4.8,
    students: "850"
  },
  {
    id: "3",
    title: "Script to Screen",
    instructor: "Marcus Thorne",
    role: "Renowned Screenwriter",
    image: "https://images.unsplash.com/photo-1459908676235-d5f02a50184b?q=80&w=2000",
    category: "Writing",
    duration: "5h 10m",
    lessons: 15,
    rating: 4.9,
    students: "2.1k"
  },
  {
    id: "4",
    title: "Sound Design Mastery",
    instructor: "Sarah Jenkins",
    role: "Sound Engineer",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000",
    category: "Sound",
    duration: "2h 30m",
    lessons: 6,
    rating: 4.7,
    students: "620"
  },
  {
    id: "5",
    title: "Edit for Emotion",
    instructor: "Julian Frost",
    role: "Lead Film Editor",
    image: "https://images.unsplash.com/photo-1574717024453-354056afd6fc?q=80&w=2000",
    category: "Editing",
    duration: "4h 00m",
    lessons: 10,
    rating: 4.8,
    students: "1.1k"
  },
  {
    id: "6",
    title: "Indie Film Marketing",
    instructor: "Tanya Reed",
    role: "Producer",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2000",
    category: "Producing",
    duration: "3h 15m",
    lessons: 9,
    rating: 4.6,
    students: "430"
  }
];

const MasterclassCard = ({ classData }: { classData: typeof MASTERCLASSES[0] }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className="glass-card group relative rounded-2xl overflow-hidden border border-white/5 bg-zinc-950/50"
  >
    <div className="aspect-video relative overflow-hidden">
      <Image 
        src={classData.image} 
        alt={classData.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60" />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-black uppercase tracking-widest text-primary backdrop-blur-md">
          {classData.category}
        </span>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto"
      >
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
          <Play size={24} fill="currentColor" className="text-white ml-1" />
        </div>
      </motion.div>
    </div>

    <div className="p-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1 text-accent text-[10px] font-bold">
          <Star size={12} fill="currentColor" /> {classData.rating}
        </div>
        <div className="w-1 h-1 rounded-full bg-white/20" />
        <div className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest">
          {classData.students} Students
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{classData.title}</h3>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/5 overflow-hidden relative">
           <Image src={classData.image} alt={classData.instructor} fill className="object-cover grayscale" />
        </div>
        <div>
          <p className="text-xs font-bold">{classData.instructor}</p>
          <p className="text-[10px] opacity-40 uppercase tracking-widest">{classData.role}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-60">
            <BookOpen size={14} className="text-primary" /> {classData.lessons} Lessons
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-60">
            <Clock size={14} className="text-primary" /> {classData.duration}
          </div>
        </div>
        <button className="text-primary group-hover:translate-x-1 transition-transform">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default function MasterclassPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Directing", "Cinematography", "Writing", "Sound", "Editing", "Producing"];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white pb-20">
      {/* Navigation moved to global Layout */}

      {/* Hero Section */}
      <div className="relative pt-40 pb-20 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 px-4 py-2 rounded-full mb-8"
          >
            <Award className="text-accent" size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Learn from the Masters</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-12"
          >
            Art of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-primary text-glow">Excellence.</span>
          </motion.h1>

          <div className="relative w-full max-w-2xl mt-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30" size={20} />
            <input 
              type="text"
              placeholder="What do you want to master?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-6 pl-16 pr-8 text-lg focus:outline-none focus:border-accent transition-colors glass-card"
            />
          </div>
        </div>
      </div>

      {/* Filter & Grid */}
      <div className="px-6 md:px-12 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full border transition-all ${
                    activeCategory === cat 
                      ? "bg-accent border-accent text-white electric-glow" 
                      : "bg-white/5 border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MASTERCLASSES.map((mc) => (
              <MasterclassCard key={mc.id} classData={mc} />
            ))}
          </div>
        </div>
      </div>

      {/* Feature Section: Global Community */}
      <div className="mt-32 px-6 md:px-12 py-32 bg-zinc-950/50 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Users className="text-primary" size={20} />
              <span className="text-xs font-black uppercase tracking-[0.5em] text-primary">Veedibox Education</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8">
              A Global <span className="text-primary italic font-serif">Studio.</span>
            </h2>
            <p className="text-xl text-foreground/60 mb-12">
              Join thousands of film creators from around the world. Get personalized feedback, join live workshops, and collaborate on real independent projects.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-3xl font-black tracking-tighter text-glow">150+</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Expert Lessons</p>
              </div>
              <div>
                <p className="text-3xl font-black tracking-tighter text-glow">12k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Active Students</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-3xl" />
            <div className="relative glass-card h-full rounded-full border border-white/10 flex items-center justify-center p-12 overflow-hidden">
               <Image 
                src="https://images.unsplash.com/photo-1574717024453-354056afd6fc?q=80&w=2000" 
                alt="Community Spotlight"
                fill
                className="object-cover opacity-60 grayscale scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
              <div className="relative z-10 text-center">
                 <Sparkles className="text-white mx-auto mb-6" size={48} />
                 <p className="text-2xl font-black uppercase tracking-widest">Collaborate. <br /> Create. <br /> Conquer.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
