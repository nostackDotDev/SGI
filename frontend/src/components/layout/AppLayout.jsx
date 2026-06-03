import { Suspense, useEffect } from "react";
import { Header } from "./Header";
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
        <header className="sticky top-0 z-30 h-12 flex items-center border-b border-border/40 bg-background/80 backdrop-blur-xl md:hidden">
          <SidebarTrigger className="ml-3 flex gap-1 items-center justify-start">
            <span className="font-heading text-lg font-semibold">IPIKK</span>
          </SidebarTrigger>
        </header>
        <main className="flex-1 pb-25">{children}</main>
      </div>
      <DockMenu />
    </div>
  );
}
