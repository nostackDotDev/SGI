import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const syncScroll = (source, target) => {
  if (!source.current || !target.current) return;
  target.current.scrollLeft = source.current.scrollLeft;
};

export const numberFormatter = (value: string | number, decimal?: boolean) => {
  const num = Number(value);
  if (isNaN(num)) return value;

  if (decimal) {
    const fixed = num.toFixed(2); // ensures 2 decimal places
    const [integerPart, decimalPart] = fixed.split(".");

    const withSpaces = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    return `${withSpaces}.${decimalPart}`;
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
