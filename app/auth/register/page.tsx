"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Camera, Play, Shield } from "lucide-react";
import { CinemaButton } from "@/app/components/ui/CinemaButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import { UserRole } from "@prisma/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"VIEWER" | "CREATOR">("VIEWER");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await registerUser({
        email,
        password,
        name,
        role: role as UserRole,
      });

      if (result.success) {
        router.push("/auth/login?registered=true");
      } else {
        setError(result.error || "Failed to register");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="glass-card p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-white to-primary" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-12">
                <div className="w-10 h-10 bg-primary rounded-xl thermal-glow flex items-center justify-center">
                  <Film className="text-white" size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase text-glow">Veedibox</span>
              </Link>
              
              <h1 className="text-4xl font-black tracking-tighter uppercase mb-6 leading-tight">
                Join the <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Disruption.</span>
              </h1>
              
              <p className="text-foreground/60 text-sm leading-relaxed mb-8">
                Experience the next generation of independent cinema. Direct-to-consumer premieres, global Q&As, and masterclasses from the masters.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-40">
                  <Shield size={16} className="text-primary" /> Secure Encryption
                </div>
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-40">
                  <Play size={16} className="text-accent" /> Instant Access
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-sm"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              {/* Role Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("VIEWER")}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      role === "VIEWER" 
                        ? "bg-primary/20 border-primary text-primary" 
                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                    }`}
                  >
                    <User size={20} className="mx-auto mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Viewer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("CREATOR")}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      role === "CREATOR" 
                        ? "bg-accent/20 border-accent text-accent" 
                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                    }`}
                  >
                    <Camera size={20} className="mx-auto mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Filmmaker</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <CinemaButton 
                type="submit" 
                className={`w-full py-4 text-xs tracking-[0.2em] ${role === "CREATOR" ? "bg-accent hover:shadow-accent/20" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : (
                  <span className="flex items-center justify-center gap-2 font-black uppercase">
                    Begin Journey <ArrowRight size={16} />
                  </span>
                )}
              </CinemaButton>

              <p className="text-center text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                Already part of the cast?{" "}
                <Link href="/auth/login" className="text-white hover:text-primary transition-colors">SignIn</Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
