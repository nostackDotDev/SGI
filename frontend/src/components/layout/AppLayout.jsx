import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export default function AppLayout({ children }) {
const [collapsed,setCollapsed] = useState(false)

  return <div className="flex flex-row items-center justify-start w-screen h-screen overflow-hidden bg-background">
    <Sidebar  collapsed={collapsed} onToggle={()=>setCollapsed(!collapsed)}/>
    <div className="h-full w-full transition ease">
      <Header onMenuClick={()=>setCollapsed(!collapsed)} />
      <main className="h-full overflow-x-auto no-scrollbar">
        {children}
      </main>
    </div>
  </div>;
}
