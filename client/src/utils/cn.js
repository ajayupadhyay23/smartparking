import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn (Class Name helper)
 * Combines conditional class names cleanly and resolves Tailwind CSS rule conflicts.
 *
 * @param {...any} inputs - Class names, boolean conditionals, arrays, or objects
 * @returns {string} - Clean, conflict-free combined className string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
