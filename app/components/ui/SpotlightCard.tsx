"use client";

import { motion } from "framer-motion";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "teal" | "magenta";
}

export const SpotlightCard = ({
  children,
  className = "",
  glowColor = "teal",
}: SpotlightCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-card p-6 rounded-2xl relative overflow-hidden group ${
        glowColor === "teal" ? "thermal-glow" : "electric-glow"
      } ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
