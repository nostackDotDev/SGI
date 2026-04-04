import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const syncScroll = (source, target) => {
  if (!source.current || !target.current) return;
  target.current.scrollLeft = source.current.scrollLeft;
};
