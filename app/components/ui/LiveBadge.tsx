"use client";

import { motion } from "framer-motion";

export const LiveBadge = () => {
  return (
    <motion.div
      animate={{ opacity: [1, 0.6, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-[10px] font-black uppercase tracking-[0.2em] text-white electric-glow"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
      Live Now
    </motion.div>
  );
};
