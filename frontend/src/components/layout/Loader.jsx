import { Loader2 } from "lucide-react";
import React from "react";

export default function Loader() {
  return (
    <div className="w-full h-full flex-1 flex items-center justify-center">
      <Loader2 className="w-24 h-24 loader" />
    </div>
  );
}

export function LoaderSmall() {
  return (
    <div className="w-full h-full flex-1 flex items-center justify-center">
      <Loader2 className="w-4 h-4 animate-spin duration-500 repeat-infinite" />
    </div>
  );
}
