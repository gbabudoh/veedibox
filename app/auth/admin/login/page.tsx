"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Lock, AlertTriangle, ArrowRight, Activity } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Generate session ID on client side only to avoid hydration mismatch
    // Using setTimeout to avoid "synchronous set state" lint warning
    const timer = setTimeout(() => {
      setSessionId(Math.random().toString(36).substring(7).toUpperCase());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Access Denied: Invalid Credentials");
        setLoading(false);
      } else {
        // Force redirect to admin dashboard
        router.push("/dashboard/admin");
        router.refresh();
      }
    } catch {
      setError("System Error: Connection Failed");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex items-center justify-center overflow-hidden z-50">
      {/* Background Grid & Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />
      
      {/* Red Alert Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="w-full max-w-sm relative z-10 p-6">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-8 shadow-[0_8px_64px_-12px_rgba(0,0,0,0.8)]">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent rounded-full" />
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 shadow-2xl shadow-red-900/40 mb-6 border border-red-500/20">
            <Shield size={32} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80">
            System <span className="text-red-500">Command.</span>
          </h1>
          <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Restricted Access Area</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Shield size={16} className="text-white/20 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="ADMIN ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-mono tracking-wide focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all placeholder:text-white/40"
                required
              />
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={16} className="text-white/20 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input
                type="password"
                placeholder="SECURITY KEY"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-mono tracking-wide focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all placeholder:text-white/40"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Activity size={16} className="animate-spin" /> Verifying...
              </>
            ) : (
              <>
                Authenticate <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex justify-center">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono text-center max-w-[220px] leading-relaxed" suppressHydrationWarning>
                Unauthorized access attempts will be logged and reported.
                <br/>Session ID: {sessionId || "INITIALIZING..."}
            </p>
        </div>
        </div>
      </div>
    </div>
  );
}
