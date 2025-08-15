import { type ClassValue, clsx } from "clsx";

/**
 * A simple utility function to conditionally join class names together.
 * This is a simplified version that doesn't rely on tailwind-merge.
 * For more advanced merging of Tailwind classes, consider installing tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
