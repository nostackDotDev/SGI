import { cn } from "@/lib/utils";
import React from "react";

export default function PageContainer({ children, className }) {
  return (
    <div
      className={cn(
        "w-full h-full min-h-0 flex-1 p-2 px-4 containerHeight overflow-x-hidden overflow-y-auto no-scrollbar",
        className,
      )}
    >
      {children}
    </div>
  );
}
