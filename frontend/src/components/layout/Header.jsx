import { Bell, Menu, Search, ChevronDown, LogOut, User, Settings } from "lucide-react";


export function Header({ onMenuClick }) {
  return (
    <header className="h-16 bg-card border-b border-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* User menu */}
        
        <i>menu</i>
      </div>
    </header>
  );
}
