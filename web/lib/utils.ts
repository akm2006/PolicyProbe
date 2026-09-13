import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Pill button styles from the Optimus template (rendered on <a>/<Link>/<button>).
export const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors group whitespace-nowrap";
export const buttonOutline =
  "inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 hover:bg-foreground/5 transition-colors whitespace-nowrap";
export const buttonLg = "h-14 px-8 text-base";
export const buttonSm = "h-9 px-5 text-sm";
