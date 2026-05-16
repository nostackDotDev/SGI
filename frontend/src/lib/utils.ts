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

/**
 * Gets a nested property from an object using dot notation
 * @example getNestedProperty({ a: { b: { c: 1 } } }, "a.b.c") // returns 1
 */
function getNestedProperty(
  obj: Record<string, unknown>,
  path: string,
): unknown {
  const keys = path.split(".");
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Deep equality comparison for any two values
 * Handles primitives, objects, arrays, and nested structures
 */
function deepEqual(a: unknown, b: unknown): boolean {
  // Check if both are the same reference
  if (a === b) return true;

  // Check if either is null or types don't match
  if (a == null || b == null || typeof a !== typeof b) return false;

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  // Handle objects
  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) =>
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
    );
  }

  // Primitives
  return a === b;
}

export function getFormState<T>(
  formData: T | null | undefined,
  initialData: T | null | undefined,
  requiredFields: readonly (keyof T)[],
) {
  if (!formData || !initialData) {
    return {
      hasChanged: false,
      isValid: false,
      canSubmit: false,
    };
  }

  const hasChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

  const isEmpty = (value: unknown): boolean => {
    if (value === null || value === undefined) return true;

    if (typeof value === "string") return value.trim() === "";

    if (Array.isArray(value)) return value.length === 0;

    if (typeof value === "object") {
      return Object.values(value).every(isEmpty);
    }

    return false;
  };

  const isValid = requiredFields.every((field) => {
    const value = formData[field];
    return !isEmpty(value);
  });

  return {
    canSubmit: hasChanged && isValid,
  };
}
