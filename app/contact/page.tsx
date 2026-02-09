"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Send, Zap } from "lucide-react";
import { CinemaButton } from "@/app/components/ui/CinemaButton";

const CONTACT_INFO = [
  {
    title: "General Inquiries",
    desc: "Questions about the platform or membership?",
    email: "hello@veedibox.com",
    icon: MessageSquare,
    color: "text-blue-500",
  },
  {
    title: "Technical Support",
    desc: "Facing issues? Our engineering team is here to help.",
    email: "support@veedibox.com",
    icon: Zap,
    color: "text-accent",
  },
  {
    title: "Press & Partners",
    desc: "Interested in collaboration or media coverage?",
    email: "press@veedibox.com",
    icon: Mail,
    color: "text-purple-500",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-800/30 via-black to-black pointer-events-none" />
         
         <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                Let&apos;s Talk.
              </h1>
              <p className="text-xl text-white/60 font-medium max-w-2xl mx-auto">
                Whether you have a question, a pitch, or just want to say hello, we&apos;re listening.
              </p>
            </motion.div>
         </div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
           
           {/* Contact Form */}
           <motion.div
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="glass-card p-8 md:p-12 border border-white/10 rounded-3xl relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
              
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Send a Message</h2>
              
              <form className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-white/40">Name</label>
                       <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-white/40">Email</label>
                       <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors" placeholder="john@example.com" />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Subject</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors text-white/80">
                       <option className="bg-zinc-900">General Inquiry</option>
                       <option className="bg-zinc-900">Technical Support</option>
                       <option className="bg-zinc-900">Partnership Proposal</option>
                       <option className="bg-zinc-900">Other</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Message</label>
                    <textarea rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors resize-none" placeholder="How can we help you today?" />
                 </div>

                 <CinemaButton size="lg" className="w-full" icon={Send}>Send Message</CinemaButton>
              </form>
           </motion.div>

           {/* Contact Info & Map Placeholder */}
           <div className="space-y-8">
              <div className="grid gap-6">
                 {CONTACT_INFO.map((item, idx) => (
                   <motion.div
                     key={item.title}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: idx * 0.1 }}
                     className="glass-card p-6 border border-white/5 flex items-start gap-4 hover:bg-white/5 transition-colors group cursor-pointer"
                   >
                      <div className={`p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${item.color}`}>
                         <item.icon size={24} />
                      </div>
                      <div>
                         <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                         <p className="text-white/40 text-sm mb-2">{item.desc}</p>
                         <p className="text-sm font-medium text-white/80 group-hover:text-accent transition-colors">{item.email}</p>
                      </div>
                   </motion.div>
                 ))}
              </div>

              {/* Office Location / Visual */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="h-[300px] w-full rounded-3xl overflow-hidden border border-white/10 relative group"
              >
                 {/* Visual Placeholder for Map/Office */}
                 <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="text-center z-10">
                       <MapPin size={48} className="mx-auto mb-4 text-accent animate-bounce" />
                       <h3 className="text-xl font-black uppercase tracking-widest">Global HQ</h3>
                       <p className="text-white/40">Los Angeles, CA</p>
                    </div>
                 </div>
              </motion.div>
           </div>
        </div>
      </section>
    </main>
  );
}
