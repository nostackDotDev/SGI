import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  BarChart3,
  Users,
  Settings,
  Zap,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/core/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navItems = [
  { title: "Início", url: "/inicio", icon: LayoutDashboard },
  { title: "Inventário", url: "/inventario", icon: Package },
  { title: "Movimentações", url: "/movimentacoes", icon: ArrowRightLeft },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Usuários", url: "/usuarios", icon: Users },
  { title: "Definições", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useLocation().pathname;

  const isActive = (path) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  const initials = user?.nome
    ? user.nome
        .split(" ")
        .map((item) => item[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "US";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Zap className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-heading text-sm font-semibold text-foreground"
            >
              IPIKK
            </motion.span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={
                        active
                          ? "bg-primary/10 text-primary hover:bg-primary/15"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }
                    >
                      <Link to={item.url} className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && (
                          <span className="text-sm">{item.title}</span>
                        )}
                        {active && !collapsed && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 h-6 w-0.5 rounded-r gradient-primary"
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex gap-2 items-center justify-start cursor-pointer py-6 px-2"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svgseeadmin" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <span className="hidden sm:inline-block font-medium">
                  {user?.nome ?? "Usuário"}
                </span>
              )}
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="font-medium">{user?.cargo ?? "Cargo"}</p>
              <p className="text-sm text-muted-foreground">
                {user?.email ?? ""}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => (window.location.href = "/configuracoes")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive hover:bg-destructive/90 hover:text-muted"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
