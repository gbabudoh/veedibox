"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ticket, Star, CheckCircle2, QrCode, CreditCard, Mail } from "lucide-react";
import { CinemaButton } from "./CinemaButton";

interface TicketFlowProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
}

type Step = "PASS_SELECTION" | "SEAT_SELECTION" | "CHECKOUT" | "SUCCESS";

export const TicketFlow = ({ isOpen, onClose, movieTitle }: TicketFlowProps) => {
  const [step, setStep] = useState<Step>("PASS_SELECTION");
  const [selectedPass, setSelectedPass] = useState<"cinema" | "director">("cinema");
  const [email, setEmail] = useState("");

  // Reset step when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep("PASS_SELECTION"), 300);
    }
  }, [isOpen]);

  const steps: Record<Step, React.ReactNode> = {
    PASS_SELECTION: (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight">Choose Your Access</h2>
          <p className="text-foreground/60">Select the experience that fits your premiere night.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setSelectedPass("cinema")}
            className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 ${selectedPass === "cinema" ? "border-primary bg-primary/10 thermal-glow" : "border-white/5 bg-white/5 hover:border-white/10"}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${selectedPass === "cinema" ? "bg-primary text-white" : "bg-white/10 text-white/40"}`}>
                <Ticket size={24} />
              </div>
              <span className="text-2xl font-black">$10</span>
            </div>
            <h3 className="text-xl font-bold mb-1 uppercase">Cinema Pass</h3>
            <p className="text-sm opacity-60 leading-relaxed">Full access to the Digital Premiere and 48h VOD replay.</p>
          </button>

          <button 
            onClick={() => setSelectedPass("director")}
            className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 ${selectedPass === "director" ? "border-accent bg-accent/10 electric-glow" : "border-white/5 bg-white/5 hover:border-white/10"}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${selectedPass === "director" ? "bg-accent text-white" : "bg-white/10 text-white/40"}`}>
                <Star size={24} />
              </div>
              <span className="text-2xl font-black">$25</span>
            </div>
            <h3 className="text-xl font-bold mb-1 uppercase">Director&apos;s Pass</h3>
            <p className="text-sm opacity-60 leading-relaxed">Cinema Pass + Q&A Access + Behind the Scenes + Artist Stories.</p>
          </button>
        </div>
        <div className="mt-8">
          <CinemaButton 
            className="w-full" 
            variant={selectedPass === "director" ? "primary" : "secondary"}
            onClick={() => setStep("SEAT_SELECTION")}
          >
            Continue to Seats
          </CinemaButton>
        </div>
      </div>
    ),
    SEAT_SELECTION: (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight">Select Your Spot</h2>
          <p className="text-foreground/60">Choose where you&apos;ll be experiencing the premiere.</p>
        </div>
        
        {/* Conceptual Grid */}
        <div className="w-full aspect-video bg-zinc-900/50 rounded-2xl border border-white/5 overflow-hidden flex flex-col items-center justify-center p-8">
           <div className="w-full h-1 bg-primary/40 thermal-glow rounded-full mb-12 relative">
             <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest font-bold opacity-40">Screen</span>
           </div>
           <div className="grid grid-cols-8 gap-2">
             {Array.from({ length: 32 }).map((_, i) => (
               <motion.div 
                 key={i}
                 whileHover={{ scale: 1.1 }}
                 className={`w-6 h-6 rounded-md border ${i % 7 === 0 ? "bg-accent/20 border-accent/40" : "bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/40 pointer-cursor"}`}
               />
             ))}
           </div>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <CinemaButton 
            className="w-full" 
            variant="primary"
            onClick={() => setStep("CHECKOUT")}
          >
            Confirm Selection
          </CinemaButton>
          <button onClick={() => setStep("PASS_SELECTION")} className="text-sm uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity">Back to passes</button>
        </div>
      </div>
    ),
    CHECKOUT: (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight">Finalize Ticket</h2>
          <p className="text-foreground/60">Secure your spot for <span className="text-primary italic">{movieTitle}</span>.</p>
        </div>
        
        <div className="space-y-4">
          <div className="glass-card p-2 rounded-xl flex items-center border border-white/10">
            <div className="p-3 bg-white/5 rounded-lg mr-3">
              <Mail className="text-foreground/40" size={20} />
            </div>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent border-none outline-none flex-1 text-sm font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="glass-card p-2 rounded-xl flex items-center border border-white/10 opacity-50 cursor-not-allowed">
            <div className="p-3 bg-white/5 rounded-lg mr-3">
              <CreditCard className="text-foreground/40" size={20} />
            </div>
            <span className="text-sm font-medium text-foreground/40 italic">Demo Checkout Only</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <CinemaButton 
            className="w-full" 
            variant="primary"
            onClick={() => setStep("SUCCESS")}
            disabled={!email}
          >
            Reserve Now
          </CinemaButton>
          <button onClick={() => setStep("SEAT_SELECTION")} className="text-sm uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity">Change Seat</button>
        </div>
      </div>
    ),
    SUCCESS: (
      <div className="text-center py-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 thermal-glow"
        >
          <CheckCircle2 className="text-primary" size={40} />
        </motion.div>
        
        <h2 className="text-4xl font-black uppercase tracking-tight mb-2">You&apos;re Set!</h2>
        <p className="text-foreground/60 mb-12">Ticket sent to <span className="text-foreground font-bold">{email || "your-email@example.com"}</span></p>
        
        <div className="relative mx-auto w-64 h-[400px] bg-zinc-900 rounded-3xl p-6 border border-white/10 overflow-hidden text-left mb-12">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <QrCode size={120} />
           </div>
           <div className="relative z-10 flex flex-col h-full">
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-1">Digital Ticket</p>
                <div className="w-12 h-1 bg-primary thermal-glow" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-black uppercase leading-tight mb-6">{movieTitle}</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">Access Level</p>
                    <p className="text-sm font-bold uppercase">{selectedPass === "director" ? "Director's Pass" : "Cinema Pass"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">Event Time</p>
                    <p className="text-sm font-bold">FEB 28, 20:00 GMT</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                <QrCode size={40} className="opacity-60" />
                <span className="text-[10px] font-mono opacity-30">VBX-PRE-9921</span>
              </div>
           </div>
        </div>

        <CinemaButton className="w-full" onClick={onClose} variant="outline">Close Premiere Portal</CinemaButton>
      </div>
    )
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={step}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.3 }}
                 >
                   {steps[step]}
                 </motion.div>
               </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
