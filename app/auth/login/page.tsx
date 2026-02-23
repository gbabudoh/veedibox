"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Film,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { CinemaButton } from "@/app/components/ui/CinemaButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else {
        // Fetch session to get user role for redirection
        const { getSession } = await import("next-auth/react");
        const session = await getSession();

        if (session?.user) {
          // Safe type assertion for extended session user
          const user = session.user as {
            role?: string;
            name?: string;
            email?: string;
            image?: string;
          };
          const role = user.role;

          if (role === "ADMIN") {
            router.push("/dashboard/admin");
          } else if (role === "CREATOR") {
            router.push("/dashboard/creator");
          } else {
            router.push("/dashboard/viewer");
          }

          router.refresh();
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050505] text-white flex items-center justify-center p-4 overflow-hidden selection:bg-primary/30 z-50">
      {/* Cinematic Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[120px] opacity-40"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [0, -80, 0], y: [0, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[100px] opacity-30"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm z-10"
      >
        <motion.div
          variants={itemVariants}
          className="p-8 relative border border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_64px_-12px_rgba(0,0,0,0.8)] rounded-3xl"
        >
          {/* Top Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full" />

          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div whileHover={{ scale: 1.05 }} className="mb-6">
              <Link href="/" className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-xl thermal-glow flex items-center justify-center">
                  <Film className="text-white" size={20} />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase text-glow leading-none pt-0.5">
                  Veedibox
                </span>
              </Link>
            </motion.div>
            <h1 className="text-2xl font-black tracking-tight mb-1.5 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              Welcome back
            </h1>
            <p className="text-foreground/30 text-xs">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/15 p-3 rounded-xl text-red-400 text-xs overflow-hidden"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span className="font-semibold">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-[11px] font-semibold text-white/40 ml-1">
                Email
              </label>
              <div className="relative">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "email" ? "text-primary" : "text-white/20"}`}
                >
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@veedibox.com"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/40 focus:bg-white/[0.06] transition-all duration-300 placeholder:text-white/15"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-semibold text-white/40">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[10px] font-semibold text-primary/50 hover:text-primary transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "password" ? "text-primary" : "text-white/20"}`}
                >
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/40 focus:bg-white/[0.06] transition-all duration-300 placeholder:text-white/15"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <CinemaButton
                type="submit"
                className="w-full py-3 text-xs tracking-wider rounded-xl overflow-hidden relative group/btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={14} />
                    <span className="uppercase font-bold">Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 uppercase font-bold">
                    Sign In{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover/btn:translate-x-0.5 transition-transform"
                    />
                  </div>
                )}
              </CinemaButton>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-white/25 text-xs mb-2">
              Don&apos;t have an account?
            </p>
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-1.5 text-white/70 hover:text-primary transition-colors text-xs font-semibold"
            >
              Create an account
              <Sparkles
                size={12}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-primary"
              />
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-center text-[9px] uppercase tracking-[0.3em] opacity-15 hover:opacity-40 transition-opacity cursor-default"
        >
          Veedibox Secure Protocol v7.4
        </motion.p>
      </motion.div>
    </div>
  );
}
