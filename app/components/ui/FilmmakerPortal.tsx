"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Clapperboard, Upload, Globe, Heart, Play } from "lucide-react";
import { CinemaButton } from "./CinemaButton";

interface FilmmakerPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "VISION" | "IDENTITY" | "ASSETS" | "SUCCESS";

export const FilmmakerPortal = ({ isOpen, onClose }: FilmmakerPortalProps) => {
  const [step, setStep] = useState<Step>("VISION");
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    runtime: "",
    vision: "",
  });

  // Reset step when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep("VISION"), 300);
    }
  }, [isOpen]);

  const steps: Record<Step, React.ReactNode> = {
    VISION: (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 thermal-glow">
            <Sparkles className="text-primary" size={32} />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-3">The Vision.</h2>
          <p className="text-foreground/60 max-w-sm mx-auto">Veedibox is a curated stage. Tell us why your film belongs in the digital spotlight.</p>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <textarea 
              placeholder="Your artistic vision in one sentence..." 
              className="w-full h-32 bg-zinc-900/50 border border-white/10 rounded-2xl p-6 outline-none focus:border-primary/50 transition-all resize-none text-lg font-medium italic"
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
            />
            <div className="absolute bottom-4 right-4 opacity-20 group-focus-within:opacity-100 transition-opacity">
              <Heart className="text-primary" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4 hover:bg-white/10 transition-colors">
              <div className="p-2 bg-primary/10 rounded-lg"><Globe size={18} className="text-primary" /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Reach</p>
                <p className="text-sm">Global Distribution</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4 hover:bg-white/10 transition-colors">
              <div className="p-2 bg-accent/10 rounded-lg"><Sparkles size={18} className="text-accent" /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Exposure</p>
                <p className="text-sm">Eventized Premieres</p>
              </div>
            </div>
          </div>
        </div>

        <CinemaButton 
          className="w-full" 
          variant="primary"
          onClick={() => setStep("IDENTITY")}
          disabled={!formData.vision}
        >
          Next: Film Identity
        </CinemaButton>
      </div>
    ),
    IDENTITY: (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-3">Film Identity.</h2>
          <p className="text-foreground/60 max-w-sm mx-auto">Build the profile your audience will see at the virtual box office.</p>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-2">Film Title</label>
            <input 
              type="text" 
              placeholder="e.g. Midnight Symphony" 
              className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl p-5 outline-none focus:border-primary/50 transition-all font-bold text-xl"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-2">Genre</label>
              <input 
                type="text" 
                placeholder="Sci-Fi" 
                className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl p-5 outline-none focus:border-primary/50 transition-all"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 ml-2">Runtime</label>
              <input 
                type="text" 
                placeholder="110 min" 
                className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl p-5 outline-none focus:border-primary/50 transition-all"
                value={formData.runtime}
                onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <CinemaButton 
            className="w-full" 
            variant="primary"
            onClick={() => setStep("ASSETS")}
            disabled={!formData.title || !formData.genre}
          >
            Media Assets
          </CinemaButton>
          <button onClick={() => setStep("VISION")} className="text-sm uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity">Back</button>
        </div>
      </div>
    ),
    ASSETS: (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-3">Media Prep.</h2>
          <p className="text-foreground/60 max-w-sm mx-auto">Upload your high-fidelity visuals for the Veedibox experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-[4/5] rounded-3xl bg-zinc-900 border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center group hover:border-primary/50 transition-all cursor-pointer">
             <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Upload className="text-foreground/40 group-hover:text-primary" size={24} />
             </div>
             <p className="text-xs font-bold uppercase tracking-widest">Posters</p>
             <p className="text-[10px] opacity-40 mt-1">2000x3000px JPG/PNG</p>
          </div>

          <div className="aspect-[4/5] rounded-3xl bg-zinc-900 border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center group hover:border-accent/50 transition-all cursor-pointer">
             <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Play className="text-foreground/40 group-hover:text-accent" size={24} />
             </div>
             <p className="text-xs font-bold uppercase tracking-widest">Main Trailer</p>
             <p className="text-[10px] opacity-40 mt-1">4K ProRes or H.264</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <CinemaButton 
            className="w-full" 
            variant="primary"
            onClick={() => setStep("SUCCESS")}
          >
            Finalize Submission
          </CinemaButton>
          <button onClick={() => setStep("IDENTITY")} className="text-sm uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity">Back</button>
        </div>
      </div>
    ),
    SUCCESS: (
      <div className="text-center py-12">
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-24 h-24 bg-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-8 electric-glow"
        >
          <Sparkles className="text-accent" size={48} />
        </motion.div>
        
        <h2 className="text-5xl font-black uppercase tracking-tight mb-4">Submission <br />Received.</h2>
        <p className="text-foreground/60 mb-12 max-w-sm mx-auto">Our curation team will review <span className="text-foreground font-bold">{formData.title || "your film"}</span>. Expect a response within 72 hours.</p>

        <div className="glass-card p-6 rounded-[2rem] border border-white/10 text-left mb-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Clapperboard size={140} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-accent">Status: Pending Review</p>
              </div>
              <h3 className="text-2xl font-black uppercase mb-2">{formData.title || "Project Alpha"}</h3>
              <p className="text-sm opacity-40 uppercase tracking-widest font-bold">{formData.genre || "Drama"} • {formData.runtime || "90 min"}</p>
           </div>
        </div>

        <CinemaButton className="w-full" variant="outline" onClick={onClose}>Back to Cinema</CinemaButton>
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
            className="absolute inset-0 bg-background/80 backdrop-blur-2xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20 group"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="p-8 md:p-16 relative z-10">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={step}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.4, ease: "easeOut" }}
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
