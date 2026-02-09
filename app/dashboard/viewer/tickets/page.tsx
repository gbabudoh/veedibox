"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MY_TICKETS = [
  { id: "1", movie: "Midnight Symphony", date: "Feb 28, 2026", time: "21:00 GMT", vbxId: "VBX-2026-X491", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000" },
  { id: "2", movie: "Urban Pulse", date: "Jan 15, 2026", time: "18:30 GMT", vbxId: "VBX-2026-M203", image: "https://images.unsplash.com/photo-1514525253344-a8130a4ea86d?q=80&w=2000" },
];

export default function ViewerTicketsPage() {
  return (
    <main className="flex-1 p-12 overflow-y-auto w-full relative text-white">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">My <span className="text-primary italic">Tickets.</span></h1>
        <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Access your digital passes and past events.</p>
      </header>

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
      </div>
    </main>
  );
}
