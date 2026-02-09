"use client";

import { PremiereCard } from "./PremiereCard";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

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
  }
];

interface PremieresSectionProps {
  onTicketClick: (title: string) => void;
  onTrailerClick: (title: string) => void;
}

export const PremieresSection = ({ onTicketClick, onTrailerClick }: PremieresSectionProps) => {
  return (
    <section className="py-24 px-6 md:px-12 bg-black relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-primary" size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Now Showing</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Live <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Premieres.</span>
            </h2>
          </div>

          <Link 
            href="/premieres"
            className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors"
          >
            View All Events <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {PREMIERES_DATA.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <PremiereCard 
                title={movie.title}
                image={movie.image}
                status={movie.status}
                genre={movie.genre}
                date={movie.date}
                onClick={() => onTicketClick(movie.title)}
                onTrailerClick={() => onTrailerClick(movie.title)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
