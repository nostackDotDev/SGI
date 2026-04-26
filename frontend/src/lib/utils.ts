import { clsx, type ClassValue } from "clsx";
import { RefObject } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const syncScroll = (
  source: RefObject<HTMLElement>,
  target: RefObject<HTMLElement>,
): void => {
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

export function formatDate(
  dateString: string,
  includeTime: boolean = false,
): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  const pad = (n: number): string => String(n).padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  const base = `${day}-${month}-${year}`;

  if (!includeTime) return base;

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${base} ${hours}:${minutes}`;
}
