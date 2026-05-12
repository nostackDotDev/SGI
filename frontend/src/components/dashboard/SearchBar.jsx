import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, ArrowRightLeft, FileText, LogOut, UserPlus, FileDown } from "lucide-react";

const quickActions = [
  { label: "Adicionar Produto", icon: Plus, color: "text-primary" },
  { label: "Fazer Transferência", icon: ArrowRightLeft, color: "text-purple-accent" },
  { label: "Gerar Relatório", icon: FileText, color: "text-cyan-accent" },
  { label: "Registrar Saída", icon: LogOut, color: "text-warning" },
  { label: "Novo Usuário", icon: UserPlus, color: "text-success" },
  { label: "Emitir PDF", icon: FileDown, color: "text-primary" },
];

const placeholders = [
  "Adicionar Produto...",
  "Fazer Transferência...",
  "Gerar Relatório...",
  "Registrar Saída...",
  "Buscar equipamento...",
];

export function SearchBar() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mx-auto w-full max-w-2xl"
    >
      <div
        className={`glass-strong rounded-2xl p-1 transition-all duration-300 ${
          isFocused ? "glow-primary ring-1 ring-primary/30" : ""
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <AnimatePresence mode="wait">
            <motion.input
              key={placeholderIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              type="text"
              placeholder={placeholders[placeholderIndex]}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {quickActions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="glass flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <action.icon className={`h-3.5 w-3.5 ${action.color}`} />
            {action.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
