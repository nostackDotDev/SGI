import { motion } from "framer-motion";
import {
  Package,
  ArrowRightLeft,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const dockItems = [
  { label: "Inventário", icon: Package, to: "/inventario" },
  { label: "Transferências", icon: ArrowRightLeft, to: "/movimentacoes" },
  { label: "Relatórios", icon: BarChart3, to: "/relatorios" },
  { label: "Utilizadores", icon: Users, to: "/usuarios" },
  { label: "Definições", icon: Settings, to: "/configuracoes" },
];

export function DockMenu() {
  const currentPath = useLocation().pathname;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pointer-events-none"
    >
      <div className="glass-strong pointer-events-auto flex items-center gap-1 rounded-2xl px-2 py-2 sm:gap-1.5 sm:px-3 sm:py-3">
        {dockItems.map((item) => {
          const active = currentPath.startsWith(item.to);
          return (
            <Link key={item.label} to={item.to}>
              <motion.div
                whileHover={{
                  scale: 1.1,
                  y: -4,
                  transition: { type: "spring", stiffness: 400 },
                }}
                whileTap={{ scale: 0.95 }}
                className={`group flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 transition-colors ${
                  active ? "bg-primary/10" : "hover:bg-accent/60"
                }`}
              >
                <div
                  className={`rounded-xl p-2 transition-all sm:p-2.5 ${
                    active
                      ? "gradient-primary glow-sm"
                      : "glass group-hover:glow-sm"
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${
                      active
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                </div>
                <span
                  className={`hidden text-[10px] font-medium transition-colors sm:block ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
