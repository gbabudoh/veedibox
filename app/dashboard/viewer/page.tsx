"use client";

import { motion } from "framer-motion";
import { 
  Ticket, User, ArrowRight, Play, Plus
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const MY_TICKETS = [
  { id: "1", movie: "Midnight Symphony", date: "Feb 28, 2026", time: "21:00 GMT", vbxId: "VBX-2026-X491", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000" },
  { id: "2", movie: "Urban Pulse", date: "Jan 15, 2026", time: "18:30 GMT", vbxId: "VBX-2026-M203", image: "https://images.unsplash.com/photo-1514525253344-a8130a4ea86d?q=80&w=2000" },
];

export default function ViewerDashboard() {
  const { data: session } = useSession();

  return (
    <main className="flex-1 p-12 overflow-y-auto w-full relative text-white">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">My <span className="text-primary italic">Collection.</span></h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Welcome back, {session?.user?.name || "Viewer"}</p>
        </div>
        <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-xs font-black uppercase tracking-widest text-white/60">Balance</p>
                <p className="text-lg font-black tracking-tighter text-primary">2 Credits</p>
             </div>
             <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-zinc-900 relative">
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                    <User size={20} />
                  </div>
                )}
             </div>
        </div>
      </header>

      {/* Hero: Continue Watching */}
      <section className="mb-16">
        <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 opacity-60">
            <Play size={14} className="text-primary" /> Continue Watching
        </h2>
        <div className="glass-card relative overflow-hidden rounded-2xl border border-white/10 aspect-video md:aspect-[21/9] group">
            <Image 
                src="https://images.unsplash.com/photo-1533923156502-be31530547c4?q=80&w=2000" 
                alt="Masterclass" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
                <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block">
                    In Progress
                </span>
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-2">Cinematic Lighting Masterclass</h3>
                <p className="text-white/60 text-sm mb-6 line-clamp-2">Learn how to shape light and shadow to create emotional depth in your films with award-winning cinematographer James Laxton.</p>
                <div className="flex items-center gap-4">
                    <button className="bg-white text-black px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/90 transition-colors flex items-center gap-2">
                        <Play size={14} fill="currentColor" /> Resume
                    </button>
                    <div className="flex-1 max-w-xs bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="w-[65%] h-full bg-primary electric-glow" />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Active Tickets Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 opacity-60">
                <Ticket size={14} className="text-primary" /> Your Tickets
            </h2>
            <Link href="/dashboard/viewer/tickets" className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1">
                View History <ArrowRight size={12} />
            </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MY_TICKETS.map((ticket, idx) => (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={ticket.id}
                className="glass-card group relative p-4 border border-white/5 hover:border-primary/30 transition-all rounded-2xl"
            >
                <div className="aspect-[2/3] relative rounded-xl overflow-hidden mb-4">
                    <Image src={ticket.image} alt={ticket.movie} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-black bg-black/50 backdrop-blur-md px-2 py-1 rounded-md uppercase tracking-widest text-white/80 border border-white/10">
                                {ticket.date}
                            </span>
                         </div>
                    </div>
                </div>
                
                <h3 className="text-xl font-black uppercase tracking-tighter mb-1 text-glow group-hover:text-primary transition-colors">{ticket.movie}</h3>
                <p className="text-[10px] font-mono opacity-40 mb-4">{ticket.vbxId}</p>

                <div className="grid grid-cols-2 gap-2">
                    <Link href={`/watch/${ticket.id}`} className="col-span-2">
                        <button className="w-full bg-white/5 hover:bg-primary hover:text-white border border-white/10 hover:border-primary py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
                             Enter Theater <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
            </motion.div>
            ))}

            {/* Empty Slot / Discover */}
            <Link href="/premieres" className="glass-card border border-white/5 hover:border-white/20 transition-all rounded-2xl flex flex-col items-center justify-center opacity-40 hover:opacity-100 group">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus size={24} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Browse Premieres</span>
            </Link>
        </div>
      </section>
    </main>
  );
}
