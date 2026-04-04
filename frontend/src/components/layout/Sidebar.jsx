import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  Box,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Início", path: "/" },
  { icon: Package, label: "Inventário", path: "/inventario" },
  { icon: ArrowLeftRight, label: "Movimentações", path: "/movimentacoes" },
  { icon: BarChart3, label: "Relatórios", path: "/relatorios" },
  { icon: Users, label: "Usuários", path: "/usuarios" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

export function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-sidebar-background border-r border-sidebar-border transition-all duration-300 ease-in-out",
          collapsed
            ? "-translate-x-full lg:translate-x-0 lg:w-18"
            : "translate-x-0 w-64",
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-start px-4 border-b border-sidebar-border gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Box className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-foreground animate-slide-in italic">
                Institution
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
                title={item.label}
              >
                <item.icon
                  className={cn("w-5 h-5 shrink-0", isActive && "text-primary")}
                />
                {!collapsed && (
                  <span className="animate-slide-in">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
            <div className="text-xs text-muted-foreground text-center">
              &copy; 2026 SGI
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
