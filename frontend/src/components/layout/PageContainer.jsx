import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function PageContainer({ children, className }) {
  const pageKey = useLocation().pathname; // Use the current pathname as the key for animation
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "w-full h-full min-h-0 flex-1 containerHeight overflow-x-hidden overflow-y-auto no-scrollbar border-t pt-6 pb-10 px-4",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
