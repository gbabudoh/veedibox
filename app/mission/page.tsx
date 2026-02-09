"use client";

import { motion } from "framer-motion";
import { Globe, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { CinemaButton } from "@/app/components/ui/CinemaButton";

const BELIEFS = [
  {
    title: "Creative Autonomy",
    desc: "We believe filmmakers should have total control over their work, their rights, and their relationship with the audience.",
    icon: Shield,
    color: "text-accent",
  },
  {
    title: "Radical Transparency",
    desc: "No hidden fees, no opaque algorithms. Real-time data and clear revenue splits for every ticket sold.",
    icon: Zap,
    color: "text-blue-500",
  },
  {
    title: "Global Connection",
    desc: "Cinema has no borders. We build bridges between local stories and a worldwide community of passionate cinephiles.",
    icon: Globe,
    color: "text-purple-500",
  },
];

const STATS = [
  { label: "Projected Payouts", value: "$2M+", color: "text-green-500" },
  { label: "Global Territories", value: "140+", color: "text-blue-500" },
  { label: "Filmmakers Onboard", value: "500+", color: "text-accent" },
];

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section: The Manifesto */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black pointer-events-none" />
         
         <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-6">
                <span className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white/60">
                  The Veedibox Manifesto
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-8 leading-none">
                Cinema <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">Unchained.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-medium max-w-3xl mx-auto leading-relaxed">
                We are dismantling the barriers between storytellers and audiences. <br/>
                This is not just a platform. It&apos;s a movement.
              </p>
            </motion.div>
         </div>
      </section>

      {/* Core Beliefs Grid */}
      <section className="py-24 px-6 md:px-12 bg-white/[0.02]">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
               <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Core <span className="text-blue-500">Beliefs</span></h2>
                  <p className="text-white/40 text-lg max-w-xl">The guiding principles that drive every decision we make.</p>
               </div>
               <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-75" />
                  <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse delay-150" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {BELIEFS.map((item, idx) => (
                 <motion.div
                   key={item.title}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   className="p-8 rounded-2xl bg-black border border-white/10 hover:border-white/20 transition-all group"
                 >
                    <div className={`w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${item.color}`}>
                       <item.icon size={28} />
                    </div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">{item.title}</h3>
                    <p className="text-white/50 leading-relaxed">{item.desc}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Impact Section */}
      <section className="py-32 px-6 border-y border-white/5 relative overflow-hidden">
         <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
         <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-black uppercase tracking-widest text-white/20 mb-16">The Impact So Far</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {STATS.map((stat, idx) => (
                 <motion.div
                   key={stat.label}
                   initial={{ opacity: 0, scale: 0.8 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.2 }}
                 >
                    <div className={`text-6xl md:text-8xl font-black tracking-tighter mb-4 ${stat.color}`}>
                       {stat.value}
                    </div>
                    <div className="text-sm font-bold uppercase tracking-widest text-white/60">{stat.label}</div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Community CTA */}
      <section className="py-32 px-6 text-center">
         <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-8">Join the <span className="text-accent underline decoration-4 underline-offset-8">Mission.</span></h2>
            <p className="text-xl text-white/50 mb-12 leading-relaxed">
               Whether you&apos;re a filmmaker ready to share your vision or a viewer hungry for original stories, there is a place for you here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link href="/auth/register" className="w-full sm:w-auto">
                 <CinemaButton size="lg" className="w-full sm:min-w-[200px] shadow-lg shadow-accent/20">Get Started</CinemaButton>
               </Link>
               <Link href="/about" className="w-full sm:w-auto">
                 <CinemaButton variant="outline" size="lg" className="w-full sm:min-w-[200px] border-white/20 hover:bg-white/10">Learn More</CinemaButton>
               </Link>
            </div>
         </div>
      </section>
    </main>
  );
}
