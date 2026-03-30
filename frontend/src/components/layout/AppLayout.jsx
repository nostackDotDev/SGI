import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-row items-center justify-start w-screen h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div
        className={cn(
          "h-full w-full transition ease-in-out",
          collapsed ? "lg:pl-18" : "lg:pl-64",
        )}
      >
        <Header
          collapsed={collapsed}
          onMenuClick={() => setCollapsed(!collapsed)}
        />
        <main className="h-full overflow-x-auto no-scrollbar">{children}</main>
      </div>
    </div>
  );
}
