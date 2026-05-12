import { Suspense, useEffect } from "react";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "@/core/contexts/AuthContext";
import { AppSidebar } from "./Sidebar";
import { SidebarTrigger } from "../ui/sidebar";
import { DockMenu } from "./DockMenu";
import { Menu } from "lucide-react";

export default function AppLayout({ children }) {
  // const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    if (pathname === "/") navigate("/inicio", { replace: true });
  }, [pathname]);

  useEffect(() => {
    refreshAuth();
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-12 items-center justify-start gap-4 border-b border-border/40 bg-background/80 backdrop-blur-xl md:hidden">
          <SidebarTrigger className="ml-3">
            <Menu className="h-5 w-5 text-red-500" />
          </SidebarTrigger>
          <span className="font-heading text-sm font-semibold">EduStock</span>
        </header>
        <main className="flex-1 pb-25">{children}</main>
      </div>
      <DockMenu />
    </div>
  );
}
