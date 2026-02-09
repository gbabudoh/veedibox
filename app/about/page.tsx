"use client";

import { motion } from "framer-motion";
import { Sparkles, Award, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CinemaButton } from "@/app/components/ui/CinemaButton";

const MISSION_VALUES = [
  { 
    title: "Democratize Cinema", 
    desc: "Empowering creators with direct access to global audiences, bypassing traditional gatekeepers.",
    icon: Globe,
    color: "text-blue-500"
  },
  { 
    title: "Eventized Streaming", 
    desc: "Turning every release into a digital premiere event with live engagement and community interaction.",
    icon: Sparkles,
    color: "text-accent"
  },
  { 
    title: "Creator Economy 2.0", 
    desc: "Maximizing revenue for filmmakers through transparent ticketing and direct fan support.",
    icon: Award,
    color: "text-purple-500"
  },
];

const TIMELINE = [
  { year: "2024", title: "The Concept", desc: "Born from a desire to fix the broken streaming model for independent filmmakers." },
  { year: "2025", title: "The Foundation", desc: "Building the Veedibox engine: High-fidelity streaming, secure ticketing, and real-time interaction." },
  { year: "2026", title: "The Premiere", desc: "Launching globally. The future of cinema is now in your hands." },
];

const TEAM = [
  { name: "Alex Veedibox", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" },
  { name: "Sarah Creative", role: "Chief Content Officer", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" },
  { name: "Marcus Tech", role: "CTO", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black pointer-events-none" />
        
        {/* Animated Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[180px] animate-pulse pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
               <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
               <span className="text-xs font-black uppercase tracking-widest text-white/80">Est. 2026</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6 drop-shadow-2xl">
              The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Cinema.</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/60 font-medium leading-relaxed max-w-2xl mx-auto">
              We are rebuilding the movie-going experience for the digital age. <br className="hidden md:block"/> Connect, Watch, and Belong.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
         <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="text-center mb-16"
         >
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Our <span className="text-accent">Mission</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto rounded-full" />
         </motion.div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MISSION_VALUES.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="glass-card p-8 border border-white/5 group hover:border-accent/30 transition-colors"
              >
                 <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${item.color}`}>
                    <item.icon size={24} />
                 </div>
                 <h3 className="text-xl font-bold uppercase tracking-tight mb-3">{item.title}</h3>
                 <p className="text-white/40 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-white/[0.02]">
         <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-16 text-center">Script to <span className="text-purple-500">Screen</span></h2>
            
            <div className="relative border-l border-white/10 ml-6 md:ml-1/2 space-y-12 pl-8 md:pl-0">
               {TIMELINE.map((item, idx) => (
                 <motion.div 
                   key={item.year}
                   initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className={`relative md:flex items-center justify-between group ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                 >
                    {/* Dot */}
                    <div className="absolute left-[-41px] md:left-1/2 md:-translate-x-[5px] w-5 h-5 rounded-full bg-black border-4 border-white/20 group-hover:border-accent transition-colors z-10" />
                    
                    <div className="md:w-[45%] mb-4 md:mb-0" />
                    <div className={`md:w-[45%] glass-card p-6 border border-white/5 hover:border-white/20 transition-all ${idx % 2 === 0 ? 'text-left' : 'md:text-right'}`}>
                       <span className="text-xs font-black text-accent uppercase tracking-widest mb-2 block">{item.year}</span>
                       <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                       <p className="text-white/40 text-sm">{item.desc}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
         <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="text-center mb-16"
         >
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Cast & <span className="text-white">Crew</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto rounded-full" />
         </motion.div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {TEAM.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6 border-2 border-white/10 group-hover:border-accent transition-colors">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-1">{member.name}</h3>
                <p className="text-accent text-xs font-black uppercase tracking-widest">{member.role}</p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center">
         <div className="max-w-3xl mx-auto glass-card p-12 border border-white/10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Join the <span className="text-accent">Revolution.</span></h2>
            <p className="text-lg text-white/40 mb-8 max-w-xl mx-auto">
               Ready to experience the next era of entertainment? Sign up today and get your front-row seat.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
               <Link href="/auth/register" className="w-full sm:w-auto">
                 <CinemaButton size="lg" className="w-full sm:min-w-[200px] shadow-lg shadow-accent/20 whitespace-nowrap">Start Your Journey</CinemaButton>
               </Link>
               <Link href="/auth/login" className="w-full sm:w-auto">
                 <CinemaButton variant="outline" size="lg" className="w-full sm:min-w-[200px] border-white/20 hover:bg-white/10 whitespace-nowrap">Member Login</CinemaButton>
               </Link>
            </div>
         </div>
      </section>
    </main>
  );
}
