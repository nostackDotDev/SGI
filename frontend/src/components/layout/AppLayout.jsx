import { Suspense, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === "/") navigate("/inicio", { replace: true });
  }, [pathname]);

  return (
    <div className="flex flex-row items-center justify-start w-screen h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div
        className={cn(
          "h-full flex flex-col flex-1 w-full transition ease-in-out",
          collapsed ? "lg:pl-18" : "lg:pl-64",
        )}
      >
        <Header
          collapsed={collapsed}
          onMenuClick={() => setCollapsed(!collapsed)}
        />
        <main className="w-full flex-1 min-h-0 overflow-hidden no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
