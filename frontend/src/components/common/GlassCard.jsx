import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassCard({ children, className, hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "glass-card rounded-xl p-5 transition-shadow duration-300",
        hover && "hover:glow-sm",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
