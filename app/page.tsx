"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Play, Users, Film, Star, ChevronRight } from "lucide-react";
import { CinemaButton } from "./components/ui/CinemaButton";
import { SpotlightCard } from "./components/ui/SpotlightCard";
import { LiveBadge } from "./components/ui/LiveBadge";
import { TicketFlow } from "./components/ui/TicketFlow";
import { FilmmakerPortal } from "./components/ui/FilmmakerPortal";
import { TrailerPlayer } from "./components/ui/TrailerPlayer";
import { PremieresSection } from "./components/ui/PremieresSection";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isFilmmakerModalOpen, setIsFilmmakerModalOpen] = useState(false);
  const [isTrailerPlayerOpen, setIsTrailerPlayerOpen] = useState(false);
  const [activeMovie, setActiveMovie] = useState("Midnight Symphony");

  const openTicketModal = (movieTitle?: string) => {
    if (movieTitle) setActiveMovie(movieTitle);
    setIsTicketModalOpen(true);
  };

  const openTrailerModal = (movieTitle?: string) => {
    if (movieTitle) setActiveMovie(movieTitle);
    setIsTrailerPlayerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white">
      {/* Navigation moved to global Layout */}

      <main>
        {/* Hero Section: The Digital Premiere */}
        <section className="relative pt-32 pb-20 px-6 md:px-12 min-h-[90vh] flex flex-col justify-center overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto">
            <LiveBadge />
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase"
            >
              The Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-glow">Premiere.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-xl md:text-2xl text-foreground/60 max-w-2xl leading-relaxed"
            >
              Experience cinema on your terms. Direct access to exclusive independent film releases, live Q&amp;As, and the world&apos;s first virtual box office.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex flex-col sm:flex-row gap-4"
            >
              <CinemaButton 
                icon={Ticket} 
                variant="primary"
                onClick={() => openTicketModal()}
              >
                Get Your Ticket
              </CinemaButton>
              <CinemaButton 
                icon={Play} 
                variant="secondary"
                onClick={() => openTrailerModal()}
              >
                Watch Trailer
              </CinemaButton>
            </motion.div>
          </div>


          {/* Hero Poster Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="absolute right-12 top-1/2 -translate-y-1/2 w-[400px] h-[550px] hidden lg:block rounded-xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10"
          >
            <Image
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000"
              alt="Midnight Symphony Movie Poster"
              width={400}
              height={550}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">Midnight Symphony</h3>
              <p className="text-sm opacity-80">A Veedibox Exclusive Premiere</p>
            </div>
          </motion.div>
        </section>

        {/* Premieres Showcase */}
        <PremieresSection 
          onTicketClick={openTicketModal}
          onTrailerClick={openTrailerModal}
        />

        {/* Feature Grid: Eventized Streaming */}
        <section className="py-24 px-6 md:px-12 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Exclusively <span className="text-primary italic">Veedibox.</span></h2>
                <p className="mt-4 text-foreground/60 text-lg">We don&apos;t just stream movies. We create events that connect creators with audiences globally.</p>
              </div>
              <div className="flex gap-2">
                <div className="w-12 h-1 bg-primary thermal-glow" />
                <div className="w-4 h-1 bg-zinc-800" />
                <div className="w-4 h-1 bg-zinc-800" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <SpotlightCard>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                  <Users className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Live Premiere Events</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">Join directors for live introductions and participate in global Q&A sessions immediately following the screening.</p>
              </SpotlightCard>

              <SpotlightCard glowColor="magenta">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-6">
                  <Star className="text-accent" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Director&apos;s Pass</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">Go beyond the screen. Access exclusive behind-the-scenes content, technical breakdown, and artist stories.</p>
              </SpotlightCard>

              <SpotlightCard>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                  <Ticket className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Virtual Box Office</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">Support independent cinema directly. $10 to &quot;see it first&quot; before it hits subscription-based platforms.</p>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* Call to Action: The Disruption */}
        <section className="py-32 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8">Ready for the <span className="text-accent underline decoration-4 underline-offset-8">Redirection?</span></h2>
            <p className="text-xl text-foreground/60 mb-12 max-w-2xl mx-auto">Skip the subscription model. Direct-to-consumer cinema is here. High-end compression, 4K quality, and offline viewing.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <CinemaButton variant="primary" onClick={() => openTicketModal()}>Get Cinema Pass</CinemaButton>
              <button 
                onClick={() => setIsFilmmakerModalOpen(true)}
                className="flex items-center justify-center gap-2 group text-sm font-bold uppercase tracking-widest transition-colors hover:text-primary"
              >
                For Filmmakers <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 md:px-12 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 cursor-pointer">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Film className="text-white" size={14} />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase">Veedibox</span>
            </div>
            <p className="text-foreground/40 text-sm max-w-xs">The Digital Home of Independent Excellence. Reclaiming the theatrical window for the digital age.</p>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 opacity-60">Company</h4>
            <ul className="space-y-4 text-sm text-foreground/40 font-medium">
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/mission" className="hover:text-foreground">Our Mission</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest mb-6 opacity-60">Follow</h4>
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="text-xs font-bold">TW</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                <span className="text-xs font-bold">IG</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-[10px] uppercase tracking-widest font-bold opacity-30">
          <p>© 2026 Veedibox Media Group</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

      <TicketFlow 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)} 
        movieTitle={activeMovie}
      />

      <FilmmakerPortal 
        isOpen={isFilmmakerModalOpen} 
        onClose={() => setIsFilmmakerModalOpen(false)} 
      />

      <TrailerPlayer 
        isOpen={isTrailerPlayerOpen} 
        onClose={() => setIsTrailerPlayerOpen(false)} 
        movieTitle={activeMovie}
      />
    </div>
  );
}
