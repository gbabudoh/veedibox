"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CinemaButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const CinemaButton = ({
  children,
  icon: Icon,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}: CinemaButtonProps) => {
  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90 electric-glow",
    secondary: "bg-primary text-white hover:bg-primary/90 thermal-glow",
    outline:
      "border border-foreground/20 text-foreground hover:bg-foreground/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-8 py-4 text-sm",
    lg: "px-12 py-6 text-base",
  };

  const disabledStyles = disabled ? "opacity-30 cursor-not-allowed grayscale pointer-events-none" : "cursor-pointer";

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-300 ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 20} />}
      <span className="tracking-tight uppercase">{children}</span>
    </motion.button>
  );
};
